import Image from "next/image";
import Link from "next/link";
import { MapPin } from "lucide-react";
import DashboardCard from "./DashboardCard";
interface Venue {
  id: string;
  name: string;
  city: string;
  bookings: number;
  rating: number;
  imageSrc?: string | null;
}
export default function PopularVenuesPanel({
  venues,
}: {
  venues: readonly Venue[];
}) {
  return (
    <DashboardCard>
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <h2 className="font-bold text-slate-900">🏆 Venue Terpopuler</h2>
          <p className="text-xs text-slate-400">Berdasarkan volume booking</p>
        </div>
        <Link
          href="/admin/tempat"
          className="text-xs font-semibold text-[#6941C6]"
        >
          Lihat Semua
        </Link>
      </div>
      <div className="mt-2 divide-y divide-slate-100">
        {venues.map((venue, index) => (
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
    </DashboardCard>
  );
}
