import Image from "next/image";
import type {
  ManagerBooking,
  BookingStatus,
} from "../../types/manager-booking";
import { BOOKING_STATUS, formatRupiah } from "./config";
export default function BookingCard({
  booking,
  selected,
  onSelect,
  onStatus,
}: {
  booking: ManagerBooking;
  selected: boolean;
  onSelect: () => void;
  onStatus: (s: BookingStatus) => void;
}) {
  const s = BOOKING_STATUS[booking.status];
  return (
    <article
      onClick={onSelect}
      className={`cursor-pointer rounded-xl border border-l-4 bg-white p-5 shadow-sm ${s.border} ${selected ? "ring-2 ring-blue-500/15" : ""}`}
    >
      <div className="flex gap-4">
        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full">
          <Image
            src={booking.avatarSrc}
            alt={booking.borrowerName}
            fill
            sizes="48px"
            className="object-cover"
          />
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="font-bold">{booking.borrowerName}</h2>
          <p className="text-xs text-slate-500">
            {booking.community} • #{booking.bookingCode}
          </p>
          <p className="mt-3 text-sm font-bold">{booking.eventName}</p>
          <p className="text-xs text-slate-500">
            {booking.roomName} • {booking.date} • {booking.time}
          </p>
        </div>
        <div className="text-right">
          <span
            className={`rounded border px-2.5 py-0.5 text-[11px] font-semibold ${s.badge}`}
          >
            {s.label}
          </span>
          <p className="mt-4 font-extrabold">
            {formatRupiah(booking.roomPrice + booking.facilityPrice)}
          </p>
          {booking.status === "pending" && (
            <div className="mt-3 flex gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onStatus("rejected");
                }}
                className="rounded-lg border border-rose-200 px-3 py-1.5 text-xs text-rose-500"
              >
                Tolak
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onStatus("approved");
                }}
                className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs text-white"
              >
                Terima
              </button>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
