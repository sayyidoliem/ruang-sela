"use client";
import { useMemo, useState } from "react";
import { RefreshCw, Search } from "lucide-react";
import { INITIAL_MANAGER_BOOKINGS } from "../data/bookings";
import type { BookingStatus } from "../types/manager-booking";
import BookingCard from "./bookings/BookingCard";
import BookingDetailDrawer from "./bookings/BookingDetailDrawer";
import BookingFilters from "./bookings/BookingFilters";
import { BOOKING_FILTERS } from "./bookings/config";
export default function ManagerBookingsPage() {
  const [bookings, setBookings] = useState(INITIAL_MANAGER_BOOKINGS);
  const [filter, setFilter] = useState<"all" | BookingStatus>("all");
  const [query, setQuery] = useState("");
  const [newest, setNewest] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>("booking-2");
  const [visible, setVisible] = useState(5);
  const counts = useMemo(
    () =>
      Object.fromEntries(
        BOOKING_FILTERS.map((i) => [
          i.id,
          i.id === "all"
            ? bookings.length
            : bookings.filter((b) => b.status === i.id).length,
        ]),
      ),
    [bookings],
  );
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const r = bookings.filter(
      (b) =>
        (filter === "all" || b.status === filter) &&
        [b.borrowerName, b.community, b.bookingCode, b.eventName, b.roomName]
          .join(" ")
          .toLowerCase()
          .includes(q),
    );
    return newest ? r : [...r].reverse();
  }, [bookings, filter, query, newest]);
  const selected = bookings.find((b) => b.id === selectedId) ?? null;
  const update = (id: string, status: BookingStatus) =>
    setBookings((c) =>
      c.map((b) =>
        b.id === id
          ? {
              ...b,
              status,
              paymentStatus:
                status === "approved" ? "Menunggu Pelunasan" : b.paymentStatus,
            }
          : b,
      ),
    );
  return (
    <main className="px-4 pb-10 sm:px-8">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">Manajemen Booking</h1>
        <p className="text-sm text-slate-500">
          Tinjau, konfirmasi, dan pantau seluruh pengajuan penggunaan tempat.
        </p>
      </header>
      <div className="flex gap-6">
        <div className="min-w-0 flex-1">
          <BookingFilters
            filter={filter}
            counts={counts}
            query={query}
            newest={newest}
            onFilter={(v) => {
              setFilter(v);
              setVisible(5);
            }}
            onQuery={setQuery}
            onSort={() => setNewest((v) => !v)}
          />
          <div className="space-y-4">
            {filtered.slice(0, visible).map((b) => (
              <BookingCard
                key={b.id}
                booking={b}
                selected={selectedId === b.id}
                onSelect={() => setSelectedId(b.id)}
                onStatus={(s) => update(b.id, s)}
              />
            ))}
          </div>
          {!filtered.length && (
            <div className="py-14 text-center">
              <Search className="mx-auto text-slate-300" />
              <h2 className="mt-3 font-bold">Booking tidak ditemukan</h2>
            </div>
          )}
          {visible < filtered.length && (
            <button
              onClick={() => setVisible((v) => v + 5)}
              className="mt-8 w-full rounded-xl border border-dashed py-3.5 text-xs font-bold"
            >
              <RefreshCw className="mr-2 inline h-3.5 w-3.5" />
              Muat Lebih Banyak Pengajuan
            </button>
          )}
        </div>
        {selected && (
          <BookingDetailDrawer
            booking={selected}
            onClose={() => setSelectedId(null)}
            onAccept={() => update(selected.id, "approved")}
            onReject={() => update(selected.id, "rejected")}
          />
        )}
      </div>
    </main>
  );
}
