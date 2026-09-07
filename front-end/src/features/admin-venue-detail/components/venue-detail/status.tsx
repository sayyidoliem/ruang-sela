import { Hourglass, ShieldCheck, XCircle } from "lucide-react";
import type { VenueDetailStatus } from "../../types/admin-venue-detail";
export const DETAIL_STATUS = {
  pending: {
    label: "Menunggu Verifikasi",
    className: "bg-amber-500 text-white",
    Icon: Hourglass,
  },
  verified: {
    label: "Terverifikasi",
    className: "bg-emerald-600 text-white",
    Icon: ShieldCheck,
  },
  rejected: {
    label: "Ditolak",
    className: "bg-rose-600 text-white",
    Icon: XCircle,
  },
} satisfies Record<
  VenueDetailStatus,
  { label: string; className: string; Icon: typeof Hourglass }
>;
