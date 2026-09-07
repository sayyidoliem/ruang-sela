import {
  Building2,
  CalendarDays,
  CreditCard,
  TrendingUp,
  UsersRound,
} from "lucide-react";

interface KpiItem {
  id: string;
  label: string;
  value: string;
  trend: string;
  note: string;
  tone: "purple" | "green" | "amber";
}
const icons = [UsersRound, CalendarDays, CreditCard, Building2];
const tones = {
  purple: "bg-purple-50 text-[#6941C6]",
  green: "bg-emerald-50 text-emerald-600",
  amber: "bg-amber-50 text-amber-600",
};

export default function KpiGrid({ items }: { items: readonly KpiItem[] }) {
  return (
    <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
      {items.map((item, index) => {
        const Icon = icons[index] ?? Building2;
        return (
          <article
            key={item.id}
            className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm"
          >
            <div className="mb-4 flex items-center justify-between">
              <span
                className={`grid h-10 w-10 place-items-center rounded-xl ${tones[item.tone]}`}
              >
                <Icon className="h-5 w-5" />
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-600">
                <TrendingUp className="h-3 w-3" />
                {item.trend}
              </span>
            </div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              {item.label}
            </span>
            <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900">
              {item.value}
            </h2>
            <p className="mt-2 text-xs text-slate-500">{item.note}</p>
          </article>
        );
      })}
    </section>
  );
}
