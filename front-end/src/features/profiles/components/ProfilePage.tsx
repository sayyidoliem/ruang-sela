import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  HeartHandshake,
  Leaf,
  LockKeyhole,
  MessageSquare,
  UserRoundCheck,
  UsersRound,
} from "lucide-react";
import type { AchievementIcon, StatIcon, UserProfile } from "../types/profile";
import ProfileActions from "./ProfileActions";

interface ProfilePageProps {
  profile: UserProfile;
}

const achievementIcons: Record<AchievementIcon, typeof Leaf> = {
  leaf: Leaf,
  message: MessageSquare,
  mentor: UserRoundCheck,
  lock: LockKeyhole,
};

const statConfig: Record<
  StatIcon,
  { icon: typeof CalendarDays; style: string }
> = {
  bookings: { icon: CalendarDays, style: "bg-blue-50 text-blue-600" },
  communities: { icon: UsersRound, style: "bg-purple-50 text-[#5e43f3]" },
  activities: { icon: HeartHandshake, style: "bg-emerald-50 text-emerald-500" },
};

export default function ProfilePage({ profile }: ProfilePageProps) {
  return (
    <main className="min-h-screen flex-1 bg-[#f8f9ff]">
      <div className="border-b border-slate-100 bg-white px-6 py-3.5 shadow-sm md:px-12">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-base font-bold text-slate-900 transition-colors hover:text-[#5e43f3]"
        >
          <ArrowLeft className="h-5 w-5" />
          Profil
        </Link>
      </div>

      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-10">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="flex flex-col gap-8 lg:col-span-8">
            <section className="flex flex-col items-center gap-6 rounded-2xl border border-slate-100 bg-white p-6 shadow-[0_4px_20px_-2px_rgba(94,67,243,0.06)] sm:flex-row sm:items-start sm:p-8">
              <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full ring-4 ring-purple-100 shadow-[0_0_25px_-3px_rgba(94,67,243,0.25)] sm:h-28 sm:w-28">
                <Image
                  src={profile.avatarSrc}
                  alt={`Foto profil ${profile.name}`}
                  fill
                  priority
                  sizes="112px"
                  className="object-cover"
                />
              </div>
              <div className="flex-1 text-center sm:text-left">
                <div className="flex flex-wrap items-center justify-center gap-3 sm:justify-start">
                  <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                    {profile.name}
                  </h1>
                  {profile.verified && (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600">
                      <UserRoundCheck className="h-3.5 w-3.5" />
                      Warga Terverifikasi
                    </span>
                  )}
                </div>
                <p className="mt-2.5 max-w-xl text-sm leading-relaxed text-slate-600 sm:text-base">
                  {profile.bio}
                </p>
                <ProfileActions username={profile.username} />
              </div>
            </section>

            <section>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-900">
                  Tempat yang Baru Dikunjungi
                </h2>
                <Link
                  href="/riwayat"
                  className="text-xs font-semibold text-[#5e43f3] hover:underline sm:text-sm"
                >
                  Lihat Semua
                </Link>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {profile.visitedSpaces.map((space) => (
                  <Link
                    key={space.id}
                    href={`/ruang/${space.slug}`}
                    className="flex items-start gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-[0_2px_10px_rgba(94,67,243,0.04)] transition-shadow hover:shadow-[0_4px_20px_-2px_rgba(94,67,243,0.08)]"
                  >
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl">
                      <Image
                        src={space.imageSrc}
                        alt={space.name}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate text-sm font-bold text-slate-900">
                        {space.name}
                      </h3>
                      <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-slate-500">
                        {space.description}
                      </p>
                      <span className="mt-2 block text-[10px] font-bold uppercase tracking-wider text-slate-400 sm:text-[11px]">
                        Dikunjungi {space.visitedAt}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>

            <section>
              <h2 className="mb-4 text-lg font-bold text-slate-900">
                Pencapaian
              </h2>
              <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-4">
                {profile.achievements.map((achievement, index) => {
                  const Icon = achievementIcons[achievement.icon];
                  const iconStyle =
                    [
                      "bg-purple-50 text-purple-600",
                      "bg-blue-50 text-blue-600",
                      "bg-amber-50 text-amber-500",
                    ][index] ?? "bg-slate-200/80 text-slate-400";
                  return (
                    <article
                      key={achievement.id}
                      className={
                        achievement.locked
                          ? "flex flex-col items-center rounded-2xl border border-dashed border-slate-300 bg-slate-50/70 p-4 text-center"
                          : "flex flex-col items-center rounded-2xl border border-slate-100 bg-white p-4 text-center shadow-[0_2px_10px_rgba(94,67,243,0.04)]"
                      }
                    >
                      <span
                        className={`mb-2.5 grid h-11 w-11 place-items-center rounded-full ${iconStyle}`}
                      >
                        <Icon className="h-5 w-5" />
                      </span>
                      <h3
                        className={`text-xs font-bold ${achievement.locked ? "text-slate-400" : "text-slate-900"}`}
                      >
                        {achievement.title}
                      </h3>
                      <p
                        className={`mt-1 text-[11px] ${achievement.locked ? "text-slate-400" : "text-slate-500"}`}
                      >
                        {achievement.description}
                      </p>
                    </article>
                  );
                })}
              </div>
            </section>
          </div>

          <aside className="flex flex-col gap-6 lg:col-span-4">
            <div className="flex flex-col gap-3.5">
              {profile.stats.map((stat) => {
                const config = statConfig[stat.icon];
                const Icon = config.icon;
                return (
                  <article
                    key={stat.id}
                    className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_2px_10px_rgba(94,67,243,0.04)]"
                  >
                    <div className="flex items-center gap-3.5">
                      <span
                        className={`grid h-11 w-11 place-items-center rounded-xl ${config.style}`}
                      >
                        <Icon className="h-5 w-5" />
                      </span>
                      <span className="font-bold text-slate-800">
                        {stat.label}
                      </span>
                    </div>
                    <strong className="text-2xl tracking-tight text-slate-900">
                      {stat.value}
                    </strong>
                  </article>
                );
              })}
            </div>

            <section className="relative overflow-hidden rounded-2xl bg-[#141238] p-6 text-white shadow-xl sm:p-7">
              <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-[#5e43f3]/20 blur-2xl" />
              <div className="relative">
                <h2 className="mb-2 text-lg font-bold tracking-tight sm:text-xl">
                  Tingkatkan ke Penyelenggara
                </h2>
                <p className="text-xs leading-relaxed text-slate-300 sm:text-sm">
                  Ingin mendaftarkan ruang dan mengelola komunitas besar? Ajukan
                  akun penyelenggara.
                </p>
                <Link
                  href="/penyelenggara"
                  className="mt-6 inline-block rounded-lg bg-[#5e43f3] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#4e33df]"
                >
                  Pelajari Lebih Lanjut
                </Link>
              </div>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}
