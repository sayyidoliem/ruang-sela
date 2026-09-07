from typing import Optional
from fastapi import APIRouter, Depends, Query

from app.middleware.auth import get_current_user
from app.services.recommendation_service import get_recommendations
from app.schemas import PlaceCard

router = APIRouter()

@router.get("", summary="GET /recommendations — maksimal dengan batas kecocokan tepat, minimal 5 similar")
@router.get("/", summary="GET /recommendations/")
def recommendations(
    limit: int = Query(10, ge=1, le=20, description="Maksimal tempat dikembalikan"),
    min_sim: float = Query(0.60, ge=0.0, le=1.0, description="Batas kecocokan tepat (threshold final_score 0-1)"),
    lat: Optional[float] = Query(None),
    lng: Optional[float] = Query(None),
    radius_m: Optional[int] = Query(None, ge=100, le=50000),
    user: dict = Depends(get_current_user),
):
    """
    Mendapatkan rekomendasi berdasarkan profil. Threshold `min_sim` diterapkan pada `final_score` hybrid.
    Jaminan minimal 5 hasil: jika <5 lolos threshold, threshold di-relax step 0.05 hingga 0.40 hingga dapat 5, atau ambil top 5 terbaik.
    """
    res = get_recommendations(profile=user, limit=limit, min_sim=min_sim, lat=lat, lng=lng, radius_m=radius_m)
    # Build PlaceCards
    cards = []
    for r in res["results"]:
        p = r["place"]
        cards.append(PlaceCard(
            id=str(p.get("place_id") or p.get("nama")),
            place_id=p.get("place_id"),
            nama=p.get("nama") or "-",
            kategori=p.get("kategori"),
            alamat=p.get("alamat_lengkap") or p.get("alamat"),
            lat=p.get("lat"), lng=p.get("lng"),
            rating=p.get("rating"), jumlah_review=p.get("jumlah_review"),
            fasilitas=p.get("fasilitas") or [],
            jam_operasional_raw=p.get("jam_operasional_raw"),
            foto_urls=(p.get("foto_urls") or [])[:3],
            sim_score=round(r["sim"], 4),
            facility_bonus=round(r["facility_bonus"], 4),
            busy_bonus=round(r["busy_bonus"], 4),
            geo_bonus=round(r["geo_bonus"], 4),
            final_score=round(r["final"], 4),
            busy_percent_at_hour=r["busy_pct"],
            distance_km=round(r["distance_km"], 2) if r["distance_km"] is not None else None,
            evidence=r["evidence"],
            content=r["content"][:600] if r.get("content") else None,
        ))
    return {
        "user_id": user.get("id"),
        "role": user.get("role"),
        "profile_used": user.get("preferences", {}),
        "query_text": res["query_text"],
        "params": {"limit": limit, "min_sim": min_sim, "threshold_applied": res["threshold_applied"], "relaxed": res["relaxed"]},
        "count_before_filter": res["count_before_filter"],
        "count": res["count"],
        "meets_minimum": res["meets_minimum"],
        "threshold_requested": res["threshold_requested"],
        "threshold_applied": res["threshold_applied"],
        "relaxed": res["relaxed"],
        "data": [c.model_dump() for c in cards],
    }
