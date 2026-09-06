"use client";

import Image from "next/image";
import {
  Building2,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  CircleStop,
  Clock3,
  Eye,
  FileText,
  Hourglass,
  Mail,
  MessageCircle,
  Phone,
  PlayCircle,
  RefreshCw,
  Search,
  SlidersHorizontal,
  Star,
  UserRound,
  Users,
  X,
  XCircle,
} from "lucide-react";
import { useMemo, useState } from "react";
import { INITIAL_MANAGER_BOOKINGS } from "../data/bookings";
import type { BookingStatus, ManagerBooking } from "../types/manager-booking";

const FILTERS: Array<{
  id: "all" | BookingStatus;
  label: string;
  icon: typeof CheckCircle2;
}> = [
  { id: "all", label: "Semua", icon: FileText },
  { id: "approved", label: "Disetujui", icon: CheckCircle2 },
  { id: "ongoing", label: "Berlangsung", icon: PlayCircle },
  { id: "pending", label: "Menunggu", icon: Hourglass },
  { id: "completed", label: "Selesai", icon: CheckCircle2 },
  { id: "rejected", label: "Ditolak", icon: XCircle },
  { id: "cancelled", label: "Dibatalkan", icon: CircleStop },
];

const STATUS_STYLES: Record<
  BookingStatus,
  { label: string; border: string; badge: string }
> = {
  approved: {
    label: "Disetujui",
    border: "border-l-emerald-500",
    badge: "border-emerald-300 bg-emerald-50 text-emerald-600",
  },
  ongoing: {
    label: "Berlangsung",
    border: "border-l-blue-600",
    badge: "border-blue-300 bg-blue-50 text-blue-600",
  },
  pending: {
    label: "Menunggu",
    border: "border-l-amber-500",
    badge: "border-amber-300 bg-amber-50 text-amber-600",
  },
  completed: {
    label: "Selesai",
    border: "border-l-purple-500",
    badge: "border-purple-300 bg-purple-50 text-purple-600",
  },
  rejected: {
    label: "Ditolak",
    border: "border-l-rose-500",
    badge: "border-rose-300 bg-rose-50 text-rose-600",
  },
  cancelled: {
    label: "Dibatalkan",
    border: "border-l-slate-300",
    badge: "border-slate-300 bg-slate-50 text-slate-500",
  },
};

const formatRupiah = (value: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);

