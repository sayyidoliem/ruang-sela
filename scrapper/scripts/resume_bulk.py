import asyncio, json, pathlib, sys
sys.stdout.reconfigure(encoding='utf-8', errors='replace')
from playwright.async_api import async_playwright
from scraper.auth import load_netscape_cookies
from scraper.detail import extract_detail
from scraper.scale_dki import is_dki
from scraper.export import export_places

async def run():
    col=json.loads(pathlib.Path("data/raw/_collected_DKI_75.json").read_text(encoding="utf-8"))
    collected=[(x["keyword"], x["wilayah"], x["url"]) for x in col]
    # find latest ckpt
    import glob
    ckpts=sorted(pathlib.Path("data/raw").glob("_ckpt_bulk_*.json"), key=lambda p: p.stat().st_mtime)
    done=[]
    done_urls=set()
    if ckpts:
        latest=ckpts[-1]
        done=json.loads(latest.read_text(encoding="utf-8"))
        for d in done:
            done_urls.add(d.get("place_id") or d.get("url_google_maps","").split("?")[0])
            # also add normalized url
            done_urls.add(d.get("url_google_maps","").split("?")[0])
        print(f"Resume from {latest} with {len(done)} done")
    # filter remaining by not in done (by place_id or url contains)
    remaining=[]
    for kw,wil,url in collected:
        norm=url.split("?")[0]
        # extract g id
        import re
        m=re.search(r"/g/([A-Za-z0-9_-]+)", url)
        gid=m.group(1) if m else norm
        if gid in done_urls or norm in done_urls:
            continue
        # also check if any done has same keyword+gid substring
        found=False
        for d in done:
            if gid in d.get("url_google_maps","") or gid==d.get("place_id"):
                found=True
                break
        if not found:
            remaining.append((kw,wil,url))
    print(f"Remaining {len(remaining)} / {len(collected)}")
    for i,(kw,wil,u) in enumerate(remaining[:5],1):
        print(f"  {i}. {kw} {u[:80]}")
    cookies=load_netscape_cookies("www.google.com_cookies.txt")
    async with async_playwright() as p:
        browser=await p.chromium.launch(headless=True, args=["--disable-blink-features=AutomationControlled","--lang=id-ID"])
        ctx=await browser.new_context(locale="id-ID", user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64)")
        if cookies:
            await ctx.add_cookies(cookies)
        page=await ctx.new_page()
        places=done.copy()  # but done are dicts, need to convert to objects? For simplicity keep dicts and append dicts
        # Convert done dicts to Place objects for consistency? Just keep dicts and append new dicts
        # We'll treat places as list of dicts for now, but extract_detail returns Place, so we need to handle both
        # Convert done to list of dicts already, new places will be dicts
        # For export we need Place objects or dicts, export_places expects Place objects, so we will convert everything to Place at end
        # Simpler: keep places as list of Place objects by reconstructing
        from scraper.models import Place
        # reconstruct done as Place dicts -> keep as dicts for final merge
        # Actually we will just keep dicts and at the end merge
        new_places=[]
        for idx,(kw,wil,url) in enumerate(remaining,1):
            print(f"\n[RESUME BULK] {idx}/{len(remaining)} {kw}@{wil}")
            place=await extract_detail(page, url, keyword=kw)
            place.attributes["wilayah_search"]=wil
            if is_dki(place):
                new_places.append(place.to_dict())
                print(f" KEEP {place.nama} fasilitas {len(place.fasilitas)}")
            else:
                print(f" FILTER {place.nama}")
            await page.wait_for_timeout(800)
            if idx%10==0:
                # checkpoint
                try:
                    merged=done + new_places
                    with open(f"data/raw/_ckpt_bulk_{len(merged)}.json","w",encoding="utf-8") as f:
                        json.dump(merged, f, ensure_ascii=False, indent=2)
                    print(f"[CKPT] {len(merged)} saved")
                except: pass
        await browser.close()
        merged=done + new_places
        print(f"\nDone merged {len(merged)} (done {len(done)} + new {len(new_places)})")
        # dedup by place_id
        seen=set()
        dedup=[]
        for d in merged:
            key=d.get("place_id") or d.get("url_google_maps","").split("?")[0]
            if key not in seen:
                seen.add(key)
                dedup.append(d)
        print(f"Dedup {len(merged)} -> {len(dedup)}")
        # save final
        with open("data/raw/ruangsela_DKI_bulk75_cookie.json","w",encoding="utf-8") as f:
            json.dump(dedup, f, ensure_ascii=False, indent=2)
        # csv
        import pandas as pd
        flat=[]
        for d in dedup:
            attr=d.get("attributes",{})
            flat.append({"keyword":d.get("keyword"),"nama":d.get("nama"),"kategori":d.get("kategori"),"alamat":d.get("alamat"),"lat":d.get("lat"),"lng":d.get("lng"),"rating":d.get("rating"),"jumlah_review":d.get("jumlah_review"),"jam_operasional_raw":(d.get("jam_operasional_raw") or "").replace("\n"," | "),"telepon":d.get("telepon"),"website":d.get("website"),"fasilitas":", ".join(d.get("fasilitas") or []),"fasilitas_count":len(d.get("fasilitas") or []),"has_busy_hours":attr.get("has_busy_hours"),"total_open_hours_week":attr.get("analytics_total_open_hours_per_week"),"facility_score":attr.get("analytics_facility_score"),"place_id":d.get("place_id"),"url_google_maps":d.get("url_google_maps")})
        pd.DataFrame(flat).to_csv("data/raw/ruangsela_DKI_bulk75_cookie.csv", index=False, encoding="utf-8-sig")
        print("Saved ruangsela_DKI_bulk75_cookie.json/csv")
        print(pd.DataFrame(flat)[["nama","fasilitas_count","has_busy_hours"]].head().to_string())

if __name__=="__main__":
    asyncio.run(run())
