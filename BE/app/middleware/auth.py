from typing import Optional
from fastapi import Header, HTTPException, Depends

from app.config import get_settings

# Mock user for local dev without Supabase
MOCK_USERS = {
    "user": {"id": "uuid-user-1", "email": "user@example.com", "role": "USER", "preferences": {"needs_ac": True, "needs_parking": True, "kategori_fav": ["Aula serbaguna"]}},
    "admin": {"id": "uuid-admin-1", "email": "admin@example.com", "role": "ADMIN", "preferences": {}},
}

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
    # If Supabase JWT, try to verify via supabase if configured (lazy)
    settings = get_settings()
    if settings.supabase_configured():
        try:
            from supabase import create_client
            sb = create_client(settings.supabase_url, settings.supabase_service_key or settings.supabase_anon_key)
            # verify token
            user_res = sb.auth.get_user(token)
            if user_res and user_res.user:
                u = user_res.user
                # role from user_metadata or app_metadata
                role = (u.user_metadata or {}).get("role") or (u.app_metadata or {}).get("role") or "USER"
                return {"id": u.id, "email": u.email, "role": role.upper(), "preferences": (u.user_metadata or {}).get("preferences", {})}
        except Exception as e:
            # fallback to unauthenticated
            print(f"[AUTH] supabase verify failed: {e}")
            return None
    # If JWT looks like real but not verifiable, try decode payload without verify (dev)
    try:
        import base64, json
        parts = token.split(".")
        if len(parts) == 3:
            payload = parts[1] + "=" * (-len(parts[1]) % 4)
            data = json.loads(base64.urlsafe_b64decode(payload).decode())
            role = data.get("role") or data.get("user_metadata", {}).get("role") or "USER"
            return {"id": data.get("sub") or "jwt-user", "email": data.get("email") or "jwt@example.com", "role": role.upper(), "preferences": data.get("preferences", {})}
    except:
        pass
    return None

async def get_current_user(
    authorization: Optional[str] = Header(None),
    x_role: Optional[str] = Header(None, alias="X-Role"),
    x_user_id: Optional[str] = Header(None, alias="X-User-Id"),
):
    user = _decode_mock_token(authorization, x_role)
    if user:
        # override id if X-User-Id given
        if x_user_id:
            user["id"] = x_user_id
        return user
    # Allow anonymous as USER for local testing if no auth (configurable)
    # For strict prod, uncomment raise
    # raise HTTPException(status_code=401, detail="Missing Authorization: Bearer <supabase_jwt>")
    # Fallback anonymous USER (dev)
    return {"id": "anon-user", "email": "anon@example.com", "role": "USER", "preferences": {}}

async def require_admin(user: dict = Depends(get_current_user)):
    if user.get("role") != "ADMIN":
        raise HTTPException(status_code=403, detail="Forbidden: ADMIN only")
    return user

async def require_user(user: dict = Depends(get_current_user)):
    if user.get("role") not in ("USER", "ADMIN"):
        raise HTTPException(status_code=403, detail="Forbidden")
    return user