export default function ManagerBookingsPage() {
  const [bookings, setBookings] = useState(INITIAL_MANAGER_BOOKINGS);
  const [filter, setFilter] = useState<"all" | BookingStatus>("all");
  const [query, setQuery] = useState("");
  const [sortNewest, setSortNewest] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>("booking-2");
  const [visibleCount, setVisibleCount] = useState(5);

  const counts = useMemo(
    () =>
      Object.fromEntries(
        FILTERS.map((item) => [
          item.id,
          item.id === "all"
            ? bookings.length
            : bookings.filter((booking) => booking.status === item.id).length,
        ]),
      ),
    [bookings],
  );
  const filtered = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase("id-ID");
    const result = bookings.filter((booking) => {
      const statusMatch = filter === "all" || booking.status === filter;
      const searchMatch =
        !normalized ||
        [
          booking.borrowerName,
          booking.community,
          booking.bookingCode,
          booking.eventName,
          booking.roomName,
        ]
          .join(" ")
          .toLocaleLowerCase("id-ID")
          .includes(normalized);
      return statusMatch && searchMatch;
    });
    return sortNewest ? result : [...result].reverse();
  }, [bookings, filter, query, sortNewest]);

  const selected =
    bookings.find((booking) => booking.id === selectedId) ?? null;
  const updateStatus = (id: string, status: BookingStatus) =>
    setBookings((current) =>
      current.map((booking) =>
        booking.id === id
          ? {
              ...booking,
              status,
              paymentStatus:
                status === "approved"
                  ? "Menunggu Pelunasan"
                  : booking.paymentStatus,
            }
          : booking,
      ),
    );

  return (
    <main className="px-4 pb-10 sm:px-8">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Manajemen Booking</h1>
        <p className="mt-1 text-sm text-slate-500">
          Tinjau, konfirmasi, dan pantau seluruh pengajuan penggunaan tempat.
        </p>
      </header>
      <div className="flex min-h-[calc(100vh-9rem)] gap-6">
        <div className="min-w-0 flex-1">
          <section
            className="mb-6 space-y-3"
            aria-label="Filter status booking"
          >
            <div className="flex flex-wrap gap-2">
              {FILTERS.map((item) => {
                const Icon = item.icon;
                const active = filter === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setFilter(item.id);
                      setVisibleCount(5);
                    }}
                    className={`inline-flex items-center gap-2 rounded-lg border px-3.5 py-2 text-xs font-semibold transition ${active ? "border-blue-600 bg-blue-600 text-white shadow-sm" : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"}`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {item.label}
                    <span
                      className={
                        active
                          ? "rounded bg-white/20 px-1.5 py-0.5"
                          : "text-slate-400"
                      }
                    >
                      {counts[item.id] ?? 0}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <label className="relative block w-full max-w-md">
              <span className="sr-only">Cari booking</span>
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Cari nama kegiatan, peminjam, ID..."
                className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-4 text-xs outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15"
              />
            </label>
            <button
              type="button"
              onClick={() => setSortNewest((value) => !value)}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              <SlidersHorizontal className="h-3.5 w-3.5 text-slate-400" />
              Urutkan: {sortNewest ? "Terkini" : "Terlama"}
              <ChevronDown className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="space-y-4">
            {filtered.slice(0, visibleCount).map((booking) => {
              const status = STATUS_STYLES[booking.status];
              const total = booking.roomPrice + booking.facilityPrice;
              return (
                <article
                  key={booking.id}
                  onClick={() => setSelectedId(booking.id)}
                  className={`cursor-pointer rounded-xl border border-l-4 border-slate-100 bg-white p-5 shadow-sm transition hover:shadow-md ${status.border} ${selectedId === booking.id ? "ring-2 ring-blue-500/15" : ""}`}
                >
                  <div className="flex flex-col gap-5 xl:flex-row xl:items-stretch xl:justify-between">
                    <div className="flex min-w-0 flex-1 items-start gap-4">
                      <div className="relative mt-1 h-12 w-12 shrink-0 overflow-hidden rounded-full border border-slate-100">
                        <Image
                          src={booking.avatarSrc}
                          alt={booking.borrowerName}
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0 flex-1 space-y-3">
                        <div>
                          <h2 className="text-sm font-bold text-slate-900">
                            {booking.borrowerName}
                          </h2>
                          <p className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                            <span className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              {booking.community}
                            </span>
                            <span className="text-slate-300">
                              #{booking.bookingCode}
                            </span>
                          </p>
                        </div>
                        <div className="grid gap-4 text-xs md:grid-cols-2">
                          <div>
                            <span className="flex items-center gap-1.5 text-[11px] text-slate-400">
                              <Building2 className="h-3 w-3" />
                              Ruangan & Acara
                            </span>
                            <p className="mt-0.5 font-bold text-slate-800">
                              {booking.eventName}
                            </p>
                            <p className="text-[11px] text-slate-500">
                              {booking.roomName} • {booking.roomDetail}
                            </p>
                          </div>
                          <div>
                            <span className="flex items-center gap-1.5 text-[11px] text-slate-400">
                              <CalendarDays className="h-3 w-3" />
                              Jadwal & Kapasitas
                            </span>
                            <p className="mt-0.5 font-bold text-slate-800">
                              {booking.date} • {booking.time}
                            </p>
                            <p className="flex items-center gap-1 text-[11px] text-slate-500">
                              <UserRound className="h-3 w-3" />
                              {booking.participants} Orang •{" "}
                              {booking.facilities.join(" + ")}
                            </p>
                            {booking.checkIn && (
                              <p className="text-[11px] font-medium text-emerald-600">
                                Check-in: {booking.checkIn}
                              </p>
                            )}
                            {booking.rejectionReason && (
                              <p className="truncate text-[11px] font-medium text-rose-600">
                                {booking.rejectionReason}
                              </p>
                            )}
                            {booking.rating && (
                              <p className="flex items-center gap-1 text-[11px] font-semibold text-amber-500">
                                <Star className="h-3 w-3 fill-current" />
                                {booking.rating.toFixed(1)} Review Peminjam
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex min-w-0 flex-col justify-between gap-4 border-t border-slate-100 pt-4 xl:min-w-[210px] xl:border-l xl:border-t-0 xl:pl-5 xl:pt-0">
                      <div className="flex flex-wrap items-center gap-1.5 xl:justify-end">
                        <span
                          className={`inline-flex items-center gap-1 rounded border px-2.5 py-0.5 text-[11px] font-semibold ${status.badge}`}
                        >
                          {status.label}
                        </span>
                        <span className="rounded border border-slate-300 px-2.5 py-0.5 text-[11px] font-semibold text-slate-600">
                          {booking.paymentStatus}
                        </span>
                      </div>
                      <p
                        className={`text-left text-base font-extrabold xl:text-right ${["rejected", "cancelled"].includes(booking.status) ? "text-slate-400 line-through" : "text-slate-900"}`}
                      >
                        {formatRupiah(total)}
                      </p>
                      <div className="grid grid-cols-2 gap-2 xl:grid-cols-1">
                        {booking.status === "pending" ? (
                          <>
                            <button
                              type="button"
                              onClick={(event) => {
                                event.stopPropagation();
                                updateStatus(booking.id, "rejected");
                              }}
                              className="rounded-lg border border-rose-200 py-1.5 text-xs font-semibold text-rose-500 hover:bg-rose-50"
                            >
                              Tolak
                            </button>
                            <button
                              type="button"
                              onClick={(event) => {
                                event.stopPropagation();
                                updateStatus(booking.id, "approved");
                              }}
                              className="rounded-lg bg-blue-600 py-1.5 text-xs font-semibold text-white hover:bg-blue-700"
                            >
                              Terima
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              type="button"
                              className="rounded-lg border border-slate-200 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                            >
                              Hubungi
                            </button>
                            <button
                              type="button"
                              className="rounded-lg border border-blue-500 py-1.5 text-xs font-semibold text-blue-600 hover:bg-blue-50"
                            >
                              Lihat Detail
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {filtered.length === 0 && (
            <div className="rounded-xl border border-dashed border-slate-300 bg-white py-14 text-center">
              <Search className="mx-auto h-8 w-8 text-slate-300" />
              <h2 className="mt-3 font-bold text-slate-900">
                Booking tidak ditemukan
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Ubah filter atau kata kunci pencarian.
              </p>
            </div>
          )}
          {visibleCount < filtered.length && (
            <button
              type="button"
              onClick={() => setVisibleCount((count) => count + 5)}
              className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 bg-white py-3.5 text-xs font-bold text-slate-700 hover:bg-slate-50"
            >
              <RefreshCw className="h-3.5 w-3.5 text-slate-400" />
              Muat Lebih Banyak Pengajuan
            </button>
          )}
        </div>

        {selected && (
          <BookingDetailDrawer
            booking={selected}
            onClose={() => setSelectedId(null)}
            onAccept={() => updateStatus(selected.id, "approved")}
            onReject={() => updateStatus(selected.id, "rejected")}
          />
        )}
      </div>
    </main>
  );
}

function BookingDetailDrawer({
  booking,
  onClose,
  onAccept,
  onReject,
}: {
  booking: ManagerBooking;
  onClose: () => void;
  onAccept: () => void;
  onReject: () => void;
}) {
  const total = booking.roomPrice + booking.facilityPrice;
  return (
    <>
      <button
        type="button"
        aria-label="Tutup detail"
        onClick={onClose}
        className="fixed inset-0 z-30 bg-slate-950/30 xl:hidden"
      />
      <aside className="fixed inset-y-0 right-0 z-40 flex w-full max-w-[360px] flex-col border-l border-slate-100 bg-white shadow-2xl xl:sticky xl:top-20 xl:z-10 xl:h-[calc(100vh-6rem)] xl:shrink-0 xl:shadow-[-4px_0_16px_rgba(0,0,0,0.02)]">
        <div className="min-h-0 flex-1 overflow-y-auto">
          <div className="relative h-44 bg-slate-800">
            <Image
              src={booking.roomImageSrc}
              alt={booking.roomName}
              fill
              sizes="360px"
              className="object-cover opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20" />
            <button
              type="button"
              onClick={onClose}
              aria-label="Tutup detail"
              className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-white/30 text-white backdrop-blur-sm hover:bg-white/50"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="absolute bottom-3 left-4 text-white">
              <p className="text-[10px] font-medium uppercase tracking-wide opacity-80">
                Booking ID: #{booking.bookingCode}
              </p>
              <h2 className="mt-0.5 text-lg font-bold">{booking.roomName}</h2>
            </div>
          </div>
          <div className="space-y-6 p-5">
            <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3.5">
              <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full">
                <Image
                  src={booking.avatarSrc}
                  alt={booking.borrowerName}
                  fill
                  sizes="40px"
                  className="object-cover"
                />
              </div>
              <div className="min-w-0">
                <h3 className="text-sm font-bold text-slate-900">
                  {booking.borrowerName}
                </h3>
                <p className="mt-1 flex items-center gap-1.5 truncate text-xs text-slate-500">
                  <Mail className="h-3 w-3" />
                  {booking.email}
                </p>
                <p className="mt-0.5 flex items-center gap-1.5 text-xs text-slate-500">
                  <Phone className="h-3 w-3" />
                  {booking.phone}
                </p>
              </div>
            </div>
            <section>
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-blue-600">
                Informasi Kegiatan
              </h3>
              <dl className="mt-3 space-y-2 text-xs">
                <div className="flex justify-between gap-4">
                  <dt className="text-slate-400">Tujuan</dt>
                  <dd className="text-right font-bold text-slate-900">
                    {booking.eventName}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-400">Jumlah Peserta</dt>
                  <dd className="font-bold text-slate-900">
                    {booking.participants} Orang
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="shrink-0 text-slate-400">Catatan</dt>
                  <dd className="text-right font-medium text-slate-700">
                    {booking.notes}
                  </dd>
                </div>
              </dl>
            </section>
            <section>
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-blue-600">
                Ringkasan Biaya
              </h3>
              <dl className="mt-3 space-y-2.5 rounded-xl border border-slate-100 bg-slate-50/70 p-3.5 text-xs">
                <div className="flex justify-between">
                  <dt className="text-slate-500">Sewa Ruangan</dt>
                  <dd className="font-semibold text-slate-800">
                    {formatRupiah(booking.roomPrice)}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-500">Fasilitas Tambahan</dt>
                  <dd className="font-semibold text-slate-800">
                    {formatRupiah(booking.facilityPrice)}
                  </dd>
                </div>
                <div className="flex items-center justify-between border-t border-slate-200 pt-2">
                  <dt className="font-bold text-slate-900">Total</dt>
                  <dd className="text-base font-black text-emerald-600">
                    {formatRupiah(total)}
                  </dd>
                </div>
              </dl>
            </section>
          </div>
        </div>
        {booking.status === "pending" && (
          <div className="grid grid-cols-2 gap-3 border-t border-slate-100 bg-white p-4">
            <button
              type="button"
              onClick={onReject}
              className="flex items-center justify-center gap-1.5 rounded-xl border border-rose-500 px-4 py-2.5 text-xs font-bold text-rose-600 hover:bg-rose-50"
            >
              <X className="h-4 w-4" />
              Tolak
            </button>
            <button
              type="button"
              onClick={onAccept}
              className="flex items-center justify-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-blue-700"
            >
              <Check className="h-4 w-4" />
              Terima
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
