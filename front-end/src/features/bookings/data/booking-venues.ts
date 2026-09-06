import type { BookingVenue } from "../types/booking";

export const BOOKING_VENUES: BookingVenue[] = [
  {
    id: "space-1",
    slug: "aula-warga-kebayoran",
    name: "Aula Warga Kebayoran",
    location: "Kebayoran Baru, Jakarta Selatan",
    imageSrc:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBbcKlXtjgyRN4BFdo_xUsv-QXvJB_zw97DmxLMMMNugsP1CdDALbwEb5tnPuG1p7AwIyY7Dn0NgDdxHWGBMHV4_avrDu6YqSqtY3SdkieDTtuGBOvtoi3r-7kTeiPnyd2EXNxQXOVhPluQCX9bvog40JCpYqbnPVBL2PxvshZBKoNK4IQuVMowvcI8L6k5u1WcCz9TQ1haXs0lzngDw4sVcJo31uWnqdaDF9ViuB0dcW4EwHQ5DIoN4VEb0JgqeFBoKg",
    hourlyPrice: 50000,
    serviceFee: 15000,
    availableTimes: ["08:00", "10:00", "13:00", "15:00"],
  },
];

export function getBookingVenueBySlug(slug: string) {
  return BOOKING_VENUES.find((venue) => venue.slug === slug);
}
