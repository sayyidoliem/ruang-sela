from typing import Optional
from fastapi import Header, HTTPException, Depends

from app.config import get_settings

# Mock user for local dev without Supabase
MOCK_USERS = {
    "user": {"id": "uuid-user-1", "email": "user@example.com", "role": "USER", "preferences": {"needs_ac": True, "needs_parking": True, "kategori_fav": ["Aula serbaguna"]}},
    "admin": {"id": "uuid-admin-1", "email": "admin@example.com", "role": "ADMIN", "preferences": {}},
}

def _fetch_profile_role(auth_id: str):
    """Ambil role dari public.users bila tersedia (RLS offline pakai service key)."""
    try:
        from app.database import get_supabase
        sb = get_supabase()
        res = sb.table("users").select("role,name,preferences,domicile,created_at").eq("auth_id", auth_id).maybe_single().execute()
        if res and res.data:
            return res.data
    except Exception:
        pass
    return None

def _decode_mock_token(authorization: Optional[str], x_role: Optional[str]) -> Optional[dict]:
    # Priority: X-Role header for testing
    if x_role:
        key = x_role.lower()
        if key in MOCK_USERS:
            return MOCK_USERS[key]
        # allow USER/ADMIN directly
        return {"id": f"mock-{key}", "email": f"{key}@example.com", "role": key.upper(), "preferences": {}}
    if not authorization:
        return None
    # Bearer token handling
    token = authorization.replace("Bearer ", "").strip()
    # Mock tokens for testing: "user_token", "admin_token"
    if token == "user_token" or token == "mock_user":
        return MOCK_USERS["user"]
    if token == "admin_token" or token == "mock_admin":
        return MOCK_USERS["admin"]
    return None

def verify_supabase_token(token: str) -> Optional[dict]:
    """Verifikasi Supabase JWT via api/auth.get_user. Return dict user atau None."""
    settings = get_settings()
    if not settings.supabase_configured():
        return None
    try:
        from supabase import create_client
        key = settings.supabase_service_key or settings.supabase_anon_key
        sb = create_client(settings.supabase_url, key)
        res = sb.auth.get_user(token)
        if res and res.user:
            u = res.user
            meta = u.user_metadata or {}
            profile = _fetch_profile_role(u.id)
            role = (profile or {}).get("role") or meta.get("role") or (u.app_metadata or {}).get("role") or "user"
            return {
                "id": u.id,
                "auth_id": u.id,
                "email": u.email,
                "name": profile.get("name") if profile else (meta.get("fullName") or meta.get("name")),
                "role": role.upper(),
                "preferences": (profile or {}).get("preferences") or meta.get("preferences", {}),
                "domicile": (profile or {}).get("domicile") or meta.get("domicile"),
                "phone": meta.get("phone"),
                "created_at": (profile or {}).get("created_at"),
            }
    except Exception as e:
        print(f"[AUTH] supabase verify failed: {e}")
        return None
    return None

async def get_current_user(
    authorization: Optional[str] = Header(None),
    x_role: Optional[str] = Header(None, alias="X-Role"),
    x_user_id: Optional[str] = Header(None, alias="X-User-Id"),
):
    settings = get_settings()
    if authorization:
        token = authorization.replace("Bearer ", "").strip()
        user = verify_supabase_token(token)
        if user:
            if x_user_id:
                user["id"] = x_user_id
            return user

    # Dev fallback: X-Role header / mock tokens hanya jika Supabase belum dikonfigurasi
    if not settings.supabase_configured():
        user = _decode_mock_token(authorization, x_role)
        if user:
            if x_user_id:
                user["id"] = x_user_id
            return user
        # Allow anonymous as USER for local testing if no auth (configurable)
        # For strict prod, uncomment raise
        # raise HTTPException(status_code=401, detail="Missing Authorization: Bearer <supabase_jwt>")
        # Fallback anonymous USER (dev)
        return {"id": "anon-user", "email": "anon@example.com", "role": "USER", "preferences": {}}

    # Supabase configured namun token invalid / tidak ada -> 401
    raise HTTPException(status_code=401, detail="Unauthorized: Authorization: Bearer <supabase_jwt>")

async def require_admin(user: dict = Depends(get_current_user)):
    if user.get("role") != "ADMIN":
        raise HTTPException(status_code=403, detail="Forbidden: ADMIN only")
    return user

async def require_user(user: dict = Depends(get_current_user)):
    if user.get("role") not in ("USER", "ADMIN"):
        raise HTTPException(status_code=403, detail="Forbidden")
    return user
