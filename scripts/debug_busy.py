import asyncio, pathlib, sys
sys.stdout.reconfigure(encoding='utf-8', errors='replace')
from playwright.async_api import async_playwright
from scraper.auth import load_netscape_cookies

URL="https://www.google.com/maps/place/Gedung+Dhanapala/data=!4m7!3m6!1s0x2e69f5cb019d1a5b:0x7176ab25b6de0b31!8m2!3d-6.173361!4d106.845!16s%2Fg%2F11b6z2pv29"

async def run():
    cookies=load_netscape_cookies("www.google.com_cookies.txt")
    async with async_playwright() as p:
        browser=await p.chromium.launch(headless=True)
        ctx=await browser.new_context(locale="id-ID")
        await ctx.add_cookies(cookies)
        page=await ctx.new_page()
        await page.goto(URL, wait_until="domcontentloaded")
        await page.wait_for_timeout(4000)
        await page.wait_for_load_state("networkidle", timeout=4000)
        # scroll
        await page.evaluate("()=> window.scrollBy(0,600)")
        await page.wait_for_timeout(1000)
        # dump aria-labels containing busy/ramai/popular
        aria=await page.eval_on_selector_all("[aria-label]", "els=>els.map(e=>e.getAttribute('aria-label')).filter(Boolean)")
        busy=[a for a in aria if any(k in a.lower() for k in ["busy","ramai","popular","%"])]
        print(f"Found {len(busy)} busy aria")
        for b in busy[:10]:
            print(f"  BUSY ARIA: {b[:200]}")
        # dump innerText snippets
        body=await page.inner_text("body")
        for line in body.split("\n"):
            if "ramai" in line.lower() or "popular" in line.lower() or "busy" in line.lower():
                print(f"BODY line: {line[:200]}")
        # dump content search
        content=await page.content()
        import re
        for m in re.finditer(r'popularTimes.{0,300}', content, re.I):
            print(f"CONTENT popularTimes: {m.group(0)[:300]}")
        # try to find histogram bars
        hist=await page.eval_on_selector_all("[aria-valuenow]", "els=>els.map(e=>e.outerHTML).slice(0,5)")
        print(f"aria-valuenow count {len(hist)}")
        for h in hist[:3]:
            print(h[:300])
        # network capture attempt: listen for XHR
        await browser.close()

asyncio.run(run())
