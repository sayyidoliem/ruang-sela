import Link from "next/link";
import type { Route } from "next";
import { ChevronRight, HelpCircle } from "lucide-react";
import DashboardCard from "./DashboardCard";
interface Task {
  id: string;
  href: string;
  title: string;
  description: string;
  count: number;
  tone: "amber" | "green" | "indigo" | "rose";
}
const tones = {
  amber: "bg-amber-50 text-amber-600",
  green: "bg-emerald-50 text-emerald-600",
  indigo: "bg-indigo-50 text-indigo-600",
  rose: "bg-rose-50 text-rose-600",
};
export default function TaskPanel({ tasks }: { tasks: readonly Task[] }) {
  return (
    <DashboardCard>
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <h2 className="font-bold text-slate-900">Menunggu Tindakan</h2>
          <p className="mt-0.5 text-xs text-slate-400">
            Antrean mendesak hari ini
          </p>
        </div>
        <span className="rounded-full border border-rose-100 bg-rose-50 px-2.5 py-0.5 text-xs font-bold text-rose-600">
          18 tugas
        </span>
      </div>
      <div className="mt-4 space-y-3">
        {tasks.map((task) => (
          <Link
            key={task.id}
            href={task.href as Route}
            className="flex items-center justify-between rounded-xl border border-slate-100 p-3 hover:bg-slate-50"
          >
            <div className="flex min-w-0 items-center gap-3">
              <span
                className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg ${tones[task.tone]}`}
              >
                <HelpCircle className="h-4 w-4" />
              </span>
              <span className="min-w-0">
                <b className="block truncate text-xs text-slate-800">
                  {task.title}
                </b>
                <small className="block truncate text-[11px] text-slate-400">
                  {task.description}
                </small>
              </span>
            </div>
            <span className="ml-2 flex items-center gap-1">
              <b className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px]">
                {task.count}
              </b>
              <ChevronRight className="h-4 w-4 text-slate-300" />
            </span>
          </Link>
        ))}
      </div>
    </DashboardCard>
  );
}
