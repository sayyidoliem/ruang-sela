import type { Metadata } from "next";
import { AdminDashboardPage } from "@/features/admin-dashboard";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description:
    "Dashboard operasional, transaksi, pengguna, dan venue RuangSela.",
};

export default function AdminDashboardRoute() {
  return <AdminDashboardPage />;
}
