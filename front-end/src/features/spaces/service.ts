import { api, type LocationCard, type LocationDetail } from "@/shared/lib/api";
import { mapLocationToSpace } from "./data/map-space";
import type { Space } from "./types/space";

export interface SpacesResult {
  spaces: Space[];
  total: number;
}

const CONCURRENCY = 8;

async function batchFetchDetails(
  placeIds: string[],
): Promise<Map<string, LocationDetail>> {
  const map = new Map<string, LocationDetail>();
  for (let i = 0; i < placeIds.length; i += CONCURRENCY) {
    const batch = placeIds.slice(i, i + CONCURRENCY);
    const results = await Promise.allSettled(
      batch.map((id) => api.locationDetail(id, { timeoutMs: 10000 })),
    );
    results.forEach((result, index) => {
      if (result.status === "fulfilled") {
        map.set(batch[index], result.value);
      }
    });
  }
  return map;
}

function enrichWithPhotos(
  locations: LocationCard[],
  details: Map<string, LocationDetail>,
): Space[] {
  return locations.map((loc, index) => {
    const detail = details.get(loc.place_id);
    const space = mapLocationToSpace(loc, index);
    if (detail?.foto_urls?.[0]) {
      space.imageSrc = detail.foto_urls[0];
    }
    return space;
  });
}

export async function listSpaces(): Promise<SpacesResult> {
  const response = await api.locations({ limit: 100 });
  const placeIds = response.data.map((loc) => loc.place_id);
  const details = await batchFetchDetails(placeIds);
  const spaces = enrichWithPhotos(response.data, details);
  return { spaces, total: response.total };
}

export async function searchSpaces(
  query: string,
  amount = 24,
): Promise<SpacesResult> {
  try {
    const response = await api.search(
      { data_text: query, top_k: amount },
      { timeoutMs: 45000 },
    );
    const spaces = (response.results ?? []).map(
      (place, index): Space => {
        const mapped = mapLocationToSpace(
          {
            place_id: place.place_id || place.id || `place-${index}`,
            nama: place.nama,
            kategori: place.kategori ?? null,
            alamat: place.alamat ?? null,
            lat: place.lat ?? null,
            lng: place.lng ?? null,
            rating: place.rating ?? null,
            jumlah_review: place.jumlah_review ?? null,
            status: "published",
            foto_count: (place.foto_urls ?? []).length,
            fasilitas: place.fasilitas ?? [],
          },
          index,
        );
        if (place.foto_urls?.[0]) {
          mapped.imageSrc = place.foto_urls[0];
        }
        return mapped;
      },
    );
    return { spaces, total: spaces.length };
  } catch {
    const response = await api.locations({ limit: amount });
    const q = query.toLocaleLowerCase("id-ID");
    const filtered = response.data.filter(
      (loc) =>
        (loc.nama || "").toLocaleLowerCase("id-ID").includes(q) ||
        (loc.kategori || "").toLocaleLowerCase("id-ID").includes(q) ||
        (loc.alamat || "").toLocaleLowerCase("id-ID").includes(q) ||
        (loc.fasilitas || []).some((f) =>
          f.toLocaleLowerCase("id-ID").includes(q),
        ),
    );
    const placeIds = filtered.map((loc) => loc.place_id);
    const details = await batchFetchDetails(placeIds);
    const spaces = enrichWithPhotos(filtered, details);
    return { spaces, total: spaces.length };
  }
}
