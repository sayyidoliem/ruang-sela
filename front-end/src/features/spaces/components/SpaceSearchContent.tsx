"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { Route } from "next";
import CardAvailable from "@/app/components/CardAvailable";
import SearchAndFilter from "./SearchAndFilter";
import SearchMap from "./SearchMap";
import type { Space } from "../types/space";

interface SpaceSearchContentProps {
  spaces: Space[];
  totalCount?: number;
}

export default function SpaceSearchContent({
  spaces,
  totalCount,
}: SpaceSearchContentProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");
  const [selectedSpaceId, setSelectedSpaceId] = useState<string>();
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);

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
          onSubmit={() => setSubmittedQuery(query)}
        />
        <div className="flex-1 space-y-6 overflow-y-auto p-6 [scrollbar-color:#cbd5e1_#f8fafc] [scrollbar-width:thin] lg:px-10">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 lg:text-[28px]">
              Ruang Tersedia
            </h1>
            <p className="text-sm text-slate-500">
              {submittedQuery
                ? `Menampilkan ${filteredSpaces.length} hasil untuk “${submittedQuery}”`
                : `Menampilkan ${totalCount ?? spaces.length} ruang di area Anda`}
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
                onClick={() => {
                  setQuery("");
                  setSubmittedQuery("");
                }}
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
