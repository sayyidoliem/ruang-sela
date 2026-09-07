"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Check,
  Clock3,
  Download,
  FileText,
  MapPin,
  Megaphone,
  QrCode,
  Settings2,
  Trash2,
  UploadCloud,
  WalletCards,
  X,
} from "lucide-react";
import {
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import BookingStepper from "./BookingStepper";
import type {
  BookingCategory,
  BookingFormData,
  BookingVenue,
  OrganizerType,
  PaymentMethod,
} from "../types/booking";

type Errors = Record<string, string>;
const CATEGORIES: BookingCategory[] = [
  "Workshop / Pelatihan",
  "Seni & Budaya",
  "Sosial & Warga",
  "Olahraga Ringan",
];
const AGREEMENTS = [
  "Bersedia menjaga ketertiban, kebersihan, dan tidak merusak fasilitas.",
  "Tidak membawa barang terlarang, zat berbahaya, atau merokok di ruangan.",
  "Bertanggung jawab atas keselamatan peserta selama peminjaman.",
];
const rupiah = (value: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
const dateText = (value: string) =>
  value
    ? new Intl.DateTimeFormat("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }).format(new Date(`${value}T00:00:00`))
    : "Belum dipilih";
const endTime = (start: string, duration: number) => {
  const [h, m] = start.split(":").map(Number);
  const total = h * 60 + m + duration * 60;
  return `${String(Math.floor(total / 60) % 24).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
};

export default function BookingFormPage({ venue }: { venue: BookingVenue }) {
  const router = useRouter();
  const identityRef = useRef<HTMLInputElement>(null);
  const proposalRef = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState<Errors>({});
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState<BookingFormData>({
    activity: {
      activityName: "Rapat Komunitas Bulanan",
      category: "Sosial & Warga",
      description:
        "Musyawarah evaluasi program kebersihan dan taman lingkungan bersama warga.",
      participantCount: 25,
      organizerType: "organization",
      organizerProfile: "Komunitas Kreatif Lingkungan",
      additionalNotes: "Perlu bantuan pengaturan sound system dan proyektor.",
    },
    schedule: {
      date: "",
      durationHours: 4,
      startTime: "10:00",
      preparationTime: true,
    },
    requirements: {
      identityDocument: null,
      proposalDocument: null,
      agreements: [true, true, true],
      emergencyContact: "+62 812-3456-7890 (Budi Santoso)",
    },
    payment: { method: "qris" },
  });
  const rental = venue.hourlyPrice * form.schedule.durationHours;
  const total = rental + venue.serviceFee;
  const finish = useMemo(
    () => endTime(form.schedule.startTime, form.schedule.durationHours),
    [form.schedule],
  );
  const input =
    "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#7c3aed] focus:ring-2 focus:ring-[#7c3aed]/15";
  const activity = <K extends keyof BookingFormData["activity"]>(
    key: K,
    value: BookingFormData["activity"][K],
  ) => setForm((c) => ({ ...c, activity: { ...c.activity, [key]: value } }));
  const schedule = <K extends keyof BookingFormData["schedule"]>(
    key: K,
    value: BookingFormData["schedule"][K],
  ) => setForm((c) => ({ ...c, schedule: { ...c.schedule, [key]: value } }));
  const document = (
    key: "identityDocument" | "proposalDocument",
    file: File | null,
  ) => {
    if (file && file.size > 5 * 1024 * 1024)
      return setErrors({ [key]: "Ukuran berkas maksimal 5 MB." });
    setForm((c) => ({
      ...c,
      requirements: { ...c.requirements, [key]: file },
    }));
    setErrors({});
  };
  const validate = () => {
    const e: Errors = {};
    if (step === 1) {
      if (!form.activity.activityName.trim())
        e.activityName = "Nama kegiatan wajib diisi.";
      if (!form.activity.description.trim())
        e.description = "Deskripsi wajib diisi.";
      if (
        form.activity.participantCount < 1 ||
        form.activity.participantCount > venue.capacity
      )
        e.participants = `Jumlah peserta maksimal ${venue.capacity}.`;
    }
    if (step === 2) {
      if (!form.schedule.date) e.date = "Tanggal wajib dipilih.";
      if (
        form.schedule.durationHours < 1 ||
        form.schedule.durationHours > venue.maximumDurationHours
      )
        e.duration = `Durasi maksimal ${venue.maximumDurationHours} jam.`;
    }
    if (step === 3) {
      if (!form.requirements.identityDocument)
        e.identityDocument = "Identitas wajib diunggah.";
      if (!form.requirements.proposalDocument)
        e.proposalDocument = "Proposal wajib diunggah.";
      if (!form.requirements.agreements.every(Boolean))
        e.agreements = "Semua pernyataan wajib disetujui.";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };
  const next = () => {
    if (validate()) {
      setStep((s) => Math.min(4, s + 1));
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };
  const back = () =>
    step === 1 ? router.push(`/ruang/${venue.slug}`) : setStep((s) => s - 1);
  const submit = (e: FormEvent) => {
    e.preventDefault();
    setSuccess(true);
  };

  return (
    <>
      <main className="min-h-screen bg-[#faf9fc]">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <header className="mb-8">
            <h1 className="text-3xl font-extrabold text-slate-900">
              Formulir Pengajuan
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Lengkapi detail pengajuan penggunaan ruang publik.
            </p>
          </header>
          <BookingStepper currentStep={step} />
          <form onSubmit={submit}>
            {step === 1 && (
              <Card
                title="Detail Aktivitas & Kegiatan"
                subtitle="Jelaskan tujuan dan jenis kegiatan agar pengelola dapat memfasilitasi kebutuhan Anda."
              >
                <Field
                  label="Nama kegiatan / acara"
                  error={errors.activityName}
                >
                  <div className="relative">
                    <Megaphone className="absolute left-3.5 top-3.5 h-5 w-5 text-slate-400" />
                    <input
                      className={`${input} pl-11`}
                      value={form.activity.activityName}
                      onChange={(e) => activity("activityName", e.target.value)}
                    />
                  </div>
                </Field>
                <Field label="Kategori kegiatan">
                  <div className="flex flex-wrap gap-2">
                    {CATEGORIES.map((c) => (
                      <button
                        type="button"
                        key={c}
                        onClick={() => activity("category", c)}
                        className={`rounded-xl border px-4 py-2.5 text-xs ${form.activity.category === c ? "border-violet-600 bg-violet-50 text-violet-700" : "border-slate-200"}`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </Field>
                <Field
                  label="Deskripsi singkat acara"
                  error={errors.description}
                >
                  <textarea
                    rows={4}
                    maxLength={500}
                    className={input}
                    value={form.activity.description}
                    onChange={(e) => activity("description", e.target.value)}
                  />
                </Field>
                <div className="grid gap-6 md:grid-cols-2">
                  <Field
                    label="Estimasi jumlah peserta"
                    error={errors.participants}
                  >
                    <input
                      type="number"
                      min={1}
                      max={venue.capacity}
                      className={input}
                      value={form.activity.participantCount}
                      onChange={(e) =>
                        activity("participantCount", Number(e.target.value))
                      }
                    />
                    <p className="mt-1 text-xs text-slate-400">
                      Maksimal {venue.capacity} orang.
                    </p>
                  </Field>
                  <Field label="Tipe penyelenggara">
                    <div className="flex rounded-xl bg-slate-100 p-1">
                      {(
                        [
                          ["personal", "Pribadi"],
                          ["organization", "Organisasi / Komunitas"],
                        ] as const
                      ).map(([v, l]) => (
                        <button
                          type="button"
                          key={v}
                          onClick={() =>
                            activity("organizerType", v as OrganizerType)
                          }
                          className={`flex-1 rounded-lg py-2 text-xs font-semibold ${form.activity.organizerType === v ? "bg-white shadow-sm" : "text-slate-500"}`}
                        >
                          {l}
                        </button>
                      ))}
                    </div>
                  </Field>
                </div>
                {form.activity.organizerType === "organization" && (
                  <Field label="Profil penyelenggara / komunitas">
                    <div className="relative">
                      <Building2 className="absolute left-3.5 top-3.5 h-5 w-5 text-slate-400" />
                      <input
                        className={`${input} pl-11`}
                        value={form.activity.organizerProfile}
                        onChange={(e) =>
                          activity("organizerProfile", e.target.value)
                        }
                      />
                    </div>
                  </Field>
                )}
                <Field label="Kebutuhan khusus / catatan tambahan">
                  <div className="relative">
                    <Settings2 className="absolute left-3.5 top-3.5 h-5 w-5 text-slate-400" />
                    <textarea
                      rows={3}
                      className={`${input} pl-11`}
                      value={form.activity.additionalNotes}
                      onChange={(e) =>
                        activity("additionalNotes", e.target.value)
                      }
                    />
                  </div>
                </Field>
              </Card>
            )}
            {step === 2 && (
              <Card
                title="Detail Jadwal Kegiatan"
                subtitle="Tentukan tanggal, durasi, dan waktu mulai kegiatan."
              >
                <div className="grid gap-6 md:grid-cols-2">
                  <Field label="Nama kegiatan">
                    <input
                      readOnly
                      className={`${input} bg-slate-50`}
                      value={form.activity.activityName}
                    />
                  </Field>
                  <Field label="Kategori">
                    <input
                      readOnly
                      className={`${input} bg-slate-50`}
                      value={form.activity.category}
                    />
                  </Field>
                </div>
                <div className="grid gap-6 md:grid-cols-2">
                  <Field label="Tanggal kegiatan" error={errors.date}>
                    <input
                      type="date"
                      className={input}
                      value={form.schedule.date}
                      onChange={(e) => schedule("date", e.target.value)}
                    />
                  </Field>
                  <Field label="Durasi sewa" error={errors.duration}>
                    <input
                      type="number"
                      min={1}
                      max={venue.maximumDurationHours}
                      className={input}
                      value={form.schedule.durationHours}
                      onChange={(e) =>
                        schedule("durationHours", Number(e.target.value))
                      }
                    />
                  </Field>
                </div>
                <Field label="Pilih waktu mulai">
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {venue.availableTimes.map((t) => (
                      <button
                        type="button"
                        key={t}
                        onClick={() => schedule("startTime", t)}
                        className={`rounded-xl py-4 font-bold ${form.schedule.startTime === t ? "border-2 border-violet-600 bg-violet-50" : "border border-slate-200"}`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                  <div className="mt-4 rounded-xl bg-slate-50 p-3 text-xs">
                    <Clock3 className="mr-2 inline h-4 w-4" />
                    {form.schedule.startTime} hingga {finish} WIB
                  </div>
                </Field>
                <label className="flex gap-3 rounded-xl border bg-slate-50 p-4">
                  <input
                    type="checkbox"
                    checked={form.schedule.preparationTime}
                    onChange={(e) =>
                      schedule("preparationTime", e.target.checked)
                    }
                  />
                  <span className="text-sm font-bold">
                    Tambahkan waktu persiapan 30 menit
                  </span>
                </label>
              </Card>
            )}
            {step === 3 && (
              <Card
                title="Persyaratan & Dokumen Pendukung"
                subtitle="Unggah dokumen untuk proses verifikasi."
              >
                <UploadField
                  label="Kartu Identitas Penanggung Jawab"
                  file={form.requirements.identityDocument}
                  inputRef={identityRef}
                  accept=".pdf,.jpg,.jpeg,.png"
                  error={errors.identityDocument}
                  onChange={(e) =>
                    document("identityDocument", e.target.files?.[0] ?? null)
                  }
                  onRemove={() => document("identityDocument", null)}
                />
                <UploadField
                  label="Surat Pengantar / Proposal"
                  file={form.requirements.proposalDocument}
                  inputRef={proposalRef}
                  accept=".pdf,.doc,.docx"
                  error={errors.proposalDocument}
                  onChange={(e) =>
                    document("proposalDocument", e.target.files?.[0] ?? null)
                  }
                  onRemove={() => document("proposalDocument", null)}
                />
                <Field label="Pernyataan tata tertib" error={errors.agreements}>
                  <div className="divide-y overflow-hidden rounded-xl border">
                    {AGREEMENTS.map((a, i) => (
                      <label key={a} className="flex gap-3 p-4 text-xs">
                        <input
                          type="checkbox"
                          checked={form.requirements.agreements[i]}
                          onChange={(e) =>
                            setForm((c) => ({
                              ...c,
                              requirements: {
                                ...c.requirements,
                                agreements: c.requirements.agreements.map(
                                  (v, j) => (j === i ? e.target.checked : v),
                                ),
                              },
                            }))
                          }
                        />
                        {a}
                      </label>
                    ))}
                  </div>
                </Field>
                <Field label="Kontak darurat">
                  <input
                    className={input}
                    value={form.requirements.emergencyContact}
                    onChange={(e) =>
                      setForm((c) => ({
                        ...c,
                        requirements: {
                          ...c.requirements,
                          emergencyContact: e.target.value,
                        },
                      }))
                    }
                  />
                </Field>
              </Card>
            )}
            {step === 4 && (
              <div className="grid items-start gap-8 lg:grid-cols-12">
                <div className="space-y-6 lg:col-span-8">
                  <Card title="Pembayaran" subtitle="Pilih metode pembayaran.">
                    {(
                      [
                        ["qris", "QRIS"],
                        ["virtual-account", "Virtual Account"],
                        ["e-wallet", "Dompet Digital"],
                      ] as [PaymentMethod, string][]
                    ).map(([v, l]) => (
                      <button
                        type="button"
                        key={v}
                        onClick={() =>
                          setForm((c) => ({ ...c, payment: { method: v } }))
                        }
                        className={`flex w-full items-center justify-between rounded-xl p-4 ${form.payment.method === v ? "border-2 border-violet-600 bg-violet-50" : "border"}`}
                      >
                        <span className="flex items-center gap-3">
                          <WalletCards className="h-5 w-5" />
                          <b>{l}</b>
                        </span>
                        <span
                          className={`h-5 w-5 rounded-full border ${form.payment.method === v ? "border-[6px] border-violet-600" : ""}`}
                        />
                      </button>
                    ))}
                  </Card>
                  {form.payment.method === "qris" && (
                    <Card
                      title="Pembayaran QRIS"
                      subtitle="Scan menggunakan aplikasi pembayaran Anda."
                    >
                      <div className="text-center">
                        <div className="mx-auto grid h-56 w-56 place-items-center rounded-2xl border">
                          <QrCode className="h-44 w-44" />
                        </div>
                        <p className="mt-5 text-xs uppercase text-slate-400">
                          Total pembayaran
                        </p>
                        <p className="text-3xl font-extrabold text-violet-600">
                          {rupiah(total)}
                        </p>
                        <button
                          type="button"
                          className="mt-3 inline-flex items-center gap-2 text-xs text-violet-600"
                        >
                          <Download className="h-4 w-4" />
                          Unduh kode QR
                        </button>
                      </div>
                    </Card>
                  )}
                </div>
                <aside className="lg:col-span-4">
                  <div className="sticky top-24 overflow-hidden rounded-2xl border bg-white shadow-sm">
                    <div className="relative h-48">
                      <Image
                        src={venue.imageSrc}
                        alt={venue.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-6">
                      <h2 className="font-bold">{venue.name}</h2>
                      <p className="mt-1 text-xs text-slate-500">
                        <MapPin className="mr-1 inline h-4 w-4" />
                        {venue.location}
                      </p>
                      <div className="mt-5 space-y-3 border-t pt-5 text-sm">
                        <Row l="Tanggal" v={dateText(form.schedule.date)} />
                        <Row
                          l="Waktu"
                          v={`${form.schedule.startTime} - ${finish}`}
                        />
                        <Row l="Sewa" v={rupiah(rental)} />
                        <Row l="Layanan" v={rupiah(venue.serviceFee)} />
                      </div>
                      <div className="mt-5 flex justify-between border-t pt-5">
                        <b>Total</b>
                        <b className="text-xl text-violet-600">
                          {rupiah(total)}
                        </b>
                      </div>
                    </div>
                  </div>
                </aside>
              </div>
            )}
            <div className="mt-8 flex flex-col-reverse justify-between gap-3 border-t pt-6 sm:flex-row">
              <button
                type="button"
                onClick={back}
                className="rounded-xl border bg-white px-6 py-3 text-sm font-semibold"
              >
                <ArrowLeft className="mr-2 inline h-4 w-4" />
                Kembali
              </button>
              {step < 4 ? (
                <button
                  type="button"
                  onClick={next}
                  className="rounded-xl bg-violet-600 px-7 py-3 text-sm font-semibold text-white"
                >
                  Lanjut
                  <ArrowRight className="ml-2 inline h-4 w-4" />
                </button>
              ) : (
                <button
                  type="submit"
                  className="rounded-xl bg-violet-600 px-7 py-3 text-sm font-semibold text-white"
                >
                  Saya Sudah Membayar {rupiah(total)}
                </button>
              )}
            </div>
          </form>
        </div>
      </main>
      {success && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div
            role="dialog"
            aria-modal="true"
            className="relative w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl"
          >
            <button
              onClick={() => setSuccess(false)}
              className="absolute right-4 top-4"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-100 text-emerald-600">
              <Check className="h-8 w-8" />
            </div>
            <h2 className="mt-5 text-center text-2xl font-extrabold">
              Pengajuan Berhasil!
            </h2>
            <p className="mt-2 text-center text-sm text-slate-500">
              Pengajuan berhasil dikirim dan sedang diproses.
            </p>
            <div className="mt-6 rounded-xl bg-slate-50 p-4">
              <b>{venue.name}</b>
              <Row l="Tanggal" v={dateText(form.schedule.date)} />
              <Row l="Total" v={rupiah(total)} />
            </div>
            <button
              onClick={() => router.push("/pengajuan-saya")}
              className="mt-6 w-full rounded-xl bg-violet-600 py-3 text-sm font-semibold text-white"
            >
              Lihat Pengajuan Saya
            </button>
            <button
              onClick={() => router.push("/")}
              className="mt-2 w-full rounded-xl border py-3 text-sm"
            >
              Kembali ke Beranda
            </button>
          </div>
        </div>
      )}
    </>
  );
}

function Card({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="border-b pb-5">
        <h2 className="text-xl font-bold">{title}</h2>
        <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
      </div>
      {children}
    </section>
  );
}
function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-700">
        {label}
      </label>
      {children}
      {error && <p className="mt-1 text-xs text-rose-600">{error}</p>}
    </div>
  );
}
function Row({ l, v }: { l: string; v: string }) {
  return (
    <div className="mt-3 flex justify-between gap-3 text-sm">
      <span className="text-slate-500">{l}</span>
      <b className="text-right">{v}</b>
    </div>
  );
}
function UploadField({
  label,
  file,
  inputRef,
  accept,
  error,
  onChange,
  onRemove,
}: {
  label: string;
  file: File | null;
  inputRef: React.RefObject<HTMLInputElement | null>;
  accept: string;
  error?: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onRemove: () => void;
}) {
  return (
    <Field label={label} error={error}>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={onChange}
        className="hidden"
      />
      {file ? (
        <div className="flex items-center justify-between rounded-xl border bg-slate-50 p-4">
          <span className="flex items-center gap-3">
            <FileText className="h-5 w-5 text-violet-600" />
            <span className="text-xs font-bold">{file.name}</span>
          </span>
          <button type="button" onClick={onRemove}>
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="w-full rounded-xl border-2 border-dashed p-8 text-center"
        >
          <UploadCloud className="mx-auto h-8 w-8 text-violet-600" />
          <span className="mt-2 block text-xs font-semibold">
            Pilih berkas, maksimum 5 MB
          </span>
        </button>
      )}
    </Field>
  );
}
