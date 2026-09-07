import { Clock3, ShieldAlert, ShieldCheck, Users } from "lucide-react";
import type { AdminUserStatus } from "../../types/admin-user";
interface Props {
  total: number;
  count: (status: AdminUserStatus) => number;
}
export default function UserSummaryCards({ total, count }: Props) {
  const items = [
    {
      label: "Total User",
      value: total,
      note: "+8% bulan ini",
      icon: Users,
      tone: "bg-violet-50 text-violet-600",
      border: "border-slate-100",
    },
    {
      label: "Aktif",
      value: count("active"),
      note: "Normal",
      icon: ShieldCheck,
      tone: "bg-emerald-50 text-emerald-600",
      border: "border-slate-100",
    },
    {
      label: "Tertunda",
      value: count("pending"),
      note: "Butuh tindakan",
      icon: Clock3,
      tone: "bg-amber-50 text-amber-500",
      border: "border-amber-300",
    },
    {
      label: "Ditangguhkan",
      value: count("suspended"),
      note: "Dibatasi",
      icon: ShieldAlert,
      tone: "bg-red-50 text-red-500",
      border: "border-slate-100",
    },
  ];
  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {items.map(({ icon: Icon, ...item }) => (
        <article
          key={item.label}
          className={`flex items-start justify-between rounded-2xl border-2 bg-white p-5 shadow-sm ${item.border}`}
        >
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              {item.label}
            </span>
            <strong className="mb-2 mt-1 block text-2xl text-slate-900">
              {item.value}
            </strong>
            <span className="text-xs font-semibold text-slate-500">
              {item.note}
            </span>
          </div>
          <span
            className={`grid h-11 w-11 place-items-center rounded-xl ${item.tone}`}
          >
            <Icon className="h-6 w-6" />
          </span>
        </article>
      ))}
    </section>
  );
}
