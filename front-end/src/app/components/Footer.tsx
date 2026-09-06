"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import { Globe2, Share2 } from "lucide-react";

type LinkHref = ComponentProps<typeof Link>["href"];

export interface FooterLink {
  label: string;
  href: LinkHref;
}

export interface FooterColumn {
  title: string;
  links: FooterLink[];
}

export interface FooterProps {
  brandName?: string;
  tagline?: string;
  columns?: FooterColumn[];
  year?: number;
  copyrightNote?: string;
  onLanguageClick?: () => void;
  onShareClick?: () => void;
}

const DEFAULT_COLUMNS = [
  {
    title: "Platform",
    links: [
      { label: "Cari Ruang", href: "/cari" },
      // { label: "Daftarkan Ruang", href: "/daftar" },
      // { label: "Acara Komunitas", href: "/acara" },
    ],
  },
  {
    title: "Tentang",
    links: [
      // { label: "Kisah Kami", href: "/tentang" },
      { label: "Pusat Bantuan", href: "/bantuan" },
      // { label: "Kontak", href: "/kontak" },
    ],
  },
  {
    title: "Legal",
    links: [
      // { label: "Syarat & Ketentuan", href: "/syarat" },
      // { label: "Kebijakan Privasi", href: "/privasi" },
    ],
  },
] satisfies FooterColumn[];

export default function Footer({
  brandName = "RuangSela",
  tagline = "Menghubungkan masyarakat dengan ruang publik dan fasilitas untuk mendukung kolaborasi dan inovasi warga.",
  columns = DEFAULT_COLUMNS as FooterColumn[],
  year = new Date().getFullYear(),
  copyrightNote = "Digital Citizenship for All.",
  onLanguageClick,
  onShareClick,
}: FooterProps) {
  return (
    <footer className="w-full border-t border-slate-800 bg-[#1b1b46] text-slate-300">
      <div className="mx-auto max-w-7xl px-6 pb-8 pt-16 lg:px-12">
        <div className="grid grid-cols-1 gap-10 pb-12 md:grid-cols-2 lg:grid-cols-5">
          <div className="space-y-4 lg:col-span-2">
            <Link href="/">
              {brandName === "RuangSela" ? (
                <>
                  Ruang<span className="text-[#6347EB]">Sela</span>
                </>
              ) : (
                brandName
              )}
            </Link>

            <p className="max-w-sm text-sm leading-relaxed text-slate-300/80">
              {tagline}
            </p>
          </div>

          {columns.map((column) => (
            <div key={column.title} className="space-y-3">
              <h3 className="text-sm font-bold tracking-wider text-white">
                {column.title}
              </h3>

              <ul className="space-y-2 text-sm text-slate-300/80">
                {column.links.map((link) => (
                  <li key={`${column.title}-${String(link.href)}`}>
                    <Link href={link.href}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-slate-800/80 pt-8 text-xs text-slate-400 sm:flex-row">
          <p>
            © {year} {brandName}. {copyrightNote}
          </p>

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={onLanguageClick}
              aria-label="Ubah bahasa"
              className="transition-colors hover:text-white"
            >
              <Globe2 className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={onShareClick}
              aria-label="Bagikan"
              className="transition-colors hover:text-white"
            >
              <Share2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
