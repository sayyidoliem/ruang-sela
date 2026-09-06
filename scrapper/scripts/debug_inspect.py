import asyncio, re, json, sys
sys.stdout.reconfigure(encoding='utf-8', errors='replace')
from playwright.async_api import async_playwright

URLS = [
    "https://www.google.com/maps/place/SWASANA+GRAND+SLIPI+CONVENTION+HALL/@-6.2007999,106.7985726,17z/data=!3m1!4b1!4m6!3m5!1s0x2e69f6bef2eaaaab:0x480ecca810824c84!8m2!3d-6.2007999!4d106.7985726!16s%2Fg%2F11dyl__ygj?entry=ttu",
    "https://www.google.com/maps/place/Aula+Karang+Taruna/@-6.2015948,106.7882547,17z/data=!3m1!4b1!4m6!3m5!1s0x2e69f6c3df1f7e67:0x6a69ab05ff820672!8m2!3d-6.2015948!4d106.7882547!16s%2Fg%2F11b6gjmmnm?entry=ttu",
    "https://www.google.com/maps/place/Nafiri+Convention+Hall+Central+Park/@-6.1765856,106.7915794,17z/data=!3m1!4b1!4m6!3m5!1s0x2e69f65f9d433c71:0xad127915e1bac9b!8m2!3d-6.1765856!4d106.7915794!16s%2Fg%2F11c37_44hv?entry=ttu",
]

async def inspect(url):
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True, args=["--lang=id-ID"])
        ctx = await browser.new_context(locale="id-ID", user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/123.0.0.0")
        page = await ctx.new_page()
        await page.goto(url, wait_until="domcontentloaded", timeout=30000)
        await page.wait_for_timeout(4000)
        try: await page.wait_for_load_state("networkidle", timeout=5000)
        except: pass
        print(f"\n{'='*80}\nURL: {url}\nTITLE: {await page.title()}")

        # Dump all aria-labels containing bintang/stars/rating
        labels = await page.eval_on_selector_all("[aria-label]", "els => els.map(e => e.getAttribute('aria-label')).slice(0,60)")
        print("\n--- aria-label sample (60) ---")
        for lb in labels[:40]:
            if any(k in (lb or "") for k in ["bintang","stars","Rating","Ulasan","reviews","Buka","Jam"]):
                print(f"  ARIA: {lb}")

        # Try category selectors
        for sel in ['button[jsaction*="pane.rating.category"]','button[jsaction*="category"]','div:has-text("Gedung")','span:has-text("Aula")']:
            try:
                cnt = await page.locator(sel).count()
                if cnt>0:
                    txt = await page.locator(sel).first.inner_text()
                    print(f"CATEGORY sel {sel}: count {cnt} -> {txt[:200]}")
            except: pass

        # Try rating selectors brute force
        print("\n--- rating candidates ---")
        for sel in ['span[aria-label*="bintang"]','span[aria-label*="stars"]','div[aria-label*="bintang"]','span:has-text("★")','span:has-text("4,")','div:has-text("ulasan")','button:has-text("ulasan")','span:has-text("ulasan")']:
            try:
                cnt = await page.locator(sel).count()
                if cnt>0:
                    for i in range(min(cnt,3)):
                        txt = await page.locator(sel).nth(i).inner_text()
                        aria = await page.locator(sel).nth(i).get_attribute("aria-label")
                        print(f"  RAT sel {sel} [{i}]: text='{txt[:120]}' aria='{aria}'")
            except Exception as e: print(f"  err {sel}: {e}")

        # Dump innerText snippet around rating area
        body = await page.inner_text("body")
        print("\n--- body snippet 2000 chars ---")
        print(body[:2500].replace("\n"," | ")[:2500])

        # Check place_id in URL after navigation
        print(f"\nFinal URL: {page.url}")
        # Try to find ChIJ
        m = re.search(r"ChIJ[^!&]+", page.url)
        print(f"ChIJ in URL: {m.group(0) if m else 'NOT FOUND'}")
        # Try data in script tags
        content = await page.content()
        m2 = re.search(r"ChIJ[^\"]+", content)
        print(f"ChIJ in content: {m2.group(0)[:80] if m2 else 'NOT FOUND'}")
        # Check for rating in content regex
        m3 = re.search(r"(\d[.,]\d)\s*★|\d[.,]\d.{0,10}bintang|\d[.,]\d.{0,10}stars", content, re.I)
        print(f"Rating regex in content: {m3.group(0)[:80] if m3 else 'NOT FOUND'}")

        await browser.close()

async def main():
    for u in URLS:
        await inspect(u)

asyncio.run(main())
