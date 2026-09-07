# RuangSela Frontend API Reference

## Base URL

| Environment | URL |
|---|---|
| Development | `http://localhost:3000/api` |
| Production | `https://[domain]/api` |

> Frontend di-deploy secara terpisah. API request dari client-side langsung ke backend hosted.

## Backend Hosted

| Environment | URL |
|---|---|
| Production | `https://ruang-sela-be.vercel.app` |

> Dokumentasi lengkap endpoint backend: [API.md (back-end branch)](https://github.com/sayyidoliem/ruang-sela/blob/back-end/BE/docs/API.md)

---

## Authentication

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register akun baru |
| POST | `/api/auth/login` | Login dan dapatkan token |
| POST | `/api/auth/logout` | Hapus sesi / logout |
| GET | `/api/auth/me` | Ambil data user yang sedang login |

### Auth Headers

```
Authorization: Bearer <jwt_token>
X-Role: USER | ADMIN          (mock dev mode)
X-User-Id: <uuid>             (mock dev mode)
```

---

## Resource Endpoints (CRUD)

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/[resource]` | Ambil semua data |
| GET | `/api/[resource]/:id` | Ambil data berdasarkan ID |
| POST | `/api/[resource]` | Buat data baru |
| PUT | `/api/[resource]/:id` | Update data |
| DELETE | `/api/[resource]/:id` | Hapus data |

---

## Backend Endpoints (Hosted)

Berikut mapping endpoint backend `https://ruang-sela-be.vercel.app` yang digunakan frontend:

### Public

| Method | Endpoint | Description |
|---|---|---|
| GET | `/health` | Cek status server dan model |
| POST | `/search/json` | Pencarian hybrid (LLM + IndoBERT) |
| POST | `/search/file` | Pencarian via file JSON (legacy) |
| GET | `/search/test?q=...` | Quick test pencarian (tanpa auth) |
| GET | `/locations` | Daftar lokasi (USER: published, ADMIN: all) |
| GET | `/location/:id` | Detail lokasi |
| GET | `/recommendations` | Rekomendasi berdasarkan profil user |

### Auth Required

| Method | Endpoint | Description |
|---|---|---|
| GET | `/profile` | Ambil profil user |
| PUT | `/profile` | Update preferensi profil |
| POST | `/location` | Ajukan lokasi baru (USER → pending, ADMIN → published) |

### Admin Only

| Method | Endpoint | Description |
|---|---|---|
| POST | `/admin/verifyLocation` | Verifikasi / tolak lokasi pending |
| DELETE | `/admin/deleteLocation/:id` | Hapus lokasi |

---

## Example Request

### Login

```ts
const response = await fetch("https://ruang-sela-be.vercel.app/profile", {
  method: "GET",
  headers: {
    "X-Role": "USER",
  },
});
const data = await response.json();
```

### Cari Lokasi

```ts
const response = await fetch("https://ruang-sela-be.vercel.app/locations?limit=10&offset=0", {
  headers: { "X-Role": "USER" },
});
const data = await response.json();
// { role: "USER", total: 75, data: [...] }
```

### Detail Lokasi

```ts
const response = await fetch("https://ruang-sela-be.vercel.app/location/11cs0c_3z7", {
  headers: { "X-Role": "USER" },
});
const data = await response.json();
// { nama: "...", kategori: "...", foto_urls: [...], fasilitas: [...], ... }
```

### Search (JSON + LLM)

```ts
const response = await fetch("https://ruang-sela-be.vercel.app/search/json", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "X-Role": "USER",
  },
  body: JSON.stringify({
    data_text: "ruangan yang memiliki AC dan juga parkir",
    top_k: 10,
    mode: "hybrid",
  }),
});
const data = await response.json();
// { query: "...", results: [...], debug: {...} }
```

### Ajukan Lokasi Baru

```ts
const response = await fetch("https://ruang-sela-be.vercel.app/location", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "X-Role": "USER",
  },
  body: JSON.stringify({
    nama: "Aula Warga Baru",
    alamat: "Jl. Contah No. 1, Jakarta",
    lat: -6.17,
    lng: 106.76,
    kategori: "Aula serbaguna",
    fasilitas: ["Parkir", "AC"],
  }),
});
const data = await response.json();
// { place_id: "...", status: "pending", message: "Menunggu verifikasi admin" }
```

### Verifikasi Lokasi (Admin)

```ts
const response = await fetch("https://ruang-sela-be.vercel.app/admin/verifyLocation", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "X-Role": "ADMIN",
  },
  body: JSON.stringify({
    location_id: "11new_xxx",
    action: "accept",
  }),
});
```

---

## Error Response Format

```json
{
  "detail": "Error message dari server"
}
```

Validation error (422):

```json
{
  "detail": [
    {
      "loc": ["body", "nama"],
      "msg": "String should have at least 3 characters",
      "type": "string_too_short"
    }
  ]
}
```
