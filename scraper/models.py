from dataclasses import dataclass, field, asdict
from typing import Optional, List, Dict, Any

@dataclass
class Place:
    keyword: str = ""
    nama: Optional[str] = None
    kategori: Optional[str] = None
    kategori_list: List[str] = field(default_factory=list)
    alamat: Optional[str] = None
    alamat_lengkap: Optional[str] = None
    plus_code: Optional[str] = None
    lat: Optional[float] = None
    lng: Optional[float] = None
    place_id: Optional[str] = None
    cid: Optional[str] = None
    url_google_maps: Optional[str] = None
    rating: Optional[float] = None
    jumlah_review: Optional[int] = None
    jam_operasional: Dict[str, str] = field(default_factory=dict)
    jam_operasional_raw: Optional[str] = None
    status_buka: Optional[str] = None
    popular_times: Optional[str] = None
    telepon: Optional[str] = None
    website: Optional[str] = None
    price_level: Optional[str] = None
    price_range: Optional[str] = None
    harga_text: Optional[str] = None
    foto_urls: List[str] = field(default_factory=list)
    reviews: List[Dict[str, Any]] = field(default_factory=list)
    fasilitas: List[str] = field(default_factory=list)
    attributes: Dict[str, Any] = field(default_factory=dict)
    deskripsi: Optional[str] = None
    jam_ramai: Optional[str] = None
    # metadata
    scraped_at: Optional[str] = None

    def to_dict(self):
        return asdict(self)
