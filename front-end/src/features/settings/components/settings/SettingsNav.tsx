import { Bell, Link2, ShieldCheck, UserRound } from "lucide-react";
import type { SettingsTab } from "../../types/settings";
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
  active: SettingsTab;
  onChange: (value: SettingsTab) => void;
}) {
  return (
    <nav className="grid grid-cols-2 gap-1 sm:grid-cols-4 md:flex md:w-64 md:flex-col">
      {tabs.map((t) => {
        const Icon = t.icon;
        return (
          <button
            key={t.id}
            onClick={() => onChange(t.id)}
            className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm ${active === t.id ? "bg-[#191543] text-white" : "text-gray-700"}`}
          >
            <Icon className="h-4 w-4" />
            {t.label}
          </button>
        );
      })}
    </nav>
  );
}
