import type { Metadata } from "next";
import { SettingsPage } from "@/features/settings";

export const metadata: Metadata = {
  title: "Settings",
  description:
    "Kelola akun, notifikasi, privasi, keamanan, dan aplikasi tertaut RuangSela.",
};

export default function SettingsRoute() {
  return <SettingsPage />;
}
