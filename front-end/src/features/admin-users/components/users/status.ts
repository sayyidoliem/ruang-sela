import type { AdminUserStatus } from "../../types/admin-user";
export const USER_STATUS: Record<
  AdminUserStatus,
  { label: string; className: string }
> = {
  active: { label: "Aktif", className: "bg-emerald-50 text-emerald-600" },
  pending: { label: "Tertunda", className: "bg-amber-50 text-amber-600" },
  suspended: { label: "Ditangguhkan", className: "bg-red-50 text-red-500" },
};
