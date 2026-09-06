"""
RuangSela DKI Jakarta Large Scale Scraper
- Loop semua KEYWORDS x DKI_WILAYAH
- Kumpulkan link, deduplicate, filter hanya DKI (alamat mengandung Jakarta atau koordinat dalam bounds)
- Scrape detail dengan filter yang sama
- Export JSON+CSV skala besar
"""
import asyncio
import re
import sys
import os
sys.stdout.reconfigure(encoding='utf-8', errors='replace')
sys.stderr.reconfigure(encoding='utf-8', errors='replace')
os.environ["PYTHONIOENCODING"] = "utf-8"

import argparse
from playwright.async_api import async_playwright
from .config import KEYWORDS, DKI_WILAYAH, DKI_CENTER, DKI_ZOOM, DKI_BOUNDS, LIMIT_PER_KEYWORD_DKI, LIMIT_DKI_TOTAL, HEADLESS
from .search import search_places, build_search_url
from .detail import extract_detail, clean_icon
from .export import export_places
from .auth import load_netscape_cookies

def is_dki(place) -> bool:
    # Filter: alamat mengandung Jakarta atau DKI, atau koordinat dalam bounds
    alamat = (place.alamat or "") + " " + (place.alamat_lengkap or "")
    if "jakarta" in alamat.lower() or "dki" in alamat.lower():
        return True
    # Fallback cek url contains jakarta? tidak reliable
    # Cek koordinat bounds
    if place.lat is not None and place.lng is not None:
        b = DKI_BOUNDS
        if b["lat_min"] <= place.lat <= b["lat_max"] and b["lng_min"] <= place.lng <= b["lng_max"]:
            return True
        else:
            return False
    # Jika tidak ada alamat & koordinat, anggap bukan DKI (filter ketat)
    return False

