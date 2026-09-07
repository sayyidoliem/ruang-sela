import pathlib
import json
from fastapi import APIRouter, HTTPException, Depends, Header

from app.config import get_settings
from app.services.embed_service import embed_texts, build_place_content
from app.database import fetch_places

router = APIRouter()

def verify_admin(x_admin_key: str = Header(None)):
    settings = get_settings()
    # if admin_key is default and not set, allow for local dev
    if x_admin_key != settings.admin_key and settings.admin_key != "changeme":
        raise HTTPException(status_code=401, detail="Invalid admin key")
    return True

@router.post("/run", summary="Trigger ETL + embedding rebuild (local)")
def ingest_run(admin_ok: bool = Depends(verify_admin)):
    # For local mode, this just recomputes embeddings and saves to eval/embeddings.json
    places = fetch_places()
    if not places:
        raise HTTPException(status_code=404, detail="No places found, check data file")
    contents = {}
    for p in places:
        pid = p.get("place_id") or p.get("nama")
        contents[pid] = build_place_content(p)
    pids = list(contents.keys())
    texts = list(contents.values())
    vecs = embed_texts(texts, batch_size=8)
    emb_dict = {pid: vec for pid, vec in zip(pids, vecs)}
    out_path = pathlib.Path("BE/eval/embeddings.json")
    alt = pathlib.Path("eval/embeddings.json")
    # ensure BE/eval exists
    out_path.parent.mkdir(parents=True, exist_ok=True)
    try:
        out_path.write_text(json.dumps(emb_dict, indent=2), encoding="utf-8")
        alt.parent.mkdir(parents=True, exist_ok=True)
        alt.write_text(json.dumps(emb_dict, indent=2), encoding="utf-8")
    except Exception as e:
        return {"status": "embeddings computed but save failed", "error": str(e), "count": len(emb_dict)}
    return {"status": "ok", "count": len(emb_dict), "saved_to": str(out_path), "dim": len(next(iter(emb_dict.values()))) if emb_dict else 0}

@router.post("/embeddings/rebuild", summary="Rebuild embeddings only")
def rebuild_embeddings(admin_ok: bool = Depends(verify_admin)):
    return ingest_run(admin_ok)

@router.get("/preview", summary="Preview content template for one place")
def preview_content(limit: int = 1):
    places = fetch_places()
    if not places:
        return {"error": "no data"}
    p = places[0]
    content = build_place_content(p)
    return {"place": p.get("nama"), "place_id": p.get("place_id"), "content": content, "content_len": len(content)}
