import Link from "next/link";
import { ChevronRight } from "lucide-react";
import DashboardCard from "./DashboardCard";
const bookingStatuses = [
  ["Berhasil", "2.843", "bg-emerald-600"],
  ["Menunggu", "538", "bg-amber-500"],
  ["Dibatalkan", "307", "bg-slate-400"],
  ["Ditolak", "154", "bg-rose-500"],
] as const;
const venueStatuses = [
  ["Venue Aktif Operasional", 82, "bg-emerald-500"],
  ["Menunggu Verifikasi", 10, "bg-amber-500"],
  ["Nonaktif Sementara", 6, "bg-slate-400"],
  ["Ditolak / Dihapus", 2, "bg-rose-500"],
] as const;
const ratings = [
  [5, 72],
  [4, 18],
  [3, 6],
  [2, 3],
  [1, 1],
] as const;
export default function StatusPanels() {
  return (
    <section className="grid gap-6 md:grid-cols-3">
      <DashboardCard>
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
          {bookingStatuses.map(([label, value, color]) => (
            <div key={label} className="flex items-center gap-1.5">
              <i className={`h-2.5 w-2.5 rounded-full ${color}`} />
              <span className="text-slate-500">{label}</span>
              <b className="ml-auto">{value}</b>
            </div>
          ))}
        </div>
      </DashboardCard>
      <DashboardCard>
        <div className="flex justify-between">
          <h2 className="font-bold text-slate-900">Status & Kapasitas Venue</h2>
          <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-600">
            142 Aktif
          </span>
        </div>
        <div className="mt-5 space-y-4">
          {venueStatuses.map(([label, value, color]) => (
            <div key={label}>
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
      </DashboardCard>
      <DashboardCard>
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
          {ratings.map(([stars, value]) => (
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
      </DashboardCard>
    </section>
  );
}
