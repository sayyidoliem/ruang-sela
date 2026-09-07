export default function VisitorPanel({
  items,
}: {
  items: Array<{ day: string; visitors: number; occupancy: number }>;
}) {
  return (
    <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
      <div className="flex justify-between">
        <div>
          <h2 className="font-bold">Tren Pengunjung & Okupansi</h2>
          <p className="text-xs text-slate-400">
            Pola kedatangan warga dan utilisasi ruang per hari.
          </p>
        </div>
        <span className="self-start rounded-xl border bg-slate-50 px-3 py-1.5 text-xs font-bold">
          Jam Sibuk: 09.00–14.00
        </span>
      </div>
      <div className="mt-5 flex h-52 items-end gap-2 border-b px-2">
        {items.map((item) => (
          <div
            key={item.day}
            className="flex h-full flex-1 flex-col items-center justify-end gap-2"
          >
            <span className="text-[10px] font-semibold">{item.visitors}</span>
            <div
              className={`w-full max-w-8 rounded-t-lg ${item.day === "Sab" ? "bg-[#7c3aed]" : "bg-indigo-100"}`}
              style={{ height: `${item.occupancy}%` }}
            />
            <span className="text-xs">{item.day}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
