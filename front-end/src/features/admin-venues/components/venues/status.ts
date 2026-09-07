import type { VenueVerificationStatus } from "../../types/admin-venue";

export const VENUE_STATUS: Record<
  VenueVerificationStatus,
  { label: string; className: string }
> = {
  pending: {
    label: "Menunggu Verifikasi",
    className: "border-amber-200 bg-amber-50 text-amber-600",
  },
  verified: {
    label: "Terverifikasi",
    className: "border-emerald-200 bg-emerald-50 text-emerald-700",
  },
  rejected: {
    label: "Ditolak",
    className: "border-rose-200 bg-rose-50 text-rose-600",
  },
};
