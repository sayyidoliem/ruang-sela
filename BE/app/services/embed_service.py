"""
IndoBERT Embedding Service — native Indo support.
Model: indobenchmark/indobert-base-p1 (768-dim) dengan mean pooling + L2 normalize.
Fallback: TF-IDF/hash dummy jika torch/transformers tidak tersedia (untuk testing tanpa GPU).
"""
import re
import hashlib
import math
from typing import List, Optional
from functools import lru_cache

from app.config import get_settings

# numpy is optional on Vercel (kept out to stay under the 250MB serverless
# limit). When absent, dummy_embedding/cosine_sim fall back to pure-Python.
try:
    import numpy as np
    HAS_NUMPY = True
except ImportError:
    HAS_NUMPY = False

# Force calling API for vector - transformers + torch wajib, no dummy fallback
try:
    from transformers import BertTokenizer, AutoModel
    import torch
    HAS_TRANSFORMERS = True
except ImportError as e:
    HAS_TRANSFORMERS = False
    _IMPORT_ERROR = str(e)

_tokenizer = None
_model = None
_model_loaded = False
_model_name_loaded = None

def _clean_text(text: str) -> str:
    if not text:
        return ""
    # reuse clean_icon logic from scraper/detail.py:18 but simple
    text = re.sub(r"[\ue000-\uf8ff\ue5cc\ue5cd\ue0c8]", "", text)
    text = re.sub(r"\n\s*\n", "\n", text)
    return text.strip()

def load_model():
    global _tokenizer, _model, _model_loaded, _model_name_loaded
    if _model_loaded:
        return True
    settings = get_settings()
    model_name = settings.model_name
    if not HAS_TRANSFORMERS:
        raise RuntimeError(f"[EMBED] transformers/torch not installed: {_IMPORT_ERROR} - vector DB calling API wajib")
    try:
        print(f"[EMBED] Loading IndoBERT: {model_name} with BertTokenizer + AutoModel")
        # Sesuai instruksi: BertTokenizer + AutoModel dari indobenchmark/indobert-base-p1
        _tokenizer = BertTokenizer.from_pretrained(model_name, trust_remote_code=True, **({"token": settings.hf_token} if settings.hf_token else {}))
        _model = AutoModel.from_pretrained(model_name, trust_remote_code=True, **({"token": settings.hf_token} if settings.hf_token else {}))
        _model.eval()
        if torch.cuda.is_available():
            _model = _model.cuda()
        _model_loaded = True
        _model_name_loaded = model_name
        print(f"[EMBED] Loaded {model_name} dim={settings.embedding_dim} (BertTokenizer)")
        return True
    except Exception as e:
        _model_loaded = False
        raise RuntimeError(f"[EMBED] Failed to load {model_name} via BertTokenizer/AutoModel: {e} - vector calling API wajib, tidak ada fallback")

def is_model_loaded() -> bool:
    return _model_loaded

def mean_pooling(last_hidden_state, attention_mask):
    # last_hidden: [batch, seq, hidden]
    mask_expanded = attention_mask.unsqueeze(-1).expand(last_hidden_state.size()).float()
    sum_hidden = (last_hidden_state * mask_expanded).sum(dim=1)
    sum_mask = mask_expanded.sum(dim=1).clamp(min=1e-9)
    return sum_hidden / sum_mask

def embed_texts(texts: List[str], batch_size: int = 8) -> List[List[float]]:
    """Embed list of texts -> list of vectors (768). Wajib calling API Supabase Vector + IndoBERT, no fallback."""
    settings = get_settings()
    dim = settings.embedding_dim
    if not texts:
        return []

    # Wajib model - tidak ada fallback dummy
    if not HAS_TRANSFORMERS:
        raise RuntimeError(f"[EMBED] transformers/torch not installed - vector DB wajib: {_IMPORT_ERROR}")
    # ensure model loaded (akan raise jika gagal)
    if not _model_loaded:
        load_model()

    import torch
    vectors = []
    _model.eval()
    with torch.no_grad():
        for i in range(0, len(texts), batch_size):
            batch = [_clean_text(t) for t in texts[i:i+batch_size]]
            encoded = _tokenizer(batch, padding=True, truncation=True, max_length=512, return_tensors="pt")
            if torch.cuda.is_available():
                encoded = {k: v.cuda() for k, v in encoded.items()}
            outputs = _model(**encoded)
            pooled = mean_pooling(outputs.last_hidden_state, encoded["attention_mask"])
            pooled = torch.nn.functional.normalize(pooled, p=2, dim=1)
            for vec in pooled.cpu().numpy():
                vectors.append(vec.tolist())
    return vectors

