"""RuangSela Auth — Supabase Auth sebagai sistem autentikasi BE.

Endpoint:
  POST /auth/signup          -> supabase.auth.sign_up
  POST /auth/login           -> supabase.auth.sign_in_with_password
  POST /auth/logout          -> revoke session (Bearer token)
  GET  /auth/me              -> pasang JWT -> user + role (dari public.users)
  GET  /auth/google          -> mulan Google OAuth (redirect ke Supabase authorize)
  GET  /auth/google/callback -> exchange code -> redirect ke FRONTEND_URL#access_token

Google flow: browser -> BE /auth/google -> Supabase authorize + PKCE -> Google
-> Supabase redirect ke BE callback -> BE exchange code -> redirect ke FE
dengan access_token/refresh_token di URL hash.
"""
import secrets
from typing import Any, Dict, Optional
from urllib.parse import urlencode

from fastapi import APIRouter, Depends, Header, HTTPException, Query
from fastapi.responses import RedirectResponse
from pydantic import BaseModel, EmailStr, Field

from app.config import get_settings
from app.middleware.auth import get_current_user
from app.database import get_supabase

router = APIRouter()

# Penyimpanan in-memory untuk PKCE verifier (state -> verifier)
_OAUTH_VERIFIERS: Dict[str, str] = {}


# ---------- Schemas ----------
class SignupBody(BaseModel):
    name: str = Field(..., min_length=1)
    email: EmailStr
    password: str = Field(..., min_length=6)
    role: str = "user"
    phone: Optional[str] = None
    domicile: Optional[str] = None


class LoginBody(BaseModel):
    email: EmailStr
    password: str


class LogoutBody(BaseModel):
    refresh_token: Optional[str] = None


def _auth_client() -> Any:
    settings = get_settings()
    if not settings.supabase_configured():
        raise HTTPException(
            status_code=503,
            detail="Supabase tidak dikonfigurasi (SUPABASE_URL/SUPABASE_ANON_KEY wajib)",
        )
    from supabase import create_client  # lazy import

    # Gunakan anon key untuk operasi auth; service key untuk update profile di public.users
    key = settings.supabase_anon_key or settings.supabase_service_key
    return create_client(settings.supabase_url, key)  # type: ignore


def _serialize_user(user: Any) -> Optional[Dict[str, Any]]:
    if user is None:
        return None
    d = user.model_dump(mode="json") if hasattr(user, "model_dump") else dict(user)
    return d


def _serialize_session(session: Any) -> Optional[Dict[str, Any]]:
    if session is None:
        return None
    d = session.model_dump(mode="json") if hasattr(session, "model_dump") else dict(session)
    if d.get("user"):
        d["user"] = _serialize_user(session.user)
    return d


def _upsert_profile(auth_id: str, email: str, name: str, role: str = "user",
                    phone: Optional[str] = None, domicile: Optional[str] = None,
                    preferences: Optional[Dict[str, Any]] = None) -> None:
    """Upsert row di public.users agar konsisten dengan user Supabase."""
    try:
        sb = get_supabase()
        row = {
            "auth_id": auth_id,
            "email": email,
            "name": name,
            "role": role,
            "phone": phone,
            "domicile": domicile,
            "preferences": preferences or {},
        }
        sb.table("users").upsert(row, on_conflict="auth_id").execute()
    except Exception:
        pass


# ---------- Endpoints ----------
@router.post("/signup", summary="POST /auth/signup — daftar via Supabase Auth")
def signup(body: SignupBody):
    sb = _auth_client()
    metadata: Dict[str, Any] = {
        "fullName": body.name,
        "name": body.name,
        "role": body.role,
    }
    if body.phone:
        metadata["phone"] = body.phone
    if body.domicile:
        metadata["domicile"] = body.domicile

    try:
        res = sb.auth.sign_up({
            "email": body.email,
            "password": body.password,
            "options": {"data": metadata},
        })
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Signup gagal: {e}")

    if res.user is None:
        raise HTTPException(status_code=400, detail="Signup gagal: user tidak dibuat")

    _upsert_profile(
        auth_id=res.user.id,
        email=res.user.email or body.email,
        name=body.name,
        role=body.role,
        phone=body.phone,
        domicile=body.domicile,
    )
    return {
        "data": {
            "user": _serialize_user(res.user),
            "session": _serialize_session(res.session),
        },
        "error": None,
    }


