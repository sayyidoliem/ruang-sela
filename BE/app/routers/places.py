from typing import Optional
from fastapi import APIRouter, Query, HTTPException

from app.database import fetch_places

router = APIRouter()

@router.get("", summary="List places (relational)")
def list_places(limit: int = Query(20, ge=1, le=100), offset: int = Query(0, ge=0), kategori: Optional[str] = Query(None)):
    places = fetch_places()
    if kategori:
        places = [p for p in places if kategori.lower() in (p.get("kategori") or "").lower()]
    total = len(places)
    sliced = places[offset: offset+limit]
    # slim
    out = []
    for p in sliced:
        out.append({
            "place_id": p.get("place_id"),
            "nama": p.get("nama"),
            "kategori": p.get("kategori"),
            "alamat": p.get("alamat_lengkap") or p.get("alamat"),
            "lat": p.get("lat"),
            "lng": p.get("lng"),
            "rating": p.get("rating"),
            "jumlah_review": p.get("jumlah_review"),
            "fasilitas": p.get("fasilitas"),
            "jam_operasional_raw": p.get("jam_operasional_raw"),
            "foto_count": len(p.get("foto_urls") or []),
        })
    return {"total": total, "limit": limit, "offset": offset, "data": out}

@router.get("/{place_id}", summary="Detail place by place_id")
def get_place(place_id: str):
    places = fetch_places()
    for p in places:
        if p.get("place_id") == place_id or p.get("nama") == place_id:
            return p
    raise HTTPException(status_code=404, detail="Place not found")

@router.get("/nearby/search", summary="Nearby search (geo)")
def nearby_search(lat: float = Query(...), lng: float = Query(...), radius_m: int = Query(2000, ge=100, le=50000), limit: int = Query(10, ge=1, le=50)):
    from app.services.search_service import haversine_km
    places = fetch_places()
    scored = []
    for p in places:
        if p.get("lat") is None or p.get("lng") is None:
            continue
        try:
            d = haversine_km(lat, lng, float(p["lat"]), float(p["lng"]))
            if d*1000 <= radius_m:
                scored.append((d, p))
        except:
            continue
    scored.sort(key=lambda x: x[0])
    out = []
    for d, p in scored[:limit]:
        out.append({"distance_km": round(d, 2), "place_id": p.get("place_id"), "nama": p.get("nama"), "kategori": p.get("kategori"), "alamat": p.get("alamat"), "rating": p.get("rating")})
    return {"lat": lat, "lng": lng, "radius_m": radius_m, "count": len(out), "data": out}
