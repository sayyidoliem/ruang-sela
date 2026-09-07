import { Building2, LockKeyhole, Star, Users } from "lucide-react";
import type { ManagerAchievement } from "../../types/manager-account";
const icons = {
  building: Building2,
  star: Star,
  users: Users,
  lock: LockKeyhole,
};
export default function AchievementsGrid({
  items,
}: {
  items: ManagerAchievement[];
}) {
  return (
    <section>
      <h2 className="mb-4 text-lg font-bold text-slate-900">Pencapaian</h2>
      <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-4">
        {items.map((item) => {
          const Icon = icons[item.icon];
          return (
            <article
              key={item.id}
              className={`flex flex-col items-center rounded-2xl p-4 text-center ${item.locked ? "border border-dashed border-slate-300 bg-slate-50" : "border border-slate-100 bg-white shadow-sm"}`}
            >
              <span
                className={`mb-2.5 grid h-11 w-11 place-items-center rounded-full ${item.locked ? "bg-slate-200 text-slate-400" : "bg-violet-50 text-[#7357FB]"}`}
              >
                <Icon
                  className={`h-5 w-5 ${item.icon === "star" ? "fill-current" : ""}`}
                />
              </span>
              <h3
                className={`text-xs font-bold ${item.locked ? "text-slate-400" : "text-slate-900"}`}
              >
                {item.title}
              </h3>
              <p className="mt-1 text-[11px] text-slate-500">
                {item.description}
              </p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
