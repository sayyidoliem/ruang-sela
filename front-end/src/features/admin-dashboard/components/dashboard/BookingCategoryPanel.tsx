import DashboardCard from "./DashboardCard";
interface Category {
  name: string;
  value: number;
  percent: number;
  color: string;
  time: string;
  revenue: string;
}
export default function BookingCategoryPanel({
  items,
}: {
  items: readonly Category[];
}) {
  return (
    <DashboardCard className="xl:col-span-2">
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
        {items.map((item) => (
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
              <span className="font-medium text-slate-600">{item.revenue}</span>
            </div>
          </div>
        ))}
      </div>
    </DashboardCard>
  );
}
