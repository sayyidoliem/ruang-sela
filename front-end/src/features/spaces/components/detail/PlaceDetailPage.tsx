import Image from "next/image";
import Link from "next/link";
import {
  BadgeCheck,
  ChevronRight,
  CircleHelp,
  MapPin,
  Minus,
  Plus,
  Star,
} from "lucide-react";
import type { PlaceDetail } from "../../types/place-detail";
import AvailabilityCalendar from "./AvailabilityCalendar";
import BookingCard from "./BookingCard";

interface PlaceDetailPageProps {
  place: PlaceDetail;
}

export default function PlaceDetailPage({ place }: PlaceDetailPageProps) {
  return (
    <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
      <nav
        aria-label="Breadcrumb"
        className="mb-3 flex items-center gap-2 text-xs font-medium text-slate-500"
      >
        <Link href="/cari" className="transition-colors hover:text-[#7c3aed]">
          Cari Tempat
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span className="font-semibold text-slate-900">{place.title}</span>
      </nav>

      <header className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
              {place.title}
            </h1>
            {place.verified && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600">
                <BadgeCheck className="h-3.5 w-3.5" />
                Terverifikasi
              </span>
            )}
          </div>
          <p className="mt-1 flex items-center gap-1.5 text-sm font-medium text-slate-500">
            <MapPin className="h-4 w-4 text-slate-400" />
            {place.location}
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
        <div className="space-y-10 lg:col-span-8">
          <div className="grid grid-cols-1 gap-3 overflow-hidden rounded-2xl shadow-sm md:grid-cols-3">
            <div className="group relative aspect-[4/3] overflow-hidden bg-slate-100 md:col-span-2">
              <Image
                src={place.images[0].src}
                alt={place.images[0].alt}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 66vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-1">
              {place.images.slice(1, 3).map((image) => (
                <div
                  key={image.src}
                  className="group relative aspect-[4/3] overflow-hidden rounded-lg bg-slate-100 md:h-[188px] md:rounded-none"
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    sizes="(max-width: 768px) 50vw, 22vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              ))}
            </div>
          </div>

          <section>
            <h2 className="mb-3 text-lg font-bold text-slate-900">Deskripsi</h2>
            <div className="space-y-3 text-sm leading-relaxed text-slate-600">
              {place.description.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </section>

          <div className="grid grid-cols-1 gap-8 border-t border-slate-100 pt-8 md:grid-cols-2">
            <section>
              <h2 className="mb-3 font-bold text-slate-900">Jam Operasional</h2>
              <div className="space-y-1 text-sm font-medium text-slate-600">
                {place.operatingHours.map((item) => (
                  <p key={item.day}>
                    <strong className="inline-block w-20 text-slate-800">
                      {item.day}:
                    </strong>{" "}
                    {item.hours}
                  </p>
                ))}
              </div>
            </section>
            <section>
              <h2 className="mb-3 font-bold text-slate-900">Fasilitas</h2>
              <div className="grid grid-cols-2 gap-2 text-sm font-medium text-slate-600 sm:grid-cols-3">
                {place.facilities.map((facility) => (
                  <span key={facility}>• {facility}</span>
                ))}
              </div>
            </section>
          </div>

          <AvailabilityCalendar
            initialSelectedDate={place.selectedDate}
            bookedDates={place.bookedDates}
          />

          <section className="border-t border-slate-100 pt-8">
            <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <h2 className="font-bold text-slate-900">Jam Ramai</h2>
                  <select
                    aria-label="Pilih hari"
                    className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-700"
                  >
                    <option>Senin</option>
                    <option>Selasa</option>
                    <option>Rabu</option>
                  </select>
                </div>
                <CircleHelp className="h-4 w-4 text-slate-400" />
              </div>
              <div className="mb-6 flex items-center gap-2">
                <span className="rounded bg-rose-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
                  AKTIF
                </span>
                <span className="text-xs font-medium text-slate-600">
                  Tidak seramai biasanya
                </span>
              </div>
              <div className="mx-2 flex h-28 items-end justify-between gap-1 border-b border-slate-100 pb-1">
                {place.crowdLevels.map((level, index) => (
                  <div
                    key={`${level}-${index}`}
                    className={`w-full rounded-t ${index === 11 ? "bg-[#8b5cf6]" : "bg-indigo-300"}`}
                    style={{ height: `${level}%` }}
                  />
                ))}
              </div>
              <div className="mx-2 mt-2 flex justify-between text-[11px] font-semibold text-slate-500">
                <span>06</span>
                <span>09</span>
                <span>12</span>
                <span>15</span>
                <span>18</span>
                <span>21</span>
              </div>
            </div>
          </section>

          <section className="border-t border-slate-100 pt-8">
            <h2 className="mb-4 text-lg font-bold text-slate-900">Lokasi</h2>
            <div className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm">
              <div className="relative grid h-64 place-items-center overflow-hidden bg-slate-100 [background-image:radial-gradient(#cbd5e1_1px,transparent_1px),linear-gradient(35deg,transparent_45%,#fff_46%,#fff_50%,transparent_51%)] [background-size:24px_24px,160px_120px]">
                <div className="z-10 flex items-center gap-2.5 rounded-xl border border-slate-100 bg-white px-4 py-2.5 shadow-lg">
                  <span className="grid h-7 w-7 place-items-center rounded-full bg-violet-50 text-[#7c3aed]">
                    <MapPin className="h-4 w-4 fill-current" />
                  </span>
                  <div>
                    <h3 className="text-xs font-bold text-slate-900">
                      {place.title}
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      {place.address}
                    </p>
                  </div>
                </div>
                <div className="absolute bottom-4 right-4 flex flex-col gap-1">
                  <button
                    type="button"
                    aria-label="Perbesar peta"
                    className="grid h-7 w-7 place-items-center rounded bg-white text-slate-700 shadow"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    aria-label="Perkecil peta"
                    className="grid h-7 w-7 place-items-center rounded bg-white text-slate-700 shadow"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between px-6 py-4 text-xs font-medium">
                <span className="text-slate-600">
                  Lihat rute dan detail lokasi lengkap
                </span>
                <Link
                  href={`/ruang/${place.slug}/lokasi`}
                  className="font-bold text-[#7c3aed] hover:underline"
                >
                  Lihat Selengkapnya →
                </Link>
              </div>
            </div>
          </section>
        </div>

        <div className="lg:col-span-4">
          <BookingCard
            slug={place.slug}
            price={place.price}
            priceUnit={place.priceUnit}
            durationHours={place.durationHours}
            capacity={place.capacity}
            minimumBooking={place.minimumBooking}
          />
        </div>
      </div>

      <section className="mt-14 border-t border-slate-100 pt-8">
        <h2 className="mb-6 text-lg font-bold text-slate-900">Ulasan</h2>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {place.reviews.map((review) => (
            <article
              key={review.id}
              className="flex flex-col justify-between rounded-2xl border border-slate-100 bg-white p-6 shadow-sm"
            >
              <div>
                <div className="mb-3 flex gap-1 text-sm text-amber-400">
                  {Array.from({ length: review.rating }, (_, index) => (
                    <Star key={index} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <p className="mb-6 text-xs font-medium leading-relaxed text-slate-600">
                  “{review.comment}”
                </p>
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-900">
                  {review.author}
                </h3>
                <p className="text-[11px] text-slate-400">{review.role}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
