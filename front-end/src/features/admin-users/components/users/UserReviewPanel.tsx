import Image from "next/image";
import {
  CheckCircle2,
  Eye,
  FileText,
  Mail,
  ShieldCheck,
  Star,
  X,
  XCircle,
} from "lucide-react";
import type { AdminManagedUser } from "../../types/admin-user";
import { USER_STATUS } from "./status";
interface Props {
  user: AdminManagedUser;
  onClose: () => void;
  onVerify: () => void;
  onReject: () => void;
}
export default function UserReviewPanel({
  user,
  onClose,
  onVerify,
  onReject,
}: Props) {
  return (
    <aside className="space-y-4 xl:col-span-5">
      <div className="space-y-6 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <div className="flex items-start justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3.5">
            {user.avatarSrc ? (
              <span className="relative h-12 w-12 overflow-hidden rounded-full ring-2 ring-violet-100">
                <Image
                  src={user.avatarSrc}
                  alt={user.fullName}
                  fill
                  sizes="48px"
                  className="object-cover"
                />
              </span>
            ) : (
              <span className="grid h-12 w-12 place-items-center rounded-full bg-violet-50 font-bold text-violet-600">
                {user.initials}
              </span>
            )}
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-slate-900">{user.fullName}</h2>
                <span className="rounded-md bg-violet-50 px-2 py-0.5 text-[10px] font-bold text-violet-600">
                  {user.role}
                </span>
              </div>
              <p className="text-xs text-slate-400">{user.email}</p>
              <span
                className={`mt-1.5 inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold ${USER_STATUS[user.status].className}`}
              >
                {USER_STATUS[user.status].label}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-slate-300 hover:text-slate-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <section>
          <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Informasi Akun
          </h3>
          <dl className="mt-3 space-y-2 text-xs">
            {[
              ["Nama Lengkap", user.fullName],
              ["Nomor Telepon", user.phone],
              ["Tanggal Terdaftar", user.joinedAt],
              ["Aktif Terakhir", user.lastActiveAt],
            ].map(([l, v]) => (
              <div key={l} className="flex justify-between gap-4">
                <dt className="text-slate-500">{l}</dt>
                <dd className="text-right font-semibold text-slate-800">{v}</dd>
              </div>
            ))}
            <div className="flex justify-between">
              <dt className="text-slate-500">Status Email</dt>
              <dd
                className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-semibold ${user.emailVerified ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"}`}
              >
                <Mail className="h-3 w-3" />
                {user.emailVerified ? "Terverifikasi" : "Belum Terverifikasi"}
              </dd>
            </div>
          </dl>
        </section>
        <section>
          <div className="flex items-center justify-between">
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Dokumen Identitas
            </h3>
            {user.documents.some((d) => d.status === "Verified") && (
              <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Lampiran Sahih
              </span>
            )}
          </div>
          <div className="mt-3 space-y-2">
            {user.documents.length ? (
              user.documents.map((d) => (
                <div
                  key={d.id}
                  className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="grid h-10 w-10 place-items-center rounded-xl bg-red-50 text-red-500">
                      <FileText className="h-5 w-5" />
                    </span>
                    <div>
                      <b className="block text-xs text-slate-800">{d.name}</b>
                      <small className="text-[11px] text-slate-400">
                        {d.size} • {d.uploadedAt}
                      </small>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    Lihat
                  </button>
                </div>
              ))
            ) : (
              <p className="rounded-lg bg-slate-50 p-3 text-xs text-slate-500">
                Belum ada dokumen yang diunggah.
              </p>
            )}
          </div>
        </section>
        <section>
          <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Aktivitas Pengguna
          </h3>
          <div className="mt-2.5 grid grid-cols-3 gap-2 text-center">
            {[
              [user.venues, "Venue"],
              [user.bookings, "Booking"],
              [user.rating.toFixed(1), `${user.reviews} Ulasan`],
            ].map(([v, l]) => (
              <div
                key={l}
                className="rounded-xl border border-slate-100 bg-slate-50 p-2.5"
              >
                <b className="block text-base text-slate-900">
                  {v}
                  {String(l).includes("Ulasan") && (
                    <Star className="ml-1 inline h-3 w-3 fill-amber-400 text-amber-400" />
                  )}
                </b>
                <span className="text-[11px] text-slate-400">{l}</span>
              </div>
            ))}
          </div>
        </section>
        <section>
          <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Riwayat Status Akun
          </h3>
          <div className="mt-3 space-y-4">
            {user.history.map((i) => (
              <div key={i.id} className="relative pl-5">
                <i
                  className={`absolute left-0 top-1 h-3 w-3 rounded-full ring-4 ${i.tone === "green" ? "bg-emerald-500 ring-emerald-100" : i.tone === "amber" ? "bg-amber-500 ring-amber-100" : "bg-slate-400 ring-slate-100"}`}
                />
                <b className="block text-xs text-slate-800">{i.date}</b>
                <p className="mt-0.5 text-[11px] text-slate-500">
                  {i.description}
                </p>
              </div>
            ))}
          </div>
        </section>
        <div className="grid grid-cols-2 gap-3 pt-2">
          <button
            type="button"
            onClick={onReject}
            className="flex items-center justify-center gap-1.5 rounded-xl border border-rose-400 py-2.5 text-xs font-semibold text-rose-500 hover:bg-rose-50"
          >
            <XCircle className="h-4 w-4" />
            {user.status === "active" ? "Tangguhkan" : "Tolak Verifikasi"}
          </button>
          <button
            type="button"
            onClick={onVerify}
            className="flex items-center justify-center gap-1.5 rounded-xl bg-violet-600 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-violet-700"
          >
            <ShieldCheck className="h-4 w-4" />
            {user.status === "suspended" ? "Aktifkan User" : "Verifikasi User"}
          </button>
        </div>
      </div>
      <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50/50 p-4">
        <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" />
        <div>
          <div className="flex justify-between gap-3">
            <h3 className="text-xs font-bold text-slate-800">
              Panduan Verifikasi Admin
            </h3>
            <span className="text-[10px] font-semibold text-slate-400">
              SOP v2.4
            </span>
          </div>
          <p className="mt-1 text-[11px] leading-relaxed text-slate-600">
            Pastikan identitas sesuai dengan data rekening dan venue terdaftar.
            Keputusan akan dikirim otomatis melalui email.
          </p>
        </div>
      </div>
    </aside>
  );
}
