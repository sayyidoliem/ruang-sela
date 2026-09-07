import type { Metadata } from "next";
import { AuthPage } from "@/features/auth";

export const metadata: Metadata = {
  title: "Daftar",
  description: "Buat akun RuangSela.",
};

export default function SignupRoute() {
  return <AuthPage mode="signup" />;
}
