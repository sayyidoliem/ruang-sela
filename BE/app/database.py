import json
import pathlib
from typing import List, Dict, Any, Optional
from functools import lru_cache

from fastapi import HTTPException

from app.config import get_settings

# Supabase WAJIB - no fallback
try:
    from supabase import create_client, Client  # type: ignore
    HAS_SUPABASE = True
except ImportError as e:
    HAS_SUPABASE = False
    Client = Any  # type: ignore
    _IMPORT_ERR = str(e)

_supabase_client: Optional[Any] = None

def get_supabase() -> Optional[Any]:
    """WAJIB calling API Supabase. Jika tidak configured maka raise 500."""
    global _supabase_client
    if _supabase_client is not None:
        return _supabase_client
    settings = get_settings()
    if not HAS_SUPABASE:
        raise HTTPException(status_code=500, detail=f"Supabase SDK not installed: {_IMPORT_ERR} - relational DB calling API wajib")
    if not settings.supabase_configured():
        raise HTTPException(status_code=500, detail="Supabase relational not configured (SUPABASE_URL/SUPABASE_SERVICE_KEY wajib) - calling API tidak jalan")
    key = settings.supabase_service_key or settings.supabase_anon_key
    try:
        _supabase_client = create_client(settings.supabase_url, key)  # type: ignore
        return _supabase_client
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Supabase init failed: {e} - relational DB calling API wajib")

def _normalize_place(p: Dict[str, Any]) -> Dict[str, Any]:
    """Mapping Supabase row (ruangsela_DKI_bulk75_cookie_75.json) ke format yang dipakai search_service.
    BE/schema places.csv pakai fasilitas_raw, popular_times_raw, jam_ramai; code pakai fasilitas, popular_times.
    Juga foto_urls, reviews sudah di tabel terpisah.
    """
    # fasilitas: Supabase kolom fasilitas_raw -> fasilitas (dipakai compute_facility_bonus)
    if p.get("fasilitas") is None and p.get("fasilitas_raw") is not None:
        p["fasilitas"] = p.get("fasilitas_raw") or []
    elif p.get("fasilitas") is None:
        p["fasilitas"] = []
    # popular_times: Supabase popular_times_raw -> popular_times (dipakai extract_busy_percent)
    if not p.get("popular_times") and p.get("popular_times_raw"):
        p["popular_times"] = p.get("popular_times_raw")
    if not p.get("jam_ramai") and p.get("popular_times_raw"):
        p["jam_ramai"] = p.get("popular_times_raw")
    # reviews: Supabase tabel reviews terpisah, fallback kosong jika belum di-join
    # biarkan fetch_enriched yang isi, tapi set default []
    if p.get("reviews") is None:
        p["reviews"] = []
    # alamat: fallback alamat_lengkap
    if not p.get("alamat") and p.get("alamat_lengkap"):
        p["alamat"] = p.get("alamat_lengkap")
    return p

def fetch_places(limit: Optional[int] = None) -> List[Dict[str, Any]]:
    """Fetch places: WAJIB Supabase, tidak ada fallback local JSON. Normalisasi untuk ruangsela_DKI_bulk75_cookie_75."""
    sb = get_supabase()  # akan raise 500 jika tidak configured
    try:
        q = sb.table("places").select("*")
        if limit:
            q = q.limit(limit)
        res = q.execute()
        if res.data is not None:
            # normalisasi setiap row agar fasilitas tidak kosong
            normed = [_normalize_place(dict(r)) for r in res.data]
            # enrich reviews dari tabel reviews (jika ada) - join ringan untuk 75 data
            try:
                # ambil semua reviews untuk places yang di-fetch (batched)
                ids = [r.get("id") for r in res.data if r.get("id")]
                if ids:
                    rev_res = sb.table("reviews").select("place_id,text,rating").in_("place_id", ids).execute()
                    if rev_res.data:
                        from collections import defaultdict
                        rev_map = defaultdict(list)
                        for rv in rev_res.data:
                            rev_map[rv["place_id"]].append({"text": rv["text"], "rating": rv["rating"]})
                        for p in normed:
                            if p.get("id") in rev_map:
                                p["reviews"] = rev_map[p["id"]]
            except Exception:
                pass  # reviews opsional, jangan gagalkan fetch
            return normed
        raise HTTPException(status_code=500, detail="Supabase places empty - check import BE/schema/places.csv")
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Supabase fetch_places gagal: {e} - relational DB calling API wajib")

def count_places() -> int:
    sb = get_supabase()
    try:
        res = sb.table("places").select("id", count="exact").execute()
        if res.count is not None:
            return res.count
        return len(res.data) if res.data else 0
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Supabase count_places gagal: {e}")

# Legacy helpers dihapus fallback - tetap raise jika dipanggil tanpa Supabase
def load_local_places() -> List[Dict[str, Any]]:
    raise HTTPException(status_code=500, detail="load_local_places disabled - gunakan Supabase relational (BE/schema/places.csv)")

def load_local_embeddings() -> Dict[str, list]:
    raise HTTPException(status_code=500, detail="load_local_embeddings disabled - gunakan Supabase vector (place_embeddings)")
