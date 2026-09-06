import type { Metadata } from "next";
import { ManagerProfilePage } from "@/features/manager-account";

export const metadata: Metadata = {
  title: "Profil Pengelola",
  description: "Profil, performa, tempat, dan pencapaian pengelola RuangSela.",
};

export default function ManagerProfileRoute() {
  return <ManagerProfilePage />;
}
