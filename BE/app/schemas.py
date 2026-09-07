from pydantic import BaseModel, Field
from typing import Optional, List, Any, Dict
import re

class SearchRequestFileContent(BaseModel):
    """Isi JSON file yang diupload. Wajib ada data_text (string)."""
    data_text: str = Field(..., description="Query natural language, cth: ruangan yang memiliki AC dan juga parkir tempat lega dan kosong pada jam 12")
    # optional extras yang boleh ada di file JSON
    top_k: Optional[int] = Field(default=None, ge=1, le=50)
    mode: Optional[str] = Field(default=None, description="hybrid|vector|relational")
    lat: Optional[float] = None
    lng: Optional[float] = None
    radius_m: Optional[int] = None
    hour: Optional[int] = Field(default=None, ge=0, le=23)

    def auto_parse_hour(self) -> Optional[int]:
        """Auto parse jam dari data_text jika hour tidak eksplisit."""
        if self.hour is not None:
            return self.hour
        text = self.data_text.lower()
        # patterns: jam 12, jam12, pukul 12, jam 12.00, jam 12:00
        m = re.search(r"(?:jam|pukul)\s*(\d{1,2})(?:[:\.]\d{0,2})?", text)
        if m:
            try:
                h = int(m.group(1))
                if 0 <= h <= 23:
                    return h
            except:
                pass
        # fallback "jam 12" bare
        m2 = re.search(r"\b(\d{1,2})\s*(?:00|jam)?\b", text)
        # only if text contains "kosong" or "ramai" heuristic? use m above only
        return None

class PlaceCard(BaseModel):
    id: Optional[str] = None
    place_id: Optional[str] = None
    nama: str
    kategori: Optional[str] = None
    alamat: Optional[str] = None
    lat: Optional[float] = None
    lng: Optional[float] = None
    rating: Optional[float] = None
    jumlah_review: Optional[int] = None
    fasilitas: List[str] = []
    jam_operasional_raw: Optional[str] = None
    foto_urls: List[str] = []
    # scoring
    sim_score: float = 0.0
    facility_bonus: float = 0.0
    busy_bonus: float = 0.0
    geo_bonus: float = 0.0
    final_score: float = 0.0
    busy_percent_at_hour: Optional[int] = None
    distance_km: Optional[float] = None
    evidence: Dict[str, Any] = {}
    content: Optional[str] = None

class SearchResponse(BaseModel):
    query: str
    parsed_hour: Optional[int] = None
    mode: str = "hybrid"
    top_k: int = 10
    took_ms: int = 0
    results: List[PlaceCard] = []
    debug: Dict[str, Any] = {}

class HealthResponse(BaseModel):
    status: str
    model_loaded: bool
    model_name: str
    supabase_configured: bool
    places_count: Optional[int] = None
    embedding_dim: int = 768

# New schemas for role-based routing
class ProfileResponse(BaseModel):
    id: str
    email: Optional[str] = None
    role: str
    preferences: Dict[str, Any] = {}
    created_at: Optional[str] = None

class ProfileUpdateRequest(BaseModel):
    preferences: Dict[str, Any]

class CreateLocationRequest(BaseModel):
    nama: str = Field(..., min_length=3)
    kategori: Optional[str] = None
    alamat: Optional[str] = None
    lat: float
    lng: float
    fasilitas: List[str] = []
    jam_operasional_raw: Optional[str] = None
    deskripsi: Optional[str] = None
    harga_text: Optional[str] = None
    foto_urls: List[str] = []

class VerifyLocationRequest(BaseModel):
    location_id: str = Field(..., description="place_id")
    action: str = Field(..., description="accept|reject", pattern="^(accept|reject)$")
    reason: Optional[str] = None

class RecommendationsQuery(BaseModel):
    limit: int = Field(default=10, ge=1, le=20)
    min_sim: float = Field(default=0.60, ge=0.0, le=1.0)
    lat: Optional[float] = None
    lng: Optional[float] = None
    radius_m: Optional[int] = Field(default=None, ge=100, le=50000)

class SearchJsonBody(BaseModel):
    data_text: str = Field(..., description="Query natural language")
    top_k: Optional[int] = Field(default=None, ge=1, le=50)
    lat: Optional[float] = None
    lng: Optional[float] = None
    radius_m: Optional[int] = None
    hour: Optional[int] = Field(default=None, ge=0, le=23)
    mode: Optional[str] = Field(default=None, description="hybrid|vector|relational")

    def auto_parse_hour(self) -> Optional[int]:
        if self.hour is not None:
            return self.hour
        m = re.search(r"(?:jam|pukul)\s*(\d{1,2})(?:[:\.]\d{0,2})?", self.data_text.lower())
        if m:
            try:
                h = int(m.group(1))
                if 0 <= h <= 23:
                    return h
            except:
                pass
        return None
