import Image from "next/image";
import Link from "next/link";
import { Building2, FileText, LayoutGrid, UserRound } from "lucide-react";
const nav = [
  { label: "Dashboard", href: "/pengelola/dashboard", icon: LayoutGrid },
  { label: "Kelola Tempat", href: "/pengelola/tempat", icon: Building2 },
  { label: "Pengajuan", href: "/pengelola/pengajuan", icon: FileText },
  { label: "Profil", href: "/pengelola/profil", icon: UserRound },
];
const avatar =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCtxMujcl2597dS_l_nMbenfmfKY1gkqq7WxsPA3Vec-vxRSKpLbicPm3bEtl8ySoglGy8bF-hFG53WGKEAV-vG1gjKYXRQ3QNNc7nO4HHqqw___biYEl-GCdtktIWLYNY_5Cjh2q8jOxHIsh3efusQakxSjqoxyzHZ7C6j22w2KqSy1b6H_XBFhH6cATaWC5DJIgxInkgTZWgdkQHM3dtCWIfJ880NGJ_s2dsgP6y-gfSyBUUQqKI";
export default function ManagerSidebar({
  pathname,
  onNavigate,
}: {
  pathname: string;
  onNavigate: () => void;
}) {
  return (
    <>
      <div>
        <div className="px-7 py-6">
          <Link
            href="/pengelola/dashboard"
            className="text-xl font-black text-[#704fe6]"
          >
            RuangSela
          </Link>
          <p className="text-[11px] uppercase text-slate-400">
            Space Management
          </p>
        </div>
        <nav className="space-y-1.5 px-4">
          {nav.map((item) => {
            const Icon = item.icon;
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onNavigate}
                className={`flex items-center gap-3.5 rounded-xl px-4 py-3 text-sm ${active ? "bg-[#7c3aed] font-semibold text-white" : "text-slate-500 hover:bg-slate-50"}`}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
      <Link
        href="/pengelola/profil"
        className="m-4 flex items-center gap-3 border-t pt-4"
      >
        <span className="relative h-10 w-10 overflow-hidden rounded-full">
          <Image
            src={avatar}
            alt="Budi Santoso"
            fill
            sizes="40px"
            className="object-cover"
          />
        </span>
        <span>
          <b className="block text-sm">Budi Santoso</b>
          <small className="text-slate-400">Pengelola Tempat</small>
        </span>
      </Link>
    </>
  );
}
