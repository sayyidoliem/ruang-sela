import asyncio, pathlib, sys
sys.stdout.reconfigure(encoding='utf-8', errors='replace')
from playwright.async_api import async_playwright
from scraper.auth import load_netscape_cookies
from scraper.search import search_places
from scraper.detail import extract_detail
from scraper.export import export_places

# 5 sample diverse untuk validate facilities/busy-hours dengan cookie
TARGETS = [
    ("taman", "Jakarta Barat"),
    ("co-working space", "Jakarta Barat"),
    ("lapangan", "Jakarta Barat"),
    ("aula", "Jakarta Pusat"),
    ("ruang komunitas", "Jakarta Selatan"),
]

async def run():
    cookies = load_netscape_cookies("www.google.com_cookies.txt")
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True, args=["--disable-blink-features=AutomationControlled","--lang=id-ID"])
        ctx = await browser.new_context(locale="id-ID", user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/123.0.0.0", viewport={"width":1366,"height":768})
        if cookies:
            # Playwright expects domain .google.com -> add to google.com, also need for maps.google.com?
            # Add all
            try:
                await ctx.add_cookies(cookies)
                print(f"[COOKIE] Added {len(cookies)} cookies to context")
            except Exception as e:
                print(f"[COOKIE] add_cookies failed: {e}")
                # fallback add only google.com
                filtered=[c for c in cookies if "google" in c["domain"]]
                await ctx.add_cookies(filtered)
                print(f"[COOKIE] Added filtered {len(filtered)}")

        page = await ctx.new_page()
        # Verify cookie is sent
        await page.goto("https://www.google.com/maps", wait_until="domcontentloaded")
        await page.wait_for_timeout(2000)
        # Print current cookies
        stored = await ctx.cookies()
        print(f"[COOKIE] Context has {len(stored)} cookies after add")
        for c in stored[:5]:
            print(f"  {c['name']} domain={c['domain']} path={c['path']}")

        places=[]
        for kw, wilayah in TARGETS:
            print(f"\n{'='*60}\n[TEST5] kw={kw} wilayah={wilayah}")
            links = await search_places(page, kw, wilayah, max_results=2)
            if not links:
                print("  No links")
                continue
            url = links[0]
            print(f"  Using URL: {url[:120]}")
            place = await extract_detail(page, url, keyword=kw)
            place.attributes["test_wilayah"] = wilayah
            places.append(place)
            # Print analytics summary
            print(f"  -> {place.nama} | {place.kategori} | rating {place.rating} ({place.jumlah_review})")
            print(f"     fasilitas: {place.fasilitas} (count {len(place.fasilitas)})")
            print(f"     has_busy_hours: {place.attributes.get('has_busy_hours')} | popular_times: {str(place.popular_times)[:120] if place.popular_times else 'None'}")
            print(f"     price_level: {place.price_level} | harga_text: {place.harga_text}")
            print(f"     jam: {place.jam_operasional_raw[:100] if place.jam_operasional_raw else 'None'} | analytics_hours {place.attributes.get('analytics_total_open_hours_per_week')}")
            print(f"     about_sections: {len(place.attributes.get('about_sections',[]))} aria_facilities: {place.attributes.get('aria_facilities',[])[:3] if place.attributes.get('aria_facilities') else 'None'}")
            await page.wait_for_timeout(1000)

        await browser.close()

        if places:
            json_path, csv_path = export_places(places, prefix="test_cookie_5_essentials")
            print(f"\n[EXPORT] JSON {json_path} CSV {csv_path}")
            # Validation summary
            print("\n=== VALIDATION 5 SAMPLE ESSENTIALS ===")
            for i, pl in enumerate(places,1):
                d=pl.to_dict()
                print(f"{i}. {d['nama']} ({d['keyword']})")
                print(f"   kategori: {d['kategori']} rating {d['rating']} reviews {d['jumlah_review']}")
                print(f"   jam_lengkap: {d['attributes'].get('analytics_jam_lengkap')} total_hours {d['attributes'].get('analytics_total_open_hours_per_week')} is24h {d['attributes'].get('analytics_is_24h')}")
                print(f"   fasilitas({len(d['fasilitas'])}): {d['fasilitas']}")
                print(f"   has_busy: {d['attributes'].get('has_busy_hours')} busy_raw: {str(d['popular_times'])[:150] if d['popular_times'] else 'None'}")
                print(f"   price: level={d['price_level']} harga={d['harga_text']} facility_score {d['attributes'].get('analytics_facility_score')}")
                print(f"   attributes keys: {list(d['attributes'].keys())[:8]}")
            # Check non-null rates
            print("\n=== NON-NULL RATES ===")
            keys=["fasilitas","popular_times","jam_operasional_raw","price_level","harga_text","kategori","rating"]
            for k in keys:
                if k in ["fasilitas"]:
                    cnt=sum(1 for pl in places if getattr(pl,k))
                elif k=="popular_times":
                    cnt=sum(1 for pl in places if getattr(pl,k))
                else:
                    cnt=sum(1 for pl in places if getattr(pl,k) not in [None,"",[]])
                print(f"  {k}: {cnt}/5 ({cnt/5*100:.0f}%)")

if __name__=="__main__":
    asyncio.run(run())
