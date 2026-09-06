import type { ReactNode } from "react";
import Footer from "@/app/components/Footer";
import PublicNavbar from "./components/PublicNavbar";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <PublicNavbar />
      {children}
      <Footer />
    </div>
  );
}
