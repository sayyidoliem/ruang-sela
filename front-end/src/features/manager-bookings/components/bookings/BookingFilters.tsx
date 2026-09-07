import { ChevronDown, Search, SlidersHorizontal } from "lucide-react";
import type { BookingStatus } from "../../types/manager-booking";
import { BOOKING_FILTERS } from "./config";
export default function BookingFilters({
  filter,
  counts,
  query,
  newest,
  onFilter,
  onQuery,
  onSort,
}: {
  filter: "all" | BookingStatus;
  counts: Record<string, number>;
  query: string;
  newest: boolean;
  onFilter: (v: "all" | BookingStatus) => void;
  onQuery: (v: string) => void;
  onSort: () => void;
}) {
  return (
    <>
      <div className="mb-6 flex flex-wrap gap-2">
        {BOOKING_FILTERS.map((item) => {
          const Icon = item.icon;
          const active = filter === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onFilter(item.id)}
              className={`inline-flex items-center gap-2 rounded-lg border px-3.5 py-2 text-xs font-semibold ${active ? "border-blue-600 bg-blue-600 text-white" : "border-slate-200 bg-white text-slate-600"}`}
            >
              <Icon className="h-3.5 w-3.5" />
              {item.label}
              <span>{counts[item.id] ?? 0}</span>
            </button>
          );
        })}
      </div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:justify-between">
        <label className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(e) => onQuery(e.target.value)}
            placeholder="Cari nama kegiatan, peminjam, ID..."
            className="w-full rounded-lg border py-2 pl-9 pr-4 text-xs"
          />
        </label>
        <button
          onClick={onSort}
          className="inline-flex items-center gap-2 rounded-lg border bg-white px-3.5 py-2 text-xs font-semibold"
        >
          <SlidersHorizontal className="h-3.5 w-3.5" />
          Urutkan: {newest ? "Terkini" : "Terlama"}
          <ChevronDown className="h-3.5 w-3.5" />
        </button>
      </div>
    </>
  );
}
