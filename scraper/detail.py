import re
import json
import sys
import urllib.parse
from datetime import datetime
from typing import Optional, Dict, Any, List
from playwright.async_api import Page
from .models import Place
from .config import TIMEOUT_MS, DETAIL_DELAY_MS

# Fix Windows console encoding untuk karakter icon GMaps (\ue0c8 etc)
try:
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')
    sys.stderr.reconfigure(encoding='utf-8', errors='replace')
except:
    pass

def clean_icon(text: str) -> str:
    if not text:
        return text
    # Hapus semua Private Use Area icon GMaps (\ue000-\uf8ff) dan karakter kontrol icon
    text = re.sub(r"[\ue000-\uf8ff\ue5cc\ue5cd\ue0c8\uE000-\uF8FF]", "", text)
    # Bersihkan artefak  etc tinggal placeholder ? jika encoding rusak
    text = text.replace("\ue0c8", "").replace("\ue5cc", "").replace("\ue5cd", "")
    # Trim spasi & baris ganda
    text = re.sub(r"\n\s*\n", "\n", text)
    text = re.sub(r"^\W+\n", "", text)
    return text.strip()

def safe_print(s: str):
    try:
        # bersihkan icon sebelum print agar tidak error charmap
        s_clean = re.sub(r"[\ue000-\uf8ff]", " ", s)
        print(s_clean.encode('utf-8', 'replace').decode('utf-8', 'replace'))
    except:
        try:
            print(s.encode('ascii', 'ignore').decode('ascii'))
        except:
            print(repr(s))

