import type { Metadata } from "next";
import { UserSubmissionsPage } from "@/features/user-submissions";

export const metadata: Metadata = {
  title: "Pengajuan Saya",
  description:
    "Pantau status persetujuan, jadwal, dan riwayat penggunaan ruang.",
};

export default function UserSubmissionsRoute() {
  return <UserSubmissionsPage />;
}
