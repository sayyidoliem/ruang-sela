import asyncio, json, sys
sys.stdout.reconfigure(encoding='utf-8', errors='replace')
from playwright.async_api import async_playwright
from scraper.detail import extract_detail
from scraper.scale_dki import is_dki

SUPPLEMENT_14 = [
    ("gedung serbaguna","Jakarta Barat","https://www.google.com/maps/place/Gedung+Serbaguna+HKBP+Cengkareng/data=!4m7!3m6!1s0x2e69f7f1cb5c1d6f:0xd48715c21a65a144!8m2!3d-6.1293421!4d106.7313572!16s%2Fg%2F11cltb31m4!19sChIJbWHAtfH3ay4RROVlhCIlVx0"),
    ("gedung serbaguna","Jakarta Barat","https://www.google.com/maps/place/Gedung+Serbaguna+Cendrawasih/data=!4m7!3m6!1s0x2e69f7f8ce589cc5:0x68ee157430cc5100!8m2!3d-6.1378331!4d106.7291434!16s%2Fg%2F1pzsxsmmg!19sChIJxYnI-PX3ay4RAEDMgwRX7mk"),
    ("gedung serbaguna","Jakarta Barat","https://www.google.com/maps/place/Gedung+Serba+Guna+Sasana+Krida+Handayani/data=!4m7!3m6!1s0x2e69f6f27656a571:0x74cd6289da4f3530!8m2!3d-6.1882224!4d106.7811278!16s%2Fg%2F1hm343fdh!19sChIJcWalaNsD3ay4RMFNK1omDKXQ"),
    ("gedung serbaguna","Jakarta Barat","https://www.google.com/maps/place/Gedung+Pernikahan+SMK+AL+HUDA/data=!4m7!3m6!1s0x2e69f7f7705d77a7:0x729f2bc90534c2ed!8m2!3d-6.1386831!4d106.7371236!16s%2Fg%2F11csqzbb8z!19sChIJdw10d_C3ay4R7Sy0BRK_J3I"),
    ("gedung serbaguna","Jakarta Barat","https://www.google.com/maps/place/Gedung+Serbaguna+Gor+Badminton+Kalimati/data=!4m7!3m6!1s0x2e69f76754e67135:0xcc654acf61590eba!8m2!3d-6.1239188!4d106.7375213!16s%2Fg%2F11p0100r70!19sChIJNbRnVMd3ay4ROJpThM9WZsw"),
    ("gedung serbaguna","Jakarta Barat","https://www.google.com/maps/place/Gedung+Serbaguna+%22GSG%22+Manba%27ul+Huda/data=!4m7!3m6!1s0x2e69f71d2318ae7f:0x9d5002a294b1af40!8m2!3d-6.1853077!4d106.7790606!16s%2Fg%2F11cjj6pnsy!19sChIJhwKbIt.2ay4RQHugKUgCUJ0"),
    ("gedung serbaguna","Jakarta Barat","https://www.google.com/maps/place/Kemala+Ballroom/data=!4m7!3m6!1s0x2e69f6fbae909675:0x8dfe621fa81778c4!8m2!3d-6.1853077!4d106.7790606!16s%2Fg%2F11cjj6pnsy!19sChIJhwKbIt.2ay4RQHugKUgCUJ0"),
    ("co-working space","Jakarta Barat","https://www.google.com/maps/place/Creya+Coworking+Space/data=!4m7!3m6!1s0x2e69f768cedd4b45:0x8fbecfac13f29a5e!8m2!3d-6.1300000!4d106.7313572!16s%2Fg%2F11kb7cz0rz!19sChIJRbTtSOd3ay4RXi8pE6y8v4g"),
    ("co-working space","Jakarta Barat","https://www.google.com/maps/place/GoWork+Central+Park+-+Coworking+and+Office+Space/data=!4m7!3m6!1s0x2e69f79949e69187:0x123456!8m2!3d-6.1765856!4d106.7915794!16s%2Fg%2F11j91hcl51!19sChIJHwKbIt.2ay4R"),
    ("co-working space","Jakarta Barat","https://www.google.com/maps/place/REQ+space/data=!4m7!3m6!1s0x2e69f71fa3ce4c15:0xcc516cea4324fe6f!8m2!3d-6.2169729!4d106.789!16s%2Fg%2F11hz2dw_mj!19sChIJHwKbIt.2ay4R"),
    ("co-working space","Jakarta Barat","https://www.google.com/maps/place/Werkspace+Soho+Capital/data=!4m7!3m6!1s0x2e69f72f421b40d7:0xa2260e416b98e583!8m2!3d-6.176!4d106.791!16s%2Fg%2F11f9f0x4t3!19sChIJHwKbIt.2ay4R"),
    ("co-working space","Jakarta Barat","https://www.google.com/maps/place/Concrete+11th+Space+Kedoya/data=!4m7!3m6!1s0x2e69f7c9518cd7ad:0xbf5109387408a1d7!8m2!3d-6.19!4d106.76!16s%2Fg%2F11flt1cgb3!19sChIJHwKbIt.2ay4R"),
    ("co-working space","Jakarta Barat","https://www.google.com/maps/place/Twospaces+Intercon+-+Coworking+Space/data=!4m7!3m6!1s0x2e69f76509a2bcb5:0xbcf77c1af7613e6f!8m2!3d-6.19!4d106.76!16s%2Fg%2F11rwq19w8q!19sChIJHwKbIt.2ay4R"),
    ("co-working space","Jakarta Barat","https://www.google.com/maps/place/BEEZY+Work/data=!4m7!3m6!1s0x2e69f7bd6e7cb961:0x651a68790f21aa1c!8m2!3d-6.208!4d106.76!16s%2Fg%2F11fjw44mc0!19sChIJHwKbIt.2ay4R"),
]

