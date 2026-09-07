import asyncio, json, os, sys
sys.stdout.reconfigure(encoding='utf-8', errors='replace')
from playwright.async_api import async_playwright
from scraper.search import search_places
from scraper.detail import extract_detail
from scraper.scale_dki import is_dki
from scraper.export import export_places

KEYWORDS = ["gedung serbaguna", "co-working space", "balai warga"]  # balai warga kurang 3
WILAYAH = ["Jakarta Barat","Jakarta Pusat","Jakarta Selatan","Jakarta Timur","Jakarta Utara"]

async def run():
    collected=[]
    seen=set()
    # load existing collected to avoid duplicate
    import pathlib, glob
    existing = set()
    for fp in glob.glob("data/raw/ruangsela_DKI_scale*.json") + glob.glob("data/raw/_ckpt*.json"):
        try:
            d=json.loads(pathlib.Path(fp).read_text(encoding="utf-8"))
            for x in d:
                if x.get("place_id"): existing.add(x["place_id"])
                if x.get("url_google_maps"): existing.add(x["url_google_maps"].split("?")[0])
        except: pass
    print(f"Existing places deduplication set: {len(existing)}")

    async with async_playwright() as p:
        browser=await p.chromium.launch(headless=True, args=["--disable-blink-features=AutomationControlled","--lang=id-ID"])
        ctx=await browser.new_context(locale="id-ID", user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64)")
        page=await ctx.new_page()
        for kw in KEYWORDS:
            need = 7 if kw!="balai warga" else 4
            kw_col=0
            for wil in WILAYAH:
                if kw_col>=need: break
                rem=need-kw_col
                print(f"[SUPP] {kw} @ {wil} need {rem}")
                links=await search_places(page, kw, wil, max_results=rem+2)
                added=0
                for url in links:
                    norm=url.split("?")[0]
                    # check duplicate via existing set (place_id not yet known, use norm)
                    if norm in existing or norm in seen:
                        continue
                    seen.add(norm)
                    collected.append((kw,wil,url))
                    kw_col+=1
                    added+=1
                    if kw_col>=need: break
                print(f"  added {added} kw_col {kw_col}")
                await page.wait_for_timeout(1200)
                if kw_col>=need: break
            print(f"Collected {kw}: {kw_col}")

        print(f"Total supplemental collected: {len(collected)}")
        for i,(kw,wil,u) in enumerate(collected,1):
            print(f"{i:02d} [{kw}] {u[:90]}")

        places=[]
        for idx,(kw,wil,url) in enumerate(collected,1):
            print(f"\n[SUPP DETAIL] {idx}/{len(collected)} {kw}")
            place=await extract_detail(page, url, keyword=kw)
            place.attributes["wilayah_search"]=wil
            if is_dki(place):
                places.append(place)
                print(f" KEEP {place.nama}")
            else:
                print(f" FILTER OUT {place.nama} {place.alamat}")
            await page.wait_for_timeout(800)
        await browser.close()
        if places:
            json_path, csv_path = export_places(places, prefix=f"ruangsela_DKI_supplement_{len(places)}")
            print(f"Saved supplement {len(places)} -> {json_path}")
            # also merge with existing 62
            import pathlib
            base_path = "E:/scraping_gmaps/data/raw/ruangsela_DKI_scale62_resume.json"
            base = json.loads(pathlib.Path(base_path).read_text(encoding="utf-8"))
            merged = base + [p.to_dict() for p in places]
            # dedup by place_id or url
            seen2=set()
            dedup=[]
            for d in merged:
                key=d.get("place_id") or d.get("url_google_maps","").split("?")[0]
                if key not in seen2:
                    seen2.add(key)
                    dedup.append(d)
            print(f"Merged {len(base)} + {len(places)} -> {len(dedup)} dedup")
            with open("E:/scraping_gmaps/data/raw/ruangsela_DKI_FINAL_70.json","w",encoding="utf-8") as f:
                json.dump(dedup,f,ensure_ascii=False,indent=2)
            # csv merged
            import pandas as pd
            flat=[]
            for d in dedup:
                flat.append({"keyword":d.get("keyword"),"nama":d.get("nama"),"kategori":d.get("kategori"),"alamat":d.get("alamat"),"lat":d.get("lat"),"lng":d.get("lng"),"rating":d.get("rating"),"jumlah_review":d.get("jumlah_review"),"jam_operasional_raw":(d.get("jam_operasional_raw") or "").replace("\n"," | "),"telepon":d.get("telepon"),"website":d.get("website"),"harga_text":d.get("harga_text"),"url_google_maps":d.get("url_google_maps"),"place_id":d.get("place_id")})
            pd.DataFrame(flat).to_csv("E:/scraping_gmaps/data/raw/ruangsela_DKI_FINAL_70.csv", index=False, encoding="utf-8-sig")
            print("FINAL saved: ruangsela_DKI_FINAL_70.json/csv")
        else:
            print("No supplement places")

asyncio.run(run())
