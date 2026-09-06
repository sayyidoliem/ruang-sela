"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Bell,
  Building2,
  LayoutGrid,
  Menu,
  Search,
  Settings,
  UsersRound,
} from "lucide-react";
import { useState, type ReactNode } from "react";

const NAV = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutGrid },
  { label: "Kelola Tempat", href: "/admin/tempat", icon: Building2 },
  { label: "Kelola Pengguna", href: "/admin/pengguna", icon: UsersRound },
];
const AVATAR =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDAPxswsPWv_eveF9XAEu7CUYDdDhw8RtpzB2atoDioAEallXd3WGdyzo8om1pnHE1l69nO3CcYARY16ayx-IBPkRCBuLzAYGA4xc7R1W7cByjWONM4BKPjkQch7_bPa64FHjQose6zl4k7Bm7M4Xct6tBPJNp8sm4MpPgIyDINoQDPmdOBso5vmwJXlO7JloM5ONwpcJ_g42mh9r2-JdAlwXfneudFvFaPFPg3d-FJtWK97fVAuts";

export default function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const sidebar = (
    <>
      <div>
        <div className="px-7 pb-8 pt-7">
          <Link
            href="/admin/dashboard"
            className="text-2xl font-black tracking-tight text-[#6941C6]"
          >
            RuangSela
          </Link>
          <p className="text-xs font-medium tracking-wide text-slate-400">
            Admin Console
          </p>
        </div>
        <nav className="space-y-1.5 px-4">
          {NAV.map((item) => {
            const Icon = item.icon;
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3.5 rounded-xl px-4 py-3 text-sm transition ${active ? "bg-[#6941C6] font-semibold text-white shadow-sm" : "font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900"}`}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
      <Link
        href="/admin/profil"
        className="m-2 flex items-center gap-3 border-t border-slate-100 px-4 pt-4"
      >
        <span className="relative h-10 w-10 overflow-hidden rounded-full border">
          <Image
            src={AVATAR}
            alt="Budi Santoso"
            fill
            sizes="40px"
            className="object-cover"
          />
        </span>
        <span className="min-w-0">
          <b className="block truncate text-sm text-slate-900">Budi Santoso</b>
          <small className="text-xs text-slate-400">Admin / Developer</small>
        </span>
      </Link>
    </>
  );

  const submitSearch = () => {
    if (query.trim())
      router.push(`/admin/search?q=${encodeURIComponent(query.trim())}`);
  };
  return (
    <div className="min-h-screen bg-[#f8faff] text-slate-800">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col justify-between border-r border-slate-100 bg-white lg:flex">
        {sidebar}
      </aside>
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            aria-label="Tutup menu"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-slate-950/40"
          />
          <aside className="relative flex h-full w-72 flex-col justify-between bg-white shadow-xl">
            {sidebar}
          </aside>
        </div>
      )}
      <div className="lg:ml-64">
        <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-slate-100 bg-white px-4 sm:px-8">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="grid h-9 w-9 place-items-center rounded-lg bg-slate-50 lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              submitSearch();
            }}
            className="relative w-full max-w-xl"
          >
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Cari venue, transaksi, pengguna..."
              className="w-full rounded-lg border border-slate-200 bg-slate-50/70 py-2 pl-10 pr-4 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/15"
            />
          </form>
          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={() => router.push("/admin/notifikasi")}
              aria-label="Notifikasi"
              className="relative grid h-9 w-9 place-items-center rounded-lg text-blue-600 hover:bg-slate-50"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-blue-600 ring-2 ring-white" />
            </button>
            <button
              onClick={() => router.push("/admin/settings")}
              aria-label="Settings"
              className="grid h-9 w-9 place-items-center rounded-lg text-blue-600 hover:bg-slate-50"
            >
              <Settings className="h-5 w-5" />
            </button>
            <button
              onClick={() => router.push("/admin/profil")}
              className="relative ml-1 h-9 w-9 overflow-hidden rounded-full border"
            >
              <Image
                src={AVATAR}
                alt="Profil admin"
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
