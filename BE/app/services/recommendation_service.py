"""
Recommendation Service — GET /recommendations with threshold min 5 similar.
"""
from typing import List, Dict, Any, Optional
import math

from app.services.search_service import hybrid_search

def _get_published_places():
    # Only published for recommendations
    try:
        from app.routers.locations import _get_all_places, _get_status
        all_places = _get_all_places()
        return [p for p in all_places if _get_status(p) == "published"]
    except:
        from app.database import fetch_places
        return fetch_places()

def build_profile_query(profile: Dict[str, Any]) -> str:
    prefs = profile.get("preferences") or {}
    parts = []
    # role-based default
    if prefs.get("needs_ac"):
        parts.append("ruangan ber-AC sejuk")
    if prefs.get("needs_parking"):
        parts.append("dengan parkir luas lega")
    kategori_fav = prefs.get("kategori_fav")
    if kategori_fav:
        if isinstance(kategori_fav, list):
            parts.append("kategori " + ", ".join(kategori_fav))
        else:
            parts.append(str(kategori_fav))
    # fallback if empty
    if not parts:
        parts.append("ruangan yang nyaman dan bersih dengan rating tinggi")
    # add generic
    parts.append("tempat yang direkomendasikan")
    return " ".join(parts)

def get_recommendations(
    profile: Dict[str, Any],
    limit: int = 10,
    min_sim: float = 0.60,
    lat: Optional[float] = None,
    lng: Optional[float] = None,
    radius_m: Optional[int] = None,
) -> Dict[str, Any]:
    query_text = build_profile_query(profile)
    # hybrid search top larger pool to allow filtering
    # Note: hybrid_search internally loads all published via fetch_places; for local in-memory pending filter we handle threshold after
    initial_top = max(limit * 3, 30)
    results = hybrid_search(
        query_text=query_text,
        top_k=initial_top,
        mode="hybrid",
        target_hour=None,
        user_lat=lat,
        user_lng=lng,
        radius_m=radius_m,
    )
    # Filter to only published (if local overrides exist, exclude pending)
    try:
        from app.routers.locations import _get_status
        results = [r for r in results if _get_status(r["place"]) == "published"]
    except:
        pass
    # Sort by final_score already
    count_before = len(results)
    # Filter by threshold (final_score)
    threshold = min_sim
    filtered = [r for r in results if r["final"] >= threshold]

    # Ensure minimal 5: relax threshold stepwise down to 0.40
    relaxed = False
    threshold_applied = threshold
    min_required = 5
    step = 0.05
    min_floor = 0.40
    while len(filtered) < min_required and threshold_applied > min_floor:
        threshold_applied = round(threshold_applied - step, 2)
        filtered = [r for r in results if r["final"] >= threshold_applied]
        relaxed = True
        if threshold_applied <= min_floor:
            break

    # If still <5, take top 5 regardless (if enough data)
    meets_minimum = len(filtered) >= min_required
    if not meets_minimum and len(results) >= min_required:
        # fallback: take top 5 top results ignoring threshold
        filtered = results[:min_required]
        meets_minimum = True
        # mark relaxed even more
        relaxed = True
        threshold_applied = filtered[-1]["final"] if filtered else threshold_applied

    # Truncate to limit
    final_results = filtered[:limit]

    return {
        "query_text": query_text,
        "count_before_filter": count_before,
        "count": len(final_results),
        "threshold_requested": min_sim,
        "threshold_applied": threshold_applied,
        "relaxed": relaxed,
        "meets_minimum": meets_minimum,
        "results": final_results,
    }
