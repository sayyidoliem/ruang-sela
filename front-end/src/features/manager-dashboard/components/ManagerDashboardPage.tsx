"use client";

import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";
import {
  BarChart3,
  CalendarRange,
  Clock3,
  MapPin,
  MessageSquare,
  PieChart,
  Star,
  Users,
  Wallet,
} from "lucide-react";
import { useState } from "react";
import {
  MANAGER_METRICS,
  PENDING_BOOKINGS,
  TODAY_SCHEDULE,
  VISITOR_DATA,
} from "../data/dashboard";

const VENUE_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCFRubSHzrPPt0FEEnOaZl2aOA1-hQ_MuRwGdQZz7n1C6AgEwtuu7Rc5TuTj0_j2J3Fr9tQWap3pei7rsmZuz6EuzmmkfD0xGp_UxcZE_gz3O8kd-oFYBV-lAQ7ydMNrKhAx09m8OM3Jdsq_vlhaQNGP49NH_66SVKNl4ZZb09eURK7u7GwgNciSb8o1WjtWz_xObsebI6qYOMeqr8uP9SroQt8VFzjiZ_JlyQ0RDMrU5FiM6Y3rso";
const periods = ["7 Hari", "30 Hari", "Bulan Ini", "Tahun Ini"];

export default function ManagerDashboardPage() {
  const [period, setPeriod] = useState("30 Hari");
  const metricIcons = [CalendarRange, PieChart, Users, Clock3];

  return (
    <main className="px-4 pb-12 sm:px-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">
          Dashboard Pengelola
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Pantau performa tempat dan tindak lanjuti pengajuan terbaru.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="space-y-6">
          <section className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {MANAGER_METRICS.map((metric, index) => {
              const Icon = metricIcons[index];
              return (
                <article
                  key={metric.id}
                  className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <span
                      className={`grid h-10 w-10 place-items-center rounded-xl ${metric.tone === "amber" ? "bg-amber-50 text-amber-500" : "bg-blue-50 text-blue-600"}`}
                    >
                      <Icon className="h-5 w-5" />
                    </span>
                    {metric.trend && (
                      <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-600">
                        {metric.trend}
                      </span>
                    )}
                  </div>
                  <p className="text-sm font-medium text-slate-500">
                    {metric.label}
                  </p>
                  <div className="mt-1 flex flex-wrap items-baseline gap-2">
                    <strong className="text-2xl text-slate-900">
                      {metric.value}
                    </strong>
                    <span
                      className={`text-xs ${metric.tone === "amber" ? "rounded bg-amber-50 px-2 py-0.5 font-medium text-amber-600" : "text-slate-400"}`}
                    >
                      {metric.note}
                    </span>
                  </div>
                </article>
              );
            })}
          </section>

          <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="font-bold text-slate-900">
                    Tren Penjualan & Pendapatan
                  </h2>
                  <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-600">
                    +18,4%
                  </span>
                </div>
                <p className="mt-1 text-xs text-slate-400">
                  Analisis pendapatan sewa, target bulanan, dan perbandingan kas
                  riil.
                </p>
              </div>
              <div className="flex flex-wrap rounded-xl bg-slate-100/70 p-1 text-xs">
                {periods.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setPeriod(item)}
                    className={`rounded-lg px-3 py-1.5 ${period === item ? "bg-white font-semibold text-[#7c3aed] shadow-sm" : "text-slate-600"}`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
            <div className="my-6 grid grid-cols-1 gap-4 border-b border-slate-100 pb-5 sm:grid-cols-3">
              <div>
                <p className="text-[11px] text-slate-400">Total Realisasi</p>
                <strong className="text-lg text-slate-900">Rp12.500.000</strong>
                <p className="text-[11px] font-semibold text-emerald-600">
                  ↑ 92,5% dari target
                </p>
              </div>
              <div>
                <p className="text-[11px] text-slate-400">Target Pendapatan</p>
                <strong className="text-lg text-slate-900">Rp13.500.000</strong>
                <p className="text-[11px] text-slate-400">Sisa Rp1.000.000</p>
              </div>
              <div>
                <p className="text-[11px] text-slate-400">
                  Rata-rata Transaksi
                </p>
                <strong className="text-lg text-slate-900">Rp480.000</strong>
                <p className="text-[11px] font-semibold text-[#7c3aed]">
                  26 transaksi selesai
                </p>
              </div>
            </div>
            <div className="relative h-56 overflow-hidden">
              <svg
                viewBox="0 0 650 200"
                preserveAspectRatio="none"
                className="h-full w-full"
              >
                <defs>
                  <linearGradient
                    id="managerRevenue"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0" stopColor="#7c3aed" stopOpacity=".2" />
                    <stop offset="1" stopColor="#7c3aed" stopOpacity="0" />
                  </linearGradient>
                </defs>
                {[40, 90, 140, 190].map((y) => (
                  <line
                    key={y}
                    x1="0"
                    x2="650"
                    y1={y}
                    y2={y}
                    stroke="#f1f5f9"
                    strokeDasharray="4 4"
                  />
                ))}
                <path
                  d="M10 160 Q150 140 300 110 T640 40"
                  fill="none"
                  stroke="#cbd5e1"
                  strokeDasharray="5 5"
                  strokeWidth="2"
                />
                <path
                  d="M20 170 Q160 150 300 130 T500 70 L590 78 L590 190 L20 190Z"
                  fill="url(#managerRevenue)"
                />
                <path
                  d="M20 170 Q160 150 300 130 T500 70 L590 78"
                  fill="none"
                  stroke="#7c3aed"
                  strokeWidth="3"
                />
              </svg>
              <div className="absolute right-[15%] top-4 rounded-lg bg-slate-900 px-3 py-1.5 text-center text-[10px] text-white shadow-xl">
                <b>Minggu 4: Rp3.850.000</b>
                <span className="block font-bold text-emerald-400">
                  ▲ +24% Rekor Tertinggi
                </span>
              </div>
            </div>
            <div className="flex justify-between text-[10px] font-medium text-slate-400 sm:text-xs">
              <span>Minggu 1</span>
              <span>Minggu 2</span>
              <span>Minggu 3</span>
              <span>Minggu 4</span>
              <span>Minggu 5</span>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <div className="flex flex-col justify-between gap-3 sm:flex-row">
              <div>
                <h2 className="font-bold text-slate-900">
                  Tren Pengunjung & Okupansi
                </h2>
                <p className="mt-0.5 text-xs text-slate-400">
                  Pola kedatangan warga dan utilisasi ruang per hari.
                </p>
              </div>
              <span className="self-start rounded-xl border border-slate-100 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-700">
                Jam Sibuk: 09.00–14.00
              </span>
            </div>
            <div className="mt-5 flex h-52 items-end justify-between gap-2 border-b border-slate-100 px-2">
              {VISITOR_DATA.map((item) => (
                <div
                  key={item.day}
                  className="flex h-full flex-1 flex-col items-center justify-end gap-2"
                >
                  <span
                    className={`text-[10px] font-semibold ${item.day === "Sab" ? "text-[#7c3aed]" : "text-slate-500"}`}
                  >
                    {item.visitors}
                  </span>
                  <div
                    className={`w-full max-w-8 rounded-t-lg ${item.day === "Sab" ? "bg-[#7c3aed] shadow-md shadow-purple-500/20" : "bg-indigo-100"}`}
                    style={{ height: `${item.occupancy}%` }}
                  />
                  <span
                    className={`text-xs ${item.day === "Sab" ? "font-bold text-slate-900" : "text-slate-400"}`}
                  >
                    {item.day}
                  </span>
                </div>
              ))}
            </div>
            <p className="mt-3 text-xs text-slate-500">
              Rata-rata Harian: <b className="text-slate-800">458 Pengunjung</b>{" "}
              • Okupansi Tertinggi:{" "}
              <b className="text-[#7c3aed]">Sabtu (92%)</b>
            </p>
          </section>

          <section className="flex flex-col items-center gap-6 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:flex-row">
            <div className="relative h-48 w-full shrink-0 overflow-hidden rounded-xl sm:w-64">
              <Image
                src={VENUE_IMAGE}
                alt="Aula Kelurahan Melati"
                fill
                sizes="(max-width:640px) 100vw,256px"
                className="object-cover"
              />
              <span className="absolute left-2.5 top-2.5 rounded-full bg-emerald-600/90 px-2.5 py-1 text-[11px] font-semibold text-white">
                ✓ Terverifikasi
              </span>
            </div>
            <div className="flex-1">
              <p className="flex items-center gap-1.5 text-xs font-semibold text-slate-400">
                <MapPin className="h-4 w-4" />
                Jakarta Selatan
              </p>
              <h2 className="mt-2 text-2xl font-black text-slate-900">
                Aula Kelurahan Melati
              </h2>
              <p className="mt-2 text-xs font-medium text-slate-600">
                <span className="mr-2 inline-block h-2 w-2 rounded-full bg-emerald-500" />
                Aktif dan dapat dibooking
              </p>
              <div className="mt-5 flex gap-3">
                <Link
                  href="/ruang/aula-kelurahan-melati"
                  className="rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white"
                >
                  Lihat Tempat
                </Link>
                <Link
                  href="/pengelola/tempat/aula-kelurahan-melati/edit"
                  className="rounded-xl border border-slate-300 px-5 py-2.5 text-xs font-bold text-slate-700"
                >
                  Edit Tempat
                </Link>
              </div>
            </div>
          </section>

          <div className="grid gap-5 sm:grid-cols-2">
            <article className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
              <div>
                <p className="text-xs text-slate-500">Rating Tempat</p>
                <p className="mt-1 text-2xl font-black text-slate-900">
                  4,8{" "}
                  <Star className="inline h-5 w-5 fill-amber-400 text-amber-400" />
                </p>
                <span className="text-[11px] text-slate-400">126 ulasan</span>
              </div>
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-blue-50 text-blue-500">
                <MessageSquare className="h-5 w-5" />
              </span>
            </article>
            <article className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
              <div>
                <p className="text-xs text-slate-500">Estimasi Pendapatan</p>
                <p className="mt-1 text-xl font-bold text-slate-900">
                  Rp12.500.000
                </p>
                <span className="text-[11px] text-slate-400">Bulan ini</span>
              </div>
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-emerald-50 text-emerald-500">
                <Wallet className="h-5 w-5" />
              </span>
            </article>
          </div>
        </div>

        <aside className="space-y-6">
          <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <h2 className="font-bold leading-snug text-slate-900">
              Booking Menunggu Konfirmasi
            </h2>
            <div className="mt-4 space-y-3">
              {PENDING_BOOKINGS.map((item) => (
                <article
                  key={item.id}
                  className="rounded-xl border border-slate-100 bg-slate-50/50 p-4"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <span className="rounded bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-600">
                      Menunggu
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {item.date}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">
                    {item.community}
                  </h3>
                  <p className="mt-1 text-xs text-slate-500">
                    • {item.time} • {item.participants} orang
                  </p>
                  <Link
                    href={`/pengelola/pengajuan/${item.id}` as Route}
                    className="mt-3 block rounded-xl border border-purple-200 py-2 text-center text-xs font-bold text-[#7c3aed] hover:bg-purple-50"
                  >
                    Lihat Detail
                  </Link>
                </article>
              ))}
            </div>
            <Link
              href="/pengelola/pengajuan"
              className="mt-4 block text-center text-xs font-semibold text-[#7c3aed] hover:underline"
            >
              Lihat Semua Permintaan
            </Link>
          </section>
          <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <h2 className="mb-4 font-bold text-slate-900">Jadwal Hari Ini</h2>
            <div className="relative space-y-6 pl-5 before:absolute before:bottom-2 before:left-2 before:top-2 before:w-0.5 before:bg-slate-200">
              {TODAY_SCHEDULE.map((item) => (
                <article key={item.id} className="relative">
                  <span
                    className={`absolute -left-[17px] top-1 h-2.5 w-2.5 rounded-full ring-4 ${item.active ? "bg-blue-600 ring-blue-100" : "bg-slate-400 ring-slate-100"}`}
                  />
                  <p
                    className={`text-xs ${item.active ? "font-bold text-blue-600" : "font-medium text-slate-500"}`}
                  >
                    {item.time}
                  </p>
                  <h3 className="mt-0.5 text-sm font-bold text-slate-900">
                    {item.title}
                  </h3>
                  <p className="mt-0.5 text-xs text-slate-400">{item.room}</p>
                </article>
              ))}
            </div>
          </section>
        </aside>
      </div>
    </main>
  );
}
