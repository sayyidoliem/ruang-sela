from fastapi import APIRouter, Depends, HTTPException
from app.middleware.auth import get_current_user
from app.schemas import CreateLocationRequest
from app.routers.locations import _STATUS_OVERRIDES
from app.database import fetch_places
import uuid, time

router = APIRouter()

# In-memory store for newly created places (local dev without supabase)
_CREATED_PLACES = []

@router.post("", summary="POST /location — USER pending, ADMIN langsung published", status_code=201)
def create_location(body: CreateLocationRequest, user: dict = Depends(get_current_user)):
    role = user.get("role", "USER")
    status = "published" if role == "ADMIN" else "pending"
    new_id = f"11new_{uuid.uuid4().hex[:8]}"
    place = {
        "place_id": new_id,
        "nama": body.nama,
        "kategori": body.kategori,
        "alamat": body.alamat,
        "alamat_lengkap": body.alamat,
        "lat": body.lat,
        "lng": body.lng,
        "fasilitas": body.fasilitas,
        "jam_operasional_raw": body.jam_operasional_raw,
        "deskripsi": body.deskripsi,
        "harga_text": body.harga_text,
        "foto_urls": body.foto_urls,
        "status": status,
        "owner_id": user.get("id"),
        "created_by_role": role,
        "rating": None,
        "jumlah_review": 0,
        "scraped_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
    }
    # Store in memory
    _CREATED_PLACES.append(place)
    _STATUS_OVERRIDES[new_id] = status

    # Try supabase insert if configured
    try:
        from app.config import get_settings
        from supabase import create_client
        settings = get_settings()
        if settings.supabase_configured():
            sb = create_client(settings.supabase_url, settings.supabase_service_key or settings.supabase_anon_key)
            sb.table("places").insert({
                "place_id": new_id,
                "nama": body.nama,
                "kategori": body.kategori,
                "alamat": body.alamat,
                "alamat_lengkap": body.alamat,
                "lat": body.lat, "lng": body.lng,
                "fasilitas_raw": body.fasilitas,
                "status": status,
                "owner_id": user.get("id"),
            }).execute()
    except Exception as e:
        print(f"[LOCATION] supabase insert skip: {e}")

    return {
        "place_id": new_id,
        "nama": body.nama,
        "status": status,
        "owner_id": user.get("id"),
        "message": "Langsung terpublish (ADMIN)" if status == "published" else "Menunggu verifikasi admin",
    }

# Expose for other routers to merge
def get_created_places():
    return _CREATED_PLACES
