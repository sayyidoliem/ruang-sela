# TECH-STACK.md — Teknologi yang Digunakan

## Frontend

| Technology | Version | Purpose |
|---|---|---|
| **Next.js** | 15.5 | React framework (App Router, SSR, SSG, Turbopack) |
| **React** | 19.1 | UI library |
| **TypeScript** | 5.9 | Type safety |
| **Tailwind CSS** | 4.1 | Utility-first CSS |
| **Zod** | 4.1 | Schema validation |
| **React Hook Form** | 7.62 | Form handling + validation |
| **@supabase/ssr** | 0.7 | Supabase server-side auth |
| **@supabase/supabase-js** | 2.56 | Supabase client SDK |
| **Leaflet** | 1.9 | Peta OpenStreetMap (marker, tile, zoom) |
| **Lucide React** | 0.542 | Icon library |
| **Vitest** | 3.2 | Unit testing |
| **Playwright** | 1.55 | E2E testing |
| **ESLint** | 9.34 | Linting |

### Deployment

| Platform | Purpose |
|---|---|
| **Vercel** | Frontend hosting + CI/CD dari branch `master` |

---

## Backend

| Technology | Version | Purpose |
|---|---|---|
| **Python** | 3.10+ | Runtime |
| **FastAPI** | 0.110 | REST API framework |
| **Uvicorn** | 0.29 | ASGI server |
| **Pydantic** | 2.8 | Data validation & schemas |
| **pydantic-settings** | 2.4 | Environment config |
| **Supabase** | 2.15+ | PostgreSQL + pgvector (database & vector search) |
| **OpenAI** | 1.52 | LLM API (GPT query expansion) |
| **Gemini (REST)** | - | LLM fallback via httpx direct REST |
| **httpx** | 0.27 | HTTP client (Gemini REST) |
| **Mangum** | 0.17 | AWS Lambda / Vercel serverless adapter |
| **python-dotenv** | 1.0 | `.env` loader |
| **python-multipart** | 0.09 | File upload support |

### ML / Embedding (Local Only)

| Technology | Version | Purpose |
|---|---|---|
| **PyTorch** | 2.4 | Deep learning runtime |
| **Transformers** | 4.44 | HuggingFace tokenizer + model |
| **NumPy** | 1.26 | Numerical computation |

> **Catatan:** `torch` dan `transformers` tidak diinstal di Vercel (melebihi limit 250MB). Hosting fallback ke `dummy_embedding` (hash-based). ML deps hanya dipakai lokal untuk job embedding.

### Deployment

| Platform | Purpose |
|---|---|
| **Vercel** | Python serverless (FastAPI via Mangum) |
| **Supabase** | PostgreSQL + pgvector + Auth |

---

## Scraper

| Technology | Version | Purpose |
|---|---|---|
| **Playwright** | 1.48 | Browser automation (Chromium) |
| **Pandas** | 2.2 | Data manipulation & export CSV |
| **openpyxl** | 3.1 | Excel export |

---

## Database

| Technology | Purpose |
|---|---|
| **PostgreSQL** | Relational database (via Supabase) |
| **pgvector** | Vector similarity search (embedding IndoBERT 768-dim) |

### Schema

| Tabel | Description |
|---|---|
| `places` | Data tempat (nama, kategori, alamat, lat/lng, rating, foto, jam operasional) |
| `place_embeddings` | Vektor embedding 768-dim (pgvector) |
| `place_facilities` | Relasi many-to-many tempat ↔ fasilitas |
| `reviews` | Ulasan pengguna |

---

## AI / ML Pipeline

```
User Query (natural language)
        │
        ▼
┌─────────────────────┐
│  LLM Expansion      │  OpenAI GPT / Google Gemini
│  (intent parsing)   │  → expanded_query + intent
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│  IndoBERT Embedding  │  indobenchmark/indobert-base-p1
│  (768-dim vector)   │  → query vector
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│  pgvector Search     │  Supabase RPC hybrid_search
│  (cosine similarity)│  → ranked results
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│  Hybrid Scoring      │  sim + facility + busy + geo + rating
│  (soft filter)      │  → final ranked places
└─────────────────────┘
```

### Hybrid Search Weights

```
final_score = 0.55 × sim_score         (IndoBERT cosine similarity)
            + facility_bonus            (+0.15 AC, +0.10 parkir, +0.05 lega)
            + busy_bonus                ((40 - busy_pct)/40 × 0.15)
            + rating_norm               (rating/5 × 0.05)
            + geo_bonus                 ((10 - dist_km)/10 × 0.05)
```

---

## API Endpoints Summary

