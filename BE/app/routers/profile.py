from fastapi import APIRouter, Depends, HTTPException
from app.middleware.auth import get_current_user
from app.database import fetch_places

router = APIRouter()

@router.get("", summary="GET /profile — data mengenai profile")
def get_profile(user: dict = Depends(get_current_user)):
    # In prod, fetch from supabase profiles table. For local fallback, return mock.
    # Count owned places if we had owner_id (for now mock)
    return {
        "id": user.get("id"),
        "email": user.get("email"),
        "role": user.get("role"),
        "preferences": user.get("preferences", {}),
        "created_at": user.get("created_at"),
        "note": "Supabase JWT verified" if user.get("id") != "anon-user" else "anonymous fallback (set Authorization Bearer)",
    }

@router.put("", summary="PUT /profile — update preferences")
def update_profile(body: dict, user: dict = Depends(get_current_user)):
    # In prod: supabase.table("profiles").update({"preferences": body.get("preferences")}).eq("id", user["id"])
    prefs = body.get("preferences")
    if prefs is not None:
        user["preferences"] = prefs
    return {"id": user.get("id"), "role": user.get("role"), "preferences": user.get("preferences"), "updated": True}
