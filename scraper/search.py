import re
import asyncio
import urllib.parse
from typing import List
from playwright.async_api import Page

from .config import SELECTORS, TARGET_COORDS, ZOOM, TIMEOUT_MS, SCROLL_DELAY_MS

async def build_search_url(keyword: str, location: str, coords: str = TARGET_COORDS, zoom: str = ZOOM) -> str:
    query = f"{keyword} di {location}"
    encoded = urllib.parse.quote_plus(query)
    # Format: https://www.google.com/maps/search/aula+di+Jakarta+Barat/@-6.16,106.75,14z
    return f"https://www.google.com/maps/search/{encoded}/@{coords},{zoom}"

async def dismiss_consent(page: Page):
    try:
        # Coba klik tombol consent jika ada
        sel = SELECTORS["consent"]
        btn = page.locator(sel).first
        if await btn.count() > 0:
            await btn.click(timeout=3000)
            await page.wait_for_timeout(1000)
    except:
        pass

async def scroll_feed(page: Page, max_results: int = 20, max_scrolls: int = 15) -> List[str]:
    """
    Scroll div[role=feed] untuk memuat hasil. Kumpulkan href place.
    """
    feed_selector = SELECTORS["feed"]
    # Tunggu feed muncul (bisa 10-20 detik di koneksi lambat)
    try:
        await page.wait_for_selector(feed_selector, timeout=TIMEOUT_MS)
    except:
        print("[SEARCH] Feed tidak ditemukan, mungkin hasil kosong atau layout berubah")
        # Dump URL untuk debug
        print(f"  URL: {page.url}")
        return []

    links = set()
    last_count = 0
    stalled = 0

    for i in range(max_scrolls):
        # Ambil semua link place saat ini
        hrefs = await page.eval_on_selector_all(
            SELECTORS["place_links"],
            "els => els.map(e => e.href)"
        )
        for h in hrefs:
            # Filter hanya yang beneran place
            if "/maps/place/" in h:
                links.add(h.split("?")[0])  # bersihkan query, keep base
            elif h.startswith("https://www.google.com/maps/place/"):
                links.add(h)

        print(f"[SEARCH] Scroll {i+1}: {len(links)} unique links")

        if len(links) >= max_results:
            break
        if len(links) == last_count:
            stalled += 1
            if stalled >= 3:
                print("[SEARCH] Stalled, berhenti scroll")
                break
        else:
            stalled = 0
        last_count = len(links)

        # Scroll feed ke bawah
        try:
            await page.eval_on_selector(feed_selector, "el => el.scrollBy(0, el.scrollHeight)")
        except:
            # fallback scroll page
            await page.mouse.wheel(0, 3000)

        await page.wait_for_timeout(SCROLL_DELAY_MS)

        # Cek apakah ada "You've reached the end" atau tombol end
        end_text = await page.locator("text=You've reached the end").count()
        if end_text > 0:
            print("[SEARCH] End of list tercapai")
            break

    return list(links)[:max_results]

async def search_places(page: Page, keyword: str, location: str, max_results: int = 10) -> List[str]:
    url = await build_search_url(keyword, location)
    print(f"\n[SEARCH] Keyword: '{keyword} di {location}'")
    print(f"  URL: {url}")
    await page.goto(url, wait_until="domcontentloaded", timeout=TIMEOUT_MS)
    await page.wait_for_timeout(3000)
    await dismiss_consent(page)
    # Tunggu network idle sebentar
    try:
        await page.wait_for_load_state("networkidle", timeout=8000)
    except:
        pass

    links = await scroll_feed(page, max_results=max_results)
    print(f"[SEARCH] Total {len(links)} links untuk '{keyword}'")
    for idx, l in enumerate(links, 1):
        print(f"  {idx}. {l[:120]}")
    return links
