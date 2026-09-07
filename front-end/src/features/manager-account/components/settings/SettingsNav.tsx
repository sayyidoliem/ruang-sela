import { Bell, Link2, ShieldCheck, UserRound } from "lucide-react";
import type { ManagerSettingsTab } from "../../types/manager-account";
const tabs = [
  { id: "account", label: "Akun", icon: UserRound },
  { id: "notifications", label: "Notifikasi", icon: Bell },
  { id: "privacy", label: "Privasi & Keamanan", icon: ShieldCheck },
  { id: "linked-apps", label: "Aplikasi Tertaut", icon: Link2 },
] as const;
export default function SettingsNav({
  active,
  onChange,
}: {
  active: ManagerSettingsTab;
  onChange: (tab: ManagerSettingsTab) => void;
}) {
  return (
    <nav
      aria-label="Navigasi settings"
      className="grid w-full shrink-0 grid-cols-2 gap-1 sm:grid-cols-4 lg:flex lg:w-64 lg:flex-col"
    >
      {tabs.map((item) => {
        const Icon = item.icon;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onChange(item.id)}
            className={`flex items-center gap-3 rounded-xl px-4 py-3.5 text-left text-sm ${active === item.id ? "bg-[#1C1635] font-semibold text-white" : "font-medium text-gray-700 hover:bg-white/80"}`}
          >
            <Icon className="h-5 w-5" />
            {item.label}
          </button>
        );
      })}
    </nav>
  );
}
