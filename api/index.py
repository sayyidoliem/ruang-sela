"""
Vercel serverless entrypoint for FastAPI BE (monorepo, Root Directory = "/").

Vercel's Python builder statically scans this file for a top-level
`app` / `application` / `handler` variable, so it MUST be assigned
unconditionally at module level (no bare try/except import that can
leave the name undefined).
"""
import sys
import pathlib

# Make BE importable when deploying from repo root:
#   api/index.py  ->  parent.parent = repo root, BE/ sits there.
_ROOT = pathlib.Path(__file__).resolve().parent.parent
_BE_DIR = _ROOT / "BE"
for _p in (str(_BE_DIR), str(_ROOT)):
    if _p not in sys.path:
        sys.path.insert(0, _p)

from fastapi import FastAPI

try:
    from app.main import app as _fastapi_app

    app: FastAPI = _fastapi_app
    _import_error: str | None = None
except Exception as exc:  # pragma: no cover - build-time safety net
    # NEVER leave `app` undefined: Vercel fails the build with
    # 'Could not find a top-level "app", "application", or "handler"'
    # if the real import crashes (e.g. missing env/deps at build time).
    # This fallback keeps the detector happy and surfaces the real
    # error as a 500 at runtime instead of a failed deploy.
    _import_error = f"{type(exc).__name__}: {exc}"
    print(f"[api/index] FastAPI import failed, using fallback app: {_import_error}")

    app = FastAPI(title="RuangSela BE (import fallback)")

    @app.get("/")
    def _fallback_root():
        return {"status": "error", "detail": "backend import failed", "error": _import_error}

    @app.get("/health")
    def _fallback_health():
        return {"status": "error", "detail": "backend import failed", "error": _import_error}

# Aliases Vercel also accepts — all point at the same ASGI app.
application = app
handler = app
