import DashboardCard from "./DashboardCard";

export type ChartMode = "revenue" | "bookings";
interface SeriesItem {
  month: string;
  revenue: number;
  bookings: number;
}
interface GrowthChartProps {
  mode: ChartMode;
  series: readonly SeriesItem[];
  onModeChange: (mode: ChartMode) => void;
}

export default function GrowthChart({
  mode,
  series,
  onModeChange,
}: GrowthChartProps) {
  return (
    <DashboardCard className="xl:col-span-2">
      <div className="flex flex-col justify-between gap-4 border-b border-slate-100 pb-4 sm:flex-row">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="font-bold text-slate-900">
              Pertumbuhan Pendapatan & Booking
            </h2>
            <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-[11px] font-semibold text-indigo-600">
              Tren Bulanan
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-400">
            Realisasi target enam bulan terakhir
          </p>
        </div>
        <div className="flex rounded-xl bg-slate-100 p-1 text-xs">
          {(["revenue", "bookings"] as const).map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => onModeChange(item)}
              className={`rounded-lg px-3.5 py-1.5 ${mode === item ? "bg-white font-semibold text-[#6941C6] shadow-sm" : "text-slate-500"}`}
            >
              {item === "revenue" ? "Pendapatan" : "Jumlah Booking"}
            </button>
          ))}
        </div>
      </div>
      <div className="my-5 flex flex-wrap items-baseline gap-2">
        <span className="text-xs text-slate-400">Total Realisasi:</span>
        <strong className="text-lg text-slate-900">
          {mode === "revenue" ? "Rp 125.400.000" : "3.842 booking"}
        </strong>
        <span className="text-xs font-semibold text-emerald-600">
          +24,2% vs periode lalu
        </span>
      </div>
      <div className="flex h-64 items-end gap-3 border-b border-slate-100 px-2">
        {series.map((item, index) => {
          const value = mode === "revenue" ? item.revenue : item.bookings / 30;
          return (
            <div
              key={item.month}
              className="flex h-full flex-1 flex-col items-center justify-end gap-2"
            >
              <span
                className={`text-[10px] font-semibold ${index === 5 ? "text-[#6941C6]" : "text-slate-400"}`}
              >
                {mode === "revenue" ? `Rp ${item.revenue} jt` : item.bookings}
              </span>
              <div
                className={`w-full max-w-12 rounded-t-lg ${index === 5 ? "bg-[#6941C6] shadow-lg shadow-purple-500/20" : "bg-purple-100"}`}
                style={{ height: `${Math.max(18, value * 2.5)}%` }}
              />
              <span
                className={`text-xs ${index === 5 ? "font-bold text-[#6941C6]" : "text-slate-400"}`}
              >
                {item.month}
              </span>
            </div>
          );
        })}
      </div>
    </DashboardCard>
  );
}
