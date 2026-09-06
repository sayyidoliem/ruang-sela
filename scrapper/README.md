# RuangSela - Google Maps Scraper

Scraper untuk mengumpulkan data ruang kota (aula, taman, lapangan, ruang komunitas, dll) di Jakarta Barat.

## Setup
```
pip install -r requirements.txt
playwright install chromium
```

## Jalankan sampel 5 Jakarta Barat
```
python -m scraper.main --limit 5 --location "Jakarta Barat"
# atau headless
python -m scraper.main --limit 5 --headless
```

Output: `data/raw/ruangsela_jakbar_sample5_*.json` + `.csv`

## Data yang diambil
nama, kategori, alamat, lat/lng, place_id, rating, jumlah_review, jam_operasional (7 hari), status_buka, telepon, website, price_level/harga_text, foto_urls, reviews, fasilitas, plus_code, deskripsi
