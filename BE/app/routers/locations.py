from typing import Optional
from fastapi import APIRouter, Query, HTTPException, Depends, Header

from app.middleware.auth import get_current_user
from app.database import fetch_places

# In-memory status store for local dev (when supabase not configured)
# Key: place_id -> status (published/pending/rejected)
_STATUS_OVERRIDES = {}

def _get_all_places():
    """Merge base 75 + newly created in-memory places."""
    base = fetch_places()
    # import here to avoid circular
    try:
        from app.routers.location_mutation import get_created_places
        created = get_created_places()
        # avoid duplicating if already in base (supabase case)
        base_ids = {p.get("place_id") for p in base}
        merged = list(base)
        for p in created:
            if p.get("place_id") not in base_ids:
                merged.append(p)
        return merged
    except:
        return base

router = APIRouter()

def _get_status(place: dict) -> str:
    pid = place.get("place_id")
    if pid in _STATUS_OVERRIDES:
        return _STATUS_OVERRIDES[pid]
    # Default: if place has status field use it, else published for original 75
    return place.get("status") or "published"

def _enrich_with_status(places):
    out = []
    for p in places:
        cp = dict(p)
        cp["status"] = _get_status(p)
        out.append(cp)
    return out

@router.get("", summary="GET /locations — USER: published only, ADMIN: pending+published+rejected")
def list_locations(
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
    kategori: Optional[str] = Query(None),
    status: Optional[str] = Query(None, description="ADMIN only: pending|published|rejected|all"),
    user: dict = Depends(get_current_user),
):
    places = _enrich_with_status(_get_all_places())
    role = user.get("role", "USER")

    # Filter by visibility
    if role != "ADMIN":
        # USER only sees published
        places = [p for p in places if p["status"] == "published"]
    else:
        # ADMIN can filter by status
        if status and status != "all":
            places = [p for p in places if p["status"] == status]

    if kategori:
        places = [p for p in places if kategori.lower() in (p.get("kategori") or "").lower()]

    total = len(places)
    sliced = places[offset: offset + limit]
    data = []
    for p in sliced:
        data.append({
            "place_id": p.get("place_id"),
            "nama": p.get("nama"),
            "kategori": p.get("kategori"),
            "alamat": p.get("alamat_lengkap") or p.get("alamat"),
            "lat": p.get("lat"), "lng": p.get("lng"),
            "rating": p.get("rating"),
            "jumlah_review": p.get("jumlah_review"),
            "status": p["status"],
            "foto_count": len(p.get("foto_urls") or []),
            "fasilitas": (p.get("fasilitas") or [])[:5],
        })
    # For ADMIN include counts
    counts = None
    if role == "ADMIN":
        from collections import Counter
        all_places = _enrich_with_status(_get_all_places())
        c = Counter([_get_status(p) for p in all_places])
        counts = dict(c)

    return {"role": role, "total": total, "limit": limit, "offset": offset, "counts": counts, "data": data}

@router.get("/{place_id}", summary="GET /location/:id — USER: published only, ADMIN: all")
def get_location(place_id: str, user: dict = Depends(get_current_user)):
    places = _enrich_with_status(_get_all_places())
    role = user.get("role", "USER")
    for p in places:
        if p.get("place_id") == place_id or p.get("nama") == place_id:
            if role != "ADMIN" and p["status"] != "published":
                raise HTTPException(status_code=404, detail="Place not found or not published")
            return p
    raise HTTPException(status_code=404, detail="Place not found")

# Also mount as /locations/{id} alias for convenience
@router.get("/by/{place_id}", summary="GET /locations/{id} alias", include_in_schema=False)
def get_location_alias(place_id: str, user: dict = Depends(get_current_user)):
    return get_location(place_id, user)
