import Link from "next/link";
import { BadgeCheck, ChevronRight, MapPin, Star } from "lucide-react";
import type { PlaceDetail } from "../../types/place-detail";
import BookingCard from "./BookingCard";
import LocationMap from "./LocationMap";
import PlaceGallery from "./sections/PlaceGallery";
import PlaceInfo from "./sections/PlaceInfo";
import ReviewsGrid from "./sections/ReviewsGrid";
export default function PlaceDetailPage({ place }: { place: PlaceDetail }) {
  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <nav className="mb-3 flex gap-2 text-xs">
        <Link href="/cari">Cari Tempat</Link>
        <ChevronRight className="h-3 w-3" />
        <span>{place.title}</span>
      </nav>
      <header className="mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-extrabold">{place.title}</h1>
          {place.verified && (
            <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs text-emerald-600">
              <BadgeCheck className="h-3.5 w-3.5" />
              Terverifikasi
            </span>
          )}
        </div>
        <p className="mt-2 flex items-center gap-2 text-sm text-slate-500">
          <MapPin className="h-4 w-4" />
          {place.location}
          {place.rating && (
            <>
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              {place.rating.toFixed(1)}
            </>
          )}
        </p>
      </header>
      <div className="grid items-start gap-8 lg:grid-cols-12">
        <div className="space-y-10 lg:col-span-8">
          <PlaceGallery images={place.images} />
          <PlaceInfo place={place} />
          {place.lat != null && place.lng != null && (
            <section>
              <h2 className="mb-4 text-lg font-bold">Lokasi</h2>
              <LocationMap
                lat={place.lat}
                lng={place.lng}
                title={place.title}
                address={place.address}
              />
            </section>
          )}
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
      <ReviewsGrid items={place.reviews} />
    </main>
  );
}
