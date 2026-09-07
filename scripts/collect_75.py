import asyncio, json, os, sys
sys.stdout.reconfigure(encoding='utf-8', errors='replace')
from playwright.async_api import async_playwright
from scraper.config import KEYWORDS, DKI_WILAYAH
from scraper.search import search_places

LIMIT=75
PER=8
async def collect():
    collected=[]
    seen=set()
    async with async_playwright() as p:
        browser=await p.chromium.launch(headless=True, args=["--disable-blink-features=AutomationControlled","--lang=id-ID"])
        ctx=await browser.new_context(locale="id-ID", user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64)")
        page=await ctx.new_page()
        for kw in KEYWORDS:
            if len(collected)>=LIMIT: break
            kw_col=0
            for wil in DKI_WILAYAH:
                if kw_col>=PER or len(collected)>=LIMIT: break
                rem=min(PER-kw_col, LIMIT-len(collected), 6)
                if rem<=0: break
                print(f"[COLLECT75] {kw} @ {wil} need {rem}")
                links=await search_places(page, kw, wil, max_results=rem+2)
                added=0
                for url in links:
                    norm=url.split("?")[0]
                    if norm not in seen:
                        seen.add(norm)
                        collected.append((kw,wil,url))
                        kw_col+=1
                        added+=1
                        if kw_col>=PER or len(collected)>=LIMIT: break
                print(f"  added {added} kw_col {kw_col} total {len(collected)}")
                await page.wait_for_timeout(1200)
                if kw_col>=PER: break
            # fallback
            if kw_col<PER and len(collected)<LIMIT:
                # try DKI Jakarta generic if still need
                pass
        await browser.close()
    os.makedirs("data/raw", exist_ok=True)
    path="data/raw/_collected_DKI_75.json"
    with open(path,"w",encoding="utf-8") as f:
        json.dump([{"keyword":kw,"wilayah":wil,"url":u} for kw,wil,u in collected], f, ensure_ascii=False, indent=2)
    print(f"Saved {len(collected)} to {path}")
    for i,(kw,wil,u) in enumerate(collected,1):
        print(f"{i:02d} [{kw}@{wil}] {u[:90]}")

asyncio.run(collect())
