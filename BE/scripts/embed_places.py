"""
Build IndoBERT embeddings for all places and save to BE/eval/embeddings.json + upsert to Supabase if configured.
"""
import json, pathlib, sys
sys.path.insert(0, "BE")
sys.path.insert(0, ".")

from app.services.embed_service import embed_texts, build_place_content
from app.database import fetch_places

places = fetch_places()
print(f"[EMBED] {len(places)} places")

contents = {}
pids = []
texts = []
for p in places:
    pid = p.get("place_id") or p.get("nama")
    content = build_place_content(p)
    contents[pid] = content
    pids.append(pid)
    texts.append(content)

print(f"[EMBED] Embedding {len(texts)} docs with IndoBERT (768-dim) — first run downloads model...")
vecs = embed_texts(texts, batch_size=8)
print(f"[EMBED] Done, sample dim {len(vecs[0]) if vecs else 0}")

emb_dict = {pid: vec for pid, vec in zip(pids, vecs)}

# Save local
out = pathlib.Path("BE/eval/embeddings.json")
out.parent.mkdir(parents=True, exist_ok=True)
out.write_text(json.dumps(emb_dict, indent=2), encoding="utf-8")
alt = pathlib.Path("eval/embeddings.json")
alt.parent.mkdir(parents=True, exist_ok=True)
alt.write_text(json.dumps(emb_dict, indent=2), encoding="utf-8")
print(f"[EMBED] Saved to {out} and {alt}")

# Try Supabase upsert
try:
    from app.config import get_settings
    from supabase import create_client
    settings = get_settings()
    if settings.supabase_configured():
        sb = create_client(settings.supabase_url, settings.supabase_service_key or settings.supabase_anon_key)
        # Need place id uuid mapping: fetch places id from DB
        db_places = sb.table("places").select("id,place_id").execute()
        id_map = {r["place_id"]: r["id"] for r in db_places.data} if db_places.data else {}
        for pid, vec in emb_dict.items():
            # pid is place_id string like 11cs0c_3z7
            db_id = id_map.get(pid)
            if not db_id:
                # fallback: try match by our pid = place_id, if not found skip
                continue
            content = contents[pid]
            row = {"place_id": db_id, "content": content, "embedding": vec, "model": settings.model_name}
            try:
                sb.table("place_embeddings").upsert(row).execute()
                print(f"  upsert embedding for {pid}")
            except Exception as e:
                print(f"  failed {pid}: {e}")
        print("[EMBED] Supabase upsert done")
    else:
        print("[EMBED] Supabase not configured, only local file saved")
except Exception as e:
    print(f"[EMBED] Supabase upsert skip: {e}")

print("[EMBED] All done")
