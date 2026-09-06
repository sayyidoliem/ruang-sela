"use client";

import Image from "next/image";
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Download,
  Eye,
  FileText,
  Mail,
  RefreshCw,
  Search,
  ShieldAlert,
  ShieldCheck,
  Star,
  Users,
  X,
  XCircle,
} from "lucide-react";
import { useMemo, useState } from "react";
import { INITIAL_ADMIN_USERS } from "../data/users";
import type {
  AdminManagedUser,
  AdminUserRole,
  AdminUserStatus,
} from "../types/admin-user";

const STATUS: Record<AdminUserStatus, { label: string; className: string }> = {
  active: { label: "Aktif", className: "bg-emerald-50 text-emerald-600" },
  pending: { label: "Tertunda", className: "bg-amber-50 text-amber-600" },
  suspended: { label: "Ditangguhkan", className: "bg-red-50 text-red-500" },
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState(INITIAL_ADMIN_USERS);
  const [query, setQuery] = useState("");
  const [role, setRole] = useState<"all" | AdminUserRole>("all");
  const [status, setStatus] = useState<"all" | AdminUserStatus>("all");
  const [selectedId, setSelectedId] = useState<string | null>("user-1");
  const [page, setPage] = useState(1);
  const pageSize = 5;

  const filtered = useMemo(
    () =>
      users.filter((user) => {
        const text =
          `${user.fullName} ${user.email} ${user.phone}`.toLocaleLowerCase(
            "id-ID",
          );
        return (
          text.includes(query.trim().toLocaleLowerCase("id-ID")) &&
          (role === "all" || user.role === role) &&
          (status === "all" || user.status === status)
        );
      }),
    [users, query, role, status],
  );
  const selected = users.find((user) => user.id === selectedId) ?? null;
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const rows = filtered.slice((page - 1) * pageSize, page * pageSize);
  const count = (value: AdminUserStatus) =>
    users.filter((user) => user.status === value).length;

  const updateStatus = (id: string, next: AdminUserStatus) =>
    setUsers((current) =>
      current.map((user) =>
        user.id === id
          ? {
              ...user,
              status: next,
              emailVerified: next === "active" ? true : user.emailVerified,
            }
          : user,
      ),
    );
  const reset = () => {
    setQuery("");
    setRole("all");
    setStatus("all");
    setPage(1);
  };
  const exportCsv = () => {
    const data = [
      ["Nama", "Email", "Role", "Status", "Tanggal Bergabung"],
      ...filtered.map((user) => [
        user.fullName,
        user.email,
        user.role,
        STATUS[user.status].label,
        user.joinedAt,
      ]),
    ];
    const csv = data
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");
    const url = URL.createObjectURL(
      new Blob([csv], { type: "text/csv;charset=utf-8" }),
    );
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "ruangsela-users.csv";
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main className="space-y-6 p-4 sm:p-8">
      <header>
        <h1 className="text-2xl font-bold text-slate-900">Kelola Pengguna</h1>
        <p className="mt-1 text-sm text-slate-500">
          Kelola akses, role, status, dan verifikasi identitas pengguna.
        </p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          {
            label: "Total User",
            value: users.length,
            note: "+8% bulan ini",
            icon: Users,
            tone: "bg-violet-50 text-violet-600",
            border: "border-slate-100",
          },
          {
            label: "Aktif",
            value: count("active"),
            note: "Normal",
            icon: ShieldCheck,
            tone: "bg-emerald-50 text-emerald-600",
            border: "border-slate-100",
          },
          {
            label: "Tertunda",
            value: count("pending"),
            note: "Butuh tindakan",
            icon: Clock3,
            tone: "bg-amber-50 text-amber-500",
            border: "border-amber-300",
          },
          {
            label: "Ditangguhkan",
            value: count("suspended"),
            note: "Dibatasi",
            icon: ShieldAlert,
            tone: "bg-red-50 text-red-500",
            border: "border-slate-100",
          },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <article
              key={item.label}
              className={`flex items-start justify-between rounded-2xl border-2 bg-white p-5 shadow-sm ${item.border}`}
            >
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  {item.label}
                </span>
                <strong className="mb-2 mt-1 block text-2xl text-slate-900">
                  {item.value}
                </strong>
                <span className="text-xs font-semibold text-slate-500">
                  {item.note}
                </span>
              </div>
              <span
                className={`grid h-11 w-11 place-items-center rounded-xl ${item.tone}`}
              >
                <Icon className="h-6 w-6" />
              </span>
            </article>
          );
        })}
      </section>

      <section className="space-y-4">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <label className="relative block w-full max-w-md">
            <span className="sr-only">Cari pengguna</span>
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setPage(1);
              }}
              placeholder="Cari nama, email..."
              className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-10 pr-4 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/15"
            />
          </label>
          <div className="flex flex-wrap gap-2.5">
            <select
              value={role}
              onChange={(event) => {
                setRole(event.target.value as typeof role);
                setPage(1);
              }}
              className="rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold"
            >
              <option value="all">Semua Role</option>
              <option>User</option>
              <option>Manager</option>
              <option>Admin</option>
            </select>
            <select
              value={status}
              onChange={(event) => {
                setStatus(event.target.value as typeof status);
                setPage(1);
              }}
              className="rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold"
            >
              <option value="all">Semua Status</option>
              <option value="active">Aktif</option>
              <option value="pending">Tertunda</option>
              <option value="suspended">Ditangguhkan</option>
            </select>
            <button
              type="button"
              onClick={reset}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-600"
            >
              <RefreshCw className="h-4 w-4" />
              Reset
            </button>
            <button
              type="button"
              onClick={exportCsv}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700"
            >
              <Download className="h-4 w-4" />
              Ekspor Data
            </button>
          </div>
        </div>
      </section>

      <section className="grid items-start gap-6 xl:grid-cols-12">
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm xl:col-span-7">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="font-bold text-slate-900">Daftar Pengguna</h2>
              <p className="mt-0.5 text-xs text-slate-400">
                Pilih baris untuk meninjau dan memverifikasi akun.
              </p>
            </div>
            <span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-600">
              {count("pending")} Perlu Verifikasi
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
                {rows.map((user) => (
                  <tr
                    key={user.id}
                    onClick={() => setSelectedId(user.id)}
                    className={`cursor-pointer transition hover:bg-slate-50 ${selectedId === user.id ? "bg-violet-50/40 ring-1 ring-inset ring-violet-500/20" : ""}`}
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
                    <td className="px-2 py-3 text-slate-500">
                      {user.joinedAt}
                    </td>
                    <td className="px-2 py-3 text-right">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${STATUS[user.status].className}`}
                      >
                        <i className="h-1.5 w-1.5 rounded-full bg-current" />
                        {STATUS[user.status].label}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {rows.length === 0 && (
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
                {filtered.length ? (page - 1) * pageSize + 1 : 0}–
                {Math.min(page * pageSize, filtered.length)}
              </b>{" "}
              dari <b>{filtered.length}</b>
            </span>
            <div className="flex gap-1">
              <button
                disabled={page === 1}
                onClick={() => setPage((value) => value - 1)}
                className="grid h-7 w-7 place-items-center rounded-lg disabled:opacity-40"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
              </button>
              {Array.from({ length: totalPages }, (_, index) => index + 1).map(
                (number) => (
                  <button
                    key={number}
                    onClick={() => setPage(number)}
                    className={`grid h-7 w-7 place-items-center rounded-lg font-semibold ${page === number ? "bg-violet-600 text-white" : "hover:bg-slate-100"}`}
                  >
                    {number}
                  </button>
                ),
              )}
              <button
                disabled={page === totalPages}
                onClick={() => setPage((value) => value + 1)}
                className="grid h-7 w-7 place-items-center rounded-lg disabled:opacity-40"
              >
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>

        {selected ? (
          <UserReviewPanel
            user={selected}
            onClose={() => setSelectedId(null)}
            onVerify={() => updateStatus(selected.id, "active")}
            onReject={() => updateStatus(selected.id, "suspended")}
          />
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center xl:col-span-5">
            <Users className="mx-auto h-10 w-10 text-slate-300" />
            <p className="mt-3 text-sm text-slate-500">
              Pilih pengguna untuk membuka detail.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}

function UserReviewPanel({
  user,
  onClose,
  onVerify,
  onReject,
}: {
  user: AdminManagedUser;
  onClose: () => void;
  onVerify: () => void;
  onReject: () => void;
}) {
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
                className={`mt-1.5 inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold ${STATUS[user.status].className}`}
              >
                {STATUS[user.status].label}
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
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between gap-4">
                <dt className="text-slate-500">{label}</dt>
                <dd className="text-right font-semibold text-slate-800">
                  {value}
                </dd>
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
            {user.documents.some(
              (document) => document.status === "Verified",
            ) && (
              <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Lampiran Sahih
              </span>
            )}
          </div>
          <div className="mt-3 space-y-2">
            {user.documents.length ? (
              user.documents.map((document) => (
                <div
                  key={document.id}
                  className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="grid h-10 w-10 place-items-center rounded-xl bg-red-50 text-red-500">
                      <FileText className="h-5 w-5" />
                    </span>
                    <div>
                      <b className="block text-xs text-slate-800">
                        {document.name}
                      </b>
                      <small className="text-[11px] text-slate-400">
                        {document.size} • {document.uploadedAt}
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
              <p className="mt-2 rounded-lg bg-slate-50 p-3 text-xs text-slate-500">
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
            ].map(([value, label]) => (
              <div
                key={label}
                className="rounded-xl border border-slate-100 bg-slate-50 p-2.5"
              >
                <b className="block text-base text-slate-900">
                  {value}
                  {label.toString().includes("Ulasan") && (
                    <Star className="ml-1 inline h-3 w-3 fill-amber-400 text-amber-400" />
                  )}
                </b>
                <span className="text-[11px] text-slate-400">{label}</span>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Riwayat Status Akun
          </h3>
          <div className="mt-3 space-y-4">
            {user.history.map((item) => (
              <div key={item.id} className="relative pl-5">
                <i
                  className={`absolute left-0 top-1 h-3 w-3 rounded-full ring-4 ${item.tone === "green" ? "bg-emerald-500 ring-emerald-100" : item.tone === "amber" ? "bg-amber-500 ring-amber-100" : "bg-slate-400 ring-slate-100"}`}
                />
                <b className="block text-xs text-slate-800">{item.date}</b>
                <p className="mt-0.5 text-[11px] text-slate-500">
                  {item.description}
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
