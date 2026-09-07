# SETUP.md — Panduan Instalasi & Setup RuangSela

## Struktur Repository

```
ruang-sela/
├── front-end/          # Next.js 15 Frontend
├── BE/                 # FastAPI Backend (Python)
├── api/                # Vercel serverless entrypoint
├── data/               # Data mentah (CSV/JSON)
├── scraper/            # Google Maps Scraper (Playwright)
├── scripts/            # Utility scripts
└── vercel.json         # Root Vercel config
```

---

## 1. Frontend (Next.js)

### Prerequisites

- **Node.js** >= 18.x
- **npm** >= 9.x

### Install

```bash
cd front-end
npm install
```

### Environment Variables

Buat file `front-end/.env.local`:

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=https://ruang-sela-be.vercel.app

# Supabase (opsional untuk auth)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# AI Keys (opsional)
AI_API_KEY=
AI_BASE_URL=
```

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_APP_URL` | Ya | URL frontend (default: `http://localhost:3000`) |
| `NEXT_PUBLIC_API_URL` | Ya | URL backend hosted (default: `https://ruang-sela-be.vercel.app`) |
| `NEXT_PUBLIC_SUPABASE_URL` | Tidak | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Tidak | Supabase anonymous key |

### Jalankan

```bash
npm run dev          # Development (http://localhost:3000)
npm run build        # Production build
npm start            # Jalankan production build
npm run lint         # Linting
npm run typecheck    # Type check TypeScript
npm run test         # Unit tests
```

### Deployment (Vercel)

Framework: Next.js. Deploy otomatis dari branch `master`.

**Root Directory:** `front-end/`

---

## 2. Backend (FastAPI)

### Prerequisites

- **Python** >= 3.10
- **pip**

### Install

```bash
cd BE
pip install -r requirements.txt
```

Untuk fitur ML embedding lokal (opsional — hanya untuk ETL/embedding script):

```bash
pip install -r requirements.ml.txt
```

### Environment Variables

Buat file `BE/.env`:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGci...
SUPABASE_ANON_KEY=eyJhbGci...

# LLM Provider (pilih salah satu)
OPENAI_API_KEY=sk-...          # OpenAI
GEMINI_API_KEY=AIza...         # Google Gemini (fallback)

# Opsional
ADMIN_KEY=changeme
MODEL_NAME=indobenchmark/indobert-base-p1
HF_TOKEN=hf_...               # Jika model private
```

| Variable | Required | Description |
|---|---|---|
| `SUPABASE_URL` | Ya | URL project Supabase |
| `SUPABASE_SERVICE_KEY` | Ya* | Supabase service role key (*fallback: `SUPABASE_SERVICE_ROLE_KEY`) |
| `SUPABASE_ANON_KEY` | Tidak | Supabase anon key |
| `OPENAI_API_KEY` | Tidak | API key OpenAI untuk LLM search |
| `GEMINI_API_KEY` | Tidak | API key Google Gemini (jika tidak pakai OpenAI) |
| `ADMIN_KEY` | Tidak | Key untuk endpoint admin (default: `changeme`) |
| `MODEL_NAME` | Tidak | Nama model IndoBERT (default: `indobenchmark/indobert-base-p1`) |

### Jalankan

```bash
cd BE
uvicorn app.main:app --reload --port 8000
```

Backend berjalan di `http://localhost:8000`

### API Docs

- Swagger UI: `http://localhost:8000/docs`
- OpenAPI JSON: `http://localhost:8000/openapi.json`
- Health check: `http://localhost:8000/health`

### Deployment (Vercel)

Backend di-deploy via Vercel Python serverless.

**Root Directory:** `BE/`

> **Catatan Vercel:** File `requirements.txt` di `BE/` tidak menyertakan `torch`/`transformers` (melebihi limit 250MB). Backend akan fallback ke embedding berbasis hash saat model tidak tersedia.

---

## 3. Scraper (Playwright)

### Prerequisites

- **Python** >= 3.10
- **pip**
- **Playwright Chromium** (diinstall otomatis)

### Install

```bash
pip install -r requirements.txt
pip install -r requirements-scraper.txt
playwright install chromium
```

### Jalankan

```bash
# Sampel 5 tempat Jakarta Barat
python -m scraper.main --limit 5 --location "Jakarta Barat"

# Headless mode
python -m scraper.main --limit 5 --headless

# Bulk 75 tempat DKI
python scripts/collect_75.py
```

Output tersimpan di `data/raw/` dalam format `.json` dan `.csv`.

---

## 4. Database (Supabase)

### Schema

Schema SQL tersedia di:

- `BE/supabase/schema.sql` — DDL lengkap (tabel, index, vector)
- `BE/supabase/rpc.sql` — RPC function `hybrid_search` untuk pgvector

### Setup

1. Buat project di [Supabase](https://supabase.com)
2. Jalankan `schema.sql` di SQL Editor Supabase
3. Jalankan `rpc.sql` untuk membuat fungsi hybrid search
4. Import data dari `BE/schema/places.csv` ke tabel `places`
5. Jalankan ETL untuk embedding:
   ```bash
   cd BE
   pip install -r requirements.txt -r requirements.ml.txt
   python scripts/etl_bulk75.py
   python scripts/embed_places.py
   ```

### Tabel Utama

| Tabel | Description |
|---|---|
| `places` | Data tempat/ruang |
| `place_embeddings` | Vektor embedding (pgvector) |
| `place_facilities` | Relasi tempat ↔ fasilitas |
| `users` | Data pengguna |

---

## Quick Start

### 1. Clone & Install

```bash
git clone https://github.com/sayyidoliem/ruang-sela.git
cd ruang-sela

# Frontend
cd front-end && npm install && cd ..

# Backend
cd BE && pip install -r requirements.txt && cd ..
```

### 2. Setup Environment

```bash
# Frontend
cp front-end/.env.example front-end/.env.local
# Edit .env.local sesuai kebutuhan

# Backend
cp BE/.env.example BE/.env  # atau buat manual
# Edit .env dengan credential Supabase dan API key
```

### 3. Jalankan

```bash
# Terminal 1: Backend
cd BE
uvicorn app.main:app --reload --port 8000

# Terminal 2: Frontend
cd front-end
npm run dev
```

### 4. Akses

| Service | URL |
|---|---|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:8000 |
| Backend Docs | http://localhost:8000/docs |

> **Tanpa Supabase/Model:** Frontend tetap berjalan menggunakan backend hosted (`ruang-sela-be.vercel.app`). Search menggunakan fallback lokal (keyword scoring). Gambar & detail tetap ter-load dari endpoint hosted.
