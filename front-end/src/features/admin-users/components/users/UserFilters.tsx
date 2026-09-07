import { Download, RefreshCw, Search } from "lucide-react";
import type { AdminUserRole, AdminUserStatus } from "../../types/admin-user";
interface Props {
  query: string;
  role: "all" | AdminUserRole;
  status: "all" | AdminUserStatus;
  onQueryChange: (v: string) => void;
  onRoleChange: (v: "all" | AdminUserRole) => void;
  onStatusChange: (v: "all" | AdminUserStatus) => void;
  onReset: () => void;
  onExport: () => void;
}
export default function UserFilters(p: Props) {
  return (
    <section>
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <label className="relative block w-full max-w-md">
          <span className="sr-only">Cari pengguna</span>
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={p.query}
            onChange={(e) => p.onQueryChange(e.target.value)}
            placeholder="Cari nama, email..."
            className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-10 pr-4 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/15"
          />
        </label>
        <div className="flex flex-wrap gap-2.5">
          <select
            value={p.role}
            onChange={(e) => p.onRoleChange(e.target.value as Props["role"])}
            className="rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold"
          >
            <option value="all">Semua Role</option>
            <option>User</option>
            <option>Manager</option>
            <option>Admin</option>
          </select>
          <select
            value={p.status}
            onChange={(e) =>
              p.onStatusChange(e.target.value as Props["status"])
            }
            className="rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold"
          >
            <option value="all">Semua Status</option>
            <option value="active">Aktif</option>
            <option value="pending">Tertunda</option>
            <option value="suspended">Ditangguhkan</option>
          </select>
          <button
            type="button"
            onClick={p.onReset}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-600"
          >
            <RefreshCw className="h-4 w-4" />
            Reset
          </button>
          <button
            type="button"
            onClick={p.onExport}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700"
          >
            <Download className="h-4 w-4" />
            Ekspor Data
          </button>
        </div>
      </div>
    </section>
  );
}
