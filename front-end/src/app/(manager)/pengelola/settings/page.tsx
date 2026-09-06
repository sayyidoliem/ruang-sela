import type { Metadata } from "next";
import { ManagerSettingsPage } from "@/features/manager-account";

export const metadata: Metadata = {
  title: "Settings Pengelola",
  description:
    "Kelola akun, notifikasi, privasi, keamanan, dan aplikasi tertaut pengelola RuangSela.",
};

export default function ManagerSettingsRoute() {
  return <ManagerSettingsPage />;
}
