from fastapi import APIRouter
from app.schemas import HealthResponse
from app.config import get_settings
from app.services.embed_service import is_model_loaded, load_model
from app.database import count_places

router = APIRouter()

@router.get("", response_model=HealthResponse)
@router.get("/", response_model=HealthResponse)
def health_check():
    settings = get_settings()
    # lazy load attempt
    # don't auto load heavy model on health unless already loaded
    return HealthResponse(
        status="ok",
        model_loaded=is_model_loaded(),
        model_name=settings.model_name,
        supabase_configured=settings.supabase_configured(),
        places_count=count_places(),
        embedding_dim=settings.embedding_dim,
    )

@router.get("/ready", response_model=HealthResponse)
def ready_check():
    settings = get_settings()
    # try load model on ready
    load_model()
    return HealthResponse(
        status="ok" if is_model_loaded() else "model_not_loaded",
        model_loaded=is_model_loaded(),
        model_name=settings.model_name,
        supabase_configured=settings.supabase_configured(),
        places_count=count_places(),
        embedding_dim=settings.embedding_dim,
    )
