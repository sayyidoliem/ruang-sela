import { env } from "@/config/env";

export const API_BASE_URL = env.NEXT_PUBLIC_API_URL;

export type Role = "USER" | "ADMIN";

export interface ApiOptions {
  role?: Role;
  authorization?: string;
  signal?: AbortSignal;
  timeoutMs?: number;
}

export interface LocationCard {
  place_id: string;
  nama: string;
  kategori: string | null;
  alamat: string | null;
  lat: number | null;
  lng: number | null;
  rating: number | null;
  jumlah_review: number | null;
  status: string;
  foto_count: number;
  fasilitas: string[];
}

export interface LocationsResponse {
  role: Role;
  total: number;
  limit: number;
  offset: number;
  counts: Record<string, number> | null;
  data: LocationCard[];
}

export interface LocationDetail {
  id?: string | null;
  place_id?: string | null;
  cid?: string | null;
  keyword?: string | null;
  nama: string;
  kategori?: string | null;
  kategori_list?: string[];
  alamat?: string | null;
  alamat_lengkap?: string | null;
  plus_code?: string | null;
  lat?: number | null;
  lng?: number | null;
  rating?: number | null;
  jumlah_review?: number | null;
  jam_operasional?: Record<string, string> | null;
  jam_operasional_raw?: string | null;
  status_buka?: string | null;
  popular_times_raw?: string | null;
  jam_ramai?: string | null;
  telepon?: string | null;
  website?: string | null;
  harga_text?: string | null;
  price_level?: string | null;
  price_range?: string | null;
  deskripsi?: string | null;
  scraped_at?: string | null;
  total_open_hours?: number | null;
  is_24h?: boolean;
  has_weekend?: boolean;
  facility_score?: number | null;
  fasilitas_raw?: string[];
  fasilitas?: string[];
  foto_urls?: string[];
  foto_count?: number;
  created_at?: string | null;
  status?: string;
  owner_id?: string | null;
  reviews?: Array<{ text?: string | null; rating?: number | null }>;
}

export interface PlaceCard {
  id?: string | null;
  place_id?: string | null;
  nama: string;
  kategori?: string | null;
  alamat?: string | null;
  lat?: number | null;
  lng?: number | null;
  rating?: number | null;
  jumlah_review?: number | null;
  fasilitas?: string[];
  jam_operasional_raw?: string | null;
  foto_urls?: string[];
  sim_score?: number;
  facility_bonus?: number;
  busy_bonus?: number;
  geo_bonus?: number;
  final_score?: number;
  busy_percent_at_hour?: number | null;
  distance_km?: number | null;
  evidence?: Record<string, unknown>;
  content?: string | null;
}

export interface SearchResponse {
  query: string;
  parsed_hour?: number | null;
  mode?: string;
  top_k?: number;
  took_ms?: number;
  results?: PlaceCard[];
  debug?: Record<string, unknown>;
}

export interface Profile {
  id: string;
  email?: string | null;
  role: string;
  preferences?: {
    needs_ac?: boolean;
    needs_parking?: boolean;
    kategori_fav?: string[];
    [key: string]: unknown;
  };
  created_at?: string | null;
  note?: string | null;
}

async function request<T>(
  path: string,
  init: RequestInit = {},
  options: ApiOptions = {},
): Promise<T> {
  const { role = "USER", authorization, signal, timeoutMs = 60000 } = options;
  const headers = new Headers(init.headers);
  headers.set("X-Role", role);
  if (authorization) headers.set("Authorization", authorization);
  if (init.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const controller = new AbortController();
  const externalSignal = signal;
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  if (externalSignal) {
    if (externalSignal.aborted) controller.abort();
    else externalSignal.addEventListener("abort", () => controller.abort());
  }

  try {
    const res = await fetch(`${API_BASE_URL}${path}`, {
      ...init,
      headers,
      signal: controller.signal,
      cache: "no-store",
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`API ${res.status}: ${text.slice(0, 200)}`);
    }
    return (await res.json()) as T;
  } finally {
    clearTimeout(timer);
  }
}

function toQuery(
  params: Record<string, string | number | boolean | null | undefined>,
): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === "") continue;
    search.set(key, String(value));
  }
  const qs = search.toString();
  return qs ? `?${qs}` : "";
}

export const api = {
  locations(params: {
    limit?: number;
    offset?: number;
    kategori?: string;
    status?: string;
  } = {}, options: ApiOptions = {}) {
    return request<LocationsResponse>(
      `/locations${toQuery(params)}`,
      {},
      options,
    );
  },

  locationDetail(
    placeId: string,
    options: ApiOptions = {},
  ): Promise<LocationDetail> {
    return request<LocationDetail>(
      `/location/${encodeURIComponent(placeId)}`,
      {},
      options,
    );
  },

  search(
    body: {
      data_text: string;
      top_k?: number;
      lat?: number;
      lng?: number;
      radius_m?: number;
      hour?: number;
      mode?: string;
    },
    options: ApiOptions = {},
  ) {
    return request<SearchResponse>(
      "/search/json",
      { method: "POST", body: JSON.stringify(body) },
      options,
    );
  },

  recommendations(
    params: {
      limit?: number;
      min_sim?: number;
      lat?: number;
      lng?: number;
      radius_m?: number;
    } = {},
    options: ApiOptions = {},
  ) {
    return request<SearchResponse>(
      `/recommendations${toQuery(params)}`,
      {},
      options,
    );
  },

  profile(options: ApiOptions = {}): Promise<Profile> {
    return request<Profile>("/profile", {}, options);
  },

  updateProfile(
    body: { preferences?: Record<string, unknown> },
    options: ApiOptions = {},
  ) {
    return request<Profile & { updated?: boolean }>(
      "/profile",
      { method: "PUT", body: JSON.stringify(body) },
      options,
    );
  },

  createLocation(
    body: {
      nama: string;
      alamat?: string;
      kategori?: string;
      lat: number;
      lng: number;
      fasilitas?: string[];
      jam_operasional_raw?: string;
      deskripsi?: string;
      harga_text?: string | null;
      foto_urls?: string[];
    },
    options: ApiOptions = {},
  ) {
    return request<{
      place_id: string;
      nama: string;
      status: string;
      owner_id?: string;
      message?: string;
    }>(
      "/location",
      { method: "POST", body: JSON.stringify(body) },
      options,
    );
  },

  verifyLocation(
    body: { location_id: string; action: "accept" | "reject"; reason?: string },
    options: ApiOptions = {},
  ) {
    return request<{
      place_id: string;
      old_status: string;
      new_status: string;
      verified_by?: string | null;
      verified_at?: string | null;
      reason?: string | null;
    }>(
      "/admin/verifyLocation",
      { method: "POST", body: JSON.stringify(body) },
      { ...options, role: "ADMIN" },
    );
  },

  deleteLocation(
    placeId: string,
    options: ApiOptions = {},
  ) {
    return request<{
      deleted: boolean;
      place_id: string;
      deleted_by?: string;
    }>(
      `/admin/deleteLocation/${encodeURIComponent(placeId)}`,
      { method: "DELETE" },
      { ...options, role: "ADMIN" },
    );
  },

  health(options: ApiOptions = {}) {
    return request<Record<string, unknown>>("/health", {}, options);
  },
};
