import type { Metadata } from "next";
import { ManagerDashboardPage } from "@/features/manager-dashboard";

export const metadata: Metadata = {
  title: "Dashboard Pengelola",
  description: "Ringkasan performa, booking, pendapatan, dan okupansi tempat.",
};

export default function ManagerDashboardRoute() {
  return <ManagerDashboardPage />;
}
