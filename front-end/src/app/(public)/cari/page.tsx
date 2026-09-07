import type { Metadata } from "next";
import { SpaceSearchContent, listSpaces } from "@/features/spaces";

export const metadata: Metadata = {
  title: "Cari Tempat",
  description:
    "Cari ruang publik dan fasilitas terverifikasi untuk kegiatan komunitas, kolaborasi, dan inovasi warga.",
};

export const dynamic = "force-dynamic";

export default async function SearchPlacePage() {
  const { spaces, total } = await listSpaces();
  return <SpaceSearchContent spaces={spaces} totalCount={total} />;
}
