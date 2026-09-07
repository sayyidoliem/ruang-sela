import { CheckCircle2, FileCheck2, ShieldCheck, XCircle } from "lucide-react";
import type {
  AdminVenueDetail,
  VenueDetailStatus,
} from "../../types/admin-venue-detail";
import { DETAIL_STATUS } from "./status";
interface Props {
  venue: AdminVenueDetail;
  status: VenueDetailStatus;
  onReject: () => void;
  onVerify: () => void;
}
export default function ReviewSidebar({
  venue,
  status,
  onReject,
  onVerify,
}: Props) {
  return (
    <aside className="space-y-5 lg:sticky lg:top-20">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-sm font-bold text-slate-900">
          Pemeriksaan Dokumen
        </h2>
        <p className="mt-1 text-xs text-slate-500">
          Pastikan seluruh dokumen sah dan sesuai informasi venue.
        </p>
        <div className="mt-4 space-y-2.5">
          {venue.documents.map((document) => (
            <article
              key={document.id}
              className="flex items-start justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50/60 p-3.5"
            >
              <div className="flex min-w-0 gap-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-emerald-50 text-emerald-600">
                  <FileCheck2 className="h-4 w-4" />
                </span>
                <div>
                  <h3 className="text-xs font-bold text-slate-800">
                    {document.name}
                  </h3>
                  <p className="mt-0.5 text-[11px] text-slate-500">
                    {document.description}
                  </p>
                </div>
              </div>
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
            </article>
          ))}
        </div>
      </section>
      <section className="rounded-2xl border border-amber-200 bg-amber-50/60 p-4">
        <h2 className="text-xs font-bold text-slate-800">
          Catatan Pemeriksaan Admin
        </h2>
        <p className="mt-1 text-[11px] leading-relaxed text-slate-600">
          Cocokkan identitas pengelola, alamat, hak kelola, kapasitas, dan
          dokumentasi visual sebelum membuat keputusan.
        </p>
      </section>
      <section className="grid grid-cols-2 gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <button
          type="button"
          onClick={onReject}
          disabled={status !== "pending"}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-rose-300 px-3 py-3 text-xs font-bold text-rose-600 disabled:opacity-50"
        >
          <XCircle className="h-4 w-4" />
          Tolak
        </button>
        <button
          type="button"
          onClick={onVerify}
          disabled={status !== "pending"}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-3 py-3 text-xs font-bold text-white disabled:opacity-50"
        >
          <ShieldCheck className="h-4 w-4" />
          Verifikasi
        </button>
        {status !== "pending" && (
          <p className="col-span-2 text-center text-xs font-semibold text-slate-500">
            Keputusan: {DETAIL_STATUS[status].label}
          </p>
        )}
      </section>
    </aside>
  );
}
