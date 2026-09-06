"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Check,
  ChevronDown,
  Clock3,
  Info,
  MapPin,
  Users,
} from "lucide-react";
import { useMemo, useState, type FormEvent } from "react";
import type { BookingScheduleInput, BookingVenue } from "../types/booking";

interface BookingFormPageProps {
  venue: BookingVenue;
}

const CATEGORIES = [
  "Pertemuan/Rapat",
  "Workshop / Pelatihan",
  "Seminar / Diskusi",
  "Pameran Seni",
];

const STEPS = ["Aktivitas", "Jadwal", "Persyaratan", "Pembayaran"];

const formatRupiah = (value: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);

function formatDate(value: string) {
  if (!value) return "Belum dipilih";
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(`${value}T00:00:00`));
}

function endTime(startTime: string, durationHours: number) {
  const [hour, minute] = startTime.split(":").map(Number);
  return `${String((hour + durationHours) % 24).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

export default function BookingFormPage({ venue }: BookingFormPageProps) {
  const router = useRouter();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState<BookingScheduleInput>({
    activityName: "Rapat Komunitas Bulanan",
    category: CATEGORIES[0],
    date: "2026-10-15",
    durationHours: 4,
    startTime: "10:00",
    participantCount: 25,
  });

  const rentalPrice = venue.hourlyPrice * form.durationHours;
  const totalPrice = rentalPrice + venue.serviceFee;
  const finishTime = useMemo(
    () => endTime(form.startTime, form.durationHours),
    [form.startTime, form.durationHours],
  );

  const update = <K extends keyof BookingScheduleInput>(
    key: K,
    value: BookingScheduleInput[K],
  ) => {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: "" }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors: Record<string, string> = {};

    if (!form.activityName.trim())
      nextErrors.activityName = "Nama kegiatan wajib diisi.";
    if (!form.date) nextErrors.date = "Tanggal wajib dipilih.";
    if (form.durationHours < 1)
      nextErrors.durationHours = "Durasi minimal 1 jam.";
    if (form.participantCount < 1)
      nextErrors.participantCount = "Jumlah peserta minimal 1 orang.";

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const query = new URLSearchParams({
      activity: form.activityName,
      category: form.category,
      date: form.date,
      duration: String(form.durationHours),
      start: form.startTime,
      participants: String(form.participantCount),
    });

    router.push(
      `/ruang/${venue.slug}/booking/persyaratan?${query.toString()}` as Parameters<
        typeof router.push
      >[0],
    );
  };

  const inputClass =
    "w-full rounded-lg border border-slate-200 bg-[#F9FAFB] px-4 py-3 text-sm font-medium text-slate-800 outline-none transition focus:border-[#5E43F3] focus:bg-white focus:ring-2 focus:ring-[#5E43F3]/20";

  return (
    <main className="flex-1 bg-slate-50">
      <form
        onSubmit={handleSubmit}
        className="mx-auto w-full max-w-7xl px-6 py-8 md:py-10 lg:px-8"
      >
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Formulir Pengajuan
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Lengkapi detail pengajuan penggunaan ruang publik.
          </p>
        </header>

        <section
          aria-label="Tahapan pengajuan"
          className="mb-8 rounded-xl border border-slate-100 bg-white p-6 shadow-sm"
        >
          <ol className="mx-auto flex max-w-3xl items-start px-0 sm:px-4">
            {STEPS.map((step, index) => {
              const number = index + 1;
              const complete = number === 1;
              const active = number === 2;
              return (
                <li
                  key={step}
                  className={`flex items-start ${index < STEPS.length - 1 ? "flex-1" : ""}`}
                >
                  <div className="flex min-w-16 flex-col items-center text-center">
                    <span
                      className={`grid h-7 w-7 place-items-center rounded-full text-xs font-bold ${complete ? "bg-emerald-500 text-white" : active ? "bg-[#5E43F3] text-white ring-4 ring-purple-100" : "bg-slate-100 text-slate-500"}`}
                    >
                      {complete ? <Check className="h-4 w-4" /> : number}
                    </span>
                    <span
                      className={`mt-2 text-[10px] sm:text-xs ${active ? "font-bold text-[#5E43F3]" : complete ? "font-semibold text-slate-700" : "font-medium text-slate-400"}`}
                    >
                      {step}
                    </span>
                  </div>
                  {index < STEPS.length - 1 && (
                    <span className="mt-3.5 h-0.5 flex-1 bg-slate-200" />
                  )}
                </li>
              );
            })}
          </ol>
        </section>

        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
          <section className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm sm:p-8 lg:col-span-8">
            <h2 className="mb-6 border-b border-slate-100 pb-4 text-lg font-bold text-slate-900">
              Detail Jadwal Kegiatan
            </h2>
            <div className="space-y-6">
              <div>
                <label
                  htmlFor="activityName"
                  className="mb-1.5 block text-xs font-medium text-slate-500"
                >
                  Nama Kegiatan
                </label>
                <input
                  id="activityName"
                  value={form.activityName}
                  onChange={(event) =>
                    update("activityName", event.target.value)
                  }
                  className={inputClass}
                  aria-invalid={Boolean(errors.activityName)}
                />
                {errors.activityName && (
                  <p className="mt-1 text-xs text-rose-600">
                    {errors.activityName}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="category"
                  className="mb-1.5 block text-xs font-medium text-slate-500"
                >
                  Kategori Kegiatan
                </label>
                <div className="relative">
                  <select
                    id="category"
                    value={form.category}
                    onChange={(event) => update("category", event.target.value)}
                    className={`${inputClass} appearance-none pr-10`}
                  >
                    {CATEGORIES.map((category) => (
                      <option key={category}>{category}</option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="date"
                    className="mb-1.5 block text-xs font-medium text-slate-500"
                  >
                    Tanggal
                  </label>
                  <div className="relative">
                    <CalendarDays className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
                    <input
                      id="date"
                      type="date"
                      value={form.date}
                      onChange={(event) => update("date", event.target.value)}
                      className={`${inputClass} pl-11`}
                    />
                  </div>
                  {errors.date && (
                    <p className="mt-1 text-xs text-rose-600">{errors.date}</p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="duration"
                    className="mb-1.5 block text-xs font-medium text-slate-500"
                  >
                    Durasi (Jam)
                  </label>
                  <div className="relative">
                    <Clock3 className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
                    <input
                      id="duration"
                      type="number"
                      min="1"
                      max="12"
                      value={form.durationHours}
                      onChange={(event) =>
                        update("durationHours", Number(event.target.value))
                      }
                      className={`${inputClass} pl-11`}
                    />
                  </div>
                  {errors.durationHours && (
                    <p className="mt-1 text-xs text-rose-600">
                      {errors.durationHours}
                    </p>
                  )}
                </div>
              </div>

              <fieldset>
                <legend className="mb-2 block text-xs font-medium text-slate-500">
                  Pilih Waktu Mulai
                </legend>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {venue.availableTimes.map((time) => (
                    <button
                      key={time}
                      type="button"
                      onClick={() => update("startTime", time)}
                      aria-pressed={form.startTime === time}
                      className={`rounded-lg px-4 py-3 text-sm transition-colors ${form.startTime === time ? "border-2 border-[#5E43F3] bg-[#EDE9FE] font-bold text-[#5E43F3]" : "border border-slate-200 bg-white font-medium text-slate-700 hover:border-slate-300"}`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </fieldset>

              <div>
                <label
                  htmlFor="participants"
                  className="mb-1.5 block text-xs font-medium text-slate-500"
                >
                  Perkiraan Jumlah Peserta
                </label>
                <div className="relative">
                  <Users className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
                  <input
                    id="participants"
                    type="number"
                    min="1"
                    value={form.participantCount}
                    onChange={(event) =>
                      update("participantCount", Number(event.target.value))
                    }
                    className={`${inputClass} pl-11`}
                  />
                </div>
                {errors.participantCount && (
                  <p className="mt-1 text-xs text-rose-600">
                    {errors.participantCount}
                  </p>
                )}
              </div>
            </div>
          </section>

          <aside className="lg:col-span-4">
            <div className="sticky top-24 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
              <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                <Image
                  src={venue.imageSrc}
                  alt={venue.name}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 33vw"
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <div className="mb-5">
                  <h2 className="text-lg font-bold text-slate-900">
                    {venue.name}
                  </h2>
                  <p className="mt-1 flex items-center text-xs font-medium text-slate-500">
                    <MapPin className="mr-1 h-3.5 w-3.5 text-slate-400" />
                    {venue.location}
                  </p>
                </div>
                <dl className="space-y-2 border-b border-slate-100 pb-5 text-sm">
                  <div className="flex justify-between gap-4">
                    <dt className="text-slate-500">Tanggal</dt>
                    <dd className="text-right font-bold text-slate-900">
                      {formatDate(form.date)}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-slate-500">Waktu</dt>
                    <dd className="font-bold text-slate-900">
                      {form.startTime} - {finishTime}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-slate-500">Durasi</dt>
                    <dd className="font-bold text-slate-900">
                      {form.durationHours} Jam
                    </dd>
                  </div>
                </dl>
                <dl className="space-y-2 border-b border-slate-100 py-4 text-sm">
                  <div className="flex justify-between gap-4">
                    <dt className="text-slate-600">
                      Sewa Ruang (x{form.durationHours} Jam)
                    </dt>
                    <dd className="font-medium text-slate-800">
                      {formatRupiah(rentalPrice)}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-slate-600">Biaya Layanan</dt>
                    <dd className="font-medium text-slate-800">
                      {formatRupiah(venue.serviceFee)}
                    </dd>
                  </div>
                </dl>
                <div className="flex items-center justify-between py-4">
                  <span className="font-bold text-slate-900">Total</span>
                  <strong className="text-xl text-[#5E43F3]">
                    {formatRupiah(totalPrice)}
                  </strong>
                </div>
                <div className="mt-2 flex items-start gap-2.5 rounded-xl border border-amber-200/60 bg-[#FEF9EE] p-3.5">
                  <Info className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                  <p className="text-[11px] leading-relaxed text-amber-900">
                    Pemesanan ini memerlukan persetujuan pengelola. Pembayaran
                    dilakukan setelah disetujui.
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>

        <div className="mt-8 flex flex-col-reverse items-stretch justify-between gap-3 sm:flex-row sm:items-center">
          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-50"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali
          </button>
          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-lg bg-[#5E43F3] px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#4d32e6]"
          >
            Lanjut ke Persyaratan
            <ArrowRight className="ml-2 h-4 w-4" />
          </button>
        </div>
      </form>
    </main>
  );
}
