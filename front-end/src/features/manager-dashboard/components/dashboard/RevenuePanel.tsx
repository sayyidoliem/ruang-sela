const periods = ["7 Hari", "30 Hari", "Bulan Ini", "Tahun Ini"] as const;
export default function RevenuePanel({
  period,
  onPeriodChange,
}: {
  period: string;
  onPeriodChange: (value: string) => void;
}) {
  return (
    <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
      <div className="flex flex-col justify-between gap-4 sm:flex-row">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="font-bold text-slate-900">
              Tren Penjualan & Pendapatan
            </h2>
            <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-600">
              +18,4%
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-400">
            Analisis pendapatan sewa, target bulanan, dan perbandingan kas riil.
          </p>
        </div>
        <div className="flex flex-wrap rounded-xl bg-slate-100/70 p-1 text-xs">
          {periods.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => onPeriodChange(item)}
              className={`rounded-lg px-3 py-1.5 ${period === item ? "bg-white font-semibold text-[#7c3aed] shadow-sm" : "text-slate-600"}`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>
      <div className="my-6 grid gap-4 border-b pb-5 sm:grid-cols-3">
        {[
          ["Total Realisasi", "Rp12.500.000", "↑ 92,5% dari target"],
          ["Target Pendapatan", "Rp13.500.000", "Sisa Rp1.000.000"],
          ["Rata-rata Transaksi", "Rp480.000", "26 transaksi selesai"],
        ].map(([label, value, note]) => (
          <div key={label}>
            <p className="text-[11px] text-slate-400">{label}</p>
            <strong className="text-lg text-slate-900">{value}</strong>
            <p className="text-[11px] font-semibold text-emerald-600">{note}</p>
          </div>
        ))}
      </div>
      <div className="relative h-56 overflow-hidden">
        <svg
          viewBox="0 0 650 200"
          preserveAspectRatio="none"
          className="h-full w-full"
        >
          <defs>
            <linearGradient id="managerRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#7c3aed" stopOpacity=".2" />
              <stop offset="1" stopColor="#7c3aed" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d="M20 170 Q160 150 300 130 T500 70 L590 78 L590 190 L20 190Z"
            fill="url(#managerRevenue)"
          />
          <path
            d="M20 170 Q160 150 300 130 T500 70 L590 78"
            fill="none"
            stroke="#7c3aed"
            strokeWidth="3"
          />
        </svg>
      </div>
    </section>
  );
}
