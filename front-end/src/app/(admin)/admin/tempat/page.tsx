import type { Metadata } from "next";
import { AdminVenuesPage } from "@/features/admin-venues";

export const metadata: Metadata = {
  title: "Verifikasi Tempat",
  description:
    "Tinjau dan verifikasi pengajuan tempat pada platform RuangSela.",
};

export default function AdminVenuesRoute() {
  return <AdminVenuesPage />;
}
