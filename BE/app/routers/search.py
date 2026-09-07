import json
import time
import re
from typing import Optional

from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Query, Depends

from app.schemas import SearchRequestFileContent, SearchJsonBody, SearchResponse, PlaceCard
from app.services.search_service import hybrid_search
from app.services.llm_service import llm_expand_query
from app.middleware.auth import get_current_user

router = APIRouter()

def parse_hour_from_text(text: str) -> Optional[int]:
    if not text:
        return None
    m = re.search(r"(?:jam|pukul)\s*(\d{1,2})(?:[:\.]\d{0,2})?", text.lower())
    if m:
        try:
            h = int(m.group(1))
            if 0 <= h <= 23:
                return h
        except:
            pass
    return None

def build_place_cards(results, query_text: str) -> list:
    cards = []
    for r in results:
        p = r["place"]
        cards.append(PlaceCard(
            id=str(p.get("place_id") or p.get("nama")),
            place_id=p.get("place_id"),
            nama=p.get("nama") or "-",
            kategori=p.get("kategori"),
            alamat=p.get("alamat_lengkap") or p.get("alamat"),
            lat=p.get("lat"),
            lng=p.get("lng"),
            rating=p.get("rating"),
            jumlah_review=p.get("jumlah_review"),
            fasilitas=p.get("fasilitas") or [],
            jam_operasional_raw=p.get("jam_operasional_raw"),
            foto_urls=(p.get("foto_urls") or [])[:3],
            sim_score=round(r["sim"], 4),
            facility_bonus=round(r["facility_bonus"], 4),
            busy_bonus=round(r["busy_bonus"], 4),
            geo_bonus=round(r["geo_bonus"], 4),
            final_score=round(r["final"], 4),
            busy_percent_at_hour=r["busy_pct"],
            distance_km=round(r["distance_km"], 2) if r["distance_km"] is not None else None,
            evidence=r["evidence"],
            content=r["content"][:800] if r.get("content") else None,
        ))
    return cards

@router.post("/file", response_model=SearchResponse, summary="POST /search/file - file JSON dengan data_text (legacy)")
async def search_via_file_legacy(
    file: UploadFile = File(..., description="File JSON berisikan {data_text: string, optional: top_k, mode, lat, lng, radius_m, hour}"),
    top_k: Optional[int] = Form(None),
    mode: Optional[str] = Form(None),
    user: dict = Depends(get_current_user),
):

    # delegate to shared logic but keep for backward compat
    return await _search_file_impl(file, top_k, mode, user)

# Keep POST /search without suffix as file upload for backward compat (deprecated, use /file or /json)
@router.post("", response_model=SearchResponse, summary="POST /search - terima file JSON dengan data_text (legacy, use /json for JSON body)")
@router.post("/", response_model=SearchResponse, include_in_schema=False)
async def search_via_file(
    file: UploadFile = File(..., description="File JSON berisikan {data_text: string, optional: top_k, mode, lat, lng, radius_m, hour}"),
    top_k: Optional[int] = Form(None),
    mode: Optional[str] = Form(None),
    user: dict = Depends(get_current_user),
):
    """
    **POST /search** — Menerima **file JSON** (multipart/form-data) yang wajib mengandung `data_text` string.
    
    Auto-parse:
    - `data_text` -> query utama (wajib)
    - `hour` auto extract dari `data_text` jika mengandung `jam 12` / `pukul 12` (regex)
    - `lat/lng/radius_m` jika ada di file JSON
    - fallback Form fields `top_k`, `mode` jika tidak ada di file

    Contoh file `query.json`:
    ```json
    {"data_text": "ruangan yang memiliki AC dan juga parkir tempat lega dan kosong pada jam 12"}
    ```
    """
    return await _search_file_impl(file, top_k, mode, user)

