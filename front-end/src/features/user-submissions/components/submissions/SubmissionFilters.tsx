import { Filter, Search } from "lucide-react";
import type { SubmissionStatus } from "../../types/user-submission";
import { SUBMISSION_FILTERS } from "./config";
export default function SubmissionFilters({
  active,
  query,
  period,
  count,
  onActive,
  onQuery,
  onPeriod,
}: {
  active: "all" | SubmissionStatus;
  query: string;
  period: string;
  count: (s: "all" | SubmissionStatus) => number;
  onActive: (s: "all" | SubmissionStatus) => void;
  onQuery: (v: string) => void;
  onPeriod: (v: string) => void;
}) {
  return (
    <section className="space-y-4">
      <div className="flex gap-2 overflow-x-auto border-b pb-2">
        {SUBMISSION_FILTERS.map((f) => (
          <button
            key={f.id}
            onClick={() => onActive(f.id)}
            className={`rounded-xl border px-4 py-2 text-xs font-semibold ${active === f.id ? "border-violet-600 bg-violet-600 text-white" : "bg-white"}`}
          >
            {f.label} <span className="ml-2">{count(f.id)}</span>
          </button>
        ))}
      </div>
      <div className="flex flex-col justify-between gap-3 sm:flex-row">
        <label className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
          <input
            value={query}
            onChange={(e) => onQuery(e.target.value)}
            className="w-full rounded-xl border py-2.5 pl-9 pr-4"
            placeholder="Cari tempat atau ID booking..."
          />
        </label>
        <div className="flex gap-2">
          <select
            value={period}
            onChange={(e) => onPeriod(e.target.value)}
            className="rounded-xl border px-3"
          >
            <option value="all">Semua Tanggal</option>
            <option>September 2026</option>
            <option>Agustus 2026</option>
          </select>
          <button
            aria-label="Filter tambahan"
            className="rounded-xl border p-3"
          >
            <Filter className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
