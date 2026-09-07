"""Analytics essentials for RuangSela decision making"""
import json, pathlib, pandas as pd

ESSENTIAL_FIELDS = [
    "keyword","nama","kategori","alamat","lat","lng","rating","jumlah_review",
    "jam_operasional_raw","status_buka","telepon","website","price_level","harga_text",
    "fasilitas","popular_times","jam_ramai",
    "analytics_total_open_hours_per_week","analytics_is_24h","analytics_has_weekend",
    "analytics_jam_lengkap","analytics_facility_score","analytics_facility_count",
    "has_busy_hours","place_id","url_google_maps"
]

def to_analytics_df(json_path: str) -> pd.DataFrame:
    data=json.loads(pathlib.Path(json_path).read_text(encoding="utf-8"))
    rows=[]
    for d in data:
        attr=d.get("attributes",{})
        rows.append({
            "keyword":d.get("keyword"),
            "nama":d.get("nama"),
            "kategori":d.get("kategori"),
            "alamat":d.get("alamat"),
            "lat":d.get("lat"),
            "lng":d.get("lng"),
            "rating":d.get("rating"),
            "jumlah_review":d.get("jumlah_review"),
            "jam_operasional_raw":d.get("jam_operasional_raw"),
            "status_buka":d.get("status_buka"),
            "telepon":d.get("telepon"),
            "website":d.get("website"),
            "price_level":d.get("price_level"),
            "harga_text":d.get("harga_text"),
            "fasilitas":", ".join(d.get("fasilitas") or []),
            "fasilitas_count":len(d.get("fasilitas") or []),
            "popular_times":d.get("popular_times"),
            "jam_ramai":d.get("jam_ramai"),
            "has_busy_hours":attr.get("has_busy_hours"),
            "total_open_hours_week":attr.get("analytics_total_open_hours_per_week"),
            "is_24h":attr.get("analytics_is_24h"),
            "has_weekend":attr.get("analytics_has_weekend"),
            "jam_lengkap":attr.get("analytics_jam_lengkap"),
            "facility_score":attr.get("analytics_facility_score"),
            "place_id":d.get("place_id"),
            "url_google_maps":d.get("url_google_maps"),
            "wilayah_search":attr.get("wilayah_search"),
        })
    df=pd.DataFrame(rows)
    # Add decision flag: underutilized = low facility_score + long open hours but low reviews? heuristic
    # RuangSela wants ruang kota belum optimal -> low rating/reviews + high open hours = opportunity
    df["opportunity_score"] = (df["total_open_hours_week"].fillna(0)/168*0.4 + (5-df["rating"].fillna(3))*0.3 + (1/(df["jumlah_review"].fillna(10)+1))*0.3)
    return df

if __name__=="__main__":
    import sys
    p=sys.argv[1] if len(sys.argv)>1 else "data/raw/ruangsela_DKI_FINAL_80.json"
    df=to_analytics_df(p)
    print(df.head().to_string())
    print(f"\nColumns: {list(df.columns)}")
    print(f"Facility non-null: {(df['fasilitas']!='').sum()}/{len(df)}")
    print(f"Busy non-null: {df['has_busy_hours'].sum()}/{len(df)}")
    out=p.replace(".json","_analytics.csv")
    df.to_csv(out, index=False, encoding="utf-8-sig")
    print(f"Saved analytics CSV: {out}")