@router.post("/login", summary="POST /auth/login — login via Supabase Auth")
def login(body: LoginBody):
    sb = _auth_client()
    try:
        res = sb.auth.sign_in_with_password({"email": body.email, "password": body.password})
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Login gagal: {e}")

    if res.session is None or res.user is None:
        raise HTTPException(status_code=401, detail="Email belum diverifikasi / kredensial salah")

    # Sync role + name ke public.users (trigger biasanya sudah menangani; pastikan saja)
    meta = res.user.user_metadata or {}
    _upsert_profile(
        auth_id=res.user.id,
        email=res.user.email or body.email,
        name=meta.get("fullName") or meta.get("name") or res.user.email or "",
        role=meta.get("role") or "user",
        phone=meta.get("phone"),
        domicile=meta.get("domicile"),
    )
    return {
        "data": {
            "user": _serialize_user(res.user),
            "session": _serialize_session(res.session),
        },
        "error": None,
    }


@router.post("/logout", summary="POST /auth/logout — keluar (revoke session)")
def logout(
    body: Optional[LogoutBody] = None,
    authorization: Optional[str] = Header(None),
):
    # Bearer access token (wajib) untuk identifikasi user yang logout
    token = (authorization or "").replace("Bearer ", "").strip()
    if not token:
        raise HTTPException(status_code=401, detail="Missing Authorization: Bearer <jwt>")
    try:
        from app.middleware.auth import verify_supabase_token
        user = verify_supabase_token(token)
    except Exception:
        user = None
    if user:
        # Revoke refresh token agar tidak bisa renew lagi (best effort)
        try:
            sb = _auth_client()
            if body and body.refresh_token:
                sb.auth.sign_out()
        except Exception:
            pass
    return {"data": {"message": "logged out"}, "error": None}


@router.get("/me", summary="GET /auth/me — profil user dari JWT")
def me(user: dict = Depends(get_current_user)):
    return {"data": user, "error": None}


@router.get("/google", summary="GET /auth/google — mulai Google OAuth (redirect)")
def google_auth(redirect_to: Optional[str] = Query(None, description="Tujuan FE setelah login")):
    settings = get_settings()
    if not settings.supabase_url:
        raise HTTPException(status_code=503, detail="Supabase tidak dikonfigurasi")

    try:
        from gotrue.helpers import generate_pkce_challenge, generate_pkce_verifier
    except ImportError:
        raise HTTPException(status_code=503, detail="PKCE helper tidak tersedia")

    state = secrets.token_urlsafe(16)
    verifier = generate_pkce_verifier()
    challenge = generate_pkce_challenge(verifier)
    _OAUTH_VERIFIERS[state] = verifier

    callback_url = f"{settings.public_api_url.rstrip('/')}/auth/google/callback"
    params = {
        "provider": "google",
        "redirect_to": callback_url,
        "code_challenge": challenge,
        "code_challenge_method": "s256",
        "state": state,
    }
    # FE boleh override tujuan setelah login via query param (disimpan dalam state)
    if redirect_to:
        _OAUTH_VERIFIERS[state] = f"{verifier}:{redirect_to}"

    url = f"{settings.supabase_url.rstrip('/')}/auth/v1/authorize?" + urlencode(params)
    return RedirectResponse(url)


@router.get("/google/callback", summary="GET /auth/google/callback — tukar code dgn session")
def google_callback(
    code: str = Query(...),
    state: Optional[str] = Query(None),
    error: Optional[str] = Query(None),
    error_description: Optional[str] = Query(None),
):
    if error:
        raise HTTPException(status_code=400, detail=f"Google OAuth error: {error_description or error}")

    entry = _OAUTH_VERIFIERS.pop(state, None) if state else None
    if not entry:
        raise HTTPException(status_code=400, detail="state tidak valid / kedaluwarsa")

    redirect_to = None
    if ":" in entry:
        verifier, redirect_to = entry.split(":", 1)
    else:
        verifier = entry

    sb = _auth_client()
    try:
        settings = get_settings()
        callback_url = f"{settings.public_api_url.rstrip('/')}/auth/google/callback"
        res = sb.auth.exchange_code_for_session({
            "auth_code": code,
            "code_verifier": verifier,
            "redirect_to": callback_url,
        })
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Tukar code gagal: {e}")

    if res.session is None or res.user is None:
        raise HTTPException(status_code=400, detail="Session google kosong")

    meta = res.user.user_metadata or {}
    _upsert_profile(
        auth_id=res.user.id,
        email=res.user.email or "",
        name=meta.get("fullName") or meta.get("name") or res.user.email or "Google User",
        role=meta.get("role") or "user",
        phone=meta.get("phone"),
        domicile=meta.get("domicile"),
    )

    # Redirect ke FE dengan token di URL hash
    fe = (redirect_to or settings.frontend_url).rstrip("/")
    fe_callback = f"{fe}/auth/callback" if "/auth/callback" not in fe else fe
    fragment = urlencode({
        "access_token": res.session.access_token,
        "refresh_token": res.session.refresh_token,
        "provider": "google",
    })
    return RedirectResponse(f"{fe_callback}#{fragment}")