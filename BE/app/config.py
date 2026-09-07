import os
from functools import lru_cache
try:
    from pydantic_settings import BaseSettings
except ImportError:
    from pydantic import BaseSettings  # type: ignore
from typing import Optional

class Settings(BaseSettings):
    supabase_url: Optional[str] = None
    supabase_service_key: Optional[str] = None
    supabase_anon_key: Optional[str] = None
    model_name: str = "indobenchmark/indobert-base-p1"
    embedding_dim: int = 768
    openai_api_key: Optional[str] = None
    gemini_api_key: Optional[str] = None
    admin_key: str = "changeme"
    data_path: str = "../data/raw/ruangsela_DKI_bulk75_cookie_75.json"
    # allow HF token if private model
    hf_token: Optional[str] = None

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        extra = "ignore"
        # map env names
        fields = {
            "supabase_url": {"env": "SUPABASE_URL"},
            "supabase_service_key": {"env": "SUPABASE_SERVICE_KEY"},
            "supabase_anon_key": {"env": "SUPABASE_ANON_KEY"},
            "openai_api_key": {"env": "OPENAI_API_KEY"},
            "gemini_api_key": {"env": "GEMINI_API_KEY"},
            "hf_token": {"env": "HF_TOKEN"},
            "model_name": {"env": "MODEL_NAME"},
        }

    def supabase_configured(self) -> bool:
        return bool(self.supabase_url and (self.supabase_service_key or self.supabase_anon_key))

@lru_cache
def get_settings() -> Settings:
    # Load .env files explicitly (BE/.env untuk backend, root .env untuk fallback)
    try:
        from dotenv import load_dotenv
        # load tanpa override env yang sudah ada
        load_dotenv("BE/.env", override=False)
        load_dotenv(".env", override=False)
        load_dotenv(".env.example", override=False)
    except:
        pass
    # Fallback untuk Supabase publishable key baru (sb_publishable_...) dan NEXT_PUBLIC_ prefix
    for k in ["SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_URL"]:
        if not os.getenv("SUPABASE_URL") and os.getenv(k):
            os.environ["SUPABASE_URL"] = os.getenv(k)
    for k in ["SUPABASE_ANON_KEY", "NEXT_PUBLIC_SUPABASE_ANON_KEY", "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"]:
        if not os.getenv("SUPABASE_ANON_KEY") and os.getenv(k):
            os.environ["SUPABASE_ANON_KEY"] = os.getenv(k)
    if not os.getenv("SUPABASE_SERVICE_KEY") and os.getenv("SUPABASE_SERVICE_ROLE_KEY"):
        os.environ["SUPABASE_SERVICE_KEY"] = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
    if not os.getenv("OPENAI_API_KEY") and os.getenv("AI_API_KEY"):
        os.environ["OPENAI_API_KEY"] = os.getenv("AI_API_KEY")
    # Gemini fallback: GOOGLE_API_KEY atau GEMINI_API_KEY, juga AQ. prefix dari OPENAI key jika Gemini
    if not os.getenv("GEMINI_API_KEY"):
        for k in ["GOOGLE_API_KEY", "GOOGLE_GENAI_API_KEY"]:
            if os.getenv(k):
                os.environ["GEMINI_API_KEY"] = os.getenv(k)
                break
        # jika OPENAI_API_KEY berisi Gemini key format AQ.
        if not os.getenv("GEMINI_API_KEY") and os.getenv("OPENAI_API_KEY", "").startswith("AQ."):
            os.environ["GEMINI_API_KEY"] = os.getenv("OPENAI_API_KEY")
    # fallback GOOGLE_API_KEY dari GEMINI
    if not os.getenv("GOOGLE_API_KEY") and os.getenv("GEMINI_API_KEY"):
        os.environ["GOOGLE_API_KEY"] = os.getenv("GEMINI_API_KEY")
    return Settings(_env_file=None)
