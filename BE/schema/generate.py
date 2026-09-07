#!/usr/bin/env python3
"""
Generate Supabase-importable CSVs from data/raw/ruangsela_DKI_bulk75_cookie_75.json
sesuai BE/supabase/schema.sql dan BE/app/schemas.py / scraper/models.py
Output ke BE/schema/*.csv
"""
import json, csv, pathlib, re, hashlib, uuid

ROOT = pathlib.Path(__file__).resolve().parents[2]  # repo root
DATA_CANDIDATES = [
    ROOT / "data/raw/ruangsela_DKI_bulk75_cookie_75.json",
    pathlib.Path("data/raw/ruangsela_DKI_bulk75_cookie_75.json"),
    pathlib.Path("../data/raw/ruangsela_DKI_bulk75_cookie_75.json"),
]
OUT_DIR = pathlib.Path(__file__).parent  # BE/schema
DATA_PATH = next((p for p in DATA_CANDIDATES if p.exists()), None)
if not DATA_PATH:
    raise SystemExit(f"data file not found {DATA_CANDIDATES}")
data = json.loads(DATA_PATH.read_text(encoding="utf-8"))
print(f"[GEN] loaded {len(data)} from {DATA_PATH}")

# deterministic uuid for places.id based on place_id
NS = uuid.NAMESPACE_URL
def place_uuid(place_id: str) -> str:
    return str(uuid.uuid5(NS, f"ruangsela:{place_id}"))

def review_uuid(place_id: str, text: str) -> str:
    h = hashlib.md5(text.encode()).hexdigest()
    return str(uuid.uuid5(NS, f"review:{place_id}:{h}"))

def pg_array_text(arr):
    """Postgres text[] literal: {\"a\",\"b\"} with escaping"""
    if not arr:
        return "{}"
    esc = []
    for e in arr:
        if e is None:
            esc.append("")
            continue
        s = str(e).replace("\\", "\\\\").replace('"', '\\"')
        esc.append(f'"{s}"')
    return "{" + ",".join(esc) + "}"

def clean(s):
    if s is None:
        return ""
    # replace �, normalize newlines for CSV single-line fields
    return str(s).replace("�", "–").replace("\x00","").replace("\r"," ").replace("\n"," | ").strip()

def clean_json_dict(d):
    if not isinstance(d, dict):
        return d
    out = {}
    for k,v in d.items():
        out[clean(k)] = clean(v)
    return out

# Facilities distinct
fac_set = set()
for d in data:
    for f in d.get("fasilitas") or []:
        fac_set.add(clean(f))
fac_list = sorted(fac_set)
# is_generic heuristic
GENERIC = {"Restoran","Bar"}
fac_id_map = {}
facilities_rows = []
for idx, name in enumerate(fac_list, start=1):
    is_generic = name in GENERIC
    fac_id_map[name] = idx
    facilities_rows.append({"id": idx, "name": name, "is_generic": str(is_generic).lower()})

print(f"[GEN] facilities {len(fac_list)}")

# Build places rows + related
places_rows = []
place_facilities_rows = []
reviews_rows = []
busy_hours_rows = []
embeddings_rows = []

# helper for content (simplified from embed_service.py:143)
def build_content(p):
    nama = clean(p.get("nama"))
    kategori = clean(p.get("kategori"))
    alamat = clean(p.get("alamat_lengkap") or p.get("alamat"))
    fasilitas = p.get("fasilitas") or []
    fac_pos = [f for f in fasilitas if f not in GENERIC and not f.lower().startswith("tidak memiliki")]
    fac_str = ", ".join(fac_pos) if fac_pos else "-"
    jam_raw = clean(p.get("jam_operasional_raw")).replace("\n"," | ")
    harga = clean(p.get("harga_text") or p.get("price_level") or "-")
    popular = clean(p.get("popular_times") or p.get("jam_ramai") or "-")
    if len(popular) > 600:
        popular = popular[:600]
    reviews = p.get("reviews") or []
    seen=set()
    rev_texts=[]
    for r in reviews[:3]:
        t = clean(r.get("text"))
        if not t or t in seen:
            continue
        seen.add(t)
        if len(t)>300:
            t=t[:300]
        rev_texts.append(t)
    rev_str = " | ".join(rev_texts) if rev_texts else "-"
    deskripsi = clean(p.get("deskripsi"))[:400] if p.get("deskripsi") else "-"
    attrs = p.get("attributes") or {}
    total_hours = attrs.get("analytics_total_open_hours_per_week","")
    is24 = "24 jam" if attrs.get("analytics_is_24h") else ""
    content = f"Nama: {nama}\nKategori: {kategori}\nAlamat: {alamat}\nFasilitas: {fac_str}\nJam operasional: {jam_raw} {is24} (total {total_hours} jam/minggu)\nKeramaian: {popular}\nHarga: {harga}\nDeskripsi: {deskripsi}\nUlasan: {rev_str}"
    return content

