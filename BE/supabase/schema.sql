-- Supabase schema for RuangSela hybrid search
-- Enable PostGIS (untuk geography) + pgvector
create extension if not exists postgis;
create extension if not exists vector;

-- Places core from scraper/models.py:5
create table if not exists places (
  id uuid primary key default gen_random_uuid(),
  place_id text unique, -- /g/11... scraper/detail.py:160
  cid text,
  keyword text,
  nama text not null,
  kategori text,
  kategori_list text[],
  alamat text,
  alamat_lengkap text,
  plus_code text,
  lat double precision,
  lng double precision,
  geom geography(Point, 4326),
  rating double precision,
  jumlah_review int,
  jam_operasional jsonb,
  jam_operasional_raw text,
  status_buka text,
  popular_times_raw text, -- scraper/detail.py:446
  jam_ramai text,
  telepon text,
  website text,
  harga_text text,
  price_level text,
  price_range text,
  deskripsi text,
  scraped_at timestamptz,
  total_open_hours double precision,
  is_24h boolean,
  has_weekend boolean,
  facility_score int,
  fasilitas_raw text[],
  foto_urls text[],
  foto_count int,
  created_at timestamptz default now()
);

-- Facilities normalized for soft bonus (generic Restoran/Bar filtered)
create table if not exists facilities (
  id serial primary key,
  name text unique not null,
  is_generic boolean default false
);

create table if not exists place_facilities (
  place_id uuid references places(id) on delete cascade,
  facility_id int references facilities(id) on delete cascade,
  is_negative boolean default false,
  primary key (place_id, facility_id)
);

create table if not exists reviews (
  id uuid primary key default gen_random_uuid(),
  place_id uuid references places(id) on delete cascade,
  text text not null,
  rating int,
  hash text unique
);

create table if not exists busy_hours (
  place_id uuid references places(id) on delete cascade,
  day text,
  hour int check (hour between 0 and 23),
  busy_percent int,
  primary key (place_id, day, hour)
);

-- Vector table 1:1 per place, IndoBERT 768-dim
create table if not exists place_embeddings (
  place_id uuid primary key references places(id) on delete cascade,
  content text not null,
  embedding vector(768) not null,
  model text default 'indobenchmark/indobert-base-p1',
  updated_at timestamptz default now()
);

-- Indexes
create index if not exists idx_places_geom on places using gist (geom);
create index if not exists idx_places_kategori on places (kategori);
create index if not exists idx_place_embeddings_hnsw on place_embeddings using hnsw (embedding vector_cosine_ops) with (m=16, ef_construction=64);

-- Update geom from lat/lng
-- run after insert: update places set geom = ST_SetSRID(ST_MakePoint(lng, lat), 4326)::geography where geom is null and lat is not null;

-- Eval tables for LLM-as-judge
create table if not exists eval_queries (
  id uuid primary key default gen_random_uuid(),
  query_text text not null,
  lat double precision,
  lng double precision,
  radius_m int
);

create table if not exists eval_results (
  id uuid primary key default gen_random_uuid(),
  query_id uuid references eval_queries(id),
  system text, -- relational|vector|hybrid
  place_id uuid references places(id),
  rank int,
  sim float,
  final_score float,
  llm_score int,
  llm_reason text,
  created_at timestamptz default now()
);
