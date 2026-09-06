"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Bell,
  CalendarDays,
  Check,
  ChevronRight,
  Clock3,
  Filter,
  Info,
  MapPin,
  Menu,
  MessageCircle,
  QrCode,
  Search,
  Settings,
  Star,
  Users,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { INITIAL_USER_SUBMISSIONS } from "../data/submissions";
import type {
  SubmissionStatus,
  UserSubmission,
} from "../types/user-submission";

const FILTERS: Array<{ id: "all" | SubmissionStatus; label: string }> = [
  { id: "all", label: "Semua" },
  { id: "pending", label: "Menunggu" },
  { id: "approved", label: "Disetujui" },
  { id: "ongoing", label: "Berlangsung" },
  { id: "completed", label: "Selesai" },
  { id: "rejected", label: "Ditolak" },
];
const STATUS: Record<
  SubmissionStatus,
  { label: string; badge: string; dot: string }
> = {
  pending: {
    label: "Menunggu",
    badge: "border-amber-200 bg-amber-50 text-amber-700",
    dot: "bg-amber-500",
  },
  approved: {
    label: "Disetujui",
    badge: "border-emerald-200 bg-emerald-50 text-emerald-700",
    dot: "bg-emerald-500",
  },
  ongoing: {
    label: "Berlangsung",
    badge: "border-blue-200 bg-blue-50 text-blue-700",
    dot: "bg-blue-500",
  },
  completed: {
    label: "Selesai",
    badge: "border-slate-200 bg-slate-100 text-slate-700",
    dot: "bg-slate-400",
  },
  rejected: {
    label: "Ditolak",
    badge: "border-rose-200 bg-rose-50 text-rose-700",
    dot: "bg-rose-500",
  },
  cancelled: {
    label: "Dibatalkan",
    badge: "border-slate-200 bg-slate-50 text-slate-500",
    dot: "bg-slate-400",
  },
};
const rupiah = (value: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);

