import type { LocationCard } from "@/shared/lib/api";
import type { Space } from "../types/space";
import type { AvailableTag } from "@/app/components/CardAvailable";

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

function toTags(location: LocationCard): Space["tags"] {
  const tags: Space["tags"] = [];
  if (location.kategori) {
    tags.push({ type: "wifi", label: location.kategori });
  }
  if (location.jumlah_review != null) {
    tags.push({ type: "capacity", label: `${location.jumlah_review} ulasan` });
  }
  return tags;
}

export function mapLocationToSpace(
  location: LocationCard,
  index: number,
): Space {
  const id = location.place_id || `place-${index}`;
  return {
    id,
    slug: id,
    imageSrc: "https://placehold.co/640x480?text=RuangSela",
    imageAlt: location.nama || "Ruang",
    title: location.nama || "Tanpa Nama",
    location: location.alamat?.split(",")[0] || "Jakarta",
    distanceKm: 0,
    rating: location.rating ?? 0,
    verified: location.status === "published",
    tags: toTags(location),
    price: 0,
    priceUnit: "sesi",
    latitude: location.lat ?? -6.2,
    longitude: location.lng ?? 106.816,
    markerPosition: {
      top: `${20 + ((index * 7) % 60)}%`,
      left: `${20 + ((index * 11) % 60)}%`,
    },
  };
}
