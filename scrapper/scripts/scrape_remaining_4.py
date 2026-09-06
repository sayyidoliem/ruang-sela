import asyncio, json, sys
sys.stdout.reconfigure(encoding='utf-8', errors='replace')
from playwright.async_api import async_playwright
from scraper.detail import extract_detail
from scraper.scale_dki import is_dki

# Remaining 4 balai warga from supplement (last 4 in collected)
REMAINING = [
    ("balai warga","Jakarta Barat","https://www.google.com/maps/place/Balai+Warga+Rw/data=!4m7!3m6!1s0x2e69f6f8301b6cb7:0x331e1bd6978097e0!8m2!3d-6.1797675!4d106.7718862!16s%2Fg%2F11ycy5pmdk!19sChIJt4CwgIPvay4R4Jd4lnQllzM"),
    ("balai warga","Jakarta Barat","https://www.google.com/maps/place/BALAI+WARGA/data=!4m7!3m6!1s0x2e69f7b3ee7b05bb:0xff3b3e6921dc600b!8m2!3d-6.139315!4d106.797479!16s%2Fg%2F11mc8trs4h!19sChIJuwt57TO3ay4RSDxgIRPiO38"),
    ("balai warga","Jakarta Barat","https://www.google.com/maps/place/BALAI+WARGA+RW.01+KEL.RAWA+BUAYA/data=!4m7!3m6!1s0x2e69f70056dde3e9:0x940325ccd8032643!8m2!3d-6.1586404!4d106.7453933!16s%2Fg%2F11ssdp09y5!19sChIJ6d5WVoD3ay4RQyADMM3MUyQk"),
    ("balai warga","Jakarta Barat","https://www.google.com/maps/place/Balai+Warga+Moneter/data=!4m7!3m6!1s0x2e69f77a98a1ac33:0x8bad0aae81874653!8m2!3d-6.1790094!4d106.7981025!16s%2Fg%2F11c2q3q9x!19sChIJM6qhmo53ay4RU0Z4gq6KrdI"),
]

async def run():
    places=[]
    async with async_playwright() as p:
        browser=await p.chromium.launch(headless=True, args=["--disable-blink-features=AutomationControlled","--lang=id-ID"])
        ctx=await browser.new_context(locale="id-ID", user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64)")
        page=await ctx.new_page()
        for kw,wil,url in REMAINING:
            print(f"\n[REMAIN] {kw} {url[:80]}")
            place=await extract_detail(page, url, keyword=kw)
            place.attributes["wilayah_search"]=wil
            if is_dki(place):
                places.append(place.to_dict())
                print(f" KEEP {place.nama} rating {place.rating}")
            else:
                print(f" FILTER {place.nama}")
            await page.wait_for_timeout(800)
        await browser.close()
    # Save these 4
    import pathlib
    with open("data/raw/_remaining_4.json","w",encoding="utf-8") as f:
        json.dump(places,f,ensure_ascii=False,indent=2)
    print(f"Saved {len(places)} to _remaining_4.json")
    # Merge with previous 62 + supplement 14 already done -> reconstruct final
    # Load 62
    base=json.loads(pathlib.Path("data/raw/ruangsela_DKI_scale62_resume.json").read_text(encoding="utf-8"))
    # Load supplement partial that succeeded before timeout? We don't have it, but we can reconstruct supplement 14 from logs by re-scraping quickly? For now merge 62 + these 4 + re-scrape supplement 14 quickly via reusing already done logs? Let's instead load supplement that we can re-scrape fully with faster method: we already have 14 done in this run's memory? No we only scraped 4 now.
    # For supplement 14, we need to rescrape them - but we already did in previous run but lost. Let's quickly scrape supplement 14 again but with faster batch via this same script extended?
    print("Done remaining 4")

asyncio.run(run())
