import re
import json
import pathlib
from typing import List, Dict, Any

def clean_icon(text: str) -> str:
    if not text:
        return text
    text = re.sub(r"[\ue000-\uf8ff\ue5cc\ue5cd\ue0c8]", "", text)
    text = re.sub(r"\n\s*\n", "\n", text)
    return text.strip()

def parse_busy_hours(popular_times: str) -> List[Dict[str, Any]]:
    """Parse '31% ramai pada pukul 12.00' -> list of {hour, busy_percent} for all days? raw only contains per day chunk but we parse all."""
    if not popular_times:
        return []
    results = []
    for m in re.finditer(r"(\d+)%\s*ramai\s*pada\s*pukul\s*(\d+)", popular_times):
        try:
            pct = int(m.group(1))
            hr = int(m.group(2))
            if 0 <= hr <= 23:
                results.append({"hour": hr, "busy_percent": pct})
        except:
            continue
    return results

def filter_generic_facilities(fasilitas: List[str]) -> List[str]:
    generic = {"Restoran", "Bar"}
    return [f for f in fasilitas if f not in generic]

def dedup_reviews(reviews: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    seen = set()
    out = []
    for r in reviews:
        t = (r.get("text") or "").strip()
        if not t or t in seen:
            continue
        seen.add(t)
        out.append(r)
    return out
