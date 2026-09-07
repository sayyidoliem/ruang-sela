import type { SubmissionStatus } from "../../types/user-submission";
export const SUBMISSION_FILTERS = [
  { id: "all", label: "Semua" },
  { id: "pending", label: "Menunggu" },
  { id: "approved", label: "Disetujui" },
  { id: "ongoing", label: "Berlangsung" },
  { id: "completed", label: "Selesai" },
  { id: "rejected", label: "Ditolak" },
] as const;
export const SUBMISSION_STATUS: Record<
  SubmissionStatus,
  { label: string; badge: string; dot: string }
> = {
  pending: {
    label: "Menunggu",
    badge: "border-amber-200 bg-amber-50 text-amber-700",
    dot: "bg-amber-500",
  },
  approved: {
    label: "Disetujui",
    badge: "border-emerald-200 bg-emerald-50 text-emerald-700",
    dot: "bg-emerald-500",
  },
  ongoing: {
    label: "Berlangsung",
    badge: "border-blue-200 bg-blue-50 text-blue-700",
    dot: "bg-blue-500",
  },
  completed: {
    label: "Selesai",
    badge: "border-slate-200 bg-slate-100 text-slate-700",
    dot: "bg-slate-400",
  },
  rejected: {
    label: "Ditolak",
    badge: "border-rose-200 bg-rose-50 text-rose-700",
    dot: "bg-rose-500",
  },
  cancelled: {
    label: "Dibatalkan",
    badge: "border-slate-200 bg-slate-50 text-slate-500",
    dot: "bg-slate-400",
  },
};
export const rupiah = (value: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
