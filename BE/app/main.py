from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import health, search, places, ingest, recommendations, locations, profile, location_mutation, admin
from app.config import get_settings

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Load IndoBERT lazily — don't block startup if model not cached
    # Attempt load in background
    try:
        from app.services.embed_service import load_model
        # non-blocking try
        load_model()
    except Exception as e:
        print(f"[LIFESPAN] model load skip: {e}")
    yield

def create_app() -> FastAPI:
    settings = get_settings()
    app = FastAPI(
        title="RuangSela Hybrid Search — Supabase + IndoBERT",
        version="0.1.0",
        description="Rekomendasi ruang: Supabase relational + pgvector IndoBERT (indobenchmark/indobert-base-p1) hybrid soft-filter + geo. POST /search terima file JSON dengan data_text.",
        lifespan=lifespan,
    )
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    app.include_router(health.router, prefix="/health", tags=["health"])
    app.include_router(search.router, prefix="/search", tags=["search"])
    app.include_router(places.router, prefix="/places", tags=["places"])  # legacy
    app.include_router(ingest.router, prefix="/ingest", tags=["ingest"])
    # New spec routing
    app.include_router(recommendations.router, prefix="/recommendations", tags=["recommendations"])
    app.include_router(locations.router, prefix="/locations", tags=["locations"])
    app.include_router(locations.router, prefix="/location", tags=["locations"])  # singular alias for GET /location/:id
    app.include_router(profile.router, prefix="/profile", tags=["profile"])
    app.include_router(location_mutation.router, prefix="/location", tags=["location"])
    app.include_router(admin.router, prefix="/admin", tags=["admin"])

    @app.get("/", tags=["root"])
    def root():
        return {
            "status": "ok",
            "docs": "/docs",
            "search_primary": "POST /search/json (JSON body {data_text} + LLM, Supabase JWT)",
            "search_file_legacy": "POST /search/file or POST /search (multipart)",
            "health": "GET /health",
            "recommendations": "GET /recommendations?limit=10&min_sim=0.60 (min 5 similar)",
            "locations": "GET /locations (USER published, ADMIN all)",
            "location_detail": "GET /location/{id} (USER published only)",
            "location_create": "POST /location",
            "profile": "GET /profile",
            "admin": "POST /admin/verifyLocation, DELETE /admin/deleteLocation/{id}",
            "legacy_places": "GET /places",
            "model": settings.model_name,
        }

    return app

app = create_app()
