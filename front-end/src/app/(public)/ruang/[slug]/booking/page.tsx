import { notFound } from "next/navigation";
import { BookingFormPage, getBookingVenueBySlug } from "@/features/bookings";

export default async function BookingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const venue = getBookingVenueBySlug(slug);
  if (!venue) notFound();
  return <BookingFormPage venue={venue} />;
}
