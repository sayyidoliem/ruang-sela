import asyncio, json, os, sys
sys.stdout.reconfigure(encoding='utf-8', errors='replace')
from playwright.async_api import async_playwright
from scraper.config import KEYWORDS, DKI_WILAYAH, LIMIT_PER_KEYWORD_DKI, LIMIT_DKI_TOTAL
from scraper.search import search_places

async def collect():
    collected=[]
    seen=set()
    limit_total=LIMIT_DKI_TOTAL
    limit_per_keyword=LIMIT_PER_KEYWORD_DKI
    async with async_playwright() as p:
        browser=await p.chromium.launch(headless=True, args=["--disable-blink-features=AutomationControlled","--lang=id-ID"])
        ctx=await browser.new_context(locale="id-ID", user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64)")
        page=await ctx.new_page()
        for kw in KEYWORDS:
            if len(collected)>=limit_total: break
            kw_collected=0
            for wilayah in DKI_WILAYAH:
                if kw_collected>=limit_per_keyword or len(collected)>=limit_total: break
                remaining_kw=limit_per_keyword-kw_collected
                remaining_total=limit_total-len(collected)
                need=min(remaining_kw, remaining_total, 6)
                if need<=0: break
                print(f"[COLLECT] {kw} @ {wilayah} need {need}")
                links=await search_places(page, kw, wilayah, max_results=need+2)
                added=0
                for url in links:
                    norm=url.split("?")[0]
                    if norm not in seen:
                        seen.add(norm)
                        collected.append((kw,wilayah,url))
                        kw_collected+=1
                        added+=1
                        if kw_collected>=limit_per_keyword or len(collected)>=limit_total: break
                print(f"  added {added} total {len(collected)}")
                await page.wait_for_timeout(1200)
            if kw_collected<limit_per_keyword and len(collected)<limit_total:
                need=min(limit_per_keyword-kw_collected, limit_total-len(collected))
                print(f"[COLLECT] {kw} @ DKI Jakarta fallback need {need}")
                links=await search_places(page, kw, "DKI Jakarta", max_results=need+2)
                for url in links:
                    norm=url.split("?")[0]
                    if norm not in seen:
                        seen.add(norm)
                        collected.append((kw,"DKI Jakarta",url))
                        kw_collected+=1
                        if kw_collected>=limit_per_keyword or len(collected)>=limit_total: break
                await page.wait_for_timeout(1200)
        await browser.close()
    os.makedirs("data/raw", exist_ok=True)
    path="data/raw/_collected_DKI_60.json"
    with open(path,"w",encoding="utf-8") as f:
        json.dump([{"keyword":kw,"wilayah":wil,"url":u} for kw,wil,u in collected], f, ensure_ascii=False, indent=2)
    print(f"Saved {len(collected)} to {path}")
    for i,(kw,wil,u) in enumerate(collected,1):
        print(f"{i:02d} [{kw}@{wil}] {u[:100]}")

asyncio.run(collect())
