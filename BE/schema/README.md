# BE/schema - Supabase CSV Import (RuangSela)

Folder ini berisi CSV siap import ke Supabase sesuai `BE/supabase/schema.sql` dan tipe data `scraper/models.py:5` + `BE/app/schemas.py:35`. Data sumber: `data/raw/ruangsela_DKI_bulk75_cookie_75.json` (75 places DKI, foto high-res `=s1024`).

## File

| CSV | Tabel Supabase | Rows | Deskripsi kolom sesuai schema.sql |
|-----|----------------|------|-----------------------------------|
| `places.csv` | `places` | 75 | `id uuid PK`, `place_id text unique`, `cid`, `keyword`, `nama`, `kategori`, `kategori_list text[]`, `alamat`, `alamat_lengkap`, `plus_code`, `lat/lng double precision`, `geom geography(Point,4326)` (kosong, diisi via `ST_MakePoint`), `rating double`, `jumlah_review int`, `jam_operasional jsonb`, `jam_operasional_raw text`, `status_buka`, `popular_times_raw`, `jam_ramai`, `telepon`, `website`, `harga_text`, `price_level`, `price_range`, `deskripsi`, `scraped_at timestamptz`, `total_open_hours double`, `is_24h boolean`, `has_weekend boolean`, `facility_score int`, `fasilitas_raw text[]`, `foto_urls text[]`, `foto_count int` |
| `facilities.csv` | `facilities` | 44 | `id serial PK`, `name text unique`, `is_generic boolean` (`Restoran`/`Bar` = true) |
| `place_facilities.csv` | `place_facilities` | 451 | `place_id uuid FK->places.id`, `facility_id int FK->facilities.id`, `is_negative boolean` (true untuk `Tidak memiliki...`) |
| `reviews.csv` | `reviews` | 198 | `id uuid PK`, `place_id uuid FK`, `text text`, `rating int` (kosong = null), `hash text unique` (md5 dedup) |
| `busy_hours.csv` | `busy_hours` | 613 | `place_id uuid FK`, `day text` (Senin..), `hour int 0-23`, `busy_percent int` - parsed dari `popular_times` regex `(\d+)% ramai pada pukul (\d+)` (`BE/app/services/etl_service.py:13`) |
| `place_embeddings.csv` | `place_embeddings` | 75 | `place_id uuid PK FK->places.id`, `content text` (template `BE/app/services/embed_service.py:143` `build_place_content`), `embedding vector(768)` (dummy `[0,0,...]` 768-dim, akan di-replace via `scripts/embed_places.py`), `model text` |
| `place_id_map.csv` | - | 75 | helper mapping `place_id` text -> `uuid` deterministik (`uuid5(NAMESPACE_URL, "ruangsela:{place_id}")`), untuk join manual |

Tipe data di CSV:

*   `text[]` Postgres array ditulis sebagai `{"a","b","c"}` dengan escape `\"` sesuai `schema.sql:13` (contoh `fasilitas_raw`, `foto_urls`, `kategori_list`).
*   `jsonb` (`jam_operasional`) sebagai JSON string `{"Senin":"09.00–22.00",...}` (UTF-8, `–` U+2013).
*   `boolean` sebagai `true`/`false` lower case.
*   `double precision`/`int` kosong = `""` (import sebagai `NULL` di Supabase / `\copy ... WITH CSV HEADER NULL ''`).
*   `timestamptz` (`scraped_at`) ISO8601 `2026-08-31T18:46:23.790983`.
*   `vector(768)` (`embedding`) sebagai `[0,0,...]` string length 768 (placeholder, generate ulang via IndoBERT).

## Urutan Import (karena FK)

1.  Jalankan `BE/supabase/schema.sql` + `BE/supabase/rpc.sql` di Supabase SQL Editor dulu (buat extension `vector`, tabel, index `hnsw`).
2.  Import CSV via **Supabase Dashboard > Table Editor > Import Data** atau **psql `\copy`** secara berurutan:

