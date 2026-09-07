"use client";
import type { ReactNode } from "react";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Bell, Menu, Settings } from "lucide-react";
import ManagerSidebar from "./shell/ManagerSidebar";
export default function ManagerShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  return (
    <div className="min-h-screen bg-[#F8F9FD]">
      <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col justify-between border-r bg-white lg:flex">
        <ManagerSidebar pathname={pathname} onNavigate={() => setOpen(false)} />
      </aside>
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            aria-label="Tutup menu"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-slate-950/40"
          />
          <aside className="relative flex h-full w-72 flex-col justify-between bg-white">
            <ManagerSidebar
              pathname={pathname}
              onNavigate={() => setOpen(false)}
            />
          </aside>
        </div>
      )}
      <div className="lg:ml-64">
        <header className="sticky top-0 z-20 flex h-20 items-center justify-between border-b bg-[#F8F9FD]/90 px-4 sm:px-8">
          <button
            onClick={() => setOpen(true)}
            className="grid h-10 w-10 place-items-center rounded-xl bg-white lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="ml-auto flex gap-3">
            <button
              onClick={() => router.push("/pengelola/notifikasi")}
              className="grid h-10 w-10 place-items-center rounded-xl bg-white"
            >
              <Bell className="h-5 w-5" />
            </button>
            <button
              onClick={() => router.push("/pengelola/settings")}
              className="grid h-10 w-10 place-items-center rounded-xl bg-white"
            >
              <Settings className="h-5 w-5" />
            </button>
          </div>
        </header>
        {children}
      </div>
    </div>
  );
}
