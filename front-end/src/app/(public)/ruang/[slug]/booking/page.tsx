import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BookingFormPage, getBookingVenueBySlug } from "@/features/bookings";

interface BookingRouteProps {
  params: Promise<{ slug: string }>;
}

export const metadata: Metadata = {
  title: "Formulir Pengajuan Booking",
  description: "Lengkapi jadwal dan detail pengajuan penggunaan ruang publik.",
};

export default async function BookingRoute({ params }: BookingRouteProps) {
  const { slug } = await params;
  const venue = getBookingVenueBySlug(slug);

  if (!venue) notFound();

  return <BookingFormPage venue={venue} />;
}