async def extract_detail(page: Page, url: str, keyword: str = "") -> Place:
    place = Place(keyword=keyword, url_google_maps=url)
    safe_print(f"\n[DETAIL] Scraping: {url[:120]}")
    try:
        await page.goto(url, wait_until="domcontentloaded", timeout=TIMEOUT_MS)
        await page.wait_for_timeout(DETAIL_DELAY_MS)
        try:
            # Untuk skala besar, jangan tunggu networkidle lama; 3s cukup
            await page.wait_for_load_state("networkidle", timeout=3500)
        except:
            pass

        # Dismiss consent if muncul lagi
        try:
            btn = page.locator('button:has-text("Accept all"), button:has-text("Terima semua")').first
            if await btn.count() > 0:
                await btn.click(timeout=2000)
                await page.wait_for_timeout(1000)
        except:
            pass

        # === 1. NAMA (h1) ===
        try:
            h1 = page.locator("h1").first
            if await h1.count() > 0:
                place.nama = (await h1.inner_text()).strip()
        except:
            pass
        # fallback title
        if not place.nama:
            place.nama = await page.title()

        # === 2. KATEGORI ===
        try:
            # DIAGNOSIS: selector lama pane.rating.category tidak ada, yg benar jsaction*="category" (debug_inspect.py:line 1)
            kategori_found = False
            for sel in ['button[jsaction*="pane.rating.category"]', 'button[jsaction*="category"]']:
                cat = page.locator(sel).first
                if await cat.count() > 0:
                    txt = (await cat.inner_text()).strip()
                    txt = clean_icon(txt)
                    if txt and len(txt) < 80 and txt not in ["Tulis ulasan"]:
                        place.kategori = txt
                        kategori_found = True
                        break
            if not kategori_found:
                # fallback: body snippet mengandung "4,6 | Gedung Pernikahan" -> ambil setelah rating
                body_text_tmp = await page.inner_text("body")
                m_cat = re.search(r"\d[.,]\d\s*[|·]\s*([A-Za-z ]+)", body_text_tmp)
                if m_cat:
                    cand = m_cat.group(1).strip()
                    if 3 < len(cand) < 40 and "ulasan" not in cand.lower():
                        place.kategori = clean_icon(cand)
                # fallback lain
                if not place.kategori:
                    cats = await page.locator('button:has-text("Aula"), button:has-text("Taman"), span:has-text("Taman")').all_inner_texts()
                    if cats:
                        place.kategori_list = [clean_icon(c.strip()) for c in cats[:3] if c.strip()]
                        if place.kategori_list:
                            place.kategori = place.kategori_list[0]
        except:
            pass

        # === 3. ALAMAT & PLUS CODE ===
        try:
            addr_btn = page.locator('button[data-item-id="address"]').first
            if await addr_btn.count() > 0:
                raw = (await addr_btn.inner_text()).strip()
                place.alamat = clean_icon(raw)
                # alamat_lengkap via aria-label
                aria = await addr_btn.get_attribute("aria-label")
                if aria:
                    aria_clean = aria.replace("Address: ", "").replace("Alamat: ", "").strip()
                    place.alamat_lengkap = clean_icon(aria_clean)
                else:
                    place.alamat_lengkap = place.alamat
            else:
                # fallback cari element yang mengandung alamat Jakarta
                addrs = await page.locator('div:has-text("Jakarta Barat")').all_inner_texts()
                for a in addrs:
                    if "Jl." in a or "Jakarta" in a:
                        place.alamat = clean_icon(a.strip()[:300])
                        place.alamat_lengkap = place.alamat
                        break
        except:
            pass

        # Plus code
        try:
            all_texts = await page.get_by_text(re.compile(r"^[A-Z0-9]+\+[A-Z0-9]+")).all_inner_texts()
            if all_texts:
                place.plus_code = clean_icon(all_texts[0])
            else:
                # fallback dari body_text plus code pattern
                body_tmp = await page.inner_text("body")
                m_plus = re.search(r"[A-Z0-9]{4,}\+[A-Z0-9]{2,}", body_tmp)
                if m_plus:
                    place.plus_code = m_plus.group(0)
        except:
            pass

        # === 4. KOORDINAT & PLACE_ID / CID dari URL ===
        try:
            current_url = page.url
            place.url_google_maps = current_url
            # Koordinat: !3d-6.16!4d106.75  atau @-6.16,106.75
            m = re.search(r"!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)", current_url)
            if m:
                place.lat = float(m.group(1))
                place.lng = float(m.group(2))
            else:
                m2 = re.search(r"@(-?\d+\.\d+),(-?\d+\.\d+)", current_url)
                if m2:
                    place.lat = float(m2.group(1))
                    place.lng = float(m2.group(2))
            # place_id modern: GMaps sekarang pakai /g/ID bukan ChIJ
            decoded = urllib.parse.unquote(current_url)
            # Coba ekstrak 16s%2Fg%2F11... -> /g/11...
            m_g = re.search(r"/g/([A-Za-z0-9_-]+)", decoded)
            if m_g:
                place.place_id = m_g.group(1)
                # simpan juga cid hex 0x...
            m3 = re.search(r"!1s(0x[0-9a-fA-F]+)", current_url)
            if m3:
                # ini hex feature id, simpan sebagai cid fallback jika place_id belum ada
                if not place.cid:
                    place.cid = m3.group(1)
                if not place.place_id:
                    place.place_id = m3.group(1)
            m4 = re.search(r"cid=(\d+)", current_url)
            if m4:
                place.cid = m4.group(1)
            m5 = re.search(r"!1s(ChIJ[^!]+)", current_url)
            if m5 and not place.place_id:
                place.place_id = m5.group(1)
            # content fallback: cari ChIJ di page content jika URL tidak ada
            if not place.place_id:
                try:
                    content = await page.content()
                    m6 = re.search(r"ChIJ[0-9A-Za-z-_]{15,}", content)
                    if m6:
                        place.place_id = m6.group(0)
                except:
                    pass
        except:
            pass

        # === 5. RATING & JUMLAH REVIEW ===
        try:
            # FIX: sebelumnya pakai .first yang dapat elemen " bintang" kosong, sekarang loop semua
            rating_els = page.locator('span[aria-label*="stars"], span[aria-label*="bintang"], div[aria-label*="bintang"]')
            cnt = await rating_els.count()
            for i in range(cnt):
                aria = await rating_els.nth(i).get_attribute("aria-label")
                if aria:
                    m = re.search(r"(\d+[.,]\d+)", aria)
                    if m:
                        try:
                            place.rating = float(m.group(1).replace(",", "."))
                            break
                        except:
                            pass
            # fallback: cari span dengan text 4,x di body yang merupakan rating (debug: 4,6 ada di body)
            if place.rating is None:
                body_text_rating = await page.inner_text("body")
                # Cari pola rating dekat kategori: "4,6 | Gedung" atau "4,6 Gedung"
                m_body = re.search(r"(\d[.,]\d)\s*[|·]\s*[A-Za-z]", body_text_rating)
                if m_body:
                    try:
                        place.rating = float(m_body.group(1).replace(",", "."))
                    except:
                        pass
            # Fallback extra: cari span berisi 4,
            if place.rating is None:
                try:
                    spans = page.locator('span')
                    n = await spans.count()
                    for i in range(min(n, 80)):
                        txt = (await spans.nth(i).inner_text()).strip()
                        if re.match(r"^\d[.,]\d$", txt):
                            try:
                                val = float(txt.replace(",", "."))
                                if 1.0 <= val <= 5.0:
                                    place.rating = val
                                    break
                            except:
                                pass
                except:
                    pass

            # Jumlah review: "(123)" atau "123 reviews" / "123 ulasan"
            # Coba semua element yang mengandung ulasan/reviews
            review_els = page.locator('span:has-text("ulasan"), span:has-text("reviews"), button:has-text("ulasan"), div:has-text("ulasan")')
            rcnt = await review_els.count()
            for i in range(min(rcnt, 10)):
                try:
                    txt = (await review_els.nth(i).inner_text()).strip()
                    txt_clean = clean_icon(txt)
                    # cari (123) atau 123 ulasan
                    m = re.search(r"\(?\s*(\d[\d\.]*)\s*\)?\s*(ulasan|reviews)", txt_clean, re.I)
                    if m:
                        num = m.group(1).replace(".", "").replace(",", "")
                        try:
                            val = int(num)
                            # filter noise: harus >5 dan <100000, dan bukan jam
                            if 0 < val < 100000 and val != int(place.rating or 0):
                                place.jumlah_review = val
                                break
                        except:
                            pass
                except:
                    continue
            # fallback: scan body untuk "123 ulasan" atau "(123)"
            if place.jumlah_review is None:
                body = await page.inner_text("body")
                # Prioritas: "(123)" dengan kurung
                m_paren = re.search(r"\((\d+)\)", body)
                if m_paren:
                    try:
                        place.jumlah_review = int(m_paren.group(1))
                    except:
                        pass
                else:
                    m2 = re.search(r"(\d+)\s+ulasan", body, re.I)
                    if m2:
                        try:
                            place.jumlah_review = int(m2.group(1))
                        except:
                            pass
            # fallback extra: hitung dari review cards jika header kosong (debug: kadang tidak ada count)
            if place.jumlah_review is None:
                try:
                    review_cards = page.locator('div[data-review-id]')
                    c = await review_cards.count()
                    if c > 0 and c < 5:
                        # jika cuma 1-2 review tapi header bilang "Tidak ada ulasan", tetap null
                        pass
                except:
                    pass
        except:
            pass

        # === 6. TELEPON ===
        try:
            phone_btn = page.locator('button[data-item-id*="phone"], a[href^="tel:"]').first
            if await phone_btn.count() > 0:
                # coba href tel:
                href = await phone_btn.get_attribute("href")
                if href and href.startswith("tel:"):
                    place.telepon = href.replace("tel:", "")
                else:
                    txt = await phone_btn.inner_text()
                    # extract phone pattern
                    m = re.search(r"(\+62[\d\s\-()]+|0\d[\d\s\-()]{7,})", txt)
                    if m:
                        place.telepon = m.group(1).strip()
                    else:
                        place.telepon = txt.strip()[:30]
                # aria-label fallback
                if not place.telepon:
                    aria = await phone_btn.get_attribute("aria-label")
                    if aria and "Phone" in aria:
                        m = re.search(r"(\+62[\d\s\-()]+|0\d[\d\s\-()]{7,})", aria)
                        if m:
                            place.telepon = m.group(1)
            # fallback scan page
            if not place.telepon:
                body = await page.content()
                m = re.search(r"0\d{2,3}[- ]?\d{3,4}[- ]?\d{4,}", body)
                if m:
                    place.telepon = m.group(0)
        except:
            pass

        # === 7. WEBSITE ===
        try:
            web = page.locator('a[data-item-id="authority"]').first
            if await web.count() > 0:
                place.website = await web.get_attribute("href")
            else:
                # fallback cari link dengan icon website
                web2 = page.locator('a[href^="http"]:has-text("website"), a[href^="http"]:has-text("situs")').first
                if await web2.count() > 0:
                    place.website = await web2.get_attribute("href")
        except:
            pass

        # === 8. JAM OPERASIONAL & STATUS BUKA ===
        try:
            # Klik tombol jam jika ada untuk expand
            hours_btn = page.locator('button[data-item-id="oh"], div:has-text("Hours"), div:has-text("Jam buka")').first
            if await hours_btn.count() > 0:
                try:
                    await hours_btn.click(timeout=2000)
                    await page.wait_for_timeout(1200)
                except:
                    pass
            
            # Ambil semua teks jam
            hours_table = page.locator('div:has-text("Senin"), div:has-text("Monday")').first
            # Fallback: ambil body yang mengandung hari
            body_text = await page.inner_text("body")
            # Cari pola jam operasional
            # Simpan raw
            # Cari div yang mengandung 7 hari
            hours_texts = await page.locator('table tr, div[aria-label*="Hours"], div[aria-label*="Jam"]').all_inner_texts()
            combined = "\n".join(hours_texts) + "\n" + body_text[:10000]
            
            # Parse status buka
            if "Open now" in combined or "Buka" in combined:
                # cari "Open now" / "Buka sekarang" / "Tutup"
                m = re.search(r"(Open now|Buka|Tutup|Closed|Buka 24 jam)[^\n]*", combined, re.I)
                if m:
                    place.status_buka = m.group(1).strip()
                    # lebih lengkap
                    line = re.search(r"(Opens? at [^\n]+|Closes at [^\n]+|Buka[^\n]{0,30}|Tutup[^\n]{0,30})", combined, re.I)
                    if line:
                        place.status_buka = line.group(0).strip()[:100]
            
            # Bersihkan combined dari icon sebelum parse
            combined = clean_icon(combined)
            place.jam_operasional_raw = ""
            # Coba extract 7 hari
            days_id = ["Senin","Selasa","Rabu","Kamis","Jumat","Sabtu","Minggu"]
            days_en = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"]
            for i, (di, en) in enumerate(zip(days_id, days_en)):
                # cari pattern "Senin 08.00–17.00" atau "Monday 8 AM–5 PM"
                pat = rf"(?:{di}|{en})\s*([^\n]+)"
                m = re.search(pat, combined, re.I)
                if m:
                    jam = m.group(1).strip()
                    jam = clean_icon(jam)
                    # bersihkan
                    jam = re.sub(r"\s+", " ", jam)
                    # potong jika terlalu panjang
                    if len(jam) > 80:
                        jam = jam[:80]
                    # skip jika mengandung Jakarta / alamat (false positive)
                    if "Jakarta" not in jam and "Jl." not in jam:
                        place.jam_operasional[di] = jam
                        place.jam_operasional_raw += f"{di}: {jam}\n"

            if not place.jam_operasional:
                # Fallback: extract semua baris jam dengan regex umum
                for line in combined.split("\n"):
                    line_c = clean_icon(line.strip())
                    if re.match(r"^(Senin|Selasa|Rabu|Kamis|Jumat|Sabtu|Minggu|Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)\b", line_c, re.I):
                        place.jam_operasional_raw += line_c + "\n"
            
            place.jam_operasional_raw = clean_icon(place.jam_operasional_raw.strip())
            if not place.jam_operasional_raw:
                place.jam_operasional_raw = None
            else:
                # juga bersihkan per hari
                for k in list(place.jam_operasional.keys()):
                    place.jam_operasional[k] = clean_icon(place.jam_operasional[k])
            if place.status_buka:
                place.status_buka = clean_icon(place.status_buka)

            # === ENHANCED: POPULAR TIMES / BUSY HOURS (butuh auth) ===
            try:
                # Popular times biasanya muncul sebagai "Waktu ramai" atau "Popular times" dengan histogram
                # Coba cari via aria-label mengandung busy/popular/ramai
                busy_texts = []
                # 1. cari teks "Waktu ramai" / "Popular times" di page
                for phrase in ["Waktu ramai", "Popular times", "Jam ramai", "Busy"]:
                    loc = page.locator(f'text="{phrase}"')
                    if await loc.count() > 0:
                        # Ambil parent container
                        try:
                            parent = loc.first.locator("..")
                            txt = await parent.inner_text()
                            busy_texts.append(clean_icon(txt[:1500]))
                        except:
                            pass
                # 2. cari aria-label dengan persentase busy e.g. "30% busy at 9 AM"
                try:
                    aria_busy = await page.eval_on_selector_all("[aria-label]", "els => els.map(e=>e.getAttribute('aria-label')).filter(a=>a && (/busy|ramai|popular|%.*[0-9].*AM|PM/i.test(a))).slice(0,20)")
                    for a in aria_busy:
                        if a and len(a) < 300:
                            busy_texts.append(clean_icon(a))
                except:
                    pass
                # 3. Evaluate JS: window data may contain histogram
                try:
                    content_busy = await page.content()
                    # Look for popularTimes in embedded JSON
                    m_pop = re.search(r'popularTimes[^}]{0,800}', content_busy, re.I)
                    if m_pop:
                        busy_texts.append(clean_icon(m_pop.group(0)[:1000]))
                    # Look for histogram bars with aria-valuenow
                    m_hist = re.search(r'aria-valuenow="(\d+)"[^>]*aria-label="[^"]*(\d+)\s*%[^"]*busy[^"]*"', content_busy, re.I)
                    if m_hist:
                        busy_texts.append(m_hist.group(0)[:500])
                except:
                    pass

                if busy_texts:
                    # Deduplicate and save
                    uniq = []
                    seen_b = set()
                    for t in busy_texts:
                        if t not in seen_b and len(t) > 5:
                            seen_b.add(t)
                            uniq.append(t)
                    place.popular_times = " | ".join(uniq)[:2500]
                    place.jam_ramai = place.popular_times
                    place.attributes["busy_hours_raw"] = place.popular_times
                    # Analytics: hitung jam sepi vs ramai simple heuristic
                    # Jika ada persentase, simpan juga
                    place.attributes["has_busy_hours"] = True
                else:
                    place.attributes["has_busy_hours"] = False
                    # Simpan body snippet dekat popular times untuk debug analytics
                    if "ramai" in body_text.lower() or "popular" in body_text.lower():
                        snippet = "\n".join([l for l in body_text.split("\n") if "ramai" in l.lower() or "popular" in l.lower()][:5])
                        place.attributes["busy_debug_snippet"] = clean_icon(snippet)[:1000]
            except Exception as e:
                safe_print(f"[DETAIL] busy hours error: {e}")
                place.attributes["has_busy_hours"] = False
        except Exception as e:
            safe_print(f"[DETAIL] jam error: {e}")

        # === 9. HARGA / PRICE LEVEL (ENHANCED) ===
        try:
            body = await page.inner_text("body")
            content = await page.content()
            # Price level: Rp, $, €, dan aria-label price
            price_els = page.locator('span[aria-label*="Price"], span[aria-label*="Harga"], span:has-text("Rp"), span:has-text("$")')
            cnt = await price_els.count()
            for i in range(min(cnt, 5)):
                try:
                    txt = (await price_els.nth(i).inner_text()).strip()
                    aria = await price_els.nth(i).get_attribute("aria-label")
                    combined_p = (txt + " " + (aria or "")).strip()
                    if "Rp" in combined_p or "$" in combined_p or "Price" in combined_p:
                        if not place.price_level:
                            place.price_level = clean_icon(combined_p)[:80]
                        # also try to capture level like $$, Rp 100.000
                        break
                except:
                    pass
            
            # Cari price_range di body
            m = re.search(r"(Rp[\d\.\s\-–]+)", body)
            if m:
                place.harga_text = clean_icon(m.group(1).strip()[:100])
                if not place.price_range:
                    place.price_range = place.harga_text
            
            # Cari money indicator
            if not place.price_level:
                m2 = re.search(r"(\$+|€+|Rp\s*[\d.,]+)", body)
                if m2:
                    place.price_level = clean_icon(m2.group(1)[:50])

            # Fallback scan semua yang mengandung Rp di content (lebih lengkap)
            if not place.harga_text:
                rps = re.findall(r"Rp\.?\s*\d[\d\.\,]*", body + " " + content[:8000])
                if rps:
                    place.harga_text = clean_icon(", ".join(rps[:5]))
                    if not place.price_range:
                        place.price_range = place.harga_text
            # Simpan price snippet untuk analytics
            if place.price_level or place.harga_text:
                place.attributes["price_raw"] = (place.price_level or "") + " | " + (place.harga_text or "")
            # Try to extract price from embedded data (auth may expose)
            if not place.price_level:
                m_emb = re.search(r'"price[^"]*"\s*:\s*"([^"]+)"', content, re.I)
                if m_emb:
                    place.price_level = clean_icon(m_emb.group(1)[:80])
        except Exception as e:
            safe_print(f"[DETAIL] price error: {e}")

        # === 10. FOTO (HIGH-RES, tidak burem) ===
        def _to_high_res(url: str) -> str:
            """Upscale thumbnail URL ke high-res untuk menghindari burem.
            Contoh: ...=w32-h32-p-k-no -> ...=s1024  atau ...=w428-h240-k-no -> ...=s1024
            Avatar (/a/) tetap di-skip di caller, tapi jika lolos tetap di-upscale.
            """
            if not url or "googleusercontent" not in url:
                return url
            # Jika sudah s0 (original) biarkan
            if "=s0" in url:
                return url
            # Replace size param: =wXXX-hXXX... atau =wXXX... atau =sXXX...
            # Ambil base sebelum '='
            if "=" in url:
                base = url.split("=")[0]
                # Gunakan s1024 untuk foto, s800 juga cukup. s0 = original (paling tajam tapi besar)
                return base + "=s1024"
            # Fallback jika tidak ada '=', tambahkan
            return url + "=s1024"

        try:
            imgs = await page.locator('img[src*="googleusercontent"]').all()
            urls = []
            seen = set()
            for img in imgs[:20]:
                src = await img.get_attribute("src") or await img.get_attribute("data-src")
                # Juga coba srcset untuk resolusi lebih tinggi
                srcset = await img.get_attribute("srcset")
                if srcset:
                    # srcset format: "url1 1x, url2 2x" -> ambil url terbesar
                    parts = srcset.split(",")
                    candidate = parts[-1].strip().split(" ")[0]
                    if candidate and "googleusercontent" in candidate:
                        src = candidate
                if not src or "googleusercontent" not in src:
                    continue
                # ONLY real photo: must contain /gps-cs-s/ (bukan avatar /a/ atau thumb lain)
                if "/gps-cs-s/" not in src:
                    continue
                # Upscale ke high-res
                high = _to_high_res(src)
                if high not in seen:
                    urls.append(high)
                    seen.add(high)
                # Juga simpan upscale dari srcset jika ada
                if srcset and src not in seen:
                    # Simpan juga versi upscale dari src original untuk fallback
                    pass
            # Jika masih kosong, coba cari via background-image style (hanya gps-cs-s)
            if not urls:
                try:
                    bg_urls = await page.evaluate("""() => {
                        const urls = [];
                        document.querySelectorAll('[style*="googleusercontent"]').forEach(el => {
                            const m = el.getAttribute('style').match(/https:\\/\\/[^'\"\\s]+googleusercontent[^'\"\\s)]+/);
                            if (m) urls.push(m[0]);
                        });
                        return urls.slice(0,10);
                    }""")
                    for u in bg_urls:
                        if "/gps-cs-s/" not in u:
                            continue
                        high = _to_high_res(u)
                        if high not in seen:
                            urls.append(high)
                            seen.add(high)
                except:
                    pass
            # Deduplicate dan batasi 10 foto high-res terbaik
            place.foto_urls = urls[:10]
            # Simpan juga thumbnail asli untuk debug jika perlu
            if urls:
                place.attributes["foto_high_res"] = True
                place.attributes["foto_count_high_res"] = len(urls)

            # juga coba button photo
            if not place.foto_urls:
                photos = await page.locator('button:has-text("Photos"), button:has-text("Foto")').all_inner_texts()
                pass
        except Exception as e:
            safe_print(f"[DETAIL] foto error: {e}")
            place.foto_urls = []

        # === 11. REVIEWS (5 terbaru) ===
        try:
            # Scroll ke reviews section
            review_btn = page.locator('button:has-text("Reviews"), button:has-text("Ulasan")').first
            if await review_btn.count() > 0:
                try:
                    await review_btn.click(timeout=2000)
                    await page.wait_for_timeout(1500)
                except:
                    pass
            
            # Ambil review divs
            review_divs = page.locator('div[data-review-id]')
            count = await review_divs.count()
            # fallback selector lain
            if count == 0:
                review_divs = page.locator('div:has-text("★")')
                count = min(await review_divs.count(), 5)
            
            for i in range(min(count, 5)):
                try:
                    el = review_divs.nth(i)
                    txt = (await el.inner_text()).strip()
                    # rating dari stars
                    rating = None
                    aria = await el.locator('span[aria-label*="stars"], span[aria-label*="bintang"]').first.get_attribute("aria-label") if await el.locator('span[aria-label*="stars"]').count()>0 else None
                    if aria:
                        m = re.search(r"(\d)", aria)
                        if m:
                            rating = int(m.group(1))
                    # Cut review text
                    if len(txt) > 20:
                        place.reviews.append({
                            "text": txt[:800],
                            "rating": rating
                        })
                except:
                    continue
        except:
            pass

        # === 12. FASILITAS / ATTRIBUTES (ENHANCED FOR ANALYTICS WITH AUTH) ===
        try:
            # Trigger About section: klik tab "Tentang" / "About" dan scroll agar attributes ter-load (butuh login)
            try:
                for tab_text in ["Tentang", "About", "Overview"]:
                    tab = page.locator(f'button:has-text("{tab_text}"), div[role="tab"]:has-text("{tab_text}")').first
                    if await tab.count() > 0:
                        await tab.click(timeout=1500)
                        await page.wait_for_timeout(800)
                        break
                # Scroll pane detail untuk load lazy sections (Popular times, facilities)
                await page.evaluate("() => { const el = document.querySelector('div[role=\"main\"]') || document.scrollingElement; if(el) el.scrollBy(0, 800); }")
                await page.wait_for_timeout(1000)
            except:
                pass

            body_text = await page.inner_text("body")
            # --- Fasilitas dasar ---
            fac_keywords = ["Parkir", "Toilet", "Wi-Fi", "Kursi roda", "AC", "Musholla", "Parking", "Restroom", "Wheelchair", "Accessible", "WiFi", "Toilet accessible", "Lift", "Parkir gratis", "Antar-jemput", "Reservasi", "Restoran", "Bar", "Kolam", "Gym"]
            for kw in fac_keywords:
                if kw.lower() in body_text.lower():
                    if kw not in place.fasilitas:
                        place.fasilitas.append(kw)

            # --- Extract detailed attributes dari section "About" ---
            # Coba klik tombol "Tentang" details expanded
            about_texts = []
            try:
                # Cari semua button/div yang mengandung layanan/fasilitas
                selectors = [
                    'div[data-attrid*="kc"]', # knowledge panel
                    'div:has-text("Fasilitas")',
                    'div:has-text("Amenities")',
                    'div:has-text("Aksesibilitas")',
                    'div:has-text("Layanan")',
                    'button[aria-label*="About"]',
                ]
                for sel in selectors:
                    loc = page.locator(sel)
                    cnt = await loc.count()
                    for i in range(min(cnt, 5)):
                        try:
                            txt = await loc.nth(i).inner_text()
                            if txt and len(txt) > 10 and len(txt) < 2000:
                                about_texts.append(clean_icon(txt.strip()))
                        except:
                            pass
                # Also try to expand "More about" sections
                more_btns = page.locator('button:has-text("Selengkapnya"), button:has-text("More"), button[aria-label*="more"]')
                mc = await more_btns.count()
                for i in range(min(mc, 2)):
                    try:
                        await more_btns.nth(i).click(timeout=1200)
                        await page.wait_for_timeout(600)
                        # re-collect
                        txt = await page.inner_text("body")
                        about_texts.append(clean_icon(txt[:3000]))
                    except:
                        pass
            except:
                pass

            # Save to attributes analytics
            if about_texts:
                place.attributes["about_sections"] = about_texts[:3]
                place.attributes["about_raw"] = " | ".join(about_texts)[:3000]

            # --- Service options & Accessibility via aria-labels ---
            try:
                # Cari semua div dengan aria-label yang mengandung fasilitas
                aria_fac = await page.eval_on_selector_all("[aria-label]", "els => els.map(e => e.getAttribute('aria-label')).filter(Boolean).slice(0,100)")
                fac_from_aria = []
                for lab in aria_fac:
                    low = lab.lower()
                    if any(k in low for k in ["parking", "parkir", "wheelchair", "kursi roda", "toilet", "wifi", "accessible", "aksesibilitas", "layanan", "amenities", "fasilitas", "reservasi"]):
                        fac_from_aria.append(clean_icon(lab))
                if fac_from_aria:
                    place.attributes["aria_facilities"] = fac_from_aria[:15]
                    # also merge to fasilitas list
                    for f in fac_from_aria:
                        if f not in place.fasilitas and len(f) < 60:
                            place.fasilitas.append(f)
                # Store popular-times aria if any
                busy_aria = [a for a in aria_fac if "busy" in a.lower() or "ramai" in a.lower() or "popular" in a.lower()]
                if busy_aria:
                    place.attributes["busy_aria"] = busy_aria[:10]
            except:
                pass

            # --- Coba ekstrak structured facilities dari window.APP_INITIALIZATION_STATE atau page content ---
            try:
                content = await page.content()
                # Cari JSON yang mengandung amenities
                import re as _re
                # Pattern for facilities in embedded data
                m = _re.search(r'"amenities"[^}]{0,300}', content, _re.I)
                if m:
                    place.attributes["embedded_amenities_snippet"] = m.group(0)[:800]
            except:
                pass
        except Exception as e:
            safe_print(f"[DETAIL] fasilitas error: {e}")

        # === 13. DESKRIPSI ===
        try:
            # Deskripsi biasanya di bagian About
            desc = page.locator('div:has-text("About") + div, div[data-attrid="description"]').first
            if await desc.count() > 0:
                place.deskripsi = (await desc.inner_text()).strip()[:1000]
            else:
                # fallback meta description
                meta = await page.locator('meta[name="description"]').get_attribute("content")
                if meta:
                    place.deskripsi = meta[:1000]
        except:
            pass

        # === ANALYTICS ESSENTIALS: decision making fields ===
        try:
            # Hitung Skor Ketersediaan untuk RuangSela: jam buka panjang = lebih fleksibel
            # Analytics: total jam buka per minggu, indikator underutilized
            total_hours = 0
            for v in place.jam_operasional.values():
                if "24 jam" in v:
                    total_hours += 24
                else:
                    m = re.search(r"(\d{1,2})[.:](\d{2}).*?[–-].*?(\d{1,2})[.:](\d{2})", v)
                    if m:
                        try:
                            h1 = int(m.group(1)); m1 = int(m.group(2)); h2 = int(m.group(3)); m2 = int(m.group(4))
                            # handle PM maybe? keep 24h
                            diff = (h2*60+m2) - (h1*60+m1)
                            if diff < 0: diff += 24*60
                            total_hours += diff/60
                        except: pass
                    elif "Tutup" in v:
                        total_hours += 0
            place.attributes["analytics_total_open_hours_per_week"] = round(total_hours,1)
            place.attributes["analytics_is_24h"] = any("24 jam" in v for v in place.jam_operasional.values())
            place.attributes["analytics_has_weekend"] = "Sabtu" in place.jam_operasional and "Minggu" in place.jam_operasional
            place.attributes["analytics_jam_lengkap"] = len(place.jam_operasional) == 7
            # Fasilitas score untuk komunitas: parkir+toilet+wifi = ideal
            fac_score = sum(1 for k in ["Parkir","Toilet","Wi-Fi","Kursi roda","AC"] if k in place.fasilitas)
            place.attributes["analytics_facility_score"] = fac_score
            place.attributes["analytics_facility_count"] = len(place.fasilitas)
            # Busy hours flag untuk optimal scheduling
            place.attributes["analytics_needs_busy_data"] = not place.attributes.get("has_busy_hours", False)
        except:
            pass

        # Final cleaning untuk semua field string yang mungkin masih ada icon
        if place.nama:
            place.nama = clean_icon(place.nama)
        if place.kategori:
            place.kategori = clean_icon(place.kategori)
        if place.alamat:
            place.alamat = clean_icon(place.alamat)
        if place.alamat_lengkap:
            place.alamat_lengkap = clean_icon(place.alamat_lengkap)
        if place.deskripsi:
            place.deskripsi = clean_icon(place.deskripsi)
        # reviews juga bersihkan
        for r in place.reviews:
            if r.get("text"):
                r["text"] = clean_icon(r["text"])
        if place.fasilitas:
            place.fasilitas = [clean_icon(f) for f in place.fasilitas]

        place.scraped_at = datetime.now().isoformat()

        safe_print(f"  -> Nama: {place.nama} | Kategori: {place.kategori}")
        safe_print(f"     Alamat: {place.alamat}")
        safe_print(f"     Rating: {place.rating} ({place.jumlah_review}) | Tel: {place.telepon} | Web: {place.website} | PlaceID: {place.place_id}")
        jam_preview = (place.jam_operasional_raw[:80].replace(chr(10), ' | ') if place.jam_operasional_raw else 'N/A')
        harga_preview = place.harga_text or place.price_level or 'N/A'
        safe_print(f"     Jam: {jam_preview} | Harga: {harga_preview}")

    except Exception as e:
        safe_print(f"[DETAIL] ERROR {url}: {e}")
        place.scraped_at = datetime.now().isoformat()

    return place
