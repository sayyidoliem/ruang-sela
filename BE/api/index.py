"""
Vercel entry for FastAPI BE (Root Directory = "BE").

Vercel's `@vercel/python` runtime expects a top-level `handler(event, context)`
callable. FastAPI is ASGI, so we wrap the app with Mangum, which translates
API Gateway / Vercel function payloads into ASGI requests.
"""
from mangum import Mangum

from app.main import app as _fastapi_app

app = _fastapi_app
application = app
handler = Mangum(app)
