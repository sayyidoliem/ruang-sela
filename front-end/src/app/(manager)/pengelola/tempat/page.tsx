import type { Metadata } from "next";
import { ManagePlacePage } from "@/features/manager-places";

export const metadata: Metadata = {
  title: "Kelola Tempat",
  description:
    "Kelola informasi, media, harga, fasilitas, dan ketersediaan tempat.",
};

export default function ManagePlaceRoute() {
  return <ManagePlacePage />;
}
