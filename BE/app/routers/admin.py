from fastapi import APIRouter, Depends, HTTPException
from app.middleware.auth import require_admin
from app.schemas import VerifyLocationRequest
from app.routers.locations import _STATUS_OVERRIDES
from app.routers.location_mutation import get_created_places
from app.database import fetch_places
import time

router = APIRouter()

@router.post("/verifyLocation", summary="POST /admin/verifyLocation — accept/reject pending")
def verify_location(body: VerifyLocationRequest, admin: dict = Depends(require_admin)):
    pid = body.location_id
    action = body.action  # accept|reject
    new_status = "published" if action == "accept" else "rejected"
    old = _STATUS_OVERRIDES.get(pid, "pending")
    # Check existence in fetch_places or created
    all_places = fetch_places() + get_created_places()
    exists = any(p.get("place_id") == pid for p in all_places) or pid in _STATUS_OVERRIDES
    if not exists:
        # also allow if in fetch_places
        found = any(p.get("place_id") == pid for p in all_places)
        if not found:
            raise HTTPException(status_code=404, detail="Place not found")

    _STATUS_OVERRIDES[pid] = new_status

    # Try supabase
    try:
        from app.config import get_settings
        from supabase import create_client
        settings = get_settings()
        if settings.supabase_configured():
            sb = create_client(settings.supabase_url, settings.supabase_service_key or settings.supabase_anon_key)
            sb.table("places").update({"status": new_status}).eq("place_id", pid).execute()
    except Exception as e:
        print(f"[ADMIN] supabase verify skip: {e}")

    return {
        "place_id": pid,
        "old_status": old,
        "new_status": new_status,
        "verified_by": admin.get("id"),
        "verified_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "reason": body.reason,
    }

@router.delete("/deleteLocation/{place_id}", summary="DELETE /admin/deleteLocation/:id")
def delete_location(place_id: str, admin: dict = Depends(require_admin)):
    # Mark as deleted in override or remove from created
    from app.routers.location_mutation import _CREATED_PLACES
    # Remove from in-memory
    before = len(_CREATED_PLACES)
    _CREATED_PLACES[:] = [p for p in _CREATED_PLACES if p.get("place_id") != place_id]
    # Also remove status override
    if place_id in _STATUS_OVERRIDES:
        del _STATUS_OVERRIDES[place_id]
    # Try supabase
    try:
        from app.config import get_settings
        from supabase import create_client
        settings = get_settings()
        if settings.supabase_configured():
            sb = create_client(settings.supabase_url, settings.supabase_service_key or settings.supabase_anon_key)
            sb.table("places").delete().eq("place_id", place_id).execute()
    except Exception as e:
        print(f"[ADMIN] supabase delete skip: {e}")

    # Check if existed
    all_places = fetch_places()
    exists = any(p.get("place_id") == place_id for p in all_places) or before != len(_CREATED_PLACES)
    if not exists and place_id not in _STATUS_OVERRIDES:
        # still return 404 if never existed
        raise HTTPException(status_code=404, detail="Place not found")

    return {"deleted": True, "place_id": place_id, "deleted_by": admin.get("id")}
