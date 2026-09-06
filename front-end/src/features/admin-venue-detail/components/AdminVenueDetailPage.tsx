"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Eye,
  FileCheck2,
  Hourglass,
  MapPin,
  Maximize2,
  ShieldCheck,
  Users,
  X,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  ADMIN_VENUE_DETAILS,
  FALLBACK_ADMIN_VENUE_DETAIL,
} from "../data/venue-details";
import type { VenueDetailStatus } from "../types/admin-venue-detail";

interface AdminVenueDetailPageProps {
  venueId: string;
}

const statusStyles: Record<
  VenueDetailStatus,
  { label: string; className: string }
> = {
  pending: {
    label: "Menunggu Verifikasi",
    className: "bg-amber-500 text-white",
  },
  verified: {
    label: "Terverifikasi",
    className: "bg-emerald-600 text-white",
  },
  rejected: {
    label: "Ditolak",
    className: "bg-rose-600 text-white",
  },
};

export default function AdminVenueDetailPage({
  venueId,
}: AdminVenueDetailPageProps) {
  const router = useRouter();

  const venue = ADMIN_VENUE_DETAILS[venueId] ?? {
    ...FALLBACK_ADMIN_VENUE_DETAIL,
    id: venueId,
  };

  const [status, setStatus] = useState<VenueDetailStatus>(venue.status);
  const [activeImage, setActiveImage] = useState(0);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [notice, setNotice] = useState("");

  const totalImages = venue.images.length;
  const statusStyle = statusStyles[status];

  const showPreviousImage = () => {
    if (totalImages <= 1) return;

    setActiveImage((currentImage) =>
      currentImage === 0 ? totalImages - 1 : currentImage - 1,
    );
  };

  const showNextImage = () => {
    if (totalImages <= 1) return;

    setActiveImage((currentImage) =>
      currentImage === totalImages - 1 ? 0 : currentImage + 1,
    );
  };

  const decide = (next: VenueDetailStatus) => {
    setStatus(next);

    setNotice(
      next === "verified"
        ? "Venue berhasil diverifikasi."
        : "Pengajuan venue berhasil ditolak.",
    );

    setRejectOpen(false);
    setReason("");

    window.setTimeout(() => {
      setNotice("");
    }, 2500);
  };

  useEffect(() => {
    if (!previewOpen && !rejectOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (rejectOpen) {
          setRejectOpen(false);
          return;
        }

        setPreviewOpen(false);
      }

      if (!previewOpen) return;

      if (event.key === "ArrowLeft") {
        showPreviousImage();
      }

      if (event.key === "ArrowRight") {
        showNextImage();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [previewOpen, rejectOpen, totalImages]);

  return (
    <main className="min-h-[calc(100vh-4rem)] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => router.push("/admin/tempat")}
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition-colors hover:text-violet-600"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali ke Verifikasi Tempat
          </button>

          {notice && (
            <span
              role="status"
              aria-live="polite"
              className="rounded-lg bg-emerald-50 px-4 py-2 text-xs font-semibold text-emerald-700"
            >
              {notice}
            </span>
          )}
        </header>

        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            {/* Foto utama */}
            <div className="border-b border-slate-200 bg-slate-100 p-3 sm:p-4 lg:p-5">
              <div className="group relative mx-auto h-52 w-full max-w-sm overflow-hidden rounded-xl bg-slate-900 sm:h-72 sm:max-w-2xl lg:h-80 lg:max-w-3xl">
                {totalImages > 0 ? (
                  <Image
                    src={venue.images[activeImage]}
                    alt={`${venue.name} - foto ${activeImage + 1}`}
                    fill
                    sizes="(max-width: 640px) 384px, (max-width: 1023px) 672px, 768px"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                  />
                ) : (
                  <div className="grid h-full w-full place-items-center text-sm font-medium text-white/70">
                    Foto venue belum tersedia
                  </div>
                )}

                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/5 to-black/35" />

                {/* Status dan ID venue */}
                <div className="absolute inset-x-3 top-3 flex items-center justify-between gap-2 sm:inset-x-4 sm:top-4">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[10px] font-semibold shadow-sm sm:px-3 sm:text-xs ${statusStyle.className}`}
                  >
                    {status === "pending" ? (
                      <Hourglass className="h-3.5 w-3.5 shrink-0" />
                    ) : status === "verified" ? (
                      <ShieldCheck className="h-3.5 w-3.5 shrink-0" />
                    ) : (
                      <XCircle className="h-3.5 w-3.5 shrink-0" />
                    )}

                    <span className="max-w-36 truncate sm:max-w-none">
                      {statusStyle.label}
                    </span>
                  </span>

                  <span className="shrink-0 rounded-lg bg-white/95 px-2.5 py-1.5 text-[10px] font-bold text-slate-800 shadow-sm sm:px-3 sm:text-xs">
                    ID: #{venue.submissionCode}
                  </span>
                </div>

                {/* Tombol preview */}
                {totalImages > 0 && (
                  <button
                    type="button"
                    onClick={() => setPreviewOpen(true)}
                    aria-label="Buka preview foto penuh"
                    className="absolute right-3 top-14 z-20 grid h-9 w-9 place-items-center rounded-full bg-black/45 text-white shadow-md backdrop-blur-sm transition hover:bg-black/70 focus:outline-none focus:ring-2 focus:ring-white sm:right-4 sm:top-16"
                  >
                    <Maximize2 className="h-4 w-4" />
                  </button>
                )}

                {/* Tombol foto sebelumnya */}
                {totalImages > 1 && (
                  <button
                    type="button"
                    onClick={showPreviousImage}
                    aria-label="Tampilkan foto sebelumnya"
                    className="absolute left-2 top-1/2 z-20 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-black/50 text-white shadow-lg backdrop-blur-sm transition hover:scale-105 hover:bg-black/75 focus:outline-none focus:ring-2 focus:ring-white sm:left-4 sm:h-10 sm:w-10"
                  >
                    <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
                  </button>
                )}

                {/* Tombol foto berikutnya */}
                {totalImages > 1 && (
                  <button
                    type="button"
                    onClick={showNextImage}
                    aria-label="Tampilkan foto berikutnya"
                    className="absolute right-2 top-1/2 z-20 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-black/50 text-white shadow-lg backdrop-blur-sm transition hover:scale-105 hover:bg-black/75 focus:outline-none focus:ring-2 focus:ring-white sm:right-4 sm:h-10 sm:w-10"
                  >
                    <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
                  </button>
                )}

                {/* Informasi venue */}
                <div className="absolute bottom-4 left-4 right-20 z-10 text-white sm:bottom-5 sm:left-5">
                  <h1 className="line-clamp-1 text-xl font-bold tracking-tight sm:text-2xl lg:text-3xl">
                    {venue.name}
                  </h1>

                  <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-200 sm:text-sm">
                    <MapPin className="h-4 w-4 shrink-0" />
                    <span className="line-clamp-1">{venue.location}</span>
                  </p>
                </div>

                {/* Nomor foto */}
                {totalImages > 0 && (
                  <span className="absolute bottom-4 right-4 z-10 rounded-full bg-black/60 px-2.5 py-1 text-[10px] font-semibold text-white backdrop-blur-sm sm:bottom-5 sm:text-xs">
                    {activeImage + 1} / {totalImages}
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-7 p-5 sm:p-7">
              {/* Informasi dasar venue */}
              <section>
                <h2 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">
                  Informasi Dasar Venue
                </h2>

                <div className="grid gap-3 sm:grid-cols-2">
                  <article className="rounded-xl border border-slate-100 bg-slate-50/60 p-4">
                    <span className="text-[11px] font-medium text-slate-400">
                      Pengelola
                    </span>

                    <strong className="mt-1 block text-sm text-slate-800">
                      {venue.managerName}
                    </strong>

                    <span className="text-xs font-semibold text-indigo-600">
                      {venue.communityName}
                    </span>
                  </article>

                  <article className="rounded-xl border border-slate-100 bg-slate-50/60 p-4">
                    <span className="text-[11px] font-medium text-slate-400">
                      Kategori & Kapasitas
                    </span>

                    <strong className="mt-1 block text-sm text-slate-800">
                      {venue.category}
                    </strong>

                    <span className="flex items-center gap-1 text-xs text-slate-500">
                      <Users className="h-3.5 w-3.5" />
                      Maks. {venue.capacity} orang
                    </span>
                  </article>
                </div>

                <article className="mt-3 space-y-3 rounded-xl border border-slate-100 bg-slate-50/60 p-4">
                  <div>
                    <h3 className="mb-1.5 text-xs font-semibold text-slate-400">
                      Deskripsi Ruangan
                    </h3>

                    <p className="text-sm leading-relaxed text-slate-600">
                      {venue.description}
                    </p>
                  </div>

                  <div className="flex items-start gap-2 border-t border-slate-200/70 pt-3 text-sm text-slate-600">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-indigo-400" />
                    <p>{venue.address}</p>
                  </div>
                </article>
              </section>

              {/* Navigasi galeri */}
              <section>
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div>
                    <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Galeri Foto
                    </h2>

                    <p className="mt-1 text-xs text-slate-500">
                      {totalImages > 0
                        ? `Foto ${activeImage + 1} dari ${totalImages}`
                        : "Belum ada foto"}
                    </p>
                  </div>

                  {totalImages > 0 && (
                    <button
                      type="button"
                      onClick={() => setPreviewOpen(true)}
                      className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-indigo-50 px-3 py-2 text-xs font-semibold text-indigo-600 transition hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      Preview Penuh
                    </button>
                  )}
                </div>

                {totalImages > 0 && (
                  <div className="flex items-center justify-between gap-4 rounded-xl border border-slate-100 bg-slate-50/60 p-3">
                    <button
                      type="button"
                      onClick={showPreviousImage}
                      disabled={totalImages <= 1}
                      aria-label="Foto sebelumnya"
                      className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>

                    <div className="flex min-w-0 items-center justify-center gap-2">
                      {venue.images.map((_, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => setActiveImage(index)}
                          aria-label={`Tampilkan foto ${index + 1}`}
                          aria-current={
                            activeImage === index ? "true" : undefined
                          }
                          className={`h-2.5 rounded-full transition-all duration-300 ${
                            activeImage === index
                              ? "w-8 bg-indigo-600"
                              : "w-2.5 bg-slate-300 hover:bg-slate-400"
                          }`}
                        />
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={showNextImage}
                      disabled={totalImages <= 1}
                      aria-label="Foto berikutnya"
                      className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </section>
            </div>
          </section>

          {/* Sidebar pemeriksaan */}
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

                      <div className="min-w-0">
                        <h3 className="text-xs font-bold text-slate-800">
                          {document.name}
                        </h3>

                        <p className="mt-0.5 text-[11px] leading-relaxed text-slate-500">
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
                onClick={() => setRejectOpen(true)}
                disabled={status !== "pending"}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-rose-300 px-3 py-3 text-xs font-bold text-rose-600 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <XCircle className="h-4 w-4" />
                Tolak
              </button>

              <button
                type="button"
                onClick={() => decide("verified")}
                disabled={status !== "pending"}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-3 py-3 text-xs font-bold text-white shadow-md shadow-indigo-500/20 transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <ShieldCheck className="h-4 w-4" />
                Verifikasi
              </button>

              {status !== "pending" && (
                <p className="col-span-2 text-center text-xs font-semibold text-slate-500">
                  Keputusan: {statusStyle.label}
                </p>
              )}
            </section>
          </aside>
        </div>
      </div>

      {/* Preview foto penuh */}
      {previewOpen && totalImages > 0 && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Preview foto ${venue.name}`}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90 p-3 sm:p-5 lg:p-6"
          onMouseDown={(event) => {
            if (event.currentTarget === event.target) {
              setPreviewOpen(false);
            }
          }}
        >
          <div className="mb-3 flex w-full max-w-6xl items-center justify-between gap-4 text-white">
            <div className="min-w-0">
              <h2 className="truncate text-sm font-bold sm:text-base">
                {venue.name}
              </h2>

              <p className="mt-0.5 text-xs text-white/60">
                Foto {activeImage + 1} dari {totalImages}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setPreviewOpen(false)}
              aria-label="Tutup preview"
              className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="relative h-[55vh] min-h-64 w-full max-w-6xl overflow-hidden rounded-2xl border border-white/15 bg-black shadow-2xl sm:h-[68vh] lg:h-[76vh]">
            <Image
              src={venue.images[activeImage]}
              alt={`${venue.name} - foto ${activeImage + 1}`}
              fill
              sizes="(max-width: 640px) 94vw, (max-width: 1024px) 92vw, 1152px"
              className="object-contain"
            />

            {totalImages > 1 && (
              <>
                <button
                  type="button"
                  onClick={showPreviousImage}
                  aria-label="Tampilkan foto sebelumnya"
                  className="absolute left-2 top-1/2 z-10 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-black/60 text-white shadow-xl backdrop-blur-sm transition hover:scale-105 hover:bg-black/85 focus:outline-none focus:ring-2 focus:ring-white sm:left-5 sm:h-12 sm:w-12"
                >
                  <ChevronLeft className="h-6 w-6 sm:h-7 sm:w-7" />
                </button>

                <button
                  type="button"
                  onClick={showNextImage}
                  aria-label="Tampilkan foto berikutnya"
                  className="absolute right-2 top-1/2 z-10 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-black/60 text-white shadow-xl backdrop-blur-sm transition hover:scale-105 hover:bg-black/85 focus:outline-none focus:ring-2 focus:ring-white sm:right-5 sm:h-12 sm:w-12"
                >
                  <ChevronRight className="h-6 w-6 sm:h-7 sm:w-7" />
                </button>
              </>
            )}

            <span className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/70 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-sm">
              {activeImage + 1} / {totalImages}
            </span>
          </div>

          <div className="mt-4 flex items-center justify-center gap-2">
            {venue.images.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setActiveImage(index)}
                aria-label={`Buka foto ${index + 1}`}
                aria-current={activeImage === index ? "true" : undefined}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  activeImage === index
                    ? "w-8 bg-white"
                    : "w-2.5 bg-white/35 hover:bg-white/60"
                }`}
              />
            ))}
          </div>

          <p className="mt-3 hidden text-center text-[11px] text-white/45 sm:block">
            Gunakan tombol panah atau tombol keyboard kiri dan kanan untuk
            mengganti foto.
          </p>
        </div>
      )}

      {/* Modal penolakan */}
      {rejectOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="reject-dialog-title"
          className="fixed inset-0 z-50 grid place-items-center bg-slate-950/50 p-4"
          onMouseDown={(event) => {
            if (event.currentTarget === event.target) {
              setRejectOpen(false);
            }
          }}
        >
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2
                  id="reject-dialog-title"
                  className="font-bold text-slate-900"
                >
                  Tolak Pengajuan Venue
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Alasan akan dikirim kepada pengelola.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setRejectOpen(false)}
                aria-label="Tutup formulir penolakan"
                className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <label className="mt-5 block text-xs font-semibold text-slate-700">
              Alasan Penolakan
              <textarea
                value={reason}
                onChange={(event) => setReason(event.target.value)}
                rows={4}
                placeholder="Jelaskan dokumen atau informasi yang perlu diperbaiki..."
                className="mt-2 w-full resize-none rounded-xl border border-slate-300 p-3 text-sm outline-none transition focus:border-rose-500 focus:ring-2 focus:ring-rose-500/15"
              />
            </label>

            <div className="mt-5 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setRejectOpen(false)}
                className="rounded-lg border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Batal
              </button>

              <button
                type="button"
                disabled={!reason.trim()}
                onClick={() => decide("rejected")}
                className="rounded-lg bg-rose-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Tolak Pengajuan
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
