import Image from "next/image";
import Link from "next/link";
import {
  BadgeCheck,
  ChevronRight,
  ExternalLink,
  MapPin,
  Phone,
  Star,
} from "lucide-react";
import type { PlaceDetail } from "../../types/place-detail";
import BookingCard from "./BookingCard";
import LocationMap from "./LocationMap";

interface PlaceDetailPageProps {
  place: PlaceDetail;
}

const PLACEHOLDER_IMG = "https://placehold.co/640x480?text=RuangSela";

export default function PlaceDetailPage({ place }: PlaceDetailPageProps) {
  const hasImages = place.images.length > 0;
  const hasHours = place.operatingHours.length > 0;
  const hasFacilities = place.facilities.length > 0;
  const hasReviews = place.reviews.length > 0;

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
          <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-slate-500">
            {place.location && (
              <span className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-slate-400" />
                {place.location}
              </span>
            )}
            {place.category && (
              <span className="rounded-full bg-violet-50 px-3 py-0.5 text-xs font-semibold text-violet-600">
                {place.category}
              </span>
            )}
            {place.rating != null && place.rating > 0 && (
              <span className="flex items-center gap-1 text-amber-500">
                <Star className="h-4 w-4 fill-current" />
                <span className="font-bold text-slate-700">
                  {place.rating.toFixed(1)}
                </span>
                {place.reviewCount != null && (
                  <span className="text-slate-400">
                    ({place.reviewCount} ulasan)
                  </span>
                )}
              </span>
            )}
            {place.statusOpen && (
              <span className="text-xs font-medium text-emerald-600">
                {place.statusOpen}
              </span>
            )}
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
        <div className="space-y-10 lg:col-span-8">
          {hasImages && (
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
              {place.images.length > 1 && (
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
              )}
            </div>
          )}

          {!hasImages && (
            <div className="flex items-center justify-center overflow-hidden rounded-2xl bg-slate-100 py-24">
              <img
                src={PLACEHOLDER_IMG}
                alt="Foto tidak tersedia"
                className="object-cover opacity-50"
              />
            </div>
          )}

          {place.description.length > 0 && (
            <section>
              <h2 className="mb-3 text-lg font-bold text-slate-900">
                Deskripsi
              </h2>
              <div className="space-y-3 text-sm leading-relaxed text-slate-600">
                {place.description.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </section>
          )}

          {(hasHours || hasFacilities) && (
            <div className="grid grid-cols-1 gap-8 border-t border-slate-100 pt-8 md:grid-cols-2">
              {hasHours && (
                <section>
                  <h2 className="mb-3 font-bold text-slate-900">
                    Jam Operasional
                  </h2>
                  <div className="space-y-1 text-sm font-medium text-slate-600">
                    {place.operatingHours.map((item) => (
                      <p key={item.day}>
                        <strong className="inline-block w-24 text-slate-800">
                          {item.day}
                        </strong>{" "}
                        {item.hours}
                      </p>
                    ))}
                  </div>
                </section>
              )}
              {hasFacilities && (
                <section>
                  <h2 className="mb-3 font-bold text-slate-900">Fasilitas</h2>
                  <div className="flex flex-wrap gap-2">
                    {place.facilities.map((facility) => (
                      <span
                        key={facility}
                        className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700"
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-violet-400" />
                        {facility}
                      </span>
                    ))}
                  </div>
                </section>
              )}
            </div>
          )}

          <section className="border-t border-slate-100 pt-8">
            <h2 className="mb-4 text-lg font-bold text-slate-900">Lokasi</h2>
            <div className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm">
              {place.lat != null && place.lng != null ? (
                <div className="p-3">
                  <LocationMap
                    lat={place.lat}
                    lng={place.lng}
                    title={place.title}
                    address={place.address || place.location}
                  />
                </div>
              ) : (
                <div className="flex h-64 items-center justify-center bg-slate-50 text-sm text-slate-400">
                  Peta lokasi tidak tersedia
                </div>
              )}
              <div className="space-y-2 px-6 py-4 text-xs font-medium text-slate-600">
                {place.address && <p>{place.address}</p>}
                {place.phone && (
                  <p className="flex items-center gap-1.5">
                    <Phone className="h-3.5 w-3.5 text-slate-400" />
                    {place.phone}
                  </p>
                )}
                {place.website && (
                  <Link
                    href={place.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 font-bold text-[#7c3aed] hover:underline"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    Website
                  </Link>
                )}
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
            priceText={place.priceText}
          />
        </div>
      </div>

      {hasReviews && (
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
                    {Array.from(
                      { length: Math.max(1, Math.min(5, review.rating)) },
                      (_, index) => (
                        <Star key={index} className="h-4 w-4 fill-current" />
                      ),
                    )}
                  </div>
                  <p className="mb-6 text-xs font-medium leading-relaxed text-slate-600">
                    &ldquo;{review.comment}&rdquo;
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
      )}
    </main>
  );
}
