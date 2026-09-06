"use client";

import { Clock3, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import type { Route } from "next";

interface BookingCardProps {
  slug: string;
  price: number;
  priceUnit: string;
  durationHours: number;
  capacity: number;
  minimumBooking: string;
}

const formatRupiah = (value: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);

export default function BookingCard({
  slug,
  price,
  priceUnit,
  durationHours,
  capacity,
  minimumBooking,
}: BookingCardProps) {
  const router = useRouter();

  return (
    <aside className="lg:sticky lg:top-24">
      <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
        <div className="mb-6">
          <span className="text-2xl font-black tracking-tight text-slate-900">
            {formatRupiah(price)}
          </span>
          <span className="mt-0.5 block text-xs font-medium text-slate-400">
            / {priceUnit} ({durationHours} jam)
          </span>
        </div>
        <div className="mb-6 space-y-3 text-xs font-medium text-slate-600">
          <div className="flex items-center gap-2.5">
            <Users className="h-4 w-4 text-[#7c3aed]" />
            <span>Kapasitas: Hingga {capacity} orang</span>
          </div>
          <div className="flex items-center gap-2.5">
            <Clock3 className="h-4 w-4 text-[#7c3aed]" />
            <span>Min. Booking: {minimumBooking}</span>
          </div>
        </div>
        <button
          type="button"
          onClick={() => router.push(`/ruang/${slug}/booking` as Route)}
          className="w-full rounded-xl bg-[#8b5cf6] px-4 py-3 text-sm font-bold text-white shadow-md shadow-violet-500/20 transition-colors hover:bg-[#7c3aed] active:scale-[0.99]"
        >
          Ajukan Booking
        </button>
        <p className="mt-4 rounded-lg border border-amber-100 bg-amber-50/50 py-2 text-center text-[11px] font-medium text-amber-600">
          Proses verifikasi pengajuan maks. 2x24 jam
        </p>
      </div>
    </aside>
  );
}