for d in data:
    pid_text = d.get("place_id") or d.get("cid") or d.get("nama")
    pid_uuid = place_uuid(pid_text)
    # attributes
    attrs = d.get("attributes") or {}
    total_open = attrs.get("analytics_total_open_hours_per_week")
    is24 = attrs.get("analytics_is_24h")
    has_weekend = attrs.get("analytics_has_weekend")
    facility_score = attrs.get("analytics_facility_score")
    # jam_operasional jsonb - clean values
    jam_ops = d.get("jam_operasional")
    if jam_ops:
        jam_ops = clean_json_dict(jam_ops)
    jam_ops_json = json.dumps(jam_ops, ensure_ascii=False) if jam_ops else ""
    # foto
    foto_urls = d.get("foto_urls") or []
    foto_count = len(foto_urls)
    # fasilitas_raw as pg array
    fasilitas_raw = [clean(f) for f in (d.get("fasilitas") or [])]
    # kategori_list pg array
    kat_list = d.get("kategori_list") or []
    # scraped_at
    scraped_at = clean(d.get("scraped_at"))
    # price
    # ensure lat/lng float
    lat = d.get("lat")
    lng = d.get("lng")

    row = {
        "id": pid_uuid,
        "place_id": clean(pid_text),
        "cid": clean(d.get("cid")),
        "keyword": clean(d.get("keyword")),
        "nama": clean(d.get("nama")),
        "kategori": clean(d.get("kategori")),
        "kategori_list": pg_array_text(kat_list),
        "alamat": clean(d.get("alamat")),
        "alamat_lengkap": clean(d.get("alamat_lengkap")),
        "plus_code": clean(d.get("plus_code")),
        "lat": lat if lat is not None else "",
        "lng": lng if lng is not None else "",
        # geom left empty, will be updated via ST_SetSRID after import
        "geom": "",
        "rating": d.get("rating") if d.get("rating") is not None else "",
        "jumlah_review": d.get("jumlah_review") if d.get("jumlah_review") is not None else "",
        "jam_operasional": jam_ops_json,
        "jam_operasional_raw": clean(d.get("jam_operasional_raw")),
        "status_buka": clean(d.get("status_buka")),
        "popular_times_raw": clean(d.get("popular_times"))[:2000],
        "jam_ramai": clean(d.get("jam_ramai"))[:2000],
        "telepon": clean(d.get("telepon")),
        "website": clean(d.get("website")),
        "harga_text": clean(d.get("harga_text")),
        "price_level": clean(d.get("price_level")),
        "price_range": clean(d.get("price_range")),
        "deskripsi": clean(d.get("deskripsi")),
        "scraped_at": scraped_at,
        "total_open_hours": total_open if total_open is not None else "",
        "is_24h": str(bool(is24)).lower() if is24 is not None else "",
        "has_weekend": str(bool(has_weekend)).lower() if has_weekend is not None else "",
        "facility_score": facility_score if facility_score is not None else "",
        "fasilitas_raw": pg_array_text(fasilitas_raw),
        "foto_urls": pg_array_text(foto_urls),
        "foto_count": foto_count,
        # extras not in schema but useful: url_google_maps, keyword etc already there
    }
    places_rows.append(row)

    # place_facilities
    for f in fasilitas_raw:
        fid = fac_id_map.get(f)
        if fid:
            is_neg = f.lower().startswith("tidak memiliki")
            place_facilities_rows.append({"place_id": pid_uuid, "facility_id": fid, "is_negative": str(is_neg).lower()})

    # reviews
    seen_rev=set()
    for r in d.get("reviews") or []:
        t = clean(r.get("text"))
        if not t or t in seen_rev:
            continue
        seen_rev.add(t)
        rid = review_uuid(pid_text, t)
        rating = r.get("rating")
        # hash unique
        h = hashlib.md5((pid_text+":"+t).encode()).hexdigest()[:12]
        reviews_rows.append({"id": rid, "place_id": pid_uuid, "text": t.replace("\n"," ").replace("\r"," ")[:2000], "rating": rating if rating is not None else "", "hash": h})

    # busy_hours parse
    popular_raw = d.get("popular_times") or d.get("jam_ramai") or ""
    if popular_raw:
        # try extract day before segment? simple: all matches with day Senin
        # We'll assign day = Senin unless pattern contains other days
        # Parse all "% ramai pada pukul HH"
        for m in re.finditer(r"(\d+)%\s*ramai\s*pada\s*pukul\s*(\d+)", popular_raw):
            pct = int(m.group(1))
            hr = int(m.group(2))
            if 0 <= hr <= 23 and 0 <= pct <= 100:
                # day extraction: look back 30 chars for day name
                start = max(0, m.start()-80)
                snippet = popular_raw[start:m.start()]
                day_match = re.findall(r"(Senin|Selasa|Rabu|Kamis|Jumat|Sabtu|Minggu)", snippet)
                day = day_match[-1] if day_match else "Senin"
                busy_hours_rows.append({"place_id": pid_uuid, "day": day, "hour": hr, "busy_percent": pct})

    # embeddings placeholder
    content = build_content(d)
    # dummy vector 768 zeros as "[0,0,...]" string for pgvector; Supabase import expects like "[0,0,...]"
    dummy_vec = "[" + ",".join(["0"]*768) + "]"
    embeddings_rows.append({"place_id": pid_uuid, "content": content.replace("\n"," | ")[:4000], "embedding": dummy_vec, "model": "indobenchmark/indobert-base-p1"})

