import { CalendarCheck, Star, Users, Wallet } from "lucide-react";
const stats = [
  ["Total Booking", "84", CalendarCheck, "bg-blue-50 text-blue-600"],
  ["Komunitas Dilayani", "57", Users, "bg-purple-50 text-[#7357FB]"],
  ["Pendapatan", "12,5 jt", Wallet, "bg-emerald-50 text-emerald-500"],
  ["Rating Tempat", "4,8", Star, "bg-amber-50 text-amber-500"],
] as const;
export default function ManagerStats() {
  return (
    <aside className="space-y-3.5">
      {stats.map(([label, value, Icon, style]) => (
        <article
          key={label}
          className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white p-5 shadow-sm"
        >
          <div className="flex items-center gap-3.5">
            <span
              className={`grid h-11 w-11 place-items-center rounded-xl ${style}`}
            >
              <Icon
                className={`h-5 w-5 ${label.includes("Rating") ? "fill-current" : ""}`}
              />
            </span>
            <span className="text-sm font-bold text-slate-800">{label}</span>
          </div>
          <strong className="text-xl text-slate-900">{value}</strong>
        </article>
      ))}
    </aside>
  );
}
