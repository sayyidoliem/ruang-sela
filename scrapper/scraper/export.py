import json
import csv
import os
from datetime import datetime
import pandas as pd
from typing import List
from .models import Place

def ensure_dir(path: str):
    os.makedirs(path, exist_ok=True)

def export_places(places: List[Place], output_dir: str = "data/raw", prefix: str = "ruangsela_jakbar_sample5"):
    ensure_dir(output_dir)
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    json_path = os.path.join(output_dir, f"{prefix}_{timestamp}.json")
    csv_path = os.path.join(output_dir, f"{prefix}_{timestamp}.csv")

    dicts = [p.to_dict() for p in places]

    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(dicts, f, ensure_ascii=False, indent=2)

    # Flatten untuk CSV
    flattened = []
    for d in dicts:
        row = {}
        row["keyword"] = d.get("keyword")
        row["nama"] = d.get("nama")
        row["kategori"] = d.get("kategori")
        row["kategori_list"] = ", ".join(d.get("kategori_list") or [])
        row["alamat"] = d.get("alamat")
        row["lat"] = d.get("lat")
        row["lng"] = d.get("lng")
        row["rating"] = d.get("rating")
        row["jumlah_review"] = d.get("jumlah_review")
        row["status_buka"] = d.get("status_buka")
        row["jam_operasional_raw"] = d.get("jam_operasional_raw")
        # expand jam operasional per hari
        jam = d.get("jam_operasional") or {}
        for hari in ["Senin","Selasa","Rabu","Kamis","Jumat","Sabtu","Minggu"]:
            row[f"jam_{hari}"] = jam.get(hari, "")
        row["telepon"] = d.get("telepon")
        row["website"] = d.get("website")
        row["price_level"] = d.get("price_level")
        row["price_range"] = d.get("price_range")
        row["harga_text"] = d.get("harga_text")
        row["url_google_maps"] = d.get("url_google_maps")
        row["foto_count"] = len(d.get("foto_urls") or [])
        row["foto_urls"] = " | ".join((d.get("foto_urls") or [])[:3])
        row["fasilitas"] = ", ".join(d.get("fasilitas") or [])
        row["plus_code"] = d.get("plus_code")
        row["deskripsi"] = (d.get("deskripsi") or "")[:500]
        row["reviews_count_collected"] = len(d.get("reviews") or [])
        row["scraped_at"] = d.get("scraped_at")
        flattened.append(row)

    df = pd.DataFrame(flattened)
    df.to_csv(csv_path, index=False, encoding="utf-8-sig")

    print(f"[EXPORT] JSON: {json_path} ({len(dicts)} records)")
    print(f"[EXPORT] CSV : {csv_path}")
    return json_path, csv_path
