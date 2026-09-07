-- RPC for hybrid search — vector top50, soft scoring in app layer
-- This RPC only does vector similarity; facility/busy/geo bonuses applied in Python (soft filter)

create or replace function hybrid_search(
  q vector(768),
  limit_k int default 50
)
returns table (
  place_id uuid,
  nama text,
  kategori text,
  alamat text,
  lat double precision,
  lng double precision,
  rating double precision,
  sim float
)
language sql
as $$
  select p.id, p.nama, p.kategori, p.alamat_lengkap, p.lat, p.lng, p.rating,
         1 - (pe.embedding <=> q) as sim
  from place_embeddings pe
  join places p on p.id = pe.place_id
  order by pe.embedding <=> q
  limit limit_k;
$$;

-- Alternative: hybrid with pre-filter (optional, not used for soft mode)
create or replace function hybrid_search_with_filter(
  q vector(768),
  target_hour int default null,
  limit_k int default 50
)
returns table (place_id uuid, nama text, sim float)
language sql
as $$
  select p.id, p.nama, 1 - (pe.embedding <=> q) as sim
  from place_embeddings pe
  join places p on p.id = pe.place_id
  -- soft: no WHERE elimination, just ranking
  order by pe.embedding <=> q
  limit limit_k;
$$;

-- Helper: nearby via geography
create or replace function nearby_places(u_lat double precision, u_lng double precision, r_m int default 2000, lim int default 20)
returns table (place_id uuid, nama text, distance_m float)
language sql
as $$
  select p.id, p.nama,
         ST_Distance(p.geom, ST_SetSRID(ST_MakePoint(u_lng, u_lat),4326)::geography) as distance_m
  from places p
  where p.geom is not null
    and ST_DWithin(p.geom, ST_SetSRID(ST_MakePoint(u_lng, u_lat),4326)::geography, r_m)
  order by distance_m
  limit lim;
$$;
