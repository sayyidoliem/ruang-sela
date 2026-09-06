"use client";

import Link from "next/link";
import {
  CalendarDays,
  CreditCard,
  Headphones,
  Search,
  ShieldCheck,
  UserCog,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";

const HELP_CATEGORIES = [
  {
    id: "cara-booking",
    title: "Cara Booking",
    description:
      "Panduan lengkap memesan ruang dan mengatur jadwal kegiatan Anda.",
    icon: CalendarDays,
    href: "/bantuan/cara-booking",
    keywords: "pesan ruang jadwal booking reservasi",
  },
  {
    id: "pembayaran",
    title: "Pembayaran",
    description:
      "Informasi metode pembayaran, tagihan, dan proses pengembalian dana.",
    icon: CreditCard,
    href: "/bantuan/pembayaran",
    keywords: "bayar tagihan refund pengembalian dana metode",
  },
  {
    id: "kebijakan",
    title: "Kebijakan Komunitas",
    description:
      "Aturan tata tertib penggunaan ruang dan standar perilaku komunitas.",
    icon: ShieldCheck,
    href: "/bantuan/kebijakan-komunitas",
    keywords: "aturan tata tertib keamanan privasi perilaku",
  },
  {
    id: "panduan-pengelola",
    title: "Panduan Pengelola",
    description:
      "Bantuan khusus untuk pengelola dalam mengatur ruang dan fasilitas.",
    icon: UserCog,
    href: "/bantuan/panduan-pengelola",
    keywords: "manajer admin fasilitas penyelenggara pengelola",
  },
];

export default function HelpPage() {
  const [query, setQuery] = useState("");

  const categories = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase("id-ID");
    if (!normalized) return HELP_CATEGORIES;

    return HELP_CATEGORIES.filter((category) =>
      [category.title, category.description, category.keywords]
        .join(" ")
        .toLocaleLowerCase("id-ID")
        .includes(normalized),
    );
  }, [query]);

  return (
    <main className="flex-1 bg-slate-50">
      <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-12">
        <section className="mb-16 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
            Bagaimana kami bisa membantu?
          </h1>
          <p className="mx-auto mb-8 mt-4 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
            Temukan jawaban untuk pertanyaan umum tentang pemesanan, pembayaran,
            dan kebijakan platform RuangSela.
          </p>

          <label className="relative mx-auto block max-w-xl">
            <span className="sr-only">Cari topik bantuan</span>
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Cari topik bantuan..."
              className="w-full rounded-xl border border-slate-200 bg-white py-4 pl-12 pr-12 text-sm text-slate-900 shadow-sm outline-none transition focus:border-blue-600 focus:shadow-md focus:ring-2 focus:ring-blue-600/15"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="Hapus pencarian"
                className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </label>
        </section>

        {categories.length > 0 ? (
          <section
            aria-label="Kategori bantuan"
            className="mb-16 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4"
          >
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <Link
                  key={category.id}
                  href={category.href}
                  className="group block rounded-3xl border border-white/80 bg-white p-6 shadow-[0_4px_20px_rgba(15,23,42,0.05)] transition duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  <span className="mb-4 grid h-12 w-12 place-items-center rounded-full bg-slate-900 text-white transition-colors group-hover:bg-blue-600">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h2 className="mb-2 text-xl font-semibold text-slate-950">
                    {category.title}
                  </h2>
                  <p className="text-sm leading-relaxed text-slate-600">
                    {category.description}
                  </p>
                </Link>
              );
            })}
          </section>
        ) : (
          <section className="mb-16 rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
            <Search className="mx-auto h-9 w-9 text-slate-300" />
            <h2 className="mt-3 font-bold text-slate-900">
              Topik tidak ditemukan
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Coba gunakan kata kunci lain atau hubungi tim bantuan kami.
            </p>
            <button
              type="button"
              onClick={() => setQuery("")}
              className="mt-5 rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Hapus pencarian
            </button>
          </section>
        )}

        <section className="relative overflow-hidden rounded-3xl bg-slate-950 p-8 shadow-[0_4px_20px_rgba(15,23,42,0.08)] md:flex md:items-center md:justify-between md:p-12">
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-blue-600/15 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-violet-500/15 blur-3xl" />

          <div className="relative z-10 max-w-xl text-center md:text-left">
            <h2 className="mb-4 text-2xl font-bold text-white sm:text-3xl">
              Masih butuh bantuan?
            </h2>
            <p className="text-sm leading-relaxed text-slate-300 sm:text-base">
              Tim dukungan komunitas kami siap membantu menyelesaikan kendala
              teknis maupun administratif.
            </p>
          </div>

          <div className="relative z-10 mt-8 flex justify-center md:mt-0">
            <Link
              href="/kontak"
              className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-8 py-4 text-sm font-semibold text-white shadow-md transition hover:bg-blue-700 hover:shadow-lg"
            >
              <Headphones className="h-5 w-5" />
              Hubungi Bantuan
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
