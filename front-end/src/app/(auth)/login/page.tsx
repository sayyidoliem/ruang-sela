import type { Metadata } from "next";
import { AuthPage } from "@/features/auth";

export const metadata: Metadata = {
  title: "Masuk",
  description: "Masuk ke akun RuangSela.",
};

export default function LoginRoute() {
  return <AuthPage mode="login" />;
}
