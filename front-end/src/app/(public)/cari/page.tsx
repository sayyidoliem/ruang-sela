import type { Metadata } from "next";
import { SpaceSearchContent, SPACES } from "@/features/spaces";

export const metadata: Metadata = {
  title: "Cari Tempat",
  description:
    "Cari ruang publik dan fasilitas terverifikasi untuk kegiatan komunitas, kolaborasi, dan inovasi warga.",
};

export default function SearchPlacePage() {
  return <SpaceSearchContent spaces={SPACES} totalCount={24} />;
}
