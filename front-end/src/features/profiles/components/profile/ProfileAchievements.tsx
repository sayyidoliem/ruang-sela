import { Leaf, LockKeyhole, MessageSquare, UserRoundCheck } from "lucide-react";
import type { Achievement } from "../../types/profile";
const icons = {
  leaf: Leaf,
  message: MessageSquare,
  mentor: UserRoundCheck,
  lock: LockKeyhole,
};
export default function ProfileAchievements({
  items,
}: {
  items: Achievement[];
}) {
  return (
    <section>
      <h2 className="mb-4 text-lg font-bold">Pencapaian</h2>
      <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-4">
        {items.map((item) => {
          const Icon = icons[item.icon];
          return (
            <article
              key={item.id}
              className={`flex flex-col items-center rounded-2xl p-4 text-center ${item.locked ? "border border-dashed bg-slate-50" : "border bg-white shadow-sm"}`}
            >
              <span className="mb-2.5 grid h-11 w-11 place-items-center rounded-full bg-purple-50 text-purple-600">
                <Icon className="h-5 w-5" />
              </span>
              <b className="text-xs">{item.title}</b>
              <small className="mt-1 text-slate-500">{item.description}</small>
            </article>
          );
        })}
      </div>
    </section>
  );
}
