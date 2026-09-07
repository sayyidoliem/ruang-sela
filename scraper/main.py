import asyncio
import argparse
import sys
import os
# Fix encoding Windows untuk GMaps icon font
try:
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')
    sys.stderr.reconfigure(encoding='utf-8', errors='replace')
except:
    pass
os.environ["PYTHONIOENCODING"] = "utf-8"
from playwright.async_api import async_playwright

from .config import KEYWORDS, TARGET_LOCATION, TARGET_COORDS, LIMIT_TOTAL, HEADLESS
from .search import search_places
from .detail import extract_detail
from .export import export_places
from .auth import load_netscape_cookies

async def run(limit_total: int = LIMIT_TOTAL, location: str = TARGET_LOCATION, keywords: list = None, headless: bool = HEADLESS):
    if keywords is None:
        keywords = KEYWORDS

    collected_links = []  # list of (keyword, url)
    seen_urls = set()

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=headless, args=["--disable-blink-features=AutomationControlled", "--lang=id-ID"])
        context = await browser.new_context(
            locale="id-ID",
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
            viewport={"width": 1366, "height": 768}
        )
        # AUTH: load cookies if available (essential for fasilitas/busy hours)
        try:
            cookies = load_netscape_cookies("www.google.com_cookies.txt")
            if cookies:
                await context.add_cookies(cookies)
                print(f"[AUTH] Loaded {len(cookies)} cookies for main scraper")
        except Exception as e:
            print(f"[AUTH] cookie load failed: {e}")
        page = await context.new_page()

        # Tahap 1: Search untuk kumpulkan 5 link total
        for kw in keywords:
            if len(collected_links) >= limit_total:
                break
            remaining = limit_total - len(collected_links)
            # minta sedikit lebih untuk filter duplikat
            links = await search_places(page, kw, location, max_results=remaining+3)
            for url in links:
                if url not in seen_urls:
                    seen_urls.add(url)
                    collected_links.append((kw, url))
                    if len(collected_links) >= limit_total:
                        break
            # delay antar keyword
            if len(collected_links) < limit_total:
                await page.wait_for_timeout(2000)

        print(f"\n{'='*60}")
        print(f"[MAIN] Total links terkumpul: {len(collected_links)}/{limit_total}")
        for i, (kw, u) in enumerate(collected_links, 1):
            print(f"  {i}. [{kw}] {u}")
        print(f"{'='*60}\n")

        if not collected_links:
            print("[MAIN] Tidak ada link ditemukan, coba keyword lain atau cek koneksi/selector")
            await browser.close()
            return []

        # Tahap 2: Detail scraping
        places = []
        # pakai page yang sama untuk detail (lebih stabil)
        for idx, (kw, url) in enumerate(collected_links, 1):
            print(f"\n[MAIN] Detail {idx}/{len(collected_links)}: {kw}")
            place = await extract_detail(page, url, keyword=kw)
            places.append(place)
            await page.wait_for_timeout(1500)

        await browser.close()

        # Tahap 3: Export
        if places:
            json_path, csv_path = export_places(places, prefix=f"ruangsela_jakbar_sample{limit_total}")
            print(f"\n[MAIN] Selesai! {len(places)} places disimpan")
            print(f"  JSON: {json_path}")
            print(f"  CSV : {csv_path}")
        else:
            print("[MAIN] Tidak ada place untuk diexport")

        return places

def main():
    parser = argparse.ArgumentParser(description="RuangSela GMaps Scraper - Jakarta Barat Sample")
    parser.add_argument("--limit", type=int, default=LIMIT_TOTAL, help="Total sampel (default 5)")
    parser.add_argument("--location", type=str, default=TARGET_LOCATION, help="Lokasi (default Jakarta Barat)")
    parser.add_argument("--headless", action="store_true", help="Run headless")
    parser.add_argument("--visible", action="store_true", help="Run visible browser")
    args = parser.parse_args()

    headless = HEADLESS
    if args.headless:
        headless = True
    if args.visible:
        headless = False

    asyncio.run(run(limit_total=args.limit, location=args.location, headless=headless))

if __name__ == "__main__":
    main()
