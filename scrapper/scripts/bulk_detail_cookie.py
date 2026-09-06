import asyncio, json, pathlib, sys
sys.stdout.reconfigure(encoding='utf-8', errors='replace')
from playwright.async_api import async_playwright
from scraper.auth import load_netscape_cookies
from scraper.detail import extract_detail
from scraper.scale_dki import is_dki
from scraper.export import export_places

async def run():
    col_path="data/raw/_collected_DKI_75.json"
    data=json.loads(pathlib.Path(col_path).read_text(encoding="utf-8"))
    collected=[(x["keyword"], x["wilayah"], x["url"]) for x in data]
    # Resume: check latest checkpoint
    import glob, urllib.parse, re
    ckpts=sorted(pathlib.Path("data/raw").glob("_ckpt_bulk_*.json"), key=lambda p: p.stat().st_mtime)
    done_urls=set()
    done_count=0
    done_data=[]
    if ckpts:
        latest=ckpts[-1]
        try:
            done_data=json.loads(latest.read_text(encoding="utf-8"))
            done_count=len(done_data)
            for d in done_data:
                # add place_id and decoded url gid
                if d.get("place_id"):
                    done_urls.add(d["place_id"])
                url=d.get("url_google_maps","")
                # decoded gid
                dec=urllib.parse.unquote(url)
                m=re.search(r"/g/([A-Za-z0-9_-]+)", dec)
                if m:
                    done_urls.add(m.group(1))
                done_urls.add(url.split("?")[0])
                # also add decoded norm
                dec_col=urllib.parse.unquote(url.split("?")[0])
                done_urls.add(dec_col)
            print(f"[RESUME] Found checkpoint {latest} with {done_count} done, will skip")
            # filter collected
            filtered=[]
            for kw,wil,url in collected:
                dec=urllib.parse.unquote(url)
                m=re.search(r"/g/([A-Za-z0-9_-]+)", dec)
                gid=m.group(1) if m else url.split("?")[0]
                norm=url.split("?")[0]
                dec_norm=urllib.parse.unquote(norm)
                if gid in done_urls or norm in done_urls or dec_norm in done_urls:
                    continue
                # also check if gid in any done url
                found=False
                for d in done_data:
                    if gid in d.get("url_google_maps","") or gid==d.get("place_id"):
                        found=True
                        break
                if not found:
                    filtered.append((kw,wil,url))
            print(f"[RESUME] Filtered {len(collected)} -> {len(filtered)} remaining")
            collected=filtered
            if not collected:
                print("[RESUME] All done")
                return
        except Exception as e:
            print(f"[RESUME] failed to load ckpt: {e}")
            done_data=[]
    else:
        done_data=[]
    print(f"[BULK COOKIE] {len(collected)} to scrape (after resume, done {done_count})")
    cookies=load_netscape_cookies("www.google.com_cookies.txt")
    async with async_playwright() as p:
        browser=await p.chromium.launch(headless=True, args=["--disable-blink-features=AutomationControlled","--lang=id-ID"])
        ctx=await browser.new_context(locale="id-ID", user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64)")
        if cookies:
            await ctx.add_cookies(cookies)
            print(f"[AUTH] {len(cookies)} cookies added")
        page=await ctx.new_page()
        places=[]
        filtered=[]
        for idx,(kw,wil,url) in enumerate(collected,1):
            print(f"\n[BULK] {idx}/{len(collected)} {kw}@{wil} (total {done_count+len(places)+1}/75)")
            place=await extract_detail(page, url, keyword=kw)
            place.attributes["wilayah_search"]=wil
            if is_dki(place):
                places.append(place)
                print(f" KEEP {place.nama} | fasilitas {len(place.fasilitas)} | busy {place.attributes.get('has_busy_hours')} | hours {place.attributes.get('analytics_total_open_hours_per_week')}")
            else:
                filtered.append(place)
                print(f" FILTER {place.nama}")
            await page.wait_for_timeout(800)
            if idx%10==0:
                # checkpoint - include done_data
                try:
                    total = done_count + len(places)
                    merged_ckpt = done_data + [pl.to_dict() for pl in places]
                    with open(f"data/raw/_ckpt_bulk_{total}.json","w",encoding="utf-8") as f:
                        json.dump(merged_ckpt, f, ensure_ascii=False, indent=2)
                    print(f"[CKPT] {total} saved (done {done_count} + new {len(places)})")
                except: pass
        await browser.close()
        # merge done_data + new places
        all_places = done_data + [pl.to_dict() for pl in places]
        # dedup
        seen=set()
        dedup=[]
        for d in all_places:
            key=d.get("place_id") or d.get("url_google_maps","").split("?")[0]
            if key not in seen:
                seen.add(key)
                dedup.append(d)
        print(f"\n[BULK DONE] keep {len(places)} new + {done_count} done = {len(all_places)} -> dedup {len(dedup)} filtered {len(filtered)}")
        if dedup:
            # write final directly (avoid export_places which expects Place objects)
            import pandas as pd
            json_path = f"data/raw/ruangsela_DKI_bulk75_cookie_{len(dedup)}.json"
            with open(json_path,"w",encoding="utf-8") as f:
                json.dump(dedup, f, ensure_ascii=False, indent=2)
            # csv via analytics
            flat=[]
            for d in dedup:
                attr=d.get("attributes",{})
                flat.append({"keyword":d.get("keyword"),"nama":d.get("nama"),"kategori":d.get("kategori"),"alamat":d.get("alamat"),"lat":d.get("lat"),"lng":d.get("lng"),"rating":d.get("rating"),"jumlah_review":d.get("jumlah_review"),"jam_operasional_raw":(d.get("jam_operasional_raw") or "").replace("\n"," | "),"telepon":d.get("telepon"),"website":d.get("website"),"fasilitas":", ".join(d.get("fasilitas") or []),"fasilitas_count":len(d.get("fasilitas") or []),"has_busy_hours":attr.get("has_busy_hours"),"total_open_hours_week":attr.get("analytics_total_open_hours_per_week"),"facility_score":attr.get("analytics_facility_score"),"place_id":d.get("place_id"),"url_google_maps":d.get("url_google_maps")})
            csv_path=json_path.replace(".json",".csv")
            pd.DataFrame(flat).to_csv(csv_path, index=False, encoding="utf-8-sig")
            print(f"JSON {json_path} CSV {csv_path}")
            print(pd.DataFrame(flat)[["nama","fasilitas_count","has_busy_hours"]].head(10).to_string())
            return
            print(f"JSON {json_path} CSV {csv_path}")
            # analytics
            import scraper.analytics as ana
            df=ana.to_analytics_df(json_path)
            acsv=json_path.replace(".json","_analytics.csv")
            df.to_csv(acsv, index=False, encoding="utf-8-sig")
            print(f"Analytics {acsv}")
            print(df[["nama","kategori","fasilitas_count","has_busy_hours","total_open_hours_week"]].head(10).to_string())

if __name__=="__main__":
    asyncio.run(run())