### Backend (`ruang-sela-be.vercel.app`)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/health` | Public | Status server + model |
| GET | `/locations` | USER/ADMIN | Daftar tempat |
| GET | `/location/:id` | USER/ADMIN | Detail tempat |
| POST | `/location` | USER/ADMIN | Ajukan tempat baru |
| POST | `/search/json` | ALL | Pencarian hybrid (LLM + IndoBERT) |
| GET | `/recommendations` | USER | Rekomendasi berdasarkan profil |
| GET | `/profile` | USER | Ambil profil |
| PUT | `/profile` | USER | Update preferensi |
| POST | `/admin/verifyLocation` | ADMIN | Verifikasi tempat |
| DELETE | `/admin/deleteLocation/:id` | ADMIN | Hapus tempat |

> Dokumentasi lengkap: [API.md](https://github.com/sayyidoliem/ruang-sela/blob/back-end/BE/docs/API.md)

---

## Arsitektur Sistem

### High-Level Architecture

```mermaid
graph TB
    subgraph Client["Frontend (Browser)"]
        UI[Next.js 15 + React 19]
        MapComp[Leaflet Map Component]
        SearchComp[Search Component]
    end

    subgraph Vercel_FE["Vercel — Frontend"]
        SSR[Server-Side Rendering]
        ISR[Incremental Static Regen]
    end

    subgraph Vercel_BE["Vercel — Backend"]
        API[FastAPI REST API]
        LLM[LLM Service<br/>OpenAI / Gemini]
        Embed[Embedding Service<br/>IndoBERT]
        SearchSvc[Hybrid Search Service]
    end

    subgraph Supabase["Supabase"]
        PG[(PostgreSQL)]
        PGVec[(pgvector)]
        AuthSvc[Auth Service]
    end

    subgraph External["External Services"]
        OSM[OpenStreetMap Tiles]
        HuggingFace[HuggingFace Hub<br/>IndoBERT Model]
        OpenAI_API[OpenAI API]
        Gemini_API[Gemini API]
    end

    UI --> SSR
    SSR -->|API Calls| API
    SearchComp -->|POST /search/json| API
    MapComp -->|Tile Images| OSM

    API --> LLM
    API --> SearchSvc
    API --> AuthSvc
    SearchSvc --> Embed
    Embed -->|Query Vector| PGVec
    SearchSvc -->|SQL Query| PG
    AuthSvc -->|JWT Verify| PG

    LLM -->|REST Call| OpenAI_API
    LLM -->|REST Call| Gemini_API
    Embed -->|Load Model| HuggingFace

    style Client fill:#e8f5e9,stroke:#43a047
    style Vercel_FE fill:#e3f2fd,stroke:#1e88e5
    style Vercel_BE fill:#fff3e0,stroke:#fb8c00
    style Supabase fill:#fce4ec,stroke:#e53935
    style External fill:#f3e5f5,stroke:#8e24aa
```

### Search Flow

```mermaid
sequenceDiagram
    actor User
    participant FE as Frontend<br/>(Next.js)
    participant BE as Backend<br/>(FastAPI)
    participant LLM as LLM Service<br/>(OpenAI/Gemini)
    participant DB as Supabase<br/>(pgvector)

    User->>FE: Ketik query "ruang AC parkir"
    FE->>BE: POST /search/json<br/>{data_text, top_k, mode}

    BE->>BE: Parse jam dari text<br/>(regex: jam/pukul)
    BE->>LLM: llm_expand_query(data_text)
    LLM-->>BE: expanded_query + intent<br/>{needs_ac: true, needs_parking: true}

    BE->>BE: embed_query(expanded_query)<br/>→ vector 768-dim

    alt mode=hybrid
        BE->>DB: RPC hybrid_search(vector, limit)
        DB-->>BE: ranked places + cosine sim
        BE->>BE: compute_facility_bonus()
        BE->>BE: compute_busy_bonus()
        BE->>BE: compute_geo_bonus()
        BE->>BE: final_score = 0.55*sim + bonuses
    else mode=relational
        BE->>DB: keyword overlap scoring
        DB-->>BE: matched places
    end

    BE-->>FE: SearchResponse<br/>{results, debug}
    FE->>FE: Fetch foto_urls per place<br/>(batch /location/:id)
    FE-->>User: Tampilkan hasil + peta
```

### Database Schema (ERD)

```mermaid
erDiagram
    PLACES {
        uuid id PK
        text place_id UK
        text nama
        text kategori
        text alamat_lengkap
        float lat
        float lng
        float rating
        int jumlah_review
        text status_buka
        text jam_operasional_raw
        text telepon
        text website
        text harga_text
        text foto_urls
        text fasilitas
        text deskripsi
        text status
        uuid owner_id FK
        timestamp created_at
    }

    PLACE_EMBEDDINGS {
        uuid id PK
        uuid place_id FK
        vector embedding_768
        timestamp created_at
    }

    PLACE_FACILITIES {
        uuid id PK
        uuid place_id FK
        text facility_name
    }

    REVIEWS {
        uuid id PK
        uuid place_id FK
        text reviewer_name
        int rating
        text comment
        timestamp created_at
    }

    USERS {
        uuid id PK
        text email
        text role
        jsonb preferences
        timestamp created_at
    }

    PLACES ||--o{ PLACE_EMBEDDINGS : "has embedding"
    PLACES ||--o{ PLACE_FACILITIES : "has facilities"
    PLACES ||--o{ REVIEWS : "has reviews"
    PLACES ||--o| USERS : "owned by"
```

### Deployment Architecture

```mermaid
graph LR
    subgraph Git["Git Repository"]
        Master[master branch]
        FE_Code[front-end/]
        BE_Code[BE/]
    end

    subgraph Vercel_Deploy["Vercel Project"]
        FE_Deploy["Frontend Deploy<br/>Root: front-end/<br/>Framework: Next.js"]
        BE_Deploy["Backend Deploy<br/>Root: BE/<br/>Runtime: Python 3.10"]
    end

    subgraph Supabase_Deploy["Supabase Project"]
        PG_Database[(PostgreSQL + pgvector)]
        PG_Auth[Auth]
        PG_Storage[Storage]
    end

    Master -->|push| Vercel_Deploy
    FE_Code --> FE_Deploy
    BE_Code --> BE_Deploy

    BE_Deploy -->|API calls| PG_Database
    BE_Deploy -->|JWT verify| PG_Auth
    FE_Deploy -->|Auth client| PG_Auth

    style Git fill:#f5f5f5,stroke:#9e9e9e
    style Vercel_Deploy fill:#e3f2fd,stroke:#1e88e5
    style Supabase_Deploy fill:#fce4ec,stroke:#e53935
```

### Hybrid Search Scoring

```mermaid
graph TD
    Query["User Query: 'ruang AC parkir lega'"]

    subgraph LLM_Step["Step 1: LLM Expansion"]
        LLM_Out["expanded: 'ruangan ber-AC dengan parkir luas'<br/>intent: {needs_ac: true, needs_parking: true}"]
    end

    subgraph Embed_Step["Step 2: Embedding"]
        Embed_Out["query_vector: [0.12, -0.34, ..., 0.56]<br/>(768-dim via IndoBERT)"]
    end

    subgraph Search_Step["Step 3: pgvector Search"]
        Search_Out["top 30 candidates + cosine sim"]
    end

    subgraph Score_Step["Step 4: Hybrid Scoring"]
        Sim["sim_score × 0.55"]
        Fac["facility_bonus<br/>AC: +0.15<br/>Parkir: +0.10"]
        Busy["busy_bonus<br/>(40 - busy_pct)/40 × 0.15"]
        Geo["geo_bonus<br/>(10 - dist)/10 × 0.05"]
        Rating["rating_norm<br/>rating/5 × 0.05"]

        Final["final_score"]
    end

    subgraph Result["Step 5: Result"]
        TopK["top_k places<br/>sorted by final_score"]
    end

    Query --> LLM_Out
    LLM_Out --> Embed_Out
    Embed_Out --> Search_Out
    Search_Out --> Sim
    Search_Out --> Fac
    Search_Out --> Busy
    Search_Out --> Geo
    Search_Out --> Rating
    Sim --> Final
    Fac --> Final
    Busy --> Final
    Geo --> Final
    Rating --> Final
    Final --> TopK

    style LLM_Step fill:#e8eaf6,stroke:#3f51b5
    style Embed_Step fill:#e0f2f1,stroke:#009688
    style Search_Step fill:#fff8e1,stroke:#ffc107
    style Score_Step fill:#fce4ec,stroke:#e53935
    style Result fill:#e8f5e9,stroke:#43a047
```

| Layer | Technology | Hosting |
|---|---|---|
| Frontend | Next.js 15 + React 19 | Vercel |
| Backend | FastAPI + Python 3.10 | Vercel (serverless) |
| Database | PostgreSQL + pgvector | Supabase |
| Auth | Supabase Auth | Supabase |
| AI/ML | IndoBERT + OpenAI/Gemini | HuggingFace + API |
| Map | Leaflet + OpenStreetMap | OpenStreetMap tiles |
