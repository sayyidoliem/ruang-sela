"""Resume DKI dari checkpoint + collected yang sudah ada"""
import asyncio, json, os, glob, sys, re
sys.stdout.reconfigure(encoding='utf-8', errors='replace')
os.environ["PYTHONIOENCODING"]="utf-8"
from playwright.async_api import async_playwright
from scraper.detail import extract_detail
from scraper.export import export_places
from scraper.config import DKI_BOUNDS
from scraper.scale_dki import is_dki

async def resume():
    # Load collected
    collected_files = sorted(glob.glob("data/raw/_collected_DKI_*.json"), key=os.path.getmtime)
    if not collected_files:
        print("No collected file found")
        return
    cf = collected_files[-1]
    print(f"[RESUME] Using collected: {cf}")
    with open(cf, encoding="utf-8") as f:
        collected = [(x["keyword"], x["wilayah"], x["url"]) for x in json.load(f)]
    print(f"[RESUME] Total collected: {len(collected)}")

    # Load already done keep (all checkpoints)
    keep_files = sorted(glob.glob("data/raw/_ckpt_DKI_keep_*.json"), key=os.path.getmtime)
    done_urls = set()
    done_places = []
    for kf in keep_files:
        with open(kf, encoding="utf-8") as f:
            data = json.load(f)
            for d in data:
                # place_id or url to dedup
                u = d.get("url_google_maps","")
                # normalize
                done_urls.add(u.split("?")[0])
                # also add by place_id if available
                if d.get("place_id"):
                    done_urls.add(d["place_id"])
            # keep latest largest as base
            if len(data) > len(done_places):
                done_places = data
    # Actually load latest checkpoint as base places objects would need reconstruct, simpler load from latest file as continuing list
    # We'll reload as dict and convert later
    print(f"[RESUME] Already done keep count from checkpoints: {len(done_places)} (approx)")
    # Use the latest checkpoint file as resume base
    if keep_files:
        latest = keep_files[-1]
        with open(latest, encoding="utf-8") as f:
            base_data = json.load(f)
    else:
        base_data = []

    # Determine remaining
    # Need to deduplicate by normalized url
    remaining = []
    seen_done_urls = set()
    for d in base_data:
        u = d.get("url_google_maps","").split("?")[0]
        seen_done_urls.add(u)
        # also original collected url normalized
        # place_id check
        if d.get("place_id"):
            seen_done_urls.add(d["place_id"])

    for kw,wil,url in collected:
        norm = url.split("?")[0]
        # Check if this collected url's corresponding detail url (final url) might differ, but we check norm
        # Also check if any done place has same original keyword+url substring
        found = False
        for d in base_data:
            # Check if url_google_maps contains same g id or original url id
            if norm in d.get("url_google_maps","") or d.get("place_id","") in norm:
                found = True
                break
            # Fallback check normalized collected vs done's url
            if d.get("url_google_maps","").split("?")[0] == norm:
                found = True
                break
        if not found and norm not in seen_done_urls:
            remaining.append((kw,wil,url))

    print(f"[RESUME] Remaining to scrape: {len(remaining)}")
    for i,(kw,wil,u) in enumerate(remaining[:10],1):
        print(f"  {i}. [{kw}] {u[:100]}")
    if len(remaining) > 10:
        print(f"  ... +{len(remaining)-10} more")

    if not remaining:
        print("[RESUME] All done, exporting existing")
        from scraper.models import Place
        # Export base_data directly
        # Need to convert dicts to Place not needed, export directly via json
        # Use export_places helper with Place objects reconstructed minimally
        # Instead write directly
        import pathlib
        if base_data:
            json_path = f"data/raw/ruangsela_DKI_resume_{len(base_data)}.json"
            with open(json_path, "w", encoding="utf-8") as f:
                json.dump(base_data, f, ensure_ascii=False, indent=2)
            print(f"Saved {json_path}")
        return

    # Scrape remaining
    from scraper.models import Place
    # Convert base_data dicts to Place-like dicts for final merge, we will just keep dicts
    places_dicts = base_data.copy()
    filtered_out = []

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True, args=["--disable-blink-features=AutomationControlled","--lang=id-ID"])
        ctx = await browser.new_context(locale="id-ID", user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/123.0.0.0")
        page = await ctx.new_page()
        for idx,(kw,wil,url) in enumerate(remaining,1):
            print(f"\n[RESUME][DETAIL] {idx}/{len(remaining)} kw={kw} wil={wil}")
            place = await extract_detail(page, url, keyword=kw)
            place.attributes["wilayah_search"] = wil
            if is_dki(place):
                places_dicts.append(place.to_dict())
                print(f"  -> KEEP {place.nama}")
            else:
                filtered_out.append(place.to_dict())
                print(f"  -> FILTER OUT {place.nama}")
            await page.wait_for_timeout(800)
            if idx % 10 == 0:
                # checkpoint
                try:
                    with open(f"data/raw/_ckpt_DKI_keep_{len(places_dicts)}_{idx}.json","w",encoding="utf-8") as f:
                        json.dump(places_dicts, f, ensure_ascii=False, indent=2)
                    print(f"[CKPT] saved {len(places_dicts)}")
                except: pass
        await browser.close()

    print(f"\n[RESUME] Done total keep: {len(places_dicts)} filtered: {len(filtered_out)}")
    # Final export
    json_path = f"data/raw/ruangsela_DKI_scale{len(places_dicts)}_resume.json"
    with open(json_path,"w",encoding="utf-8") as f:
        json.dump(places_dicts, f, ensure_ascii=False, indent=2)
    print(f"JSON: {json_path}")
    # also CSV via pandas
    try:
        import pandas as pd
        flat=[]
        for d in places_dicts:
            row={}
            row["keyword"]=d.get("keyword")
            row["nama"]=d.get("nama")
            row["kategori"]=d.get("kategori")
            row["alamat"]=d.get("alamat")
            row["lat"]=d.get("lat")
            row["lng"]=d.get("lng")
            row["rating"]=d.get("rating")
            row["jumlah_review"]=d.get("jumlah_review")
            row["status_buka"]=d.get("status_buka")
            row["jam_operasional_raw"]=(d.get("jam_operasional_raw") or "").replace("\n"," | ")
            row["telepon"]=d.get("telepon")
            row["website"]=d.get("website")
            row["price_level"]=d.get("price_level")
            row["harga_text"]=d.get("harga_text")
            row["url_google_maps"]=d.get("url_google_maps")
            row["foto_count"]=len(d.get("foto_urls") or [])
            row["fasilitas"]=", ".join(d.get("fasilitas") or [])
            row["plus_code"]=d.get("plus_code")
            row["place_id"]=d.get("place_id")
            flat.append(row)
        df=pd.DataFrame(flat)
        csv_path=json_path.replace(".json",".csv")
        df.to_csv(csv_path, index=False, encoding="utf-8-sig")
        print(f"CSV: {csv_path}")
        print(df.head(5).to_string())
    except Exception as e:
        print(f"CSV fail: {e}")

if __name__=="__main__":
    asyncio.run(resume())
