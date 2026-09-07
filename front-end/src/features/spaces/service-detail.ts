import { api } from "@/shared/lib/api";
import type { LocationDetail } from "@/shared/lib/api";
import type {
  OperatingHour,
  PlaceDetail,
  PlaceReview,
} from "./types/place-detail";

function slugify(value: string): string {
  return (
    value
      .toLocaleLowerCase("id-ID")
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 80) || "ruang"
  );
}

function cleanEncoding(text: string): string {
  return text
    .replace(/[\uFFFD\u0000-\u001F]/g, "")
    .replace(/\?\?+/g, "-")
    .replace(/\u2013/g, "-")
    .replace(/\u2014/g, "-")
    .replace(/\u00A0/g, " ")
    .replace(/A\?+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

const NEGATIVE_FACILITY_PATTERNS = [
  /^tidak/i,
  /^belum ada/i,
  /^belum tersedia/i,
  /^tidak ada/i,
  /^tidak memiliki/i,
  /^tidak tersedia/i,
];

function cleanFacility(raw: string): string | null {
  const cleaned = cleanEncoding(raw).trim();
  if (cleaned.length === 0) return null;
  if (cleaned.length > 50) return null;
  if (NEGATIVE_FACILITY_PATTERNS.some((pattern) => pattern.test(cleaned)))
    return null;
  return cleaned;
}

function toOperatingHours(detail: LocationDetail): OperatingHour[] {
  const raw = detail.jam_operasional;
  if (raw && typeof raw === "object") {
    const entries = Object.entries(raw)
      .map(([day, hours]) => ({ day, hours: cleanEncoding(hours) }))
      .filter((item) => item.day && item.hours);
    const order = [
      "Senin",
      "Selasa",
      "Rabu",
      "Kamis",
      "Jumat",
      "Sabtu",
      "Minggu",
    ];
    return entries.sort(
      (a, b) => order.indexOf(a.day) - order.indexOf(b.day),
    );
  }
  const rawStr = detail.jam_operasional_raw;
  if (rawStr) {
    return rawStr
      .split("|")
      .map((part) => {
        const [day, ...rest] = part.split(":");
        const hours = cleanEncoding(rest.join(":"));
        return { day: day?.trim() || "", hours };
      })
      .filter((item) => item.day && item.hours);
  }
  return [];
}

function toReviews(detail: LocationDetail): PlaceReview[] {
  return (detail.reviews ?? [])
    .filter((review) => review.text && review.text.length > 10)
    .map((review, index) => {
      const text = review.text || "";
      const parts = text.split("|");
      const rawComment =
        parts.length > 1
          ? parts
              .slice(1)
              .join("|")
              .split("|")
              .pop()
              ?.trim() || ""
          : "";
      const comment = cleanEncoding(rawComment || text).slice(0, 200);
      const author = cleanEncoding(parts[0]?.trim() || "Pengguna").split(
        "|",
      )[0];
      return {
        id: `review-${index + 1}`,
        rating: review.rating ?? 5,
        comment: comment || "Tidak ada komentar",
        author: author || "Pengguna",
        role: "Pengunjung",
      };
    })
    .slice(0, 6);
}

function toDescription(detail: LocationDetail): string[] {
  const style = detail.keyword || detail.kategori || "";
  const base =
    detail.deskripsi ||
    `${detail.nama} adalah ${style ? `ruang kategori ${style}` : "ruang publik"} yang tersedia untuk kegiatan komunitas dan warga.`;
  const facilities = (detail.fasilitas ?? [])
    .filter((f) => cleanFacility(f))
    .map((f) => cleanFacility(f))
    .filter(Boolean);
  const facilityStr =
    facilities.length > 0
      ? `Fasilitas: ${facilities.join(", ")}.`
      : "";
  const locationStr = detail.alamat_lengkap || detail.alamat || "";
  const hoursStr = cleanEncoding(detail.jam_operasional_raw || "");
  const parts = [base];
  if (locationStr || hoursStr) {
    parts.push(
      [locationStr ? `Lokasi: ${locationStr}` : "", hoursStr ? `Jam: ${hoursStr}` : ""]
        .filter(Boolean)
        .join(". ") + ".",
    );
  }
  if (facilityStr) parts.push(facilityStr);
  return parts.filter((p) => p.length > 5);
}

export function mapDetailToPlaceDetail(
  detail: LocationDetail,
): PlaceDetail {
  const id = detail.place_id || detail.id || detail.nama || "ruang";
  return {
    id,
    slug: id,
    title: detail.nama || "Tanpa Nama",
    location: detail.alamat_lengkap || detail.alamat || "Jakarta",
    address: detail.alamat_lengkap || detail.alamat || "",
    verified: detail.status === "published",
    price: 0,
    priceUnit: "sesi",
    durationHours: detail.total_open_hours ?? 0,
    capacity: 0,
    minimumBooking: "",
    description: toDescription(detail),
    images: (detail.foto_urls ?? []).map((src, index) => ({
      src,
      alt: `${detail.nama || "Ruang"} foto ${index + 1}`,
    })),
    operatingHours: toOperatingHours(detail),
    facilities: (detail.fasilitas ?? detail.fasilitas_raw ?? [])
      .map((f) => cleanFacility(f))
      .filter((f): f is string => f !== null),
    selectedDate: 1,
    bookedDates: [],
    reviews: toReviews(detail),
    crowdLevels: [],
    category: detail.kategori || undefined,
    rating: detail.rating ?? undefined,
    reviewCount: detail.jumlah_review ?? undefined,
    phone: detail.telepon || undefined,
    website: detail.website || undefined,
    priceText: detail.harga_text || undefined,
    statusOpen: detail.status_buka
      ? cleanEncoding(detail.status_buka)
      : undefined,
    lat: detail.lat ?? undefined,
    lng: detail.lng ?? undefined,
  };
}

export async function getPlaceDetail(
  slugOrId: string,
): Promise<PlaceDetail | null> {
  try {
    const detail = await api.locationDetail(slugOrId);
    return mapDetailToPlaceDetail(detail);
  } catch {
    return null;
  }
}
