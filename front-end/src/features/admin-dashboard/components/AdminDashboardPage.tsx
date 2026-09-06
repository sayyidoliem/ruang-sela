"use client";

import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";
import {
  Building2,
  CalendarDays,
  ChevronDown,
  ChevronRight,
  CreditCard,
  Download,
  HelpCircle,
  MapPin,
  Star,
  TrendingUp,
  UsersRound,
} from "lucide-react";
import { useState } from "react";
import {
  ADMIN_KPIS,
  ADMIN_TASKS,
  BOOKING_CATEGORIES,
  POPULAR_VENUES,
  REVENUE_SERIES,
} from "../data/dashboard";

const periods = [
  "7 Hari Terakhir",
  "30 Hari Terakhir",
  "90 Hari Terakhir",
  "Tahun Ini",
];
const kpiIcons = [UsersRound, CalendarDays, CreditCard, Building2];

export default function AdminDashboardPage() {
  const [period, setPeriod] = useState("30 Hari Terakhir");
  const [chartMode, setChartMode] = useState<"revenue" | "bookings">("revenue");

  const downloadReport = () => {
    const rows = [
      ["Metrik", "Nilai", "Tren"],
      ...ADMIN_KPIS.map((item) => [item.label, item.value, item.trend]),
    ];
    const csv = rows
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");
    const url = URL.createObjectURL(
      new Blob([csv], { type: "text/csv;charset=utf-8" }),
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = "ruangsela-admin-report.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main className="space-y-6 p-4 sm:p-8">
      <header>
        <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500">
          Pantau kesehatan platform, transaksi, venue, dan pengguna.
        </p>
      </header>
      <div className="flex flex-wrap items-center gap-3">
        <label className="relative">
          <span className="sr-only">Periode laporan</span>
          <select
            value={period}
            onChange={(event) => setPeriod(event.target.value)}
            className="appearance-none rounded-lg border border-slate-200 bg-white py-2 pl-4 pr-10 text-xs font-semibold text-slate-700 shadow-sm outline-none"
          >
            {periods.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        </label>
        <button
          type="button"
          onClick={downloadReport}
          className="inline-flex items-center gap-2 rounded-lg bg-[#6941C6] px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#5b37ae]"
        >
          <Download className="h-4 w-4" />
          Unduh Laporan
        </button>
      </div>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {ADMIN_KPIS.map((item, index) => {
          const Icon = kpiIcons[index];
          const tones = {
            purple: "bg-purple-50 text-[#6941C6]",
            green: "bg-emerald-50 text-emerald-600",
            amber: "bg-amber-50 text-amber-600",
          };
          return (
            <article
              key={item.id}
              className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm"
            >
              <div className="mb-4 flex items-center justify-between">
                <span
                  className={`grid h-10 w-10 place-items-center rounded-xl ${tones[item.tone]}`}
                >
                  <Icon className="h-5 w-5" />
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-600">
                  <TrendingUp className="h-3 w-3" />
                  {item.trend}
                </span>
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                {item.label}
              </span>
              <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900">
                {item.value}
              </h2>
              <p className="mt-2 text-xs text-slate-500">{item.note}</p>
            </article>
          );
        })}
      </section>

      <section className="grid gap-6 xl:grid-cols-3">
        <article className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm xl:col-span-2">
          <div className="flex flex-col justify-between gap-4 border-b border-slate-100 pb-4 sm:flex-row">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-bold text-slate-900">
                  Pertumbuhan Pendapatan & Booking
                </h2>
                <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-[11px] font-semibold text-indigo-600">
                  Tren Bulanan
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-400">
                Realisasi target enam bulan terakhir
              </p>
            </div>
            <div className="flex rounded-xl bg-slate-100 p-1 text-xs">
              {(["revenue", "bookings"] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setChartMode(mode)}
                  className={`rounded-lg px-3.5 py-1.5 ${chartMode === mode ? "bg-white font-semibold text-[#6941C6] shadow-sm" : "text-slate-500"}`}
                >
                  {mode === "revenue" ? "Pendapatan" : "Jumlah Booking"}
                </button>
              ))}
            </div>
          </div>
          <div className="my-5 flex flex-wrap items-baseline gap-2">
            <span className="text-xs text-slate-400">Total Realisasi:</span>
            <strong className="text-lg text-slate-900">
              {chartMode === "revenue" ? "Rp 125.400.000" : "3.842 booking"}
            </strong>
            <span className="text-xs font-semibold text-emerald-600">
              +24,2% vs periode lalu
            </span>
          </div>
          <div className="flex h-64 items-end gap-3 border-b border-slate-100 px-2">
            {REVENUE_SERIES.map((item, index) => {
              const value =
                chartMode === "revenue" ? item.revenue : item.bookings / 30;
              return (
                <div
                  key={item.month}
                  className="flex h-full flex-1 flex-col items-center justify-end gap-2"
                >
                  <span
                    className={`text-[10px] font-semibold ${index === 5 ? "text-[#6941C6]" : "text-slate-400"}`}
                  >
                    {chartMode === "revenue"
                      ? `Rp ${item.revenue} jt`
                      : item.bookings}
                  </span>
                  <div
                    className={`w-full max-w-12 rounded-t-lg ${index === 5 ? "bg-[#6941C6] shadow-lg shadow-purple-500/20" : "bg-purple-100"}`}
                    style={{ height: `${Math.max(18, value * 2.5)}%` }}
                  />
                  <span
                    className={`text-xs ${index === 5 ? "font-bold text-[#6941C6]" : "text-slate-400"}`}
                  >
                    {item.month}
                  </span>
                </div>
              );
            })}
          </div>
        </article>

        <article className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="font-bold text-slate-900">Menunggu Tindakan</h2>
              <p className="mt-0.5 text-xs text-slate-400">
                Antrean mendesak hari ini
              </p>
            </div>
            <span className="rounded-full border border-rose-100 bg-rose-50 px-2.5 py-0.5 text-xs font-bold text-rose-600">
              18 tugas
            </span>
          </div>
          <div className="mt-4 space-y-3">
            {ADMIN_TASKS.map((task) => {
              const tone = {
                amber: "bg-amber-50 text-amber-600",
                green: "bg-emerald-50 text-emerald-600",
                indigo: "bg-indigo-50 text-indigo-600",
                rose: "bg-rose-50 text-rose-600",
              }[task.tone];
              return (
                <Link
                  key={task.id}
                  href={task.href as Route}
                  className="flex items-center justify-between rounded-xl border border-slate-100 p-3 hover:bg-slate-50"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <span
                      className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg ${tone}`}
                    >
                      <HelpCircle className="h-4 w-4" />
                    </span>
                    <span className="min-w-0">
                      <b className="block truncate text-xs text-slate-800">
                        {task.title}
                      </b>
                      <small className="block truncate text-[11px] text-slate-400">
                        {task.description}
                      </small>
                    </span>
                  </div>
                  <span className="ml-2 flex items-center gap-1">
                    <b className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px]">
                      {task.count}
                    </b>
                    <ChevronRight className="h-4 w-4 text-slate-300" />
                  </span>
                </Link>
              );
            })}
          </div>
          
        </article>
      </section>

      <section className="grid gap-6 xl:grid-cols-3">
        <article className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm xl:col-span-2">
          <div className="flex items-center justify-between border-b border-slate-100 pb-5">
            <div>
              <h2 className="font-bold text-slate-900">
                Tren Booking Berdasarkan Kategori & Waktu
              </h2>
              <p className="text-xs text-slate-400">
                Distribusi pemesanan bulan ini
              </p>
            </div>
            <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-semibold text-indigo-600">
              Bulan Ini
            </span>
          </div>
          <div className="mt-5 space-y-4">
            {BOOKING_CATEGORIES.map((item) => (
              <div key={item.name}>
                <div className="mb-1.5 flex justify-between gap-4 text-xs font-bold text-slate-800">
                  <span>{item.name}</span>
                  <span>
                    {item.value.toLocaleString("id-ID")} ({item.percent}%)
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className={`h-full rounded-full ${item.color}`}
                    style={{ width: `${item.percent}%` }}
                  />
                </div>
                <div className="mt-1 flex justify-between text-[11px] text-slate-400">
                  <span>Jam favorit: {item.time}</span>
                  <span className="font-medium text-slate-600">
                    {item.revenue}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="font-bold text-slate-900">🏆 Venue Terpopuler</h2>
              <p className="text-xs text-slate-400">
                Berdasarkan volume booking
              </p>
            </div>
            <Link
              href="/admin/tempat"
              className="text-xs font-semibold text-[#6941C6]"
            >
              Lihat Semua
            </Link>
          </div>
          <div className="mt-2 divide-y divide-slate-100">
            {POPULAR_VENUES.map((venue, index) => (
              <div
                key={venue.id}
                className="flex items-center justify-between py-3"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span
                    className={`grid h-6 w-6 shrink-0 place-items-center rounded-full text-xs font-bold ${index === 0 ? "bg-amber-50 text-amber-600" : "bg-slate-100 text-slate-600"}`}
                  >
                    {index + 1}
                  </span>
                  {venue.imageSrc ? (
                    <span className="relative h-9 w-9 shrink-0 overflow-hidden rounded-xl">
                      <Image
                        src={venue.imageSrc}
                        alt={venue.name}
                        fill
                        sizes="36px"
                        className="object-cover"
                      />
                    </span>
                  ) : (
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-indigo-50 text-xs font-bold text-indigo-700">
                      WM
                    </span>
                  )}
                  <span className="min-w-0">
                    <b className="block truncate text-xs text-slate-800">
                      {venue.name}
                    </b>
                    <small className="flex items-center gap-1 text-[11px] text-slate-400">
                      <MapPin className="h-3 w-3" />
                      {venue.city}
                    </small>
                  </span>
                </div>
                <span className="text-right">
                  <b className="block text-xs text-slate-800">
                    {venue.bookings} booking
                  </b>
                  <small className="font-semibold text-amber-500">
                    ★ {venue.rating}
                  </small>
                </span>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        <article className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <div className="flex justify-between">
            <h2 className="font-bold text-slate-900">Status Booking</h2>
            <span className="text-xs text-slate-400">Total 3.842</span>
          </div>
          <div className="mx-auto my-5 grid h-36 w-36 place-items-center rounded-full bg-[conic-gradient(#0d9488_0_74%,#f59e0b_74%_88%,#94a3b8_88%_96%,#f43f5e_96%)]">
            <div className="grid h-24 w-24 place-items-center rounded-full bg-white text-center">
              <span>
                <b className="block text-2xl text-slate-900">74%</b>
                <small className="font-bold text-emerald-700">BERHASIL</small>
              </span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {[
              ["Berhasil", "2.843", "bg-emerald-600"],
              ["Menunggu", "538", "bg-amber-500"],
              ["Dibatalkan", "307", "bg-slate-400"],
              ["Ditolak", "154", "bg-rose-500"],
            ].map(([a, b, c]) => (
              <div key={a} className="flex items-center gap-1.5">
                <i className={`h-2.5 w-2.5 rounded-full ${c}`} />
                <span className="text-slate-500">{a}</span>
                <b className="ml-auto">{b}</b>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <div className="flex justify-between">
            <h2 className="font-bold text-slate-900">
              Status & Kapasitas Venue
            </h2>
            <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-600">
              142 Aktif
            </span>
          </div>
          <div className="mt-5 space-y-4">
            {[
              ["Venue Aktif Operasional", 82, "bg-emerald-500"],
              ["Menunggu Verifikasi", 10, "bg-amber-500"],
              ["Nonaktif Sementara", 6, "bg-slate-400"],
              ["Ditolak / Dihapus", 2, "bg-rose-500"],
            ].map(([label, value, color]) => (
              <div key={String(label)}>
                <div className="mb-1 flex justify-between text-xs">
                  <span className="text-slate-600">{label}</span>
                  <b>{value}%</b>
                </div>
                <div className="h-1.5 rounded-full bg-slate-100">
                  <div
                    className={`h-full rounded-full ${color}`}
                    style={{ width: `${value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <Link
            href="/admin/tempat"
            className="mt-5 flex items-center justify-end gap-1 border-t border-slate-100 pt-4 text-xs font-bold text-[#6941C6]"
          >
            Kelola Listing
            <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </article>

        <article className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <div className="flex justify-between">
            <h2 className="font-bold text-slate-900">Rating & Kepuasan</h2>
            <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-600">
              96% Puas
            </span>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <b className="text-3xl text-slate-900">4,7</b>
            <span className="text-sm text-slate-400">/ 5,0</span>
            <span className="text-amber-400">★★★★★</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">
            Berdasarkan 3.842 ulasan terverifikasi
          </p>
          <div className="mt-5 space-y-2">
            {[
              [5, 72],
              [4, 18],
              [3, 6],
              [2, 3],
              [1, 1],
            ].map(([stars, value]) => (
              <div key={stars} className="flex items-center gap-2 text-xs">
                <span className="w-5">{stars}★</span>
                <div className="h-2 flex-1 rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-amber-400"
                    style={{ width: `${value}%` }}
                  />
                </div>
                <span className="w-8 text-right text-slate-500">{value}%</span>
              </div>
            ))}
          </div>
        </article>
      </section>
    </main>
  );
}