async def run_dki(limit_total: int = LIMIT_DKI_TOTAL, limit_per_keyword: int = LIMIT_PER_KEYWORD_DKI, headless: bool = True, keywords=None, wilayahs=None):
    if keywords is None:
        keywords = KEYWORDS
    if wilayahs is None:
        wilayahs = DKI_WILAYAH

    collected = []  # list of (keyword, wilayah, url)
    seen = set()

    print(f"[DKI] Target: {limit_total} total, {limit_per_keyword}/keyword across {len(wilayahs)} wilayah")
    print(f"[DKI] Keywords: {keywords}")
    print(f"[DKI] Wilayah: {wilayahs}")

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=headless, args=["--disable-blink-features=AutomationControlled", "--lang=id-ID"])
        context = await browser.new_context(
            locale="id-ID",
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
            viewport={"width": 1366, "height": 768}
        )
        try:
            cookies = load_netscape_cookies("www.google.com_cookies.txt")
            if cookies:
                await context.add_cookies(cookies)
                print(f"[AUTH] Loaded {len(cookies)} cookies for DKI scale")
        except Exception as e:
            print(f"[AUTH] cookie load failed: {e}")
        page = await context.new_page()

        # FASE 1: Search - rotasi wilayah untuk diversitas DKI
        # Strategi: untuk tiap keyword, search di 1-2 wilayah bergantian sampai limit_per_keyword tercapai
        for kw in keywords:
            if len(collected) >= limit_total:
                break
            kw_collected = 0
            # Coba wilayah satu per satu
            for wilayah in wilayahs:
                if kw_collected >= limit_per_keyword or len(collected) >= limit_total:
                    break
                remaining_kw = limit_per_keyword - kw_collected
                remaining_total = limit_total - len(collected)
                need = min(remaining_kw, remaining_total, 6)  # minta 6 per wilayah call
                if need <= 0:
                    break
                print(f"\n[DKI][SEARCH] kw='{kw}' wilayah='{wilayah}' need={need}")
                links = await search_places(page, kw, wilayah, max_results=need+2)
                added = 0
                for url in links:
                    # Normalisasi: base url tanpa query tracking
                    norm = url.split("?")[0]
                    if norm not in seen:
                        seen.add(norm)
                        collected.append((kw, wilayah, url))
                        kw_collected += 1
                        added += 1
                        if kw_collected >= limit_per_keyword or len(collected) >= limit_total:
                            break
                print(f"  -> added {added} new, kw total {kw_collected}/{limit_per_keyword}, global {len(collected)}/{limit_total}")
                await page.wait_for_timeout(1500)
                # Jika wilayah ini sudah cukup, break, jika tidak lanjut wilayah berikutnya
            # Jika keyword ini masih kurang setelah loop semua wilayah, coba search generik "DKI Jakarta"
            if kw_collected < limit_per_keyword and len(collected) < limit_total:
                need = min(limit_per_keyword - kw_collected, limit_total - len(collected))
                print(f"[DKI][SEARCH] kw='{kw}' wilayah='DKI Jakarta' (fallback) need={need}")
                # Override center untuk DKI Jakarta generik
                # Gunakan search_places dengan lokasi DKI Jakarta tapi coords center DKI
                links = await search_places(page, kw, "DKI Jakarta", max_results=need+2)
                for url in links:
                    norm = url.split("?")[0]
                    if norm not in seen:
                        seen.add(norm)
                        collected.append((kw, "DKI Jakarta", url))
                        kw_collected += 1
                        if kw_collected >= limit_per_keyword or len(collected) >= limit_total:
                            break
                await page.wait_for_timeout(1500)

        # Persist collected untuk resume
        import json as _j
        try:
            os.makedirs("data/raw", exist_ok=True)
            with open(f"data/raw/_collected_DKI_{len(collected)}.json", "w", encoding="utf-8") as f:
                _j.dump([{"keyword":kw,"wilayah":wil,"url":u} for kw,wil,u in collected], f, ensure_ascii=False, indent=2)
        except: pass

        print(f"\n{'='*70}")
        print(f"[DKI] Fase Search selesai: {len(collected)} links terkumpul (target {limit_total})")
        for i, (kw, wil, u) in enumerate(collected, 1):
            print(f"  {i:02d}. [{kw} @ {wil}] {u[:110]}")
        print(f"{'='*70}\n")

        if not collected:
            print("[DKI] Tidak ada link, abort")
            await browser.close()
            return []

        # FASE 2: Detail scraping dengan filter DKI ketat + checkpoint
        places = []
        filtered_out = []
        checkpoint_every = 10
        # Import here to avoid circular
        import json as _json, os
        from datetime import datetime as _dt
        def save_checkpoint():
            try:
                ts = _dt.now().strftime("%Y%m%d_%H%M%S")
                # save KEEP partial
                if places:
                    ckpt_path = f"data/raw/_ckpt_DKI_keep_{len(places)}_{ts}.json"
                    os.makedirs("data/raw", exist_ok=True)
                    with open(ckpt_path, "w", encoding="utf-8") as f:
                        _json.dump([p.to_dict() for p in places], f, ensure_ascii=False, indent=2)
                    print(f"[CKPT] Saved {len(places)} KEEP to {ckpt_path}")
                if filtered_out:
                    ckpt2 = f"data/raw/_ckpt_DKI_filtered_{len(filtered_out)}_{ts}.json"
                    with open(ckpt2, "w", encoding="utf-8") as f:
                        _json.dump([p.to_dict() for p in filtered_out], f, ensure_ascii=False, indent=2)
            except Exception as e:
                print(f"[CKPT] fail: {e}")

        for idx, (kw, wil, url) in enumerate(collected, 1):
            print(f"\n[DKI][DETAIL] {idx}/{len(collected)} kw={kw} wil={wil}")
            place = await extract_detail(page, url, keyword=kw)
            # Simpan wilayah asal untuk tracing
            place.attributes["wilayah_search"] = wil
            # Filter DKI
            if is_dki(place):
                places.append(place)
                print(f"  -> KEEP (DKI) - {place.nama} | {place.alamat[:60] if place.alamat else ''}")
            else:
                filtered_out.append(place)
                print(f"  -> FILTER OUT (bukan DKI) - {place.nama} | {place.alamat} | lat={place.lat} lng={place.lng}")
            await page.wait_for_timeout(800)
            if idx % checkpoint_every == 0:
                save_checkpoint()
            # Auto export checkpoint tiap 20
            if len(places) >= limit_total:
                print(f"[DKI] Capai limit_total {limit_total}, stop detail")
                break

        await browser.close()

        print(f"\n{'='*70}")
        print(f"[DKI] Detail selesai: {len(places)} KEEP, {len(filtered_out)} FILTERED OUT")
        print(f"{'='*70}")

        # FASE 3: Export
        if places:
            # Potong ke limit_total jika kebanyakan
            places = places[:limit_total]
            json_path, csv_path = export_places(places, prefix=f"ruangsela_DKI_scale{len(places)}")
            print(f"\n[DKI] Selesai export {len(places)} places DKI")
            print(f"  JSON: {json_path}")
            print(f"  CSV : {csv_path}")
            if filtered_out:
                # Simpan filtered untuk audit
                j2, c2 = export_places(filtered_out, prefix=f"ruangsela_filtered_nonDKI_{len(filtered_out)}")
                print(f"  Filtered (audit): {j2}")
        else:
            print("[DKI] Tidak ada place DKI untuk diexport")
            save_checkpoint()

        return places

def main():
    parser = argparse.ArgumentParser(description="RuangSela DKI Jakarta Large Scale")
    parser.add_argument("--limit", type=int, default=LIMIT_DKI_TOTAL, help="Total target DKI (default 60)")
    parser.add_argument("--per-keyword", type=int, default=LIMIT_PER_KEYWORD_DKI, help="Max per keyword")
    parser.add_argument("--headless", action="store_true", default=True, help="Headless")
    parser.add_argument("--visible", action="store_true", help="Visible browser")
    args = parser.parse_args()
    headless = not args.visible
    if args.visible:
        headless = False
    asyncio.run(run_dki(limit_total=args.limit, limit_per_keyword=args.per_keyword, headless=headless))

if __name__ == "__main__":
    main()
