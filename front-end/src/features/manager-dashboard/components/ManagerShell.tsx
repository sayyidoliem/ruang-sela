"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { Route } from "next";
import {
  Bell,
  Building2,
  FileText,
  LayoutGrid,
  Menu,
  Settings,
  UserRound,
  X,
} from "lucide-react";
import { useState, type ReactNode } from "react";

const NAVIGATION = [
  { label: "Dashboard", href: "/pengelola/dashboard", icon: LayoutGrid },
  { label: "Kelola Tempat", href: "/pengelola/tempat", icon: Building2 },
  { label: "Pengajuan", href: "/pengelola/pengajuan", icon: FileText },
  { label: "Profil", href: "/pengelola/profil", icon: UserRound },
];

const AVATAR =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCtxMujcl2597dS_l_nMbenfmfKY1gkqq7WxsPA3Vec-vxRSKpLbicPm3bEtl8ySoglGy8bF-hFG53WGKEAV-vG1gjKYXRQ3QNNc7nO4HHqqw___biYEl-GCdtktIWLYNY_5Cjh2q8jOxHIsh3efusQakxSjqoxyzHZ7C6j22w2KqSy1b6H_XBFhH6cATaWC5DJIgxInkgTZWgdkQHM3dtCWIfJ880NGJ_s2dsgP6y-gfSyBUUQqKI";

export default function ManagerShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const sidebar = (
    <>
      <div>
        <div className="px-7 py-6">
          <Link
            href="/pengelola/dashboard"
            className="text-xl font-black tracking-tight text-[#704fe6]"
          >
            Ruang<span className="text-[#7c3aed]">Sela</span>
          </Link>
          <p className="-mt-0.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Space Management
          </p>
        </div>
        <nav className="mt-2 space-y-1.5 px-4" aria-label="Navigasi pengelola">
          {NAVIGATION.map((item) => {
            const Icon = item.icon;
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3.5 rounded-xl px-4 py-3 text-sm transition-all ${active ? "bg-[#7c3aed] font-semibold text-white shadow-md shadow-purple-500/20" : "font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-900"}`}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="m-2 border-t border-slate-100 p-4">
        <Link href="/pengelola/profil" className="flex items-center gap-3">
          <div className="relative h-10 w-10 overflow-hidden rounded-full ring-2 ring-purple-100">
            <Image
              src={AVATAR}
              alt="Budi Santoso"
              fill
              sizes="40px"
              className="object-cover"
            />
          </div>
          <div className="min-w-0">
            <h2 className="truncate text-sm font-bold text-slate-800">
              Budi Santoso
            </h2>
            <p className="truncate text-xs text-slate-400">Pengelola Tempat</p>
          </div>
        </Link>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-[#F8F9FD] text-slate-800">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col justify-between border-r border-slate-100 bg-white lg:flex">
        {sidebar}
      </aside>
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            aria-label="Tutup menu"
            className="absolute inset-0 bg-slate-950/40"
            onClick={() => setOpen(false)}
          />
          <aside className="relative flex h-full w-72 flex-col justify-between bg-white shadow-xl">
            {sidebar}
          </aside>
        </div>
      )}
      <div className="min-w-0 lg:ml-64">
        <header className="sticky top-0 z-20 flex h-20 items-center justify-between border-b border-slate-100/80 bg-[#F8F9FD]/90 px-4 backdrop-blur sm:px-8">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="grid h-10 w-10 place-items-center rounded-xl bg-white text-slate-600 shadow-sm lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="ml-auto flex items-center gap-3">
            <button
              type="button"
              onClick={() => router.push("/pengelola/notifikasi" as Route)}
              aria-label="Notifikasi"
              className="relative grid h-10 w-10 place-items-center rounded-xl border border-slate-100 bg-white text-blue-500 shadow-sm"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-blue-500" />
            </button>
            <button
              type="button"
              onClick={() => router.push("/pengelola/settings")}
              aria-label="Pengaturan"
              className="grid h-10 w-10 place-items-center rounded-xl border border-slate-100 bg-white text-slate-600 shadow-sm"
            >
              <Settings className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => router.push("/pengelola/profil")}
              className="relative ml-1 h-9 w-9 overflow-hidden rounded-full ring-2 ring-purple-200"
            >
              <Image
                src={AVATAR}
                alt="Profil pengelola"
                fill
                sizes="36px"
                className="object-cover"
              />
            </button>
          </div>
        </header>
        {children}
      </div>
    </div>
  );
}
