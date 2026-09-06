import type { Metadata } from "next";
import { HelpPage } from "@/features/help";

export const metadata: Metadata = {
  title: "Bantuan & Kebijakan",
  description:
    "Temukan panduan booking, pembayaran, kebijakan komunitas, dan dukungan RuangSela.",
};

export default function HelpRoute() {
  return <HelpPage />;
}