def embed_query(text: str) -> List[float]:
    return embed_texts([text])[0]

def dummy_embedding(text: str, dim: int = 768) -> List[float]:
    """Deterministic pseudo-embedding from hash — fallback when model unavailable."""
    # Use TF-style: hash tokens
    text = _clean_text(text.lower())
    tokens = re.findall(r"\w+", text)
    if HAS_NUMPY:
        vec = np.zeros(dim, dtype=np.float32)
    else:
        vec = [0.0] * dim
    for tok in tokens:
        h = int(hashlib.md5(tok.encode()).hexdigest(), 16)
        idx = h % dim
        # sign based on hash
        sign = 1 if (h >> 16) % 2 == 0 else -1
        vec[idx] += sign * (1.0 + math.log1p(len(tok)))
    # add char ngram for robustness
    for i in range(len(text)-2):
        tri = text[i:i+3]
        h = int(hashlib.md5(tri.encode()).hexdigest(), 16)
        idx = h % dim
        vec[idx] += 0.3
    # L2 normalize
    if HAS_NUMPY:
        norm = float(np.linalg.norm(vec))
        if norm > 0:
            vec = (vec / norm).tolist()
        else:
            vec = vec.tolist()
    else:
        norm = math.sqrt(sum(x * x for x in vec))
        if norm > 0:
            vec = [x / norm for x in vec]
    return vec

def cosine_sim(a: List[float], b: List[float]) -> float:
    if HAS_NUMPY:
        av = np.array(a, dtype=np.float32)
        bv = np.array(b, dtype=np.float32)
        denom = (np.linalg.norm(av) * np.linalg.norm(bv))
        if denom == 0:
            return 0.0
        return float(np.dot(av, bv) / denom)
    # pure-Python fallback
    if len(a) != len(b):
        return 0.0
    dot = sum(x * y for x, y in zip(a, b))
    na = math.sqrt(sum(x * x for x in a))
    nb = math.sqrt(sum(y * y for y in b))
    denom = na * nb
    if denom == 0:
        return 0.0
    return dot / denom

# Build content template for a place (used for embedding doc)
def build_place_content(place: dict) -> str:
    """Build semantic doc string for IndoBERT — Bahasa Indonesia."""
    def get(k, d=""):
        return place.get(k) or d

    nama = get("nama", "")
    kategori = get("kategori", "")
    alamat = get("alamat_lengkap") or get("alamat") or ""
    fasilitas = place.get("fasilitas") or []
    # filter generic Restoran/Bar noise (75/75) — keep if explicitly queried but de-boost in content
    generic = {"Restoran", "Bar"}
    fasilitas_pos = [f for f in fasilitas if f not in generic and not f.lower().startswith("tidak memiliki")]
    fasilitas_str = ", ".join(fasilitas_pos) if fasilitas_pos else "-"

    jam_raw = get("jam_operasional_raw", "") or ""
    # clean jam delimiter artefak
    jam_raw = jam_raw.replace("�", "–").replace("\n", " | ")

    harga = get("harga_text") or get("price_level") or "-"

    popular = get("popular_times") or get("jam_ramai") or ""
    # truncate popular to 400 chars
    if popular and len(popular) > 600:
        popular = popular[:600]
    if not popular:
        popular = "-"

    reviews = place.get("reviews") or []
    # dedup + truncate 2 reviews
    seen = set()
    rev_texts = []
    for r in reviews[:3]:
        t = (r.get("text") or "").strip()
        if not t or t in seen:
            continue
        seen.add(t)
        # clean icon
        t = _clean_text(t)
        # truncate 300
        if len(t) > 300:
            t = t[:300]
        rev_texts.append(t)
    rev_str = " | ".join(rev_texts) if rev_texts else "-"

    deskripsi = _clean_text(get("deskripsi", ""))[:400] if get("deskripsi") else "-"

    # analytics
    attrs = place.get("attributes") or {}
    total_hours = attrs.get("analytics_total_open_hours_per_week", "")
    is24 = "24 jam" if attrs.get("analytics_is_24h") else ""

    content = (
        f"Nama: {nama}\n"
        f"Kategori: {kategori}\n"
        f"Alamat: {alamat}\n"
        f"Fasilitas: {fasilitas_str}\n"
        f"Jam operasional: {jam_raw} {is24} (total {total_hours} jam/minggu)\n"
        f"Keramaian: {popular}\n"
        f"Harga: {harga}\n"
        f"Deskripsi: {deskripsi}\n"
        f"Ulasan: {rev_str}"
    )
    return content
