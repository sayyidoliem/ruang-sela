# RuangSela — API Documentation

**Base URL:** `http://localhost:8000` (dev) | **Version:** `0.1.0` | **Stack:** FastAPI + Supabase (Postgres + pgvector) + IndoBERT `indobenchmark/indobert-base-p1` 768-dim hybrid soft-filter + geo + LLM (OpenAI)

**Data source:** `data/raw/ruangsela_DKI_bulk75_cookie_75.json` (75 places, model `scraper/models.py:5`)

**Auth:** Supabase JWT `Authorization: Bearer <supabase_jwt>` — role diambil dari `user_metadata.role` (`USER`/`ADMIN`). Untuk testing lokal bisa pakai `X-Role: USER|ADMIN` atau `Bearer user_token`/`admin_token` (mock `BE/app/middleware/auth.py:1`).

**Swagger UI:** `http://localhost:8000/docs` | **OpenAPI JSON:** `http://localhost:8000/openapi.json` | **Health:** `http://localhost:8000/health`

---

## Table of Contents
1. [Auth & Roles](#1-auth--roles)
2. [GET /health](#2-get-health)
3. [GET /recommendations](#3-get-recommendations)
4. [GET /locations](#4-get-locations)
5. [GET /location/:id](#5-get-locationid)
6. [POST /search (JSON + LLM)](#6-post-search-json--llm)
7. [POST /search/file (Legacy)](#7-post-searchfile-legacy)
8. [GET /search/test & /debug/parse](#8-get-searchtest--debugparse)
9. [GET /profile & PUT /profile](#9-get-profile--put-profile)
10. [POST /location](#10-post-location)
11. [POST /admin/verifyLocation](#11-post-adminverifylocation)
12. [DELETE /admin/deleteLocation/:id](#12-delete-admindeletelocationid)
13. [Legacy /places & /ingest](#13-legacy-places--ingest)
14. [Error Format](#14-error-format)
15. [Hybrid Scoring & Threshold](#15-hybrid-scoring--threshold)
16. [cURL & Postman](#16-curl--postman)

---

## 1. Auth & Roles

| Header | Contoh | Keterangan |
|---|---|---|
| `Authorization` | `Bearer <supabase_jwt>` | Supabase JWT asli (prod). Decode `sub`, `email`, `user_metadata.role` |
| `X-Role` | `USER` atau `ADMIN` | Mock dev — override role tanpa JWT |
| `X-User-Id` | `uuid-xxx` | Mock dev — override id |

**Mock tokens for quick test:**
```
Bearer user_token  -> USER (uuid-user-1)
Bearer admin_token -> ADMIN (uuid-admin-1)
```

**Behavior tanpa header:** Fallback `anon-user` role `USER` (dev mode). Di prod: uncomment `401` di `middleware/auth.py`.

**Role matrix:**

| Endpoint | USER | ADMIN |
|---|---:|---|
| `GET /recommendations` | ✅ by own profile | ✅ by own profile |
| `GET /locations` | only `published` | `all` + filter `status` |
| `GET /location/:id` | only `published` | `published` + `pending`/`rejected` |
| `POST /search` | ✅ | ✅ |
| `GET /profile` | own | own |
| `POST /location` | `pending` | `published` auto |
| `POST /admin/verifyLocation` | ❌ 403 | ✅ |
| `DELETE /admin/deleteLocation/:id` | ❌ 403 | ✅ |

---

## 2. GET /health

**Public (no auth)**

```http
GET /health
```

**Response 200:**
```json
{
  "status": "ok",
  "model_loaded": true,
  "model_name": "indobenchmark/indobert-base-p1",
  "supabase_configured": false,
  "places_count": 75,
  "embedding_dim": 768
}
```

**Related:** `GET /health/ready` (trigger lazy IndoBERT load — `status` bisa `"ok"` atau `"model_not_loaded"` jika model belum ter-load), `GET /` (root index)

---

## 3. GET /recommendations

**Rekomendasi by profile — maksimal dengan batas kecocokan tepat, minimal 5 similar.**

`BE/app/routers/recommendations.py:1` | `BE/app/services/recommendation_service.py:1`

**Request:**
```http
GET /recommendations?limit=10&min_sim=0.60&lat=-6.168242&lng=106.758986&radius_m=5000
Authorization: Bearer <jwt>
# atau X-Role: USER
```

| Query | Type | Default | Desc |
|---|---|---|---|
| `limit` | int 1-20 | 10 | Maksimal tempat dikembalikan |
| `min_sim` | float 0-1 | 0.60 | Batas kecocokan tepat (threshold `final_score` hybrid) |
| `lat`, `lng` | float | - | Geo bias soft (0.05 weight, bukan hard filter) |
| `radius_m` | int 100-50000 | - | Jika di luar radius → penalty -0.05 soft |

**Logic threshold minimal 5:**
1. Build `query_text` dari `profile.preferences` (`needs_ac`, `needs_parking`, `kategori_fav`).
2. `hybrid_search` top `limit*3` (min 30) → sort `final_score` desc.
3. Filter `final_score >= min_sim`.
4. Jika `<5` hasil → relax `min_sim -=0.05` stepwise hingga `0.40` hingga dapat 5.
5. Jika tetap `<5` → ambil top 5 terbaik tanpa threshold (`relaxed=true`).
6. Truncate ke `limit`.

**Response 200:**
```json
{
  "user_id": "uuid-user-1",
  "role": "USER",
  "profile_used": {"needs_ac": true, "needs_parking": true, "kategori_fav": ["Aula serbaguna"]},
  "query_text": "ruangan ber-AC sejuk dengan parkir luas lega kategori Aula serbaguna tempat yang direkomendasikan",
  "params": {"limit": 10, "min_sim": 0.6, "threshold_applied": 0.6, "relaxed": false},
  "count_before_filter": 30,
  "count": 7,
  "meets_minimum": true,
  "threshold_requested": 0.6,
  "threshold_applied": 0.6,
  "relaxed": false,
  "data": [
    {
      "id": "11cs0c_3z7",
      "place_id": "11cs0c_3z7",
      "nama": "Gedung Serbaguna Wanilan",
      "kategori": "Aula serbaguna",
      "alamat": "Jl. Tenis Raya No.12, Jakarta Barat",
      "lat": -6.1435759, "lng": 106.748482,
      "rating": 4.2, "jumlah_review": 415,
      "fasilitas": ["Parkir","Kursi roda"],
      "jam_operasional_raw": "Senin: 09.00–22.00 | Selasa: 09.00–22.00 | ...",
      "foto_urls": ["https://lh3.googleusercontent.com/...=s1024"],
      "sim_score": 0.68,
      "facility_bonus": 0.15,
      "busy_bonus": 0.08,
      "geo_bonus": 0.02,
      "final_score": 0.72,
      "busy_percent_at_hour": null,
      "distance_km": 2.1,
      "evidence": {"ac": "profile match AC", "parkir": "parkir ada"},
      "content": "Nama: Gedung Serbaguna Wanilan\nKategori: Aula ... (600 char)"
    }
  ]
}
```

**Jika relax terjadi:**
```json
{
  "count": 5,
  "params": {"limit": 10, "min_sim": 0.9, "threshold_applied": 0.5, "relaxed": true},
  "threshold_applied": 0.5,
  "relaxed": true,
  "meets_minimum": true
}
```

**cURL:**
```bash
curl -H "X-Role: USER" "http://localhost:8000/recommendations?limit=5&min_sim=0.6"
curl -H "Authorization: Bearer user_token" "http://localhost:8000/recommendations?limit=10&min_sim=0.3&lat=-6.16&lng=106.75"
```

---

## 4. GET /locations

**List lokasi — USER hanya published, ADMIN bisa filter pending/rejected.**

`BE/app/routers/locations.py:1`

**Request:**
```http
GET /locations?limit=20&offset=0&kategori=Taman&status=pending
Authorization: Bearer <jwt>
```

| Query | Type | Desc |
|---|---|---|
| `limit` | int 1-100 | default 20 |
| `offset` | int | default 0 |
| `kategori` | string | filter `kategori` contains (case-insensitive) |
| `status` | `pending|published|rejected|all` | **ADMIN only**. USER param diabaikan (forced `published`) |

**Response 200 USER:**
```json
{
  "role": "USER",
  "total": 76,
  "limit": 20, "offset": 0,
  "counts": null,
  "data": [
    {
      "place_id": "11cs0c_3z7",
      "nama": "Gedung Serbaguna Wanilan",
      "kategori": "Aula serbaguna",
      "alamat": "Jl. Tenis Raya ...",
      "lat": -6.14, "lng": 106.74,
      "rating": 4.2,
      "jumlah_review": 415,
      "status": "published",
      "foto_count": 2,
      "fasilitas": ["Parkir","Kursi roda","Restoran","Bar","Tidak..."]
    }
  ]
}
```

**Response 200 ADMIN `?status=all`:**
```json
{
  "role": "ADMIN",
  "total": 77,
  "counts": {"published": 76, "pending": 1, "rejected": 0},
  "data": [
    {"place_id": "11new_abc", "nama": "Test Aula", "status": "pending", "foto_count": 0},
    {"place_id": "11cs0c_3z7", "status": "published"}
  ]
}
```

**cURL:**
```bash
curl -H "X-Role: USER" "http://localhost:8000/locations?limit=5"
curl -H "X-Role: ADMIN" "http://localhost:8000/locations?status=pending"
curl -H "X-Role: ADMIN" "http://localhost:8000/locations?kategori=Taman"
```

---

## 5. GET /location/:id

**Detail lokasi — USER hanya published, ADMIN bisa lihat pending/rejected.**

**Request:**
```http
GET /location/11cs0c_3z7
Authorization: Bearer <jwt>
```
Also alias: `GET /locations/{id}` via `GET /location/by/{id}`

**Response 200 (published):**
```json
{
  "keyword": "aula",
  "nama": "Gedung Serbaguna Wanilan",
  "kategori": "Aula serbaguna",
  "kategori_list": [],
  "alamat": "Jl. Tenis Raya No.12 ... 11720",
  "alamat_lengkap": "Jl. Tenis Raya No.12 ...",
  "plus_code": "VP4X+H9 Kapuk ...",
  "lat": -6.1435759, "lng": 106.748482,
  "place_id": "11cs0c_3z7", "cid": "0x2e69f7dde71359d7",
  "url_google_maps": "https://www.google.com/maps/place/...",
  "rating": 4.2, "jumlah_review": 415,
  "jam_operasional": {"Senin":"09.00–22.00", "Selasa":"09.00–22.00"},
  "jam_operasional_raw": "Senin: 09.00–22.00 | Selasa: 09.00–22.00 | ...",
  "status_buka": "Buka • Tutup pukul 22.00",
  "popular_times": "Jam ramai | Senin | 3% ramai pada pukul 04.00 ... | 31% ramai pada pukul 12.00 ...",
  "jam_ramai": null,
  "telepon": "0896-3579-0042",
  "website": null,
  "price_level": null, "harga_text": null,
  "foto_urls": ["https://lh3...=s1024", "https://lh3...=s1024"],
  "reviews": [{"text": "Agak pengap klo pas ...", "rating": null}],
  "fasilitas": ["Parkir","Kursi roda","Restoran","Bar","Tidak memiliki tempat parkir khusus pengguna kursi roda"],
  "attributes": {"analytics_total_open_hours_per_week": 91, "has_busy_hours": false},
  "deskripsi": null,
  "jam_ramai": null,
  "scraped_at": "2026-08-31T18:46:23.79",
  "status": "published",
  "owner_id": "uuid-user-1"
}
```

**Error:**
- `404 USER` → `{"detail":"Place not found or not published"}` (jika `status != published`)
- `404 ADMIN` → `{"detail":"Place not found"}`

**cURL:**
```bash
curl -H "X-Role: USER" http://localhost:8000/location/11cs0c_3z7
curl -H "X-Role: ADMIN" http://localhost:8000/location/11new_abc  # pending tetap bisa
```

---

## 6. POST /search (JSON + LLM)

**Primary search — JSON body `data_text` diproses LLM sebelum hybrid IndoBERT.**

`BE/app/routers/search.py:1` | `BE/app/services/llm_service.py:1` | Auth: ALL ROLE

**Request Body JSON:**
```json
{
  "data_text": "ruangan yang memiliki AC dan juga parkir tempat lega dan kosong pada jam 12",
  "top_k": 10,
  "lat": -6.168242,
  "lng": 106.758986,
  "radius_m": 5000,
  "hour": 12,
  "mode": "hybrid"
}
```

| Field | Type | Required | Desc |
|---|---|---|---|
| `data_text` | string | **yes** | Query natural language (wajib). Auto-parse jam via regex `(jam|pukul)\s*(\d{1,2})` |
| `top_k` | int 1-50 | no | default 10 |
| `lat`, `lng` | float | no | Geo bias soft |
| `radius_m` | int 100-50000 | no | Jika di luar radius → penalty -0.05 soft |
| `hour` | int 0-23 | no | Override auto-parse |
| `mode` | `hybrid|vector|relational` | no | default `hybrid` |

**LLM step:** `llm_expand_query(data_text, profile)` → `expanded_query` + `intent {needs_ac, needs_parking, hour}`. Jika `OPENAI_API_KEY` kosong → fallback heuristic regex (tetap jalan).

**Request HTTP:**
```http
POST /search/json
Content-Type: application/json
Authorization: Bearer <jwt>

{"data_text": "ruangan yang memiliki AC dan juga parkir tempat lega dan kosong pada jam 12", "top_k": 5}
```
Alias: `POST /search/llm` sama. `POST /search` (tanpa suffix) juga support JSON via file (legacy).

**Response 200:**
```json
{
  "query": "ruangan yang memiliki AC dan juga parkir tempat lega dan kosong pada jam 12",
  "parsed_hour": 12,
  "mode": "hybrid",
  "top_k": 5,
  "took_ms": 180,
  "results": [
    {
      "id": "11cs0c_3z7",
      "place_id": "11cs0c_3z7",
      "nama": "Gedung Serbaguna Wanilan",
      "kategori": "Aula serbaguna",
      "alamat": "Jl. Tenis Raya ...",
      "lat": -6.14, "lng": 106.74,
      "rating": 4.2, "jumlah_review": 415,
      "fasilitas": ["Parkir","Kursi roda"],
      "jam_operasional_raw": "Senin: 09.00–22.00 | ...",
      "foto_urls": ["https://lh3...=s1024"],
      "sim_score": 0.68,
      "facility_bonus": 0.15,
      "busy_bonus": 0.08,
      "geo_bonus": 0.02,
      "final_score": 0.62,
      "busy_percent_at_hour": 31,
      "distance_km": 2.1,
      "evidence": {"ac": "fasilitas AC eksplisit", "parkir": "parkir ada", "busy": "jam 12: 31% ramai (sedang)"},
      "content": "Nama: Gedung Serbaguna Wanilan\nKategori: Aula ... (800 char)"
    }
  ],
  "debug": {
    "auto_parsed_hour": 12,
    "llm_intent": {"needs_ac": true, "needs_parking": true, "vibe_lega": true, "empty": true, "hour": 12, "expanded_query": "ruangan ber-AC dengan parkir luas dan sepi pada jam 12 siang"},
    "query_for_search": "ruangan ber-AC dengan parkir luas dan sepi pada jam 12 siang",
    "user_role": "USER"
  }
}
```

**Error:** —
- `POST /search/json` → Pydantic validation **422** jika `data_text` kosong/tidak ada (mandatory by schema)
- `POST /search/file` → **400** `{"detail":"Field 'data_text' wajib ada dan bertipe string"}` jika file JSON tidak punya `data_text`

**cURL:**
```bash
curl -X POST http://localhost:8000/search/json \
  -H "Content-Type: application/json" \
  -H "X-Role: USER" \
  -d '{"data_text":"ruangan yang memiliki AC dan juga parkir tempat lega dan kosong pada jam 12","top_k":5}'

# Dengan geo
curl -X POST http://localhost:8000/search/json \
  -H "Authorization: Bearer user_token" \
  -H "Content-Type: application/json" \
  -d '{"data_text":"balai warga dekat sini","lat":-6.168242,"lng":106.758986,"radius_m":5000}'

# LLM akan auto-parse "pukul 09.00" -> hour 9
curl -X POST http://localhost:8000/search/json \
  -H "Content-Type: application/json" \
  -d '{"data_text":"cari tempat kosong pukul 09.00"}'
```

---

## 7. POST /search/file (Legacy)

**Masih didukung untuk backward compat — terima file JSON multipart.**

```http
POST /search/file
Content-Type: multipart/form-data
Authorization: Bearer <jwt>

file: (JSON file) {"data_text": "taman sepi pagi", "lat": -6.16, "lng": 106.75}
```

**Request:** `file` (required) JSON dengan `data_text` + optional `top_k, mode, lat, lng, radius_m, hour` + Form `top_k, mode`.

**Response:** sama dengan `POST /search/json`.

**cURL:**
```bash
echo '{"data_text":"ruangan AC parkir lega kosong jam 12"}' > /tmp/q.json
curl -X POST http://localhost:8000/search/file -F "file=@/tmp/q.json" -H "X-Role: USER"
curl -X POST http://localhost:8000/search -F "file=@/tmp/q.json" -H "X-Role: USER"  # alias
```

---

## 8. GET /search/test & /debug/parse

**Quick test tanpa auth:**

```http
GET /search/test?q=ruangan%20AC%20parkir%20lega%20kosong%20jam%2012&top_k=5&mode=hybrid&lat=-6.168242&lng=106.758986&radius_m=5000
GET /search/debug/parse?q=cari%20tempat%20kosong%20pukul%2009.00
```

| Query | Type | Default | Desc |
|---|---|---|---|
| `q` | string | **required** | Query text |
| `top_k` | int 1-50 | 10 | |
| `mode` | `hybrid\|vector\|relational` | `hybrid` | |
| `lat`, `lng` | float | - | Geo bias soft |
| `radius_m` | int 100-50000 | - | Jika di luar radius → penalty -0.05 soft |

**Response `/test`:** sama `SearchResponse` tapi tanpa LLM step (pure hybrid). **`/debug/parse`:**
```json
{"query": "cari tempat kosong pukul 09.00", "parsed_hour": 9, "lower": "cari tempat kosong pukul 09.00"}
```

---

## 9. GET /profile & PUT /profile

**Auth required**

```http
GET /profile
Authorization: Bearer <jwt>
```

**Response 200:**
```json
{
  "id": "uuid-user-1",
  "email": "user@example.com",
  "role": "USER",
  "preferences": {"needs_ac": true, "needs_parking": true, "kategori_fav": ["Aula serbaguna"]},
  "created_at": null,
  "note": "Supabase JWT verified"
}
```
**Anon tanpa JWT:** `{"id":"anon-user","role":"USER","note":"anonymous fallback (set Authorization Bearer)"}`

```http
PUT /profile
Content-Type: application/json
Authorization: Bearer <jwt>

{"preferences": {"needs_ac": false, "kategori_fav": ["Taman"]}}
```

**Response:** `{"id":"uuid-user-1","role":"USER","preferences":{...},"updated":true}`

---

## 10. POST /location

**Create lokasi — USER → pending, ADMIN → published.**

`BE/app/routers/location_mutation.py:1`

**Request:**
```http
POST /location
Content-Type: application/json
Authorization: Bearer <jwt>

{
  "nama": "Aula Baru Test",
  "kategori": "Aula serbaguna",
  "alamat": "Jl. Test No.1, Jakarta Barat",
  "lat": -6.17,
  "lng": 106.76,
  "fasilitas": ["Parkir","AC","Toilet"],
  "jam_operasional_raw": "Senin: 08.00–22.00 | ...",
  "deskripsi": "Aula untuk komunitas",
  "harga_text": null,
  "foto_urls": []
}
```

| Field | Required | Desc |
|---|---|---|
| `nama` | yes min 3 | |
| `lat`, `lng` | yes | |
| `kategori`, `alamat`, `fasilitas`, `jam_operasional_raw`, `deskripsi` | no | |

**Response 201 USER:**
```json
{
  "place_id": "11new_c13f089c",
  "nama": "Test Aula 2",
  "status": "pending",
  "owner_id": "uuid-user-1",
  "message": "Menunggu verifikasi admin"
}
```

**Response 201 ADMIN:**
```json
{
  "place_id": "11new_xxxx",
  "nama": "Test Aula",
  "status": "published",
  "owner_id": "uuid-admin-1",
  "message": "Langsung terpublish (ADMIN)"
}
```

**Error 422:** validation `nama` too short.

**cURL:**
```bash
curl -X POST http://localhost:8000/location \
  -H "Content-Type: application/json" -H "X-Role: USER" \
  -d '{"nama":"Aula Baru","alamat":"Jl Test","lat":-6.17,"lng":106.76,"fasilitas":["Parkir","AC"]}'

curl -X POST http://localhost:8000/location \
  -H "Content-Type: application/json" -H "X-Role: ADMIN" \
  -d '{"nama":"Aula Admin","lat":-6.17,"lng":106.76}'
```

---

## 11. POST /admin/verifyLocation

**ADMIN only — accept/reject pending.**

`BE/app/routers/admin.py:1`

**Request:**
```http
POST /admin/verifyLocation
Content-Type: application/json
Authorization: Bearer <admin_jwt>
# atau X-Role: ADMIN

{
  "location_id": "11new_c13f089c",
  "action": "accept",
  "reason": "Alamat valid"
}
```
`action: "accept"|"reject"`

**Response 200 accept:**
```json
{
  "place_id": "11new_c13f089c",
  "old_status": "pending",
  "new_status": "published",
  "verified_by": "uuid-admin-1",
  "verified_at": "2026-09-01T12:00:00Z",
  "reason": null
}
```

**Reject:**
```json
{
  "place_id": "11new_c13f089c",
  "old_status": "pending",
  "new_status": "rejected",
  "verified_by": "uuid-admin-1",
  "verified_at": "2026-09-01T13:00:00Z",
  "reason": "Foto tidak jelas"
}
```

**Error:**
- `403 USER` → `{"detail":"Forbidden: ADMIN only"}`
- `404` → `{"detail":"Place not found"}`

**cURL:**
```bash
curl -X POST http://localhost:8000/admin/verifyLocation \
  -H "Content-Type: application/json" -H "X-Role: ADMIN" \
  -d '{"location_id":"11new_c13f089c","action":"accept"}'

curl -X POST http://localhost:8000/admin/verifyLocation \
  -H "Content-Type: application/json" -H "X-Role: ADMIN" \
  -d '{"location_id":"11new_c13f089c","action":"reject","reason":"spam"}'
```

---

## 12. DELETE /admin/deleteLocation/:id

**ADMIN only**

```http
DELETE /admin/deleteLocation/11new_c13f089c
Authorization: Bearer <admin_jwt>
```

**Response 200:**
```json
{
  "deleted": true,
  "place_id": "11new_c13f089c",
  "deleted_by": "uuid-admin-1"
}
```

**Error:**
- `403` → `{"detail":"Forbidden: ADMIN only"}`
- `404` → `{"detail":"Place not found"}`

**cURL:**
```bash
curl -X DELETE http://localhost:8000/admin/deleteLocation/11new_c13f089c -H "X-Role: ADMIN"
```

---

## 13. Legacy /places & /ingest

**Keep for backward compat:**

```
GET  /places?limit=20&offset=0&kategori=Taman
GET  /places/{place_id}
GET  /places/nearby/search?lat=-6.17&lng=106.76&radius_m=2000&limit=10   # limit int 1-50 default 10, radius_m ge=100 le=50000

GET  /health, GET /health/ready, GET / (root index)

POST /ingest/run          (Header X-Admin-Key)
GET  /ingest/preview?limit=1
POST /ingest/embeddings/rebuild  (Header X-Admin-Key) — rebuild embeddings saja
```

Behavior sama dengan `/locations` tapi tanpa role filtering.

---

## 14. Error Format

Semua error FastAPI standard:

```json
{"detail": "Place not found or not published"}
{"detail": "Forbidden: ADMIN only"}
{"detail": "Field 'data_text' wajib ada dan bertipe string"}
{"detail": "File bukan JSON valid: ..."}
```

Validation 422:
```json
{"detail": [{"loc": ["body","nama"], "msg": "String should have at least 3 characters", "type": "string_too_short"}]}
```

---

## 15. Hybrid Scoring & Threshold

**Weights hybrid soft (tidak ada hard WHERE eliminasi):**
```
final = 0.55*sim (IndoBERT cosine) 
      + facility_bonus (0.15 AC, 0.10 parkir, +0.05 lega)
      + busy_bonus ((40 - busy_percent)/40 *0.15, extra 1.5x if query contains kosong/sepi)
      + rating_norm (rating/5*0.05)
      + geo_bonus (max(0,(10-dist_km)/10)*0.05, -0.05 if outside radius)
```

**Jam parsing:** regex `(jam|pukul)\s*(\d{1,2})` dari `data_text` → `parsed_hour`. Jika LLM berhasil, `hour` dari intent juga dipakai.

**Busy data:** `popular_times` parsed `(\d+)% ramai pada pukul (\d+)` → `busy_percent` jam 12 (32/75 data tersedia, sisanya netral).

---

## 16. cURL & Postman

**Postman:** Import `http://localhost:8000/openapi.json` → semua endpoint otomatis.

**cURL full flow USER→ADMIN:**
```bash
# 1. Health
curl http://localhost:8000/health

# 2. Profile
curl -H "X-Role: USER" http://localhost:8000/profile

# 3. Create as USER (pending)
curl -X POST http://localhost:8000/location \
  -H "Content-Type: application/json" -H "X-Role: USER" \
  -d '{"nama":"Aula Test Flow","lat":-6.17,"lng":106.76}'

# 4. USER cannot see pending
curl -H "X-Role: USER" http://localhost:8000/location/11new_xxx # 404

# 5. ADMIN sees pending
curl -H "X-Role: ADMIN" "http://localhost:8000/locations?status=pending"

# 6. ADMIN verify
curl -X POST http://localhost:8000/admin/verifyLocation \
  -H "Content-Type: application/json" -H "X-Role: ADMIN" \
  -d '{"location_id":"11new_xxx","action":"accept"}'

# 7. Now USER can see
curl -H "X-Role: USER" http://localhost:8000/location/11new_xxx

# 8. Recommendations minimal 5
curl -H "X-Role: USER" "http://localhost:8000/recommendations?limit=10&min_sim=0.6"

# 9. Search JSON + LLM
curl -X POST http://localhost:8000/search/json \
  -H "Content-Type: application/json" -H "X-Role: USER" \
  -d '{"data_text":"ruangan AC parkir lega kosong jam 12","top_k":5}'

# 10. Admin delete
curl -X DELETE http://localhost:8000/admin/deleteLocation/11new_xxx -H "X-Role: ADMIN"
```

**Env setup:** `BE/.env` dari `BE/.env.example` (`SUPABASE_URL`, `SUPABASE_SERVICE_KEY`, `OPENAI_API_KEY`, `MODEL_NAME=indobenchmark/indobert-base-p1`).

**Data:** `python scripts/etl_bulk75.py && python scripts/embed_places.py` sebelum prod (local fallback jalan tanpa ini via `data/raw/...json`).

---

**Swagger:** `http://localhost:8000/docs` — semua endpoint di atas sudah terdokumentasi dengan `summary` dan dapat di-Try it out langsung.
