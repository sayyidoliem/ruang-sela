# RuangSela Hybrid Search — BE

Supabase relational + pgvector IndoBERT (`indobenchmark/indobert-base-p1` 768-dim, mean pooling) hybrid soft-filter + geo.

Sumber data: `../data/raw/ruangsela_DKI_bulk75_cookie_75.json` (75 places `scraper/models.py:5`).

## Quick Start

```bash
cd BE
pip install -r requirements.txt
cp .env.example .env  # isi SUPABASE_URL/KEY di akhir, bisa run tanpa supabase (fallback local JSON)
```

### 1. Setup Supabase (opsional untuk local test)

```sql
-- di Supabase SQL Editor, jalankan BE/supabase/schema.sql lalu rpc.sql
```

### 2. ETL + Embedding

```bash
python scripts/etl_bulk75.py          # insert 75 ke supabase jika configured, preview jika tidak
python scripts/embed_places.py        # build IndoBERT embeddings -> BE/eval/embeddings.json (+ supabase upsert)
```

### 3. Run API

```bash
uvicorn app.main:app --reload --port 8000
# docs: http://localhost:8000/docs
# health: http://localhost:8000/health
```

### 4. Test POST /search (File JSON dengan data_text)

**Wajib file JSON mengandung `data_text` string, auto parse jam.**

```bash
# buat file query
echo '{"data_text": "ruangan yang memiliki AC dan juga parkir tempat lega dan kosong pada jam 12"}' > /tmp/q.json

# POST file
curl -X POST http://localhost:8000/search -F "file=@/tmp/q.json"

# dengan geo + top_k di file
echo '{"data_text": "taman sepi pagi", "lat": -6.168242, "lng": 106.758986, "radius_m": 5000, "top_k": 5}' > /tmp/q2.json
curl -X POST http://localhost:8000/search -F "file=@/tmp/q2.json"

# alternative JSON body (tanpa file)
curl -X POST http://localhost:8000/search/json -H "Content-Type: application/json" -d '{"data_text":"ruangan AC parkir lega kosong jam 12","top_k":5}'

# GET quick test
curl "http://localhost:8000/search/test?q=ruangan%20AC%20parkir%20lega%20kosong%20jam%2012&top_k=5"
```

**Respons contoh:**
```json
{
  "query": "ruangan yang memiliki AC dan juga parkir tempat lega dan kosong pada jam 12",
  "parsed_hour": 12,
  "mode": "hybrid",
  "top_k": 10,
  "took_ms": 120,
  "results": [
    {
      "nama": "Kemala Ballroom",
      "kategori": "Gedung Pertemuan",
      "sim_score": 0.73,
      "facility_bonus": 0.15,
      "busy_bonus": 0.08,
      "final_score": 0.62,
      "busy_percent_at_hour": 31,
      "evidence": {"ac": "fasilitas AC eksplisit", "parkir": "parkir ada", "busy": "jam 12: 31% ramai"}
    }
  ]
}
```

Auto parse: regex `(jam|pukul)\s*(\d{1,2})` dari `data_text` -> `parsed_hour`. Jika `lat/lng` ada, tambah `geo_bonus` soft (bukan hard filter).

### 5. Other Routes

```
GET  /health              -> model_loaded, places_count
GET  /places?limit&kategori
GET  /places/{place_id}
GET  /places/nearby/search?lat&lng&radius_m
POST /ingest/run (Header X-Admin-Key) -> rebuild embeddings
GET  /ingest/preview -> lihat content template
POST /search/json      -> body JSON alternative
GET  /search/test?q=.. -> quick
GET  /search/debug/parse?q=..
```

### 6. Eval LLM-as-judge

```bash
# set OPENAI_API_KEY di BE/.env dulu (optional, fallback heuristic jika kosong)
python scripts/eval_llm_judge.py
```

### 7. Env Setup Akhir

Isi `BE/.env` sesuai `.env.example`. Tanpa Supabase, API tetap jalan via local `data/raw/...json` + dummy/fallback embeddings.

## Weights Hybrid (soft)

`final = 0.55*sim + facility_bonus(0.15 AC +0.10 parkir) + busy_bonus((40-pct)/40*0.15) + rating*0.05 + geo*0.05`
Tidak ada hard WHERE eliminasi — semua 75 kandidat diranking.

## Full API Documentation

Lihat **[BE/docs/API.md](docs/API.md)** untuk dokumentasi lengkap semua endpoint:

- `GET /recommendations` — minimal 5 similar dengan threshold
- `GET /locations` & `GET /location/:id` — role-aware (USER published, ADMIN all)
- `POST /search/json` — JSON body `data_text` + LLM (primary) + `POST /search/file` legacy
- `GET /profile`, `POST /location`, `POST /admin/verifyLocation`, `DELETE /admin/deleteLocation/:id`
- Auth Supabase JWT (`Authorization: Bearer`) + mock `X-Role` untuk dev

Swagger: `http://localhost:8000/docs`
OpenAPI JSON: `http://localhost:8000/openapi.json`
