"""
ETL: Baca data/raw/ruangsela_DKI_bulk75_cookie_75.json -> Supabase (jika configured) atau preview.
"""
import json, pathlib, re, hashlib, sys

# Resolve data
candidates = [
    pathlib.Path("data/raw/ruangsela_DKI_bulk75_cookie_75.json"),
    pathlib.Path("../data/raw/ruangsela_DKI_bulk75_cookie_75.json"),
    pathlib.Path("E:/scraping_gmaps/data/raw/ruangsela_DKI_bulk75_cookie_75.json"),
]
data_path = next((p for p in candidates if p.exists()), None)
if not data_path:
    print("Data file not found in candidates, exiting")
    sys.exit(1)

data = json.loads(data_path.read_text(encoding="utf-8"))
print(f"[ETL] Loaded {len(data)} records from {data_path}")

# Stats
fac_counts = {}
for d in data:
    for f in d.get("fasilitas") or []:
        fac_counts[f] = fac_counts.get(f, 0) + 1
print(f"[ETL] Facilities distinct: {len(fac_counts)}, top 5: {sorted(fac_counts.items(), key=lambda x: -x[1])[:5]}")

# Check supabase
try:
    sys.path.insert(0, "BE")
    from app.config import get_settings
    from supabase import create_client
    settings = get_settings()
    if settings.supabase_configured():
        print(f"[ETL] Supabase configured at {settings.supabase_url}, inserting...")
        sb = create_client(settings.supabase_url, settings.supabase_service_key or settings.supabase_anon_key)
        # Insert places
        for d in data:
            # build row
            row = {
                "place_id": d.get("place_id"),
                "cid": d.get("cid"),
                "keyword": d.get("keyword"),
                "nama": d.get("nama"),
                "kategori": d.get("kategori"),
                "kategori_list": d.get("kategori_list"),
                "alamat": d.get("alamat"),
                "alamat_lengkap": d.get("alamat_lengkap"),
                "plus_code": d.get("plus_code"),
                "lat": d.get("lat"),
                "lng": d.get("lng"),
                "rating": d.get("rating"),
                "jumlah_review": d.get("jumlah_review"),
                "jam_operasional": d.get("jam_operasional"),
                "jam_operasional_raw": (d.get("jam_operasional_raw") or "").replace("�","–"),
                "status_buka": d.get("status_buka"),
                "popular_times_raw": d.get("popular_times"),
                "jam_ramai": d.get("jam_ramai"),
                "telepon": d.get("telepon"),
                "website": d.get("website"),
                "harga_text": d.get("harga_text"),
                "price_level": d.get("price_level"),
                "price_range": d.get("price_range"),
                "deskripsi": (d.get("deskripsi") or "")[:1000],
                "scraped_at": d.get("scraped_at"),
                "fasilitas_raw": d.get("fasilitas"),
                "foto_urls": d.get("foto_urls"),
                "foto_count": len(d.get("foto_urls") or []),
            }
            # upsert
            try:
                sb.table("places").upsert(row, on_conflict="place_id").execute()
                print(f"  upsert {row['nama']}")
            except Exception as e:
                print(f"  failed {row['nama']}: {e}")
        print("[ETL] Done supabase insert")
        # update geom
        try:
            sb.rpc("exec", {"sql": "update places set geom = ST_SetSRID(ST_MakePoint(lng, lat),4326)::geography where geom is null and lat is not null"}).execute()
        except:
            pass
    else:
        print("[ETL] Supabase NOT configured, skipping insert (set SUPABASE_URL/KEY in BE/.env)")
except Exception as e:
    print(f"[ETL] Supabase insert skipped: {e}")

# Preview busy parse
print("\n[ETL] Busy parse preview (first 3 with popular_times):")
cnt = 0
for d in data:
    if d.get("popular_times"):
        raw = d["popular_times"][:300]
        # parse
        matches = re.findall(r"(\d+)%\s*ramai\s*pada\s*pukul\s*(\d+)", raw)
        print(f"  {d['nama'][:30]} -> {matches[:3]}")
        cnt += 1
        if cnt >= 3:
            break

print(f"\n[ETL] Total places: {len(data)}, need supabase schema.sql applied first.")
