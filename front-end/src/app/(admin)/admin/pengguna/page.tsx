import type { Metadata } from "next";
import { AdminUsersPage } from "@/features/admin-users";

export const metadata: Metadata = {
  title: "Kelola Pengguna",
  description: "Kelola, verifikasi, dan tinjau status pengguna RuangSela.",
};

export default function AdminUsersRoute() {
  return <AdminUsersPage />;
}
