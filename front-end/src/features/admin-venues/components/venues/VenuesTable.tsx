import Image from "next/image";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Search,
} from "lucide-react";
import type { AdminVenueSubmission } from "../../types/admin-venue";
import { VENUE_STATUS } from "./status";

interface Props {
  rows: AdminVenueSubmission[];
  filteredCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onOpenDetail: (id: string) => void;
}

export default function VenuesTable(props: Props) {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
        <div className="flex items-center gap-2.5">
          <h2 className="font-bold text-slate-800">Daftar Pengajuan</h2>
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600">
            {props.filteredCount} Tempat
          </span>
        </div>
        <span className="flex items-center gap-1.5 text-xs text-slate-500">
          <i className="h-2 w-2 animate-pulse rounded-full bg-violet-600" />
          Live sinkronisasi admin
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] text-left text-xs">
          <thead className="border-b border-slate-100 bg-slate-50/50 text-[11px] uppercase tracking-wider text-slate-400">
            <tr>
              <th className="px-6 py-3.5">Foto</th>
              <th className="px-3 py-3.5">Nama Tempat</th>
              <th className="px-3 py-3.5">Pengelola</th>
              <th className="px-3 py-3.5">Kategori</th>
              <th className="px-3 py-3.5">Tanggal</th>
              <th className="px-3 py-3.5">Status</th>
              <th className="px-6 py-3.5 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {props.rows.map((venue) => {
              const style = VENUE_STATUS[venue.status];
              return (
                <tr
                  key={venue.id}
                  className="border-l-4 border-l-transparent hover:bg-slate-50"
                >
                  <td className="py-4 pl-5 pr-3">
                    <div className="relative h-14 w-20 overflow-hidden rounded-lg">
                      <Image
                        src={venue.imageSrc}
                        alt={venue.name}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                      <span className="absolute bottom-1 right-1 rounded bg-black/60 px-1.5 text-[10px] text-white">
                        {venue.photoCount} Foto
                      </span>
                    </div>
                  </td>
                  <td className="px-3 py-4">
                    <b className="text-sm text-slate-800">{venue.name}</b>
                    <span className="mt-1 flex items-center gap-1 text-[11px] text-slate-400">
                      <MapPin className="h-3 w-3" />
                      {venue.city}
                    </span>
                  </td>
                  <td className="px-3 py-4">
                    <div className="flex items-center gap-2">
                      <span className="grid h-7 w-7 place-items-center rounded-full bg-indigo-100 text-[10px] font-bold text-indigo-700">
                        {venue.managerInitials}
                      </span>
                      <span className="font-medium text-slate-700">
                        {venue.managerName}
                      </span>
                    </div>
                  </td>
                  <td className="px-3 py-4">
                    <span className="rounded-md bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-600">
                      {venue.category}
                    </span>
                  </td>
                  <td className="px-3 py-4 font-medium text-slate-600">
                    {venue.submittedAt}
                  </td>
                  <td className="px-3 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-semibold ${style.className}`}
                    >
                      <i className="h-1.5 w-1.5 rounded-full bg-current" />
                      {style.label}
                    </span>
                    {venue.verifiedAt && (
                      <p className="mt-1 text-[10px] text-emerald-600">
                        ✓ {venue.verifiedAt}
                      </p>
                    )}
                    {venue.rejectionReason && (
                      <p className="mt-1 max-w-44 truncate text-[10px] text-rose-500">
                        ✕ {venue.rejectionReason}
                      </p>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      type="button"
                      onClick={() => props.onOpenDetail(venue.id)}
                      className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2 font-semibold ${venue.status === "pending" ? "bg-violet-600 text-white hover:bg-violet-700" : "border border-slate-200 text-slate-600 hover:bg-slate-50"}`}
                    >
                      Detail
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {!props.rows.length && (
        <div className="py-14 text-center">
          <Search className="mx-auto h-8 w-8 text-slate-300" />
          <h3 className="mt-3 font-bold text-slate-900">
            Pengajuan tidak ditemukan
          </h3>
        </div>
      )}
      <div className="flex flex-col items-center justify-between gap-3 border-t border-slate-100 px-6 py-4 text-xs text-slate-500 sm:flex-row">
        <p>
          Menampilkan{" "}
          <b className="text-slate-700">
            {props.filteredCount ? (props.page - 1) * props.pageSize + 1 : 0}–
            {Math.min(props.page * props.pageSize, props.filteredCount)}
          </b>{" "}
          dari <b className="text-slate-700">{props.filteredCount}</b> pengajuan
        </p>
        <div className="flex gap-1">
          <button
            disabled={props.page === 1}
            onClick={() => props.onPageChange(props.page - 1)}
            className="grid h-8 w-8 place-items-center rounded-lg border border-slate-200 disabled:opacity-40"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          {Array.from(
            { length: props.totalPages },
            (_, index) => index + 1,
          ).map((number) => (
            <button
              key={number}
              onClick={() => props.onPageChange(number)}
              className={`grid h-8 w-8 place-items-center rounded-lg border text-xs font-semibold ${props.page === number ? "border-violet-600 bg-violet-600 text-white" : "border-slate-200"}`}
            >
              {number}
            </button>
          ))}
          <button
            disabled={props.page === props.totalPages}
            onClick={() => props.onPageChange(props.page + 1)}
            className="grid h-8 w-8 place-items-center rounded-lg border border-slate-200 disabled:opacity-40"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
