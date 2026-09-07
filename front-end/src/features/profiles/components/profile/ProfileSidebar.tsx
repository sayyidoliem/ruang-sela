import Link from "next/link";
import { CalendarDays, HeartHandshake, UsersRound } from "lucide-react";
import type { ProfileStat } from "../../types/profile";
const config = {
  bookings: { icon: CalendarDays, style: "bg-blue-50 text-blue-600" },
  communities: { icon: UsersRound, style: "bg-purple-50 text-purple-600" },
  activities: { icon: HeartHandshake, style: "bg-emerald-50 text-emerald-500" },
};
export default function ProfileSidebar({ stats }: { stats: ProfileStat[] }) {
  return (
    <aside className="flex flex-col gap-6">
      <div className="space-y-3.5">
        {stats.map((stat) => {
          const c = config[stat.icon];
          const Icon = c.icon;
          return (
            <article
              key={stat.id}
              className="flex items-center justify-between rounded-2xl border bg-white p-5 shadow-sm"
            >
              <div className="flex items-center gap-3.5">
                <span
                  className={`grid h-11 w-11 place-items-center rounded-xl ${c.style}`}
                >
                  <Icon className="h-5 w-5" />
                </span>
                <b>{stat.label}</b>
              </div>
              <strong className="text-2xl">{stat.value}</strong>
            </article>
          );
        })}
      </div>
      <section className="rounded-2xl bg-[#141238] p-7 text-white">
        <h2 className="text-xl font-bold">Tingkatkan ke Penyelenggara</h2>
        <p className="mt-2 text-sm text-slate-300">
          Daftarkan ruang dan kelola komunitas besar.
        </p>
        <Link
          href="/penyelenggara"
          className="mt-6 inline-block rounded-lg bg-[#5e43f3] px-5 py-2.5 text-sm font-semibold"
        >
          Pelajari Lebih Lanjut
        </Link>
      </section>
    </aside>
  );
}
