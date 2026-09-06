import type { Metadata } from "next";
import { AdminVenueDetailPage } from "@/features/admin-venue-detail";

interface AdminVenueDetailRouteProps {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = {
  title: "Detail Verifikasi Venue",
  description:
    "Tinjau informasi, galeri, dan dokumen pengajuan venue RuangSela.",
};

export default async function AdminVenueDetailRoute({
  params,
}: AdminVenueDetailRouteProps) {
  const { id } = await params;
  return <AdminVenueDetailPage venueId={id} />;
}
