-- ============================================================
-- RuangSela — Tabel User (Essentials)
-- Jalankan di Supabase Dashboard → SQL Editor
-- ============================================================
-- Catatan:
--  * Kredensial (password) dikelola Supabase Auth di schema `auth.users`.
--  * Tabel `public.users` ini menyimpan data esensial profil user
--    (role, nama, preferensi, dll) yang dipakai FE & BE.
--  * Trigger otomatis membuat row di public.users saat signup via auth.users.

-- ------------------------------------------------------------
-- 1. Enum & Extensions
-- ------------------------------------------------------------
create extension if not exists pgcrypto;

do $$
begin
  if not exists (select 1 from pg_type where typname = 'user_role') then
    create type public.user_role as enum ('user', 'manager', 'admin');
  end if;
end$$;

-- ------------------------------------------------------------
-- 2. Tabel users
-- ------------------------------------------------------------
create table if not exists public.users (
  id            uuid primary key default gen_random_uuid(),
  -- id akun dari Supabase Auth (auth.users.id). Null untuk user legacy/mock.
  auth_id       uuid unique,
  email         text unique not null,
  name          text not null,
  role          public.user_role not null default 'user',
  phone         text,
  domicile      text,
  preferences   jsonb not null default '{}'::jsonb,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

comment on table public.users is 'Profil user RuangSela (data esensial, kredensial di auth.users)';

-- ------------------------------------------------------------
-- 3. Index
-- ------------------------------------------------------------
create index if not exists users_email_idx        on public.users (email);
create index if not exists users_role_idx         on public.users (role);
create index if not exists users_auth_id_idx      on public.users (auth_id);

-- ------------------------------------------------------------
-- 4. Trigger: updated_at
-- ------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists users_set_updated_at on public.users;
create trigger users_set_updated_at
  before update on public.users
  for each row
  execute function public.set_updated_at();

-- ------------------------------------------------------------
-- 5. Trigger: auto-create profil saat signup via auth.users
--    Salin email + name dari raw_user_meta_data.
-- ------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.users (id, auth_id, email, name, role, phone, domicile, preferences)
  values (
    gen_random_uuid(),
    new.id,
    new.email,
    coalesce(
      new.raw_user_meta_data ->> 'fullName',
      new.raw_user_meta_data ->> 'name',
      split_part(new.email, '@', 1)
    ),
    case
      when lower(coalesce(new.raw_user_meta_data ->> 'role', '')) = 'admin'  then 'admin'::public.user_role
      when lower(coalesce(new.raw_user_meta_data ->> 'role', '')) = 'manager' then 'manager'::public.user_role
      else 'user'::public.user_role
    end,
    new.raw_user_meta_data ->> 'phone',
    new.raw_user_meta_data ->> 'domicile',
    coalesce(new.raw_user_meta_data ->> 'preferences', '{}')::jsonb
  )
  on conflict (auth_id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

-- ------------------------------------------------------------
-- 6. Row Level Security (RLS)
-- ------------------------------------------------------------
alter table public.users enable row level security;

-- User biasa: hanya bisa baca/edit profilnya sendiri
drop policy if exists "users_select_own" on public.users;
create policy "users_select_own"
  on public.users for select
  using (auth.uid() = auth_id);

drop policy if exists "users_update_own" on public.users;
create policy "users_update_own"
  on public.users for update
  using (auth.uid() = auth_id);

-- Admin (via JWT role di app_metadata): boleh baca semua
drop policy if exists "admin_select_all" on public.users;
create policy "admin_select_all"
  on public.users for select
  using (
    coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '') = 'admin'
  );

drop policy if exists "admin_insert_all" on public.users;
create policy "admin_insert_all"
  on public.users for insert
  with check (
    coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '') = 'admin'
  );

-- Service role (backend) di-bypass otomatis oleh Supabase.

-- ------------------------------------------------------------
-- 7. Seed data uji (opsional — hapus baris ini jika tidak perlu)
-- ------------------------------------------------------------
-- insert into public.users (email, name, role, preferences)
-- values
--   ('admin@example.com', 'Admin RuangSela', 'admin', '{"theme":"light"}'),
--   ('manager@example.com', 'Manager Contoh', 'manager', '{"theme":"light"}'),
--   ('user@example.com', 'User Contoh', 'user', '{"needs_ac":true,"needs_parking":true}')
-- on conflict (email) do nothing;