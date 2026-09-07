import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  MapPin,
  Maximize2,
} from "lucide-react";
import type {
  AdminVenueDetail,
  VenueDetailStatus,
} from "../../types/admin-venue-detail";
import { DETAIL_STATUS } from "./status";
interface Props {
  venue: AdminVenueDetail;
  status: VenueDetailStatus;
  activeImage: number;
  onSelect: (index: number) => void;
  onPrevious: () => void;
  onNext: () => void;
  onPreview: () => void;
}
export default function VenueGallery({
  venue,
  status,
  activeImage,
  onSelect,
  onPrevious,
  onNext,
  onPreview,
}: Props) {
  const total = venue.images.length;
  const current = DETAIL_STATUS[status];
  const Icon = current.Icon;
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 bg-slate-100 p-3 sm:p-4 lg:p-5">
        <div className="group relative mx-auto h-52 w-full max-w-sm overflow-hidden rounded-xl bg-slate-900 sm:h-72 sm:max-w-2xl lg:h-80 lg:max-w-3xl">
          {total ? (
            <Image
              src={venue.images[activeImage]}
              alt={`${venue.name} - foto ${activeImage + 1}`}
              fill
              sizes="(max-width: 640px) 384px, (max-width: 1023px) 672px, 768px"
              className="object-cover"
            />
          ) : (
            <div className="grid h-full place-items-center text-white/70">
              Foto venue belum tersedia
            </div>
          )}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/5 to-black/35" />
          <div className="absolute inset-x-3 top-3 flex justify-between">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${current.className}`}
            >
              <Icon className="h-3.5 w-3.5" />
              {current.label}
            </span>
            <span className="rounded-lg bg-white/95 px-3 py-1.5 text-xs font-bold">
              ID: #{venue.submissionCode}
            </span>
          </div>
          {total > 0 && (
            <button
              type="button"
              onClick={onPreview}
              aria-label="Buka preview foto penuh"
              className="absolute right-4 top-16 grid h-9 w-9 place-items-center rounded-full bg-black/45 text-white"
            >
              <Maximize2 className="h-4 w-4" />
            </button>
          )}
          {total > 1 && (
            <>
              <button
                type="button"
                onClick={onPrevious}
                aria-label="Foto sebelumnya"
                className="absolute left-4 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-black/50 text-white"
              >
                <ChevronLeft />
              </button>
              <button
                type="button"
                onClick={onNext}
                aria-label="Foto berikutnya"
                className="absolute right-4 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-black/50 text-white"
              >
                <ChevronRight />
              </button>
            </>
          )}
          <div className="absolute bottom-5 left-5 right-20 text-white">
            <h1 className="line-clamp-1 text-2xl font-bold">{venue.name}</h1>
            <p className="mt-1 flex items-center gap-1.5 text-sm">
              <MapPin className="h-4 w-4" />
              {venue.location}
            </p>
          </div>
          {total > 0 && (
            <span className="absolute bottom-5 right-4 rounded-full bg-black/60 px-2.5 py-1 text-xs text-white">
              {activeImage + 1} / {total}
            </span>
          )}
        </div>
      </div>
      <div className="space-y-7 p-5 sm:p-7">
        <section>
          <h2 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">
            Informasi Dasar Venue
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <article className="rounded-xl border border-slate-100 bg-slate-50/60 p-4">
              <span className="text-[11px] text-slate-400">Pengelola</span>
              <strong className="mt-1 block text-sm">
                {venue.managerName}
              </strong>
              <span className="text-xs font-semibold text-indigo-600">
                {venue.communityName}
              </span>
            </article>
            <article className="rounded-xl border border-slate-100 bg-slate-50/60 p-4">
              <span className="text-[11px] text-slate-400">
                Kategori & Kapasitas
              </span>
              <strong className="mt-1 block text-sm">{venue.category}</strong>
              <span className="text-xs text-slate-500">
                Maks. {venue.capacity} orang
              </span>
            </article>
          </div>
          <article className="mt-3 rounded-xl border border-slate-100 bg-slate-50/60 p-4">
            <p className="text-sm leading-relaxed text-slate-600">
              {venue.description}
            </p>
            <p className="mt-3 border-t pt-3 text-sm text-slate-600">
              {venue.address}
            </p>
          </article>
        </section>
        {total > 0 && (
          <section>
            <div className="mb-4 flex justify-between">
              <div>
                <h2 className="text-xs font-bold uppercase text-slate-400">
                  Galeri Foto
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  Foto {activeImage + 1} dari {total}
                </p>
              </div>
              <button
                type="button"
                onClick={onPreview}
                className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-50 px-3 py-2 text-xs font-semibold text-indigo-600"
              >
                <Eye className="h-3.5 w-3.5" />
                Preview Penuh
              </button>
            </div>
            <div className="flex items-center justify-between rounded-xl border bg-slate-50/60 p-3">
              <button
                onClick={onPrevious}
                disabled={total <= 1}
                className="grid h-9 w-9 place-items-center rounded-lg border bg-white disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <div className="flex gap-2">
                {venue.images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => onSelect(index)}
                    aria-label={`Foto ${index + 1}`}
                    className={`h-2.5 rounded-full ${activeImage === index ? "w-8 bg-indigo-600" : "w-2.5 bg-slate-300"}`}
                  />
                ))}
              </div>
              <button
                onClick={onNext}
                disabled={total <= 1}
                className="grid h-9 w-9 place-items-center rounded-lg border bg-white disabled:opacity-40"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </section>
        )}
      </div>
    </section>
  );
}
