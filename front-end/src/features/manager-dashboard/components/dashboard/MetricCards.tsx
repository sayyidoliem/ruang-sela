import { CalendarRange, Clock3, PieChart, Users } from "lucide-react";
import type { ManagerMetric } from "../../types/manager-dashboard";
const icons = [CalendarRange, PieChart, Users, Clock3];
export default function MetricCards({ metrics }: { metrics: ManagerMetric[] }) {
  return (
    <section className="grid grid-cols-1 gap-5 sm:grid-cols-2">
      {metrics.map((metric, index) => {
        const Icon = icons[index] ?? CalendarRange;
        return (
          <article
            key={metric.id}
            className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm"
          >
            <div className="mb-3 flex items-center justify-between">
              <span
                className={`grid h-10 w-10 place-items-center rounded-xl ${metric.tone === "amber" ? "bg-amber-50 text-amber-500" : "bg-blue-50 text-blue-600"}`}
              >
                <Icon className="h-5 w-5" />
              </span>
              {metric.trend && (
                <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-600">
                  {metric.trend}
                </span>
              )}
            </div>
            <p className="text-sm font-medium text-slate-500">{metric.label}</p>
            <div className="mt-1 flex items-baseline gap-2">
              <strong className="text-2xl text-slate-900">
                {metric.value}
              </strong>
              <span
                className={`text-xs ${metric.tone === "amber" ? "rounded bg-amber-50 px-2 py-0.5 text-amber-600" : "text-slate-400"}`}
              >
                {metric.note}
              </span>
            </div>
          </article>
        );
      })}
    </section>
  );
}
