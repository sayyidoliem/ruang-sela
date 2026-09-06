"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Ban,
  Check,
  ChevronLeft,
  ChevronRight,
  FolderArchive,
  Hourglass,
  MapPin,
  RefreshCw,
  Search,
  ShieldCheck,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { INITIAL_ADMIN_VENUES } from "../data/venues";
import type { VenueVerificationStatus } from "../types/admin-venue";

const statusStyle: Record<
  VenueVerificationStatus,
  { label: string; className: string }
> = {
  pending: {
    label: "Menunggu Verifikasi",
    className: "border-amber-200 bg-amber-50 text-amber-600",
  },
  verified: {
    label: "Terverifikasi",
    className: "border-emerald-200 bg-emerald-50 text-emerald-700",
  },
  rejected: {
    label: "Ditolak",
    className: "border-rose-200 bg-rose-50 text-rose-600",
  },
};

export default function AdminVenuesPage() {
  const router = useRouter();
  const [venues, setVenues] = useState(INITIAL_ADMIN_VENUES);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Semua Kategori");
  const [status, setStatus] = useState<"all" | VenueVerificationStatus>("all");
  const [page, setPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const pageSize = 5;

  const filtered = useMemo(
    () =>
      venues.filter((venue) => {
        const text =
          `${venue.name} ${venue.managerName} ${venue.city}`.toLocaleLowerCase(
            "id-ID",
          );
        return (
          text.includes(query.trim().toLocaleLowerCase("id-ID")) &&
          (category === "Semua Kategori" || venue.category === category) &&
          (status === "all" || venue.status === status)
        );
      }),
    [venues, query, category, status],
  );
  const count = (value: VenueVerificationStatus) =>
    venues.filter((venue) => venue.status === value).length;
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const rows = filtered.slice((page - 1) * pageSize, page * pageSize);

  const refresh = () => {
    setRefreshing(true);
    window.setTimeout(() => setRefreshing(false), 900);
  };

  return (
    <main className="space-y-6 p-4 sm:p-8">
      <header>
        <h1 className="text-2xl font-bold text-slate-900">Verifikasi Tempat</h1>
        <p className="mt-1 text-sm text-slate-500">
          Tinjau dokumen dan kelayakan tempat sebelum ditampilkan pada platform.
        </p>
      </header>
      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {[
          {
            label: "Total Pengajuan",
            value: venues.length,
            icon: FolderArchive,
            border: "border-slate-200",
            tone: "bg-slate-50 text-slate-600",
            note: "+12% bulan ini",
          },
          {
            label: "Menunggu Verifikasi",
            value: count("pending"),
            icon: Hourglass,
            border: "border-amber-400",
            tone: "bg-amber-50 text-amber-600",
            note: "Butuh tinjauan segera",
          },
          {
            label: "Terverifikasi",
            value: count("verified"),
            icon: ShieldCheck,
            border: "border-emerald-400",
            tone: "bg-emerald-50 text-emerald-600",
            note: "Disetujui",
          },
          {
            label: "Ditolak",
            value: count("rejected"),
            icon: Ban,
            border: "border-red-200",
            tone: "bg-red-50 text-red-500",
            note: "Tidak memenuhi syarat",
          },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <article
              key={item.label}
              className={`flex h-36 flex-col justify-between rounded-2xl border-2 bg-white p-5 shadow-sm ${item.border}`}
            >
              <div className="flex justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-500">
                    {item.label}
                  </p>
                  <strong className="mt-1 block text-3xl text-slate-800">
                    {item.value}
                  </strong>
                </div>
                <span
                  className={`grid h-10 w-10 place-items-center rounded-xl ${item.tone}`}
                >
                  <Icon className="h-5 w-5" />
                </span>
              </div>
              <p className="text-xs font-medium text-slate-500">{item.note}</p>
            </article>
          );
        })}
      </section>

      <section className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <label className="relative block w-full max-w-md">
          <span className="sr-only">Cari tempat</span>
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setPage(1);
            }}
            placeholder="Cari nama tempat, pengelola..."
            className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-10 pr-4 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/15"
          />
        </label>
        <div className="flex flex-wrap gap-2.5">
          <button
            type="button"
            onClick={refresh}
            aria-label="Refresh data"
            className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 bg-white text-slate-600"
          >
            <RefreshCw
              className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
            />
          </button>
          <select
            value={category}
            onChange={(event) => {
              setCategory(event.target.value);
              setPage(1);
            }}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium"
          >
            <option>Semua Kategori</option>
            {[...new Set(venues.map((venue) => venue.category))].map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
          <select
            value={status}
            onChange={(event) => {
              setStatus(event.target.value as typeof status);
              setPage(1);
            }}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium"
          >
            <option value="all">Semua Status</option>
            <option value="pending">Menunggu Verifikasi</option>
            <option value="verified">Terverifikasi</option>
            <option value="rejected">Ditolak</option>
          </select>
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <h2 className="font-bold text-slate-800">Daftar Pengajuan</h2>
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600">
              {filtered.length} Tempat
            </span>
          </div>
          <span className="flex items-center gap-1.5 text-xs text-slate-500">
            <i className="h-2 w-2 animate-pulse rounded-full bg-violet-600" />
            Live sinkronisasi admin
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-xs">
            <thead className="border-b border-slate-100 bg-slate-50/50 text-[11px] uppercase tracking-wider text-slate-400">
              <tr>
                <th className="px-6 py-3.5">Foto</th>
                <th className="px-3 py-3.5">Nama Tempat</th>
                <th className="px-3 py-3.5">Pengelola</th>
                <th className="px-3 py-3.5">Kategori</th>
                <th className="px-3 py-3.5">Tanggal</th>
                <th className="px-3 py-3.5">Status</th>
                <th className="px-6 py-3.5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((venue) => {
                const style = statusStyle[venue.status];
                return (
                  <tr
                    key={venue.id}
                    className={`hover:bg-slate-50 border-l-4 border-l-transparent`}
                  >
                    <td className="py-4 pl-5 pr-3">
                      <div className="relative h-14 w-20 overflow-hidden rounded-lg">
                        <Image
                          src={venue.imageSrc}
                          alt={venue.name}
                          fill
                          sizes="80px"
                          className="object-cover"
                        />
                        <span className="absolute bottom-1 right-1 rounded bg-black/60 px-1.5 text-[10px] text-white">
                          {venue.photoCount} Foto
                        </span>
                      </div>
                    </td>
                    <td className="px-3 py-4">
                      <b className="text-sm text-slate-800">{venue.name}</b>
                      <span className="mt-1 flex items-center gap-1 text-[11px] text-slate-400">
                        <MapPin className="h-3 w-3" />
                        {venue.city}
                      </span>
                    </td>
                    <td className="px-3 py-4">
                      <div className="flex items-center gap-2">
                        <span className="grid h-7 w-7 place-items-center rounded-full bg-indigo-100 text-[10px] font-bold text-indigo-700">
                          {venue.managerInitials}
                        </span>
                        <span className="font-medium text-slate-700">
                          {venue.managerName}
                        </span>
                      </div>
                    </td>
                    <td className="px-3 py-4">
                      <span className="rounded-md bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-600">
                        {venue.category}
                      </span>
                    </td>
                    <td className="px-3 py-4 font-medium text-slate-600">
                      {venue.submittedAt}
                    </td>
                    <td className="px-3 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-semibold ${style.className}`}
                      >
                        <i className="h-1.5 w-1.5 rounded-full bg-current" />
                        {style.label}
                      </span>
                      {venue.verifiedAt && (
                        <p className="mt-1 text-[10px] text-emerald-600">
                          ✓ {venue.verifiedAt}
                        </p>
                      )}
                      {venue.rejectionReason && (
                        <p className="mt-1 max-w-44 truncate text-[10px] text-rose-500">
                          ✕ {venue.rejectionReason}
                        </p>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        type="button"
                        onClick={() => router.push(`/admin/tempat/${venue.id}`)}
                        className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2 font-semibold ${venue.status === "pending" ? "bg-violet-600 text-white hover:bg-violet-700" : "border border-slate-200 text-slate-600 hover:bg-slate-50"}`}
                      >
                        Detail
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {rows.length === 0 && (
          <div className="py-14 text-center">
            <Search className="mx-auto h-8 w-8 text-slate-300" />
            <h3 className="mt-3 font-bold text-slate-900">
              Pengajuan tidak ditemukan
            </h3>
          </div>
        )}
        <div className="flex flex-col items-center justify-between gap-3 border-t border-slate-100 px-6 py-4 text-xs text-slate-500 sm:flex-row">
          <p>
            Menampilkan{" "}
            <b className="text-slate-700">
              {filtered.length ? (page - 1) * pageSize + 1 : 0}–
              {Math.min(page * pageSize, filtered.length)}
            </b>{" "}
            dari <b className="text-slate-700">{filtered.length}</b> pengajuan
          </p>
          <div className="flex gap-1">
            <button
              disabled={page === 1}
              onClick={() => setPage((value) => value - 1)}
              className="grid h-8 w-8 place-items-center rounded-lg border border-slate-200 disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            {Array.from({ length: totalPages }, (_, index) => index + 1).map(
              (number) => (
                <button
                  key={number}
                  onClick={() => setPage(number)}
                  className={`grid h-8 w-8 place-items-center rounded-lg border text-xs font-semibold ${page === number ? "border-violet-600 bg-violet-600 text-white" : "border-slate-200"}`}
                >
                  {number}
                </button>
              ),
            )}
            <button
              disabled={page === totalPages}
              onClick={() => setPage((value) => value + 1)}
              className="grid h-8 w-8 place-items-center rounded-lg border border-slate-200 disabled:opacity-40"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
