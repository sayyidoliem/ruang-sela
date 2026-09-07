import {
  CheckCircle2,
  CircleStop,
  FileText,
  Hourglass,
  PlayCircle,
  XCircle,
} from "lucide-react";
import type { BookingStatus } from "../../types/manager-booking";
export const BOOKING_FILTERS = [
  { id: "all", label: "Semua", icon: FileText },
  { id: "approved", label: "Disetujui", icon: CheckCircle2 },
  { id: "ongoing", label: "Berlangsung", icon: PlayCircle },
  { id: "pending", label: "Menunggu", icon: Hourglass },
  { id: "completed", label: "Selesai", icon: CheckCircle2 },
  { id: "rejected", label: "Ditolak", icon: XCircle },
  { id: "cancelled", label: "Dibatalkan", icon: CircleStop },
] as const;
export const BOOKING_STATUS: Record<
  BookingStatus,
  { label: string; border: string; badge: string }
> = {
  approved: {
    label: "Disetujui",
    border: "border-l-emerald-500",
    badge: "border-emerald-300 bg-emerald-50 text-emerald-600",
  },
  ongoing: {
    label: "Berlangsung",
    border: "border-l-blue-600",
    badge: "border-blue-300 bg-blue-50 text-blue-600",
  },
  pending: {
    label: "Menunggu",
    border: "border-l-amber-500",
    badge: "border-amber-300 bg-amber-50 text-amber-600",
  },
  completed: {
    label: "Selesai",
    border: "border-l-purple-500",
    badge: "border-purple-300 bg-purple-50 text-purple-600",
  },
  rejected: {
    label: "Ditolak",
    border: "border-l-rose-500",
    badge: "border-rose-300 bg-rose-50 text-rose-600",
  },
  cancelled: {
    label: "Dibatalkan",
    border: "border-l-slate-300",
    badge: "border-slate-300 bg-slate-50 text-slate-500",
  },
};
export const formatRupiah = (value: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
