"""
Eval LLM-as-judge: compare relational vs vector vs hybrid using OpenAI.
"""
import json, pathlib, sys, time, os
sys.path.insert(0, "BE")
sys.path.insert(0, ".")

# Use local hybrid_search for offline without OpenAI if needed
from app.services.search_service import hybrid_search

queries = [
    "ruangan yang memiliki AC dan juga parkir tempat lega dan kosong pada jam 12",
    "aula murah kapasitas besar untuk pernikahan 200 orang",
    "taman yang sepi pagi untuk komunitas lari",
    "co-working space ada wifi kencang dan toilet bersih",
    "tempat 24 jam yang buka minggu",
    "lapangan futsal dengan parkir luas dan rating tinggi",
    "ruang komunitas ada AC dan akses kursi roda",
    "balai warga dekat Jakarta Barat dengan harga terjangkau",
    "gedung serbaguna yang tidak ramai di siang hari",
    "taman bermain anak dengan toilet dan musholla",
]

# Try LLM judge if OPENAI key set
try:
    from openai import OpenAI
    has_openai = bool(os.getenv("OPENAI_API_KEY") or pathlib.Path("BE/.env").read_text().find("OPENAI_API_KEY") != -1)
except:
    has_openai = False

def llm_score(query, place, api_key=None):
    # fallback heuristic if no OpenAI
    if not api_key:
        # simple heuristic: if query tokens in place fasilitas/content, score 2 else 1
        import re
        qlow = query.lower()
        fac = " ".join(place.get("fasilitas") or []).lower()
        score = 1
        if "ac" in qlow and "ac" in fac:
            score += 1
        if "parkir" in qlow and "parkir" in fac:
            score += 1
        return min(3, score), "heuristic"

    client = OpenAI(api_key=api_key)
    prompt = f"""Kamu adalah judge. Query: "{query}". Tempat: Nama={place.get('nama')}, Kategori={place.get('kategori')}, Fasilitas={place.get('fasilitas')}, Jam Ramai={place.get('popular_times') or place.get('jam_ramai') or '-'}, Ulasan ringkas={(place.get('reviews') or [{}])[0].get('text','')[:400] if place.get('reviews') else '-'}
Skor 0-3: 0 tidak relevan, 1 sedikit, 2 relevan, 3 sangat relevan. Jelaskan alasan singkat. Return JSON {{"score": int, "reason": str}}"""
    try:
        resp = client.chat.completions.create(model="gpt-4o-mini", messages=[{"role":"user","content":prompt}], response_format={"type":"json_object"}, max_tokens=120)
        txt = resp.choices[0].message.content
        data = json.loads(txt)
        return int(data.get("score",1)), data.get("reason","")
    except Exception as e:
        return 1, f"llm error {e}"

def eval_one(query, mode):
    results = hybrid_search(query_text=query, top_k=10, mode=mode)
    # score via heuristic or LLM
    api_key = os.getenv("OPENAI_API_KEY")
    # try read BE/.env
    if not api_key and pathlib.Path("BE/.env").exists():
        for line in pathlib.Path("BE/.env").read_text().splitlines():
            if line.startswith("OPENAI_API_KEY="):
                api_key = line.split("=",1)[1].strip()
    scored = []
    for r in results:
        score, reason = llm_score(query, r["place"], api_key if has_openai else None)
        scored.append({"nama": r["place"].get("nama"), "final": round(r["final"],3), "sim": round(r["sim"],3), "llm_score": score, "reason": reason})
    return scored

for q in queries[:3]:
    print(f"\n=== Query: {q} ===")
    for mode in ["relational","vector","hybrid"]:
        res = eval_one(q, mode)
        avg = sum(x["llm_score"] for x in res[:5])/5 if res else 0
        print(f"  {mode}: avg llm_score@5={avg:.2f} top1={res[0]['nama'][:30] if res else '-'} ({res[0]['llm_score'] if res else '-'})")

print("\n[EVAL] Done. For full report, integrate with eval/report.md")
