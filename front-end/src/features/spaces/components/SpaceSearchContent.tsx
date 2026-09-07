"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
} from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { Route } from "next";
import CardAvailable from "@/app/components/CardAvailable";
import SearchAndFilter from "./SearchAndFilter";
import SearchMap from "./SearchMap";
import type { Space } from "../types/space";
import { api, type LocationCard, type LocationDetail } from "@/shared/lib/api";
import { mapLocationToSpace } from "../data/map-space";

interface SpaceSearchContentProps {
  spaces: Space[];
  totalCount?: number;
}

export default function SpaceSearchContent({
  spaces: initialSpaces,
  totalCount,
}: SpaceSearchContentProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [submittedQuery, setSubmittedQuery] = useState("");
  const [spaces, setSpaces] = useState<Space[]>(initialSpaces);
  const [count, setCount] = useState(totalCount ?? initialSpaces.length);
  const [selectedSpaceId, setSelectedSpaceId] = useState<string>();
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition();
  const didInit = useRef(false);

  const filteredSpaces = useMemo(() => {
    const normalizedQuery = submittedQuery.trim().toLocaleLowerCase("id-ID");
    if (!normalizedQuery) return spaces;
    return spaces.filter((space) =>
      [space.title, space.location, ...space.tags.map((tag) => tag.label)]
        .join(" ")
        .toLocaleLowerCase("id-ID")
        .includes(normalizedQuery),
    );
  }, [spaces, submittedQuery]);

  const fetchWithPhotos = useCallback(
    async (placeIds: string[]): Promise<LocationDetail[]> => {
      const results = await Promise.allSettled(
        placeIds.slice(0, 30).map((id) =>
          api.locationDetail(id, { timeoutMs: 10000 }),
        ),
      );
      return results
        .filter(
          (r): r is PromiseFulfilledResult<LocationDetail> =>
            r.status === "fulfilled",
        )
        .map((r) => r.value);
    },
    [],
  );

  const runSearch = useCallback(
    (q: string) => {
      startTransition(async () => {
        const trimmed = q.trim();
        setSubmittedQuery(trimmed);
        if (!trimmed) {
          setSpaces(initialSpaces);
          setCount(totalCount ?? initialSpaces.length);
          return;
        }

        try {
          let searchResults: LocationCard[] = [];

          try {
            const searchResp = await api.search(
              { data_text: trimmed, top_k: 50, mode: "hybrid" },
              { timeoutMs: 30000 },
            );
            if (searchResp.results && searchResp.results.length > 0) {
              searchResults = searchResp.results
                .filter((r) => r.place_id || r.id)
                .map((r) => ({
                  place_id: r.place_id || r.id || "",
                  nama: r.nama,
                  kategori: r.kategori ?? null,
                  alamat: r.alamat ?? null,
                  lat: r.lat ?? null,
                  lng: r.lng ?? null,
                  rating: r.rating ?? null,
                  jumlah_review: r.jumlah_review ?? null,
                  status: "published",
                  foto_count: (r.foto_urls ?? []).length,
                  fasilitas: r.fasilitas ?? [],
                }));
            }
          } catch {
            // search endpoint unavailable (model not loaded)
          }

          if (searchResults.length === 0) {
            const locationResponse = await api.locations({ limit: 100 });
            const keywords = trimmed
              .toLocaleLowerCase("id-ID")
              .replace(
                /yang|dan|atau|ada|di|ke|untuk|dengan|adalah|ini|itu|tempat|ruang|ruangan|punya/g,
                "",
              )
              .replace(/ber-?ac/g, " ac ")
              .replace(/ber-?parkir/g, " parkir ")
              .split(/\s+/)
              .filter((w) => w.length > 1);

            const scored = locationResponse.data.map((loc) => {
              const fac = (loc.fasilitas || []).map((f) =>
                f.toLocaleLowerCase("id-ID"),
              );
              const nama = (loc.nama || "").toLocaleLowerCase("id-ID");
              const kat = (loc.kategori || "").toLocaleLowerCase("id-ID");
              const alamat = (loc.alamat || "").toLocaleLowerCase("id-ID");
              const allText = `${nama} ${kat} ${alamat} ${fac.join(" ")}`;
              let score = 0;
              let matchCount = 0;
              for (const kw of keywords) {
                if (fac.some((f) => f.includes(kw))) {
                  score += 3;
                  matchCount++;
                } else if (nama.includes(kw)) {
                  score += 2;
                  matchCount++;
                } else if (kat.includes(kw)) {
                  score += 2;
                  matchCount++;
                } else if (allText.includes(kw)) {
                  score += 1;
                  matchCount++;
                }
              }
              return { loc, score, matchCount };
            });

            searchResults = scored
              .filter(({ score, matchCount }) => matchCount > 0 && score >= 2)
              .sort((a, b) => b.score - a.score || b.matchCount - a.matchCount)
              .map(({ loc }) => loc);
          }

          const details = await fetchWithPhotos(
            searchResults.map((l) => l.place_id).filter(Boolean),
          );
          const detailMap = new Map(
            details.map((d) => [d.place_id || d.id, d]),
          );
          const mapped = searchResults
            .filter((loc) => loc.place_id)
            .map((loc, index) => {
              const space = mapLocationToSpace(loc, index);
              const detail = detailMap.get(loc.place_id);
              if (detail?.foto_urls?.[0]) {
                space.imageSrc = detail.foto_urls[0];
              }
              return space;
            });
          setSpaces(mapped);
          setCount(mapped.length);
        } catch {
          setSpaces(initialSpaces);
          setCount(totalCount ?? initialSpaces.length);
        }
      });
    },
    [initialSpaces, totalCount, fetchWithPhotos],
  );

  useEffect(() => {
    const urlQ = searchParams.get("q");
    if (urlQ && !didInit.current) {
      didInit.current = true;
      setQuery(urlQ);
      runSearch(urlQ);
    }
  }, [searchParams, runSearch]);

  const handleSubmit = () => {
    const q = query.trim();
    const params = new URLSearchParams(searchParams.toString());
    if (q) {
      params.set("q", q);
    } else {
      params.delete("q");
    }
    router.push(
      `/cari${params.toString() ? `?${params.toString()}` : ""}`,
      { scroll: false },
    );
    runSearch(q);
  };

  const handleReset = () => {
    setQuery("");
    setSubmittedQuery("");
    setSpaces(initialSpaces);
    setCount(totalCount ?? initialSpaces.length);
    router.push("/cari", { scroll: false });
  };

  const toggleFavorite = (spaceId: string, next: boolean) => {
    setFavoriteIds((current) => {
      if (next)
        return current.includes(spaceId) ? current : [...current, spaceId];
      return current.filter((id) => id !== spaceId);
    });
  };

  return (
    <main className="flex min-h-[calc(100vh-4rem)] flex-col overflow-hidden lg:h-[calc(100vh-4rem)] lg:flex-row">
      <section className="z-10 flex w-full flex-col border-r border-slate-200 bg-white lg:w-[54%] xl:w-[52%]">
        <SearchAndFilter
          query={query}
          onQueryChange={setQuery}
          onSubmit={handleSubmit}
          loading={isPending}
        />
        <div className="flex-1 space-y-6 overflow-y-auto p-6 [scrollbar-color:#cbd5e1_#f8fafc] [scrollbar-width:thin] lg:px-10">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 lg:text-[28px]">
              Ruang Tersedia
            </h1>
            <p className="text-sm text-slate-500">
              {isPending
                ? "Mencari ruang..."
                : submittedQuery
                  ? `Menampilkan ${filteredSpaces.length} hasil untuk "${submittedQuery}"`
                  : `Menampilkan ${count} ruang di area Anda`}
            </p>
          </div>

          {filteredSpaces.length > 0 ? (
            <div className="space-y-5">
              {filteredSpaces.map((space, index) => (
                <CardAvailable
                  key={space.id}
                  imageSrc={space.imageSrc}
                  imageAlt={space.imageAlt}
                  title={space.title}
                  location={space.location}
                  distanceKm={space.distanceKm}
                  rating={space.rating}
                  verified={space.verified}
                  tags={space.tags}
                  price={space.price}
                  priceUnit={space.priceUnit}
                  favorited={favoriteIds.includes(space.id)}
                  selected={selectedSpaceId === space.id}
                  priority={index === 0}
                  onSelect={() => setSelectedSpaceId(space.id)}
                  onToggleFavorite={(next) => toggleFavorite(space.id, next)}
                  onPesan={() => router.push(`/ruang/${space.slug}` as Route)}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-14 text-center">
              <h2 className="font-bold text-slate-900">
                Ruang tidak ditemukan
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                Coba gunakan kata kunci lokasi, nama ruang, atau fasilitas lain.
              </p>
              <button
                type="button"
                onClick={handleReset}
                className="mt-5 rounded-lg bg-[#6347EB] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#583cd9]"
              >
                Hapus pencarian
              </button>
            </div>
          )}
        </div>
      </section>

      <SearchMap
        spaces={filteredSpaces}
        selectedSpaceId={selectedSpaceId}
        onMarkerClick={setSelectedSpaceId}
      />
    </main>
  );
}
