import type { Metadata } from "next";
import { ManagerBookingsPage } from "@/features/manager-bookings";

export const metadata: Metadata = {
  title: "Manajemen Booking",
  description:
    "Kelola pengajuan, status pembayaran, dan aktivitas booking tempat.",
};

export default function ManagerBookingsRoute() {
  return <ManagerBookingsPage />;
}
