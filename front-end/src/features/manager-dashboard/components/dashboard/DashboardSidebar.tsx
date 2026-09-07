import Link from "next/link";
import type { Route } from "next";
import type {
  ManagerSchedule,
  PendingBooking,
} from "../../types/manager-dashboard";
export default function DashboardSidebar({
  bookings,
  schedule,
}: {
  bookings: PendingBooking[];
  schedule: ManagerSchedule[];
}) {
  return (
    <aside className="space-y-6">
      <section className="rounded-2xl border bg-white p-6 shadow-sm">
        <h2 className="font-bold">Booking Menunggu Konfirmasi</h2>
        <div className="mt-4 space-y-3">
          {bookings.map((item) => (
            <article
              key={item.id}
              className="rounded-xl border bg-slate-50/50 p-4"
            >
              <div className="flex justify-between">
                <span className="rounded bg-amber-50 px-2 text-[11px] text-amber-600">
                  Menunggu
                </span>
                <span className="text-[11px] text-slate-400">{item.date}</span>
              </div>
              <h3 className="mt-2 text-sm font-bold">{item.community}</h3>
              <p className="text-xs text-slate-500">
                • {item.time} • {item.participants} orang
              </p>
              <Link
                href={`/pengelola/pengajuan/${item.id}` as Route}
                className="mt-3 block rounded-xl border border-purple-200 py-2 text-center text-xs font-bold text-[#7c3aed]"
              >
                Lihat Detail
              </Link>
            </article>
          ))}
        </div>
      </section>
      <section className="rounded-2xl border bg-white p-6 shadow-sm">
        <h2 className="mb-4 font-bold">Jadwal Hari Ini</h2>
        <div className="space-y-6">
          {schedule.map((item) => (
            <article key={item.id}>
              <p
                className={`text-xs ${item.active ? "font-bold text-blue-600" : "text-slate-500"}`}
              >
                {item.time}
              </p>
              <h3 className="text-sm font-bold">{item.title}</h3>
              <p className="text-xs text-slate-400">{item.room}</p>
            </article>
          ))}
        </div>
      </section>
    </aside>
  );
}