export default function UserSubmissionsPage() {
  const router = useRouter();
  const [items, setItems] = useState(INITIAL_USER_SUBMISSIONS);
  const [activeFilter, setActiveFilter] = useState<"all" | SubmissionStatus>(
    "all",
  );
  const [query, setQuery] = useState("");
  const [period, setPeriod] = useState("all");
  const [selectedId, setSelectedId] = useState<string | null>("submission-1");
  const [visible, setVisible] = useState(5);
  const [mobileMenu, setMobileMenu] = useState(false);
  const selected = items.find((item) => item.id === selectedId) ?? null;
  const filtered = useMemo(
    () =>
      items.filter(
        (item) =>
          (activeFilter === "all" || item.status === activeFilter) &&
          (period === "all" || item.period === period) &&
          `${item.venueName} ${item.code} ${item.location}`
            .toLocaleLowerCase("id-ID")
            .includes(query.trim().toLocaleLowerCase("id-ID")),
      ),
    [items, activeFilter, period, query],
  );
  const count = (status: "all" | SubmissionStatus) =>
    status === "all"
      ? items.length
      : items.filter((item) => item.status === status).length;
  const cancel = (id: string) =>
    setItems((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              status: "cancelled",
              paymentStatus: "Proses pengembalian",
            }
          : item,
      ),
    );

  return (
    <div className="min-h-screen bg-[#F8F9FD] text-slate-800">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-10">
            <Link
              href="/"
              className="text-2xl font-black tracking-tight text-violet-700"
            >
              Ruang<span className="text-slate-900">Sela</span>
            </Link>
            <nav className="hidden items-center gap-8 text-sm font-medium md:flex">
              <Link href="/" className="text-slate-600 hover:text-violet-600">
                Beranda
              </Link>
              <Link
                href="/cari"
                className="text-slate-600 hover:text-violet-600"
              >
                Cari Tempat
              </Link>
              <Link
                href="/kegiatan"
                className="text-slate-600 hover:text-violet-600"
              >
                Kegiatan
              </Link>
              <Link
                href="/pengajuan"
                className="relative py-2 font-semibold text-violet-600"
              >
                Pengajuan Saya
                <span className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-violet-600" />
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => router.push("/notifikasi")}
              aria-label="Notifikasi"
              className="relative grid h-10 w-10 place-items-center rounded-full text-slate-500 hover:bg-slate-100"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white" />
            </button>
            <button
              onClick={() => router.push("/settings")}
              aria-label="Pengaturan"
              className="grid h-10 w-10 place-items-center rounded-full text-slate-500 hover:bg-slate-100"
            >
              <Settings className="h-5 w-5" />
            </button>
            <button
              onClick={() => router.push("/profile")}
              aria-label="Profil"
              className="grid h-10 w-10 place-items-center rounded-full bg-[#151336] text-sm font-semibold text-white"
            >
              A
            </button>
            <button
              onClick={() => setMobileMenu((value) => !value)}
              className="grid h-10 w-10 place-items-center rounded-lg md:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
        {mobileMenu && (
          <nav className="border-t border-slate-100 p-4 md:hidden">
            <div className="grid gap-2 text-sm">
              <Link href="/">Beranda</Link>
              <Link href="/cari">Cari Tempat</Link>
              <Link href="/kegiatan">Kegiatan</Link>
              <Link href="/pengajuan" className="font-semibold text-violet-600">
                Pengajuan Saya
              </Link>
            </div>
          </nav>
        )}
      </header>

      <main className="mx-auto w-full max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
        <section className="space-y-4">
          <nav className="flex gap-2 text-xs font-medium text-slate-500">
            <Link href="/" className="hover:text-slate-800">
              Beranda
            </Link>
            <span>/</span>
            <span className="font-semibold text-violet-600">
              Pengajuan Saya
            </span>
          </nav>
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                Pengajuan Saya
              </h1>
              <p className="mt-1 text-sm text-slate-500 sm:text-base">
                Pantau status persetujuan, jadwal, dan riwayat penggunaan ruang
                publik kamu.
              </p>
            </div>
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-violet-100 bg-violet-50 px-4 py-2 text-xs font-semibold text-violet-700">
              <i className="h-2 w-2 animate-pulse rounded-full bg-violet-600" />
              Total {items.length} Pengajuan Terdata
            </span>
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex gap-2 overflow-x-auto border-b border-slate-200 pb-2">
            {FILTERS.map((filter) => (
              <button
                key={filter.id}
                onClick={() => {
                  setActiveFilter(filter.id);
                  setVisible(5);
                }}
                className={`flex whitespace-nowrap rounded-xl border px-4 py-2 text-xs font-semibold sm:text-sm ${activeFilter === filter.id ? "border-violet-600 bg-violet-600 text-white" : "border-slate-200 bg-white text-slate-600"}`}
              >
                {filter.label}
                <span
                  className={`ml-2 rounded-full px-2 py-0.5 text-xs ${activeFilter === filter.id ? "bg-white/20" : "bg-slate-100"}`}
                >
                  {count(filter.id)}
                </span>
              </button>
            ))}
          </div>
          <div className="flex flex-col justify-between gap-3 sm:flex-row">
            <label className="relative block w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Cari tempat atau ID booking..."
                className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-4 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/15"
              />
            </label>
            <div className="flex gap-2">
              <select
                value={period}
                onChange={(event) => setPeriod(event.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium sm:w-auto"
              >
                <option value="all">Semua Tanggal</option>
                <option>September 2026</option>
                <option>Agustus 2026</option>
              </select>
              <button
                aria-label="Filter tambahan"
                className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 bg-white"
              >
                <Filter className="h-4 w-4" />
              </button>
            </div>
          </div>
        </section>

        <div className="grid items-start gap-8 lg:grid-cols-12">
          <section className="space-y-4 lg:col-span-7">
            {filtered.slice(0, visible).map((item) => (
              <SubmissionCard
                key={item.id}
                item={item}
                selected={selectedId === item.id}
                onSelect={() => setSelectedId(item.id)}
                onCancel={() => cancel(item.id)}
              />
            ))}
            {filtered.length === 0 && (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center">
                <Search className="mx-auto h-8 w-8 text-slate-300" />
                <h2 className="mt-3 font-bold text-slate-900">
                  Pengajuan tidak ditemukan
                </h2>
              </div>
            )}
            {visible < filtered.length && (
              <button
                onClick={() => setVisible((value) => value + 5)}
                className="w-full rounded-xl border border-slate-200 bg-white py-3 text-sm font-semibold text-slate-600"
              >
                Muat Lebih Banyak
              </button>
            )}
          </section>
          <section className="lg:col-span-5">
            {selected ? (
              <SubmissionDetail
                item={selected}
                onCancel={() => cancel(selected.id)}
              />
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-500">
                Pilih pengajuan untuk melihat detail.
              </div>
            )}
          </section>
        </div>
      </main>

      <footer className="mt-20 bg-[#151336] py-10 text-slate-400">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 px-4 text-sm sm:flex-row sm:px-6 lg:px-8">
          <div>
            <strong className="text-xl text-white">
              Ruang<span className="text-violet-500">Sela</span>
            </strong>
            <p className="mt-2 max-w-lg text-xs leading-relaxed">
              Menghubungkan masyarakat dengan ruang publik untuk mendukung
              kolaborasi warga.
            </p>
          </div>
          <p className="text-xs">
            © 2026 RuangSela. Digital Citizenship for All.
          </p>
        </div>
      </footer>
    </div>
  );
}