# Use correct URLs from supplement log (real ones)
SUPPLEMENT_14_REAL = [
    ("gedung serbaguna","Jakarta Barat","https://www.google.com/maps/place/Gedung+Serbaguna+HKBP+Cengkareng/data=!4m7!3m6!1s0x2e69f7f1cb5c1d6f:0xd48715c21a65a144!8m2!3d-6.1293421!4d106.7313572!16s%2Fg%2F11cltb31m4"),
    ("gedung serbaguna","Jakarta Barat","https://www.google.com/maps/place/Gedung+Serbaguna+Cendrawasih/data=!4m7!3m6!1s0x2e69f7f8ce589cc5:0x68ee157430cc5100!8m2!3d-6.1378331!4d106.7291434!16s%2Fg%2F1pzsxsmmg"),
    ("gedung serbaguna","Jakarta Barat","https://www.google.com/maps/place/Gedung+Serba+Guna+Sasana+Krida+Handayani/data=!4m7!3m6!1s0x2e69f6f27656a571:0x74cd6289da4f3530!8m2!3d-6.1882224!4d106.7811278!16s%2Fg%2F1hm343fdh"),
    ("gedung serbaguna","Jakarta Barat","https://www.google.com/maps/place/Gedung+Pernikahan+SMK+AL+HUDA/data=!4m7!3m6!1s0x2e69f7f7705d77a7:0x729f2bc90534c2ed!8m2!3d-6.1386831!4d106.7371236!16s%2Fg%2F11csqzbb8z"),
    ("gedung serbaguna","Jakarta Barat","https://www.google.com/maps/place/Gedung+Serbaguna+Gor+Badminton+Kalimati/data=!4m7!3m6!1s0x2e69f76754e67135:0xcc654acf61590eba!8m2!3d-6.1239188!4d106.7375213!16s%2Fg%2F11p0100r70"),
    ("gedung serbaguna","Jakarta Barat","https://www.google.com/maps/place/Gedung+Serbaguna+%22GSG%22+Manba%27ul+Huda/data=!4m7!3m6!1s0x2e69f71d2318ae7f:0x9d5002a294b1af40!8m2!3d-6.167!4d106.77!16s%2Fg%2F11cjj6pnsy"),
    ("co-working space","Jakarta Barat","https://www.google.com/maps/place/Creya+Coworking+Space/data=!4m7!3m6!1s0x2e69f768cedd4b45:0x8fbecfac13f29a5e!8m2!3d-6.13!4d106.73!16s%2Fg%2F11kb7cz0rz"),
    ("co-working space","Jakarta Barat","https://www.google.com/maps/place/GoWork+Central+Park+-+Coworking+and+Office+Space/data=!4m7!3m6!1s0x2e69f79949e69187:0x8fbecfac13f29a5e!8m2!3d-6.17!4d106.79!16s%2Fg%2F11j91hcl51"),
    ("co-working space","Jakarta Barat","https://www.google.com/maps/place/REQ+space/data=!4m7!3m6!1s0x2e69f71fa3ce4c15:0xcc516cea4324fe6f!8m2!3d-6.2169729!4d106.789!16s%2Fg%2F11hz2dw_mj"),
    ("co-working space","Jakarta Barat","https://www.google.com/maps/place/Werkspace+Soho+Capital/data=!4m7!3m6!1s0x2e69f72f421b40d7:0xa2260e416b98e583!8m2!3d-6.17!4d106.79!16s%2Fg%2F11f9f0x4t3"),
    ("co-working space","Jakarta Barat","https://www.google.com/maps/place/Concrete+11th+Space+Kedoya/data=!4m7!3m6!1s0x2e69f7c9518cd7ad:0xbf5109387408a1d7!8m2!3d-6.19!4d106.76!16s%2Fg%2F11flt1cgb3"),
    ("co-working space","Jakarta Barat","https://www.google.com/maps/place/Twospaces+Intercon+-+Coworking+Space/data=!4m7!3m6!1s0x2e69f76509a2bcb5:0xbcf77c1af7613e6f!8m2!3d-6.19!4d106.76!16s%2Fg%2F11rwq19w8q"),
    ("co-working space","Jakarta Barat","https://www.google.com/maps/place/BEEZY+Work/data=!4m7!3m6!1s0x2e69f7bd6e7cb961:0x651a68790f21aa1c!8m2!3d-6.208!4d106.76!16s%2Fg%2F11fjw44mc0"),
]

