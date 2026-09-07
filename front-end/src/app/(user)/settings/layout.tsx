import type { ReactNode } from "react";
import Footer from "@/app/components/Footer";

export default function SettingsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-[#f8f9fc]">
      {children}
      <Footer />
    </div>
  );
}
