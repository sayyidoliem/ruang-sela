import type { Metadata } from "next";
import type { SVGProps } from "react";
import Link from "next/link";
import { api } from "@/shared/lib/api";

import Footer from "@/app/components/Footer";
import Navbar from "./components/Navbar";

type IconProps = SVGProps<SVGSVGElement>;

function createIcon(displayName: string, path: string) {
  function IconComponent(props: IconProps) {
    return (
      <svg
        {...props}
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path d={path} />
      </svg>
    );
  }

  IconComponent.displayName = displayName;

  return IconComponent;
}

const ArrowRight = createIcon("ArrowRight", "M5 12h14m-6-6 6 6-6 6");

const BookOpen = createIcon(
  "BookOpen",
  "M2 4.5A2.5 2.5 0 0 1 4.5 2H12v18H4.5A2.5 2.5 0 0 0 2 22V4.5ZM22 4.5A2.5 2.5 0 0 0 19.5 2H12v18h7.5A2.5 2.5 0 0 1 22 22V4.5Z",
);

const Check = createIcon("Check", "m5 12 4 4L19 6");

const MapPin = createIcon(
  "MapPin",
  "M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Zm-5 0a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z",
);

const Music2 = createIcon(
  "Music2",
  "M9 18V5l10-2v13M9 18a3 3 0 1 1-3-3 3 3 0 0 1 3 3Zm10-2a3 3 0 1 1-3-3 3 3 0 0 1 3 3Z",
);

const Palette = createIcon(
  "Palette",
  "M12 3a9 9 0 1 0 0 18h1.5a2 2 0 0 0 0-4H12a2 2 0 0 1 0-4h5a4 4 0 0 0 0-8h-5Zm-4 5h.01M12 6h.01M16 9h.01M7 12h.01",
);

const Search = createIcon(
  "Search",
  "m21 21-4.35-4.35M19 11a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z",
);

const Trophy = createIcon(
  "Trophy",
  "M8 21h8M12 17v4M7 4H4v2a5 5 0 0 0 5 5m8-7h3v2a5 5 0 0 1-5 5M7 3h10v5a5 5 0 0 1-10 0V3Z",
);

const Users = createIcon(
  "Users",
  "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2m8-10a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm6-3a4 4 0 0 1 0 7.75M22 21v-2a4 4 0 0 0-3-3.87",
);

export const metadata: Metadata = {
  title: "RuangSela - Temukan Ruang Komunitas Terlengkap",
  description:
    "Menghubungkan warga, komunitas, dan pengelola ruang untuk mengaktifkan ruang kota menjadi pusat kegiatan bermakna.",
};

const categories = [
  {
    label: "Olahraga",
    slug: "olahraga",
    icon: Trophy,
    iconClassName:
      "bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white",
  },
  {
    label: "Musik",
    slug: "musik",
    icon: Music2,
    iconClassName:
      "bg-purple-50 text-purple-600 group-hover:bg-purple-600 group-hover:text-white",
  },
  {
    label: "Seni",
    slug: "seni",
    icon: Palette,
    iconClassName:
      "bg-amber-50 text-amber-500 group-hover:bg-amber-500 group-hover:text-white",
  },
  {
    label: "Belajar",
    slug: "belajar",
    icon: BookOpen,
    iconClassName:
      "bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white",
  },
  {
    label: "Pertemuan",
    slug: "pertemuan",
    icon: Users,
    iconClassName:
      "bg-rose-50 text-rose-500 group-hover:bg-rose-500 group-hover:text-white",
  },
] as const;

const impactMetrics = [
  {
    value: "75+",
    label: "Ruang Tersedia",
  },
  {
    value: "50k+",
    label: "Komunitas Terbantu",
  },
  {
    value: "13+",
    label: "Kota",
  },
  {
    value: "4.0/5",
    label: "Rata-rata Rating",
  },
] as const;

interface SpaceCardData {
  id: string;
  title: string;
  location: string;
  rating: number;
  capacity: number;
  imageSrc: string;
  imageAlt: string;
  description: string;
  area: string;
}