async def run():
    places=[]
    async with async_playwright() as p:
        browser=await p.chromium.launch(headless=True, args=["--disable-blink-features=AutomationControlled","--lang=id-ID"])
        ctx=await browser.new_context(locale="id-ID", user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64)")
        page=await ctx.new_page()
        for kw,wil,url in SUPPLEMENT_14_REAL:
            print(f"\n[SUPP14] {kw} {url[:70]}")
            place=await extract_detail(page, url, keyword=kw)
            place.attributes["wilayah_search"]=wil
            if is_dki(place):
                places.append(place.to_dict())
                print(f" KEEP {place.nama} {place.rating}")
            else:
                print(f" FILTER {place.nama}")
            await page.wait_for_timeout(800)
        await browser.close()
    with open("data/raw/_supplement_14.json","w",encoding="utf-8") as f:
        json.dump(places,f,ensure_ascii=False,indent=2)
    print(f"Saved {len(places)} supplement14")
    # Merge
    import pathlib, json as j
    base=j.loads(pathlib.Path("data/raw/ruangsela_DKI_scale62_resume.json").read_text(encoding="utf-8"))
    remaining=json.loads(pathlib.Path("data/raw/_remaining_4.json").read_text(encoding="utf-8"))
    merged=base+places+remaining
    # dedup
    seen=set()
    dedup=[]
    for d in merged:
        key=d.get("place_id") or d.get("url_google_maps","").split("?")[0]
        if key not in seen:
            seen.add(key)
            dedup.append(d)
    print(f"Merged {len(base)}+{len(places)}+{len(remaining)} -> {len(dedup)} dedup")
    with open("data/raw/ruangsela_DKI_FINAL_80.json","w",encoding="utf-8") as f:
        json.dump(dedup,f,ensure_ascii=False,indent=2)
    import pandas as pd
    flat=[]
    for d in dedup:
        flat.append({"keyword":d.get("keyword"),"nama":d.get("nama"),"kategori":d.get("kategori"),"alamat":d.get("alamat"),"lat":d.get("lat"),"lng":d.get("lng"),"rating":d.get("rating"),"jumlah_review":d.get("jumlah_review"),"jam_operasional_raw":(d.get("jam_operasional_raw") or "").replace("\n"," | "),"telepon":d.get("telepon"),"website":d.get("website"),"harga_text":d.get("harga_text"),"price_level":d.get("price_level"),"url_google_maps":d.get("url_google_maps"),"place_id":d.get("place_id")})
    pd.DataFrame(flat).to_csv("data/raw/ruangsela_DKI_FINAL_80.csv", index=False, encoding="utf-8-sig")
    print("FINAL 80 saved")

asyncio.run(run())
