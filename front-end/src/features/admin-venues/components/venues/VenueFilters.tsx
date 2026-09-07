import { RefreshCw, Search } from "lucide-react";
import type { VenueVerificationStatus } from "../../types/admin-venue";
interface Props {
  query: string;
  category: string;
  status: "all" | VenueVerificationStatus;
  categories: string[];
  refreshing: boolean;
  onQuery: (value: string) => void;
  onCategory: (value: string) => void;
  onStatus: (value: "all" | VenueVerificationStatus) => void;
  onRefresh: () => void;
}
export default function VenueFilters(props: Props) {
  return (
    <section className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <label className="relative block w-full max-w-md">
        <span className="sr-only">Cari tempat</span>
        <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          value={props.query}
          onChange={(event) => props.onQuery(event.target.value)}
          placeholder="Cari nama tempat, pengelola..."
          className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-10 pr-4 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/15"
        />
      </label>
      <div className="flex flex-wrap gap-2.5">
        <button
          type="button"
          onClick={props.onRefresh}
          aria-label="Refresh data"
          className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 bg-white text-slate-600"
        >
          <RefreshCw
            className={`h-4 w-4 ${props.refreshing ? "animate-spin" : ""}`}
          />
        </button>
        <select
          value={props.category}
          onChange={(event) => props.onCategory(event.target.value)}
          className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium"
        >
          <option>Semua Kategori</option>
          {props.categories.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
        <select
          value={props.status}
          onChange={(event) =>
            props.onStatus(event.target.value as Props["status"])
          }
          className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium"
        >
          <option value="all">Semua Status</option>
          <option value="pending">Menunggu Verifikasi</option>
          <option value="verified">Terverifikasi</option>
          <option value="rejected">Ditolak</option>
        </select>
      </div>
    </section>
  );
}