```sql
-- 1. facilities (tanpa FK)
-- Supabase UI: facilities.csv -> mapping id->id, name->name, is_generic->is_generic

-- 2. places (tanpa FK)
-- UI: places.csv -> semua kolom, geom kosongkan (NULL), jam_operasional pilih jsonb

-- atau psql:
\copy places(id,place_id,cid,keyword,nama,kategori,kategori_list,alamat,alamat_lengkap,plus_code,lat,lng,geom,rating,jumlah_review,jam_operasional,jam_operasional_raw,status_buka,popular_times_raw,jam_ramai,telepon,website,harga_text,price_level,price_range,deskripsi,scraped_at,total_open_hours,is_24h,has_weekend,facility_score,fasilitas_raw,foto_urls,foto_count) FROM 'BE/schema/places.csv' WITH CSV HEADER NULL '' ENCODING 'UTF8';

\copy facilities(id,name,is_generic) FROM 'BE/schema/facilities.csv' WITH CSV HEADER NULL '';
\copy place_facilities(place_id,facility_id,is_negative) FROM 'BE/schema/place_facilities.csv' WITH CSV HEADER NULL '';
\copy reviews(id,place_id,text,rating,hash) FROM 'BE/schema/reviews.csv' WITH CSV HEADER NULL '' ENCODING 'UTF8';
\copy busy_hours(place_id,day,hour,busy_percent) FROM 'BE/schema/busy_hours.csv' WITH CSV HEADER NULL '';
-- place_embeddings placeholder, nanti di-overwrite:
\copy place_embeddings(place_id,content,embedding,model) FROM 'BE/schema/place_embeddings.csv' WITH CSV HEADER NULL '' ENCODING 'UTF8';
```

3.  Update `geom` setelah places:

```sql
update places set geom = ST_SetSRID(ST_MakePoint(lng, lat), 4326)::geography
where geom is null and lat is not null and lng is not null;
create index if not exists idx_places_geom on places using gist (geom);
```

4.  Generate embeddings IndoBERT nyata (overwrite dummy):

```bash
cd BE
python scripts/embed_places.py  # butuh SUPABASE_URL/KEY di BE/.env, akan upsert ke place_embeddings + BE/eval/embeddings.json
# Alternatif tanpa Supabase: embedding tetap dummy, API akan fallback ke hash dummy di BE/app/services/embed_service.py:110
```

5.  Verifikasi:

```sql
select count(*) from places; -- 75
select count(*) from facilities; -- 44
select count(*) from place_facilities; -- 451
select count(*) from reviews; -- 198
select count(*) from busy_hours; -- 613
select * from places limit 1;
select * from place_embeddings limit 1; -- embedding vector length 768
```

## Catatan Import Supabase Dashboard

*   Dashboard Import **auto-detect** `text[]` jika CSV berisi `{"a","b"}` - jika gagal, ubah kolom ke `text` dulu lalu `alter type`.
*   `jam_operasional` pilih type `jsonb` - CSV menyediakan `{"Senin":"09.00–22.00",...}` valid JSON.
*   `embedding` pilih `vector` - Dashboard kadang belum support vector import via UI, gunakan **SQL Editor + `psql`** atau `supabase` CLI. Dummy `[0,0,...]` panjang 768 valid untuk `vector(768)` tapi tidak semantik - wajib `embed_places.py` untuk hasil search hybrid akurat (`BE/app/services/search_service.py:208` cosine).
*   Jika `place_id` UUID FK error, pastikan `places` diimport dulu dan `place_id_map.csv` konsisten (uuid5 deterministic).

## Generate Ulang

```bash
py -3 BE/schema/generate.py  # dari repo root, baca data/raw/ruangsela_DKI_bulk75_cookie_75.json -> tulis BE/schema/*.csv
```

Script: `BE/schema/generate.py` (deterministik uuid, `pg_array_text`, `build_place_content` sama dengan `embed_service.py:143`).

## Sumber

*   Schema: `BE/supabase/schema.sql:1`, `BE/supabase/rpc.sql:1`
*   ETL ref: `BE/scripts/etl_bulk75.py:1`, `BE/app/services/etl_service.py:1`
*   Tipe Place: `scraper/models.py:5` (31 field), `BE/app/schemas.py:35` `PlaceCard`
