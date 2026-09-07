import Image from "next/image";
import { Check, X } from "lucide-react";
import type { ManagerBooking } from "../../types/manager-booking";
import { formatRupiah } from "./config";
export default function BookingDetailDrawer({
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
  return (
    <aside className="fixed inset-y-0 right-0 z-40 flex w-full max-w-[360px] flex-col bg-white shadow-2xl xl:sticky xl:top-20 xl:h-[calc(100vh-6rem)]">
      <div className="relative h-44">
        <Image
          src={booking.roomImageSrc}
          alt={booking.roomName}
          fill
          sizes="360px"
          className="object-cover"
        />
        <button
          onClick={onClose}
          className="absolute right-3 top-3 rounded-full bg-white/50 p-2"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      <div className="flex-1 space-y-5 overflow-y-auto p-5">
        <h2 className="text-lg font-bold">{booking.roomName}</h2>
        <section>
          <h3 className="text-xs font-bold text-blue-600">
            INFORMASI KEGIATAN
          </h3>
          <p className="mt-2 text-sm font-bold">{booking.eventName}</p>
          <p className="text-xs text-slate-500">{booking.participants} orang</p>
          <p className="mt-2 text-xs">{booking.notes}</p>
        </section>
        <section>
          <h3 className="text-xs font-bold text-blue-600">RINGKASAN BIAYA</h3>
          <p className="mt-2 flex justify-between text-sm">
            <span>Total</span>
            <b>{formatRupiah(booking.roomPrice + booking.facilityPrice)}</b>
          </p>
        </section>
      </div>
      {booking.status === "pending" && (
        <div className="grid grid-cols-2 gap-3 border-t p-4">
          <button
            onClick={onReject}
            className="rounded-xl border border-rose-500 py-2.5 text-xs font-bold text-rose-600"
          >
            <X className="inline h-4 w-4" /> Tolak
          </button>
          <button
            onClick={onAccept}
            className="rounded-xl bg-blue-600 py-2.5 text-xs font-bold text-white"
          >
            <Check className="inline h-4 w-4" /> Terima
          </button>
        </div>
      )}
    </aside>
  );
}