async function fetchSpaces(): Promise<SpaceCardData[]> {
  try {
    const response = await api.locations({ limit: 100 }, { timeoutMs: 30000 });
    const placeIds = response.data.map((p) => p.place_id);

    const detailMap = new Map<string, string>();
    for (let i = 0; i < placeIds.length; i += 8) {
      const batch = placeIds.slice(i, i + 8);
      const results = await Promise.allSettled(
        batch.map((id) =>
          api.locationDetail(id, { timeoutMs: 10000 }),
        ),
      );
      results.forEach((r, idx) => {
        if (r.status === "fulfilled" && r.value.foto_urls?.[0]) {
          detailMap.set(batch[idx], r.value.foto_urls[0]);
        }
      });
    }

    return response.data.map((place) => ({
      id: place.place_id || place.nama,
      title: place.nama || "Tanpa Nama",
      location: place.alamat?.split(",")[0] || "Jakarta",
      rating: place.rating ?? 0,
      capacity: place.jumlah_review ?? 0,
      imageSrc: detailMap.get(place.place_id) || "https://placehold.co/640x480?text=RuangSela",
      imageAlt: place.nama || "Ruang",
      description:
        place.kategori || "Ruang publik untuk kegiatan komunitas warga.",
      area: place.alamat?.split(",")[0] || "Jakarta",
    }));
  } catch {
    return [];
  }
}

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const trendingSpaces = await fetchSpaces();
  const recommendedSpaces = trendingSpaces.slice(0, 4);

  return (
    <div className="min-h-screen bg-white text-slate-800 antialiased selection:bg-violet-500 selection:text-white">
      <Navbar />

      <main>
        <section
          id="beranda"
          className="border-b border-purple-50/50 pb-24 pt-16 lg:pb-32 lg:pt-24"
        >
          <div className="relative z-10 mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
            <h1 className="mb-5 text-4xl font-extrabold leading-[1.15] tracking-tight text-slate-900 sm:text-5xl lg:text-[56px]">
              Menghidupkan Ruang,
              <br className="hidden sm:inline" />{" "}
              <span className="text-violet-700">Mempertemukan</span> Warga.
            </h1>

            <p className="mx-auto mb-10 max-w-2xl text-base leading-relaxed text-slate-500 sm:text-lg">
              Menghubungkan warga, komunitas, dan pengelola ruang untuk
              mengaktifkan ruang-ruang kota yang terabaikan menjadi pusat
              kegiatan bermakna.
            </p>

            <form
              id="cari-tempat"
              action="/cari"
              className="mx-auto mb-8 flex max-w-2xl scroll-mt-28 items-center rounded-2xl border border-slate-200 bg-white p-2 shadow-sm"
            >
              <Search
                aria-hidden="true"
                className="ml-3 h-5 w-5 shrink-0 text-slate-400"
              />

              <input
                name="q"
                type="search"
                aria-label="Cari ruang, lokasi, atau kegiatan"
                placeholder="Cari ruang, lokasi, atau kegiatan..."
                className="w-full border-0 bg-transparent px-3 py-2 text-sm font-medium text-slate-800 outline-none placeholder:text-slate-400 focus:ring-0 sm:text-base"
              />

              <button
                type="submit"
                className="shrink-0 rounded-xl bg-violet-700 px-7 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-violet-800 active:scale-95"
              >
                Cari
              </button>
            </form>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/cari"
                className="inline-flex items-center gap-2 rounded-xl bg-violet-700 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-violet-800"
              >
                Jelajahi Ruang
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Link>

              <Link
                href="#kegiatan"
                className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition-colors hover:border-violet-200 hover:text-violet-700"
              >
                Lihat Kegiatan
              </Link>
            </div>
          </div>
        </section>

        <section
          aria-labelledby="category-heading"
          className="border-b border-slate-100 bg-white py-16"
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2
              id="category-heading"
              className="mb-10 text-center text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl"
            >
              Jelajahi Kategori
            </h2>

            <div className="mx-auto grid max-w-4xl grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 md:grid-cols-5">
              {categories.map((category) => {
                const CategoryIcon = category.icon;

                return (
                  <Link
                    key={category.slug}
                    href={`/cari?kategori=${category.slug}`}
                    className="group flex flex-col items-center rounded-2xl border border-slate-100 p-4 text-center transition-shadow hover:shadow-md"
                  >
                    <span
                      className={`mb-3 rounded-xl p-3 transition-colors ${category.iconClassName}`}
                    >
                      <CategoryIcon aria-hidden="true" className="h-7 w-7" />
                    </span>

                    <span className="text-sm font-bold text-slate-800 transition-colors group-hover:text-violet-700">
                      {category.label}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        <section
          id="kegiatan"
          aria-labelledby="trending-heading"
          className="scroll-mt-24 bg-white py-16"
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <h2
                id="trending-heading"
                className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl"
              >
                Sedang Trending
              </h2>

              <p className="mt-1 text-sm text-slate-500 sm:text-base">
                Ruang paling aktif minggu ini.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {trendingSpaces.slice(0, 6).map((space) => (
                <article
                  key={space.id}
                  className="card-shadow group flex flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={space.imageSrc}
                      alt={space.imageAlt}
                      loading="lazy"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />

                    <div className="absolute left-4 top-4 inline-flex items-center gap-1 rounded-full bg-emerald-600 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                      <Check aria-hidden="true" className="h-3.5 w-3.5" />
                      Terverifikasi
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col justify-between p-5">
                    <div>
                      <Link
                        href={`/ruang/${space.id}`}
                        className="text-lg font-bold text-slate-900 transition-colors hover:text-violet-700"
                      >
                        {space.title}
                      </Link>

                      <div className="mt-1 flex items-center gap-1.5 text-xs font-medium text-slate-500">
                        <MapPin
                          aria-hidden="true"
                          className="h-4 w-4 text-slate-400"
                        />

                        <span>{space.location}</span>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4 text-sm">
                      <div
                        aria-label={`Rating ${space.rating} dari 5`}
                        className="flex items-center gap-1 font-bold text-amber-500"
                      >
                        <span aria-hidden="true">★</span>

                        <span className="font-semibold text-slate-700">
                          {space.rating.toFixed(1)}
                        </span>
                      </div>

                      <div className="text-xs font-medium text-slate-500">
                        Kapasitas:{" "}
                        <span className="font-bold text-violet-700">
                          {space.capacity}
                        </span>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section
          aria-labelledby="recommendation-heading"
          className="bg-white pb-24 pt-16"
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <h2
                id="recommendation-heading"
                className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl"
              >
                Rekomendasi Untukmu
              </h2>

              <p className="mt-1 text-sm text-slate-500 sm:text-base">
                Pilihan ruang berdasarkan preferensi Anda.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {recommendedSpaces.map((space) => (
                <article
                  key={space.id}
                  className="card-shadow group flex flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="relative h-44 overflow-hidden">
                    <img
                      src={space.imageSrc}
                      alt={space.imageAlt}
                      loading="lazy"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>

                  <div className="flex flex-1 flex-col justify-between p-4">
                    <div>
                      <Link
                        href={`/ruang/${space.id}`}
                        className="font-bold text-slate-900 transition-colors hover:text-violet-700"
                      >
                        {space.title}
                      </Link>

                      <p className="mt-1.5 text-xs leading-relaxed text-slate-500">
                        {space.description}
                      </p>
                    </div>

                    <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs">
                      <div
                        aria-label={`Rating ${space.rating} dari 5`}
                        className="flex items-center gap-1 font-bold text-amber-500"
                      >
                        <span aria-hidden="true">★</span>

                        <span className="font-semibold text-slate-700">
                          {space.rating.toFixed(1)}
                        </span>
                      </div>

                      <Link
                        href={`/ruang/${space.id}`}
                        className="font-semibold text-violet-700 hover:text-violet-800"
                      >
                        {space.area}
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section
          aria-label="Dampak RuangSela"
          className="border-t border-slate-800 bg-[#131135] py-16 text-white"
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 gap-8 text-center md:grid-cols-4 md:divide-x md:divide-slate-800/80">
              {impactMetrics.map((metric) => (
                <div key={metric.label} className="px-2">
                  <p className="mb-2 text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
                    {metric.value}
                  </p>

                  <p className="text-xs font-medium text-slate-400 sm:text-sm">
                    {metric.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer year={2026} />
    </div>
  );
}
