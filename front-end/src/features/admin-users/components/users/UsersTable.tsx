import Image from "next/image";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import type { AdminManagedUser } from "../../types/admin-user";
import { USER_STATUS } from "./status";
interface Props {
  rows: AdminManagedUser[];
  filteredCount: number;
  pendingCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  selectedId: string | null;
  onSelect: (id: string) => void;
  onPageChange: (page: number) => void;
}
export default function UsersTable(p: Props) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm xl:col-span-7">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="font-bold text-slate-900">Daftar Pengguna</h2>
          <p className="mt-0.5 text-xs text-slate-400">
            Pilih baris untuk meninjau dan memverifikasi akun.
          </p>
        </div>
        <span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-600">
          {p.pendingCount} Perlu Verifikasi
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[650px] text-left">
          <thead>
            <tr className="border-b border-slate-100 text-[11px] uppercase tracking-wider text-slate-400">
              <th className="px-2 py-3">Profil & Nama</th>
              <th className="px-2 py-3">Role</th>
              <th className="px-2 py-3">Tgl Gabung</th>
              <th className="px-2 py-3 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {p.rows.map((user) => (
              <tr
                key={user.id}
                onClick={() => p.onSelect(user.id)}
                className={`cursor-pointer transition hover:bg-slate-50 ${p.selectedId === user.id ? "bg-violet-50/40 ring-1 ring-inset ring-violet-500/20" : ""}`}
              >
                <td className="flex items-center gap-3 px-2 py-3">
                  {user.avatarSrc ? (
                    <span className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full">
                      <Image
                        src={user.avatarSrc}
                        alt={user.fullName}
                        fill
                        sizes="36px"
                        className="object-cover"
                      />
                    </span>
                  ) : (
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-slate-100 font-bold text-slate-500">
                      {user.initials}
                    </span>
                  )}
                  <span>
                    <b className="block text-slate-900">{user.fullName}</b>
                    <small className="text-[11px] text-slate-400">
                      {user.email}
                    </small>
                  </span>
                </td>
                <td className="px-2 py-3">
                  <span
                    className={`rounded-md px-2 py-0.5 text-[11px] font-semibold ${user.role === "Manager" ? "bg-violet-50 text-violet-600" : "bg-slate-100 text-slate-600"}`}
                  >
                    {user.role}
                  </span>
                </td>
                <td className="px-2 py-3 text-slate-500">{user.joinedAt}</td>
                <td className="px-2 py-3 text-right">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${USER_STATUS[user.status].className}`}
                  >
                    <i className="h-1.5 w-1.5 rounded-full bg-current" />
                    {USER_STATUS[user.status].label}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {!p.rows.length && (
        <div className="py-12 text-center">
          <Search className="mx-auto h-8 w-8 text-slate-300" />
          <p className="mt-3 text-sm font-semibold text-slate-700">
            Pengguna tidak ditemukan
          </p>
        </div>
      )}
      <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-500">
        <span>
          Menampilkan{" "}
          <b>
            {p.filteredCount ? (p.page - 1) * p.pageSize + 1 : 0}–
            {Math.min(p.page * p.pageSize, p.filteredCount)}
          </b>{" "}
          dari <b>{p.filteredCount}</b>
        </span>
        <div className="flex gap-1">
          <button
            disabled={p.page === 1}
            onClick={() => p.onPageChange(p.page - 1)}
            className="grid h-7 w-7 place-items-center rounded-lg disabled:opacity-40"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </button>
          {Array.from({ length: p.totalPages }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              onClick={() => p.onPageChange(n)}
              className={`grid h-7 w-7 place-items-center rounded-lg font-semibold ${p.page === n ? "bg-violet-600 text-white" : "hover:bg-slate-100"}`}
            >
              {n}
            </button>
          ))}
          <button
            disabled={p.page === p.totalPages}
            onClick={() => p.onPageChange(p.page + 1)}
            className="grid h-7 w-7 place-items-center rounded-lg disabled:opacity-40"
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