function SubmissionCard({
  item,
  selected,
  onSelect,
  onCancel,
}: {
  item: UserSubmission;
  selected: boolean;
  onSelect: () => void;
  onCancel: () => void;
}) {
  const style = STATUS[item.status];
  return (
    <article
      onClick={onSelect}
      className={`relative cursor-pointer overflow-hidden rounded-2xl bg-white p-5 shadow-sm transition ${selected ? "border-2 border-violet-500 shadow-md" : "border border-slate-200 hover:shadow-md"}`}
    >
      {selected && (
        <span className="absolute right-0 top-0 rounded-bl-xl bg-violet-600 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
          Sedang Dilihat
        </span>
      )}
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative h-32 w-full shrink-0 overflow-hidden rounded-xl bg-slate-100 sm:w-36">
          <Image
            src={item.imageSrc}
            alt={item.venueName}
            fill
            sizes="(max-width:640px) 100vw,144px"
            className="object-cover"
          />
        </div>
        <div className="flex flex-1 flex-col justify-between">
          <div>
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-base font-bold text-slate-900 sm:text-lg">
                  {item.venueName}
                </h2>
                <p className="mt-0.5 flex items-center gap-1 text-xs text-slate-500">
                  <MapPin className="h-3.5 w-3.5" />
                  {item.location}
                </p>
              </div>
              <span
                className={`inline-flex items-center gap-1 rounded-lg border px-2.5 py-1 text-xs font-semibold ${style.badge}`}
              >
                <i className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
                {style.label}
              </span>
            </div>
            {item.rejectionReason && (
              <p className="mt-2 rounded-xl border border-rose-100 bg-rose-50 p-2 text-xs text-rose-700">
                <b>Alasan:</b> {item.rejectionReason}
              </p>
            )}
            <div className="mt-3 grid grid-cols-2 gap-1.5 text-xs text-slate-600">
              <span className="flex items-center gap-1.5">
                <CalendarDays className="h-3.5 w-3.5 text-slate-400" />
                {item.date}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock3 className="h-3.5 w-3.5 text-slate-400" />
                {item.time}
              </span>
              <span className="flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5 text-slate-400" />
                {item.participants} peserta
              </span>
              <span className="font-mono text-slate-500">#{item.code}</span>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-4">
            <div>
              <small className="block text-[11px] text-slate-400">
                Total Biaya
              </small>
              <b>{rupiah(item.total)}</b>
            </div>
            <div className="flex gap-2">
              {item.status === "pending" && (
                <button
                  onClick={(event) => {
                    event.stopPropagation();
                    onCancel();
                  }}
                  className="rounded-lg px-3 py-1.5 text-xs font-medium text-slate-500 hover:bg-rose-50 hover:text-rose-600"
                >
                  Batalkan
                </button>
              )}
              {item.status === "ongoing" && (
                <button className="inline-flex items-center gap-1 rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700">
                  <QrCode className="h-3.5 w-3.5" />
                  Check-In
                </button>
              )}
              {item.status === "completed" && (
                <button className="inline-flex items-center gap-1 rounded-lg border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700">
                  <Star className="h-3.5 w-3.5" />
                  Beri Ulasan
                </button>
              )}
              <button
                onClick={(event) => {
                  event.stopPropagation();
                  onSelect();
                }}
                className="rounded-lg bg-violet-600 px-4 py-1.5 text-xs font-semibold text-white"
              >
                Detail
              </button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

function SubmissionDetail({
  item,
  onCancel,
}: {
  item: UserSubmission;
  onCancel: () => void;
}) {
  const style = STATUS[item.status];
  return (
    <div className="sticky top-28 space-y-4">
      <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="relative h-40 bg-slate-800">
          <Image
            src={item.imageSrc}
            alt={item.venueName}
            fill
            sizes="(max-width:1024px) 100vw,480px"
            className="object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20" />
          <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3 text-white">
            <div>
              <span className="rounded bg-violet-600/80 px-2 py-0.5 text-[10px] font-bold uppercase">
                Detail Pengajuan
              </span>
              <h2 className="mt-1 text-lg font-bold">{item.venueName}</h2>
              <p className="flex items-center gap-1 text-xs text-slate-200">
                <MapPin className="h-3 w-3" />
                {item.location}
              </p>
            </div>
            <span
              className={`rounded-lg border px-2.5 py-1 text-xs font-semibold ${style.badge}`}
            >
              {style.label}
            </span>
          </div>
        </div>
        <div className="space-y-6 p-5">
          <div className="grid grid-cols-2 gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3.5 text-xs">
            <div>
              <p className="text-slate-400">Nomor Pengajuan</p>
              <b className="font-mono">#{item.code}</b>
            </div>
            <div>
              <p className="text-slate-400">Jadwal</p>
              <b>{item.date}</b>
            </div>
            <div>
              <p className="text-slate-400">Waktu</p>
              <b>
                {item.time} ({item.duration})
              </b>
            </div>
            <div>
              <p className="text-slate-400">Kapasitas</p>
              <b>{item.participants} Orang</b>
            </div>
          </div>
          <section>
            <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-400">
              Progres & Tahapan
            </h3>
            <div className="relative space-y-5 pl-6 before:absolute before:bottom-2 before:left-2 before:top-2 before:w-0.5 before:bg-slate-200">
              {item.timeline.map((step) => (
                <div
                  key={step.id}
                  className={`relative ${!step.completed && !step.active ? "opacity-50" : ""}`}
                >
                  <span
                    className={`absolute -left-6 top-0 grid h-4 w-4 place-items-center rounded-full text-[9px] text-white ring-4 ring-white ${step.completed ? "bg-emerald-500" : step.active ? "bg-amber-500 ring-amber-100" : "bg-slate-300"}`}
                  >
                    {step.completed ? "✓" : step.active ? "…" : "○"}
                  </span>
                  <h4
                    className={`text-xs font-bold ${step.active ? "text-amber-800" : "text-slate-800"}`}
                  >
                    {step.title}
                  </h4>
                  <p className="mt-0.5 text-[11px] text-slate-500">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </section>
          <section className="border-t border-slate-100 pt-4 text-xs">
            <h3 className="mb-3 font-bold uppercase tracking-wider text-slate-400">
              Rincian Biaya
            </h3>
            <div className="flex justify-between">
              <span className="text-slate-600">
                Biaya penggunaan dan layanan
              </span>
              <b>{rupiah(item.total)}</b>
            </div>
            <div className="mt-2 flex justify-between border-t border-slate-100 pt-2 text-sm">
              <b>Total Pembayaran</b>
              <b className="text-violet-600">{rupiah(item.total)}</b>
            </div>
            <p className="mt-1 text-[11px] italic text-slate-400">
              Status: {item.paymentStatus}
            </p>
          </section>
          <div className="space-y-2">
            <button className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 py-2.5 text-xs font-semibold text-white">
              <MessageCircle className="h-4 w-4" />
              Hubungi Pengelola Ruang
            </button>
            {item.status === "pending" && (
              <button
                onClick={onCancel}
                className="w-full rounded-xl border border-slate-200 py-2.5 text-xs font-semibold text-slate-600 hover:bg-rose-50 hover:text-rose-600"
              >
                Batalkan Pengajuan Ini
              </button>
            )}
          </div>
        </div>
      </article>
      <aside className="flex items-start gap-3 rounded-xl border border-purple-100 bg-purple-50 p-4 text-xs text-purple-900">
        <Info className="mt-0.5 h-5 w-5 shrink-0 text-violet-600" />
        <div>
          <b>Butuh bantuan?</b>
          <p className="mt-0.5 leading-relaxed text-purple-700">
            Jika belum ada respons setelah 48 jam, gunakan Pusat Bantuan atau
            Live Chat RuangSela.
          </p>
        </div>
      </aside>
    </div>
  );
}