async def _search_file_impl(file: UploadFile, top_k: Optional[int], mode: Optional[str], user: dict):
    start = time.time()
    # Read file
    try:
        raw_bytes = await file.read()
        if not raw_bytes:
            raise HTTPException(status_code=400, detail="File kosong")
        raw_str = raw_bytes.decode("utf-8")
        data = json.loads(raw_str)
    except json.JSONDecodeError as e:
        raise HTTPException(status_code=400, detail=f"File bukan JSON valid: {e}")
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Gagal baca file: {e}")

    if not isinstance(data, dict):
        raise HTTPException(status_code=400, detail="JSON harus object dengan key data_text")
    data_text = data.get("data_text") or data.get("dataText") or data.get("query") or data.get("text")
    if not data_text or not isinstance(data_text, str):
        raise HTTPException(status_code=400, detail="Field 'data_text' wajib ada dan bertipe string")

    try:
        req = SearchRequestFileContent(
            data_text=data_text,
            top_k=data.get("top_k") if data.get("top_k") is not None else top_k,
            mode=data.get("mode") if data.get("mode") is not None else mode,
            lat=data.get("lat"),
            lng=data.get("lng"),
            radius_m=data.get("radius_m"),
            hour=data.get("hour"),
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Validasi gagal: {e}")

    final_top_k = req.top_k or top_k or 10
    final_top_k = max(1, min(50, final_top_k))
    final_mode = (req.mode or mode or "hybrid").lower()
    if final_mode not in ("hybrid", "vector", "relational"):
        final_mode = "hybrid"

    target_hour = req.auto_parse_hour()
    # LLM expansion
    intent = llm_expand_query(req.data_text, profile=user)
    query_for_search = intent.get("expanded_query") or req.data_text
    if target_hour is None and intent.get("hour") is not None:
        target_hour = intent["hour"]

    results = hybrid_search(
        query_text=query_for_search,
        top_k=final_top_k,
        mode=final_mode,
        target_hour=target_hour,
        user_lat=req.lat,
        user_lng=req.lng,
        radius_m=req.radius_m,
    )
    cards = build_place_cards(results, req.data_text)
    took_ms = int((time.time() - start) * 1000)
    return SearchResponse(
        query=req.data_text,
        parsed_hour=target_hour,
        mode=final_mode,
        top_k=final_top_k,
        took_ms=took_ms,
        results=cards,
        debug={
            "file_name": file.filename,
            "query_lower": req.data_text.lower()[:200],
            "auto_parsed_hour": target_hour,
            "geo": {"lat": req.lat, "lng": req.lng, "radius_m": req.radius_m} if req.lat else None,
            "llm_intent": intent,
            "query_for_search": query_for_search,
            "user_role": user.get("role"),
        },
    )

# JSON body primary — Supabase JWT + LLM processing
@router.post("/json", response_model=SearchResponse, summary="POST /search/json - JSON body + LLM")
def search_via_json(body: SearchJsonBody, user: dict = Depends(get_current_user)):
    start = time.time()
    final_top_k = body.top_k or 10
    final_mode = (body.mode or "hybrid").lower()
    if final_mode not in ("hybrid", "vector", "relational"):
        final_mode = "hybrid"
    target_hour = body.auto_parse_hour()
    # LLM expansion
    intent = llm_expand_query(body.data_text, profile=user)
    # Use expanded query for embedding but keep original for display
    query_for_search = intent.get("expanded_query") or body.data_text
    # Override hour from LLM if not parsed
    if target_hour is None and intent.get("hour") is not None:
        target_hour = intent["hour"]
    results = hybrid_search(
        query_text=query_for_search,
        top_k=final_top_k,
        mode=final_mode,
        target_hour=target_hour,
        user_lat=body.lat,
        user_lng=body.lng,
        radius_m=body.radius_m,
    )
    cards = build_place_cards(results, body.data_text)
    took_ms = int((time.time() - start) * 1000)
    return SearchResponse(
        query=body.data_text,
        parsed_hour=target_hour,
        mode=final_mode,
        top_k=final_top_k,
        took_ms=took_ms,
        results=cards,
        debug={"auto_parsed_hour": target_hour, "llm_intent": intent, "query_for_search": query_for_search, "user_role": user.get("role")},
    )

@router.post("/llm", response_model=SearchResponse, summary="POST /search primary JSON + LLM (alias)")
def search_primary(body: SearchJsonBody, user: dict = Depends(get_current_user)):
    return search_via_json(body, user)

@router.get("/test", response_model=SearchResponse, summary="GET /search/test?q=... quick test")
def search_test(
    q: str = Query(..., alias="q", description="Query text, cth: ruangan AC parkir lega kosong jam 12"),
    top_k: int = Query(10, ge=1, le=50),
    mode: str = Query("hybrid"),
    lat: Optional[float] = Query(None),
    lng: Optional[float] = Query(None),
    radius_m: Optional[int] = Query(None),
):
    start = time.time()
    tmp = SearchRequestFileContent(data_text=q, top_k=top_k, mode=mode, lat=lat, lng=lng, radius_m=radius_m)
    target_hour = tmp.auto_parse_hour()
    results = hybrid_search(query_text=q, top_k=top_k, mode=mode.lower(), target_hour=target_hour, user_lat=lat, user_lng=lng, radius_m=radius_m)
    cards = build_place_cards(results, q)
    took_ms = int((time.time() - start) * 1000)
    return SearchResponse(query=q, parsed_hour=target_hour, mode=mode, top_k=top_k, took_ms=took_ms, results=cards, debug={"auto_parsed_hour": target_hour})

@router.get("/debug/parse", summary="Debug auto parse jam dari text")
def debug_parse(q: str = Query(...)):
    tmp = SearchRequestFileContent(data_text=q)
    return {"query": q, "parsed_hour": tmp.auto_parse_hour(), "lower": q.lower()}