# Write CSVs
def write_csv(path, rows, fieldnames):
    with open(path, "w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=fieldnames, quoting=csv.QUOTE_MINIMAL, escapechar="\\")
        w.writeheader()
        for r in rows:
            w.writerow(r)
    print(f"[GEN] wrote {len(rows)} -> {path}")

# places.csv header sesuai schema.sql (exclude geom generation, include it as empty)
write_csv(OUT_DIR / "places.csv", places_rows,
    ["id","place_id","cid","keyword","nama","kategori","kategori_list","alamat","alamat_lengkap","plus_code","lat","lng","geom","rating","jumlah_review","jam_operasional","jam_operasional_raw","status_buka","popular_times_raw","jam_ramai","telepon","website","harga_text","price_level","price_range","deskripsi","scraped_at","total_open_hours","is_24h","has_weekend","facility_score","fasilitas_raw","foto_urls","foto_count"])

write_csv(OUT_DIR / "facilities.csv", facilities_rows, ["id","name","is_generic"])
write_csv(OUT_DIR / "place_facilities.csv", place_facilities_rows, ["place_id","facility_id","is_negative"])
write_csv(OUT_DIR / "reviews.csv", reviews_rows, ["id","place_id","text","rating","hash"])
write_csv(OUT_DIR / "busy_hours.csv", busy_hours_rows, ["place_id","day","hour","busy_percent"])
write_csv(OUT_DIR / "place_embeddings.csv", embeddings_rows, ["place_id","content","embedding","model"])

# also write mapping uuid for debugging
with open(OUT_DIR / "place_id_map.csv","w",newline="",encoding="utf-8") as f:
    w=csv.DictWriter(f,fieldnames=["place_id_text","uuid","nama"])
    w.writeheader()
    for d in data:
        pid_text = clean(d.get("place_id"))
        w.writerow({"place_id_text": pid_text, "uuid": place_uuid(pid_text), "nama": clean(d.get("nama"))})

print("[GEN] done")
