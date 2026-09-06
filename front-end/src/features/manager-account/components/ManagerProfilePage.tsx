"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Building2,
  CalendarCheck,
  Edit3,
  LockKeyhole,
  MapPin,
  Share2,
  Star,
  Users,
  Wallet,
} from "lucide-react";
import { useState } from "react";
import { MANAGER_ACCOUNT, MANAGER_ACHIEVEMENTS } from "../data/manager-account";

const PLACE_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCFRubSHzrPPt0FEEnOaZl2aOA1-hQ_MuRwGdQZz7n1C6AgEwtuu7Rc5TuTj0_j2J3Fr9tQWap3pei7rsmZuz6EuzmmkfD0xGp_UxcZE_gz3O8kd-oFYBV-lAQ7ydMNrKhAx09m8OM3Jdsq_vlhaQNGP49NH_66SVKNl4ZZb09eURK7u7GwgNciSb8o1WjtWz_xObsebI6qYOMeqr8uP9SroQt8VFzjiZ_JlyQ0RDMrU5FiM6Y3rso";

export default function ManagerProfilePage() {
  const [copied, setCopied] = useState(false);
  const share = async () => {
    if (navigator.share)
      await navigator
        .share({
          title: "Profil Pengelola RuangSela",
          url: window.location.href,
        })
        .catch(() => undefined);
    else {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    }
  };
  const achievementIcons = {
    building: Building2,
    star: Star,
    users: Users,
    lock: LockKeyhole,
  };

  return (
    <main className="px-4 pb-12 sm:px-8">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Profil Pengelola</h1>
        <p className="mt-1 text-sm text-slate-500">
          Identitas, performa, dan pencapaian pengelola tempat.
        </p>
      </header>
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="space-y-8">
          <section className="flex flex-col items-center gap-6 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm sm:flex-row sm:items-start sm:p-8">
            <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full ring-4 ring-purple-100 shadow-lg sm:h-28 sm:w-28">
              <Image
                src={MANAGER_ACCOUNT.avatarSrc}
                alt={MANAGER_ACCOUNT.fullName}
                fill
                priority
                sizes="112px"
                className="object-cover"
              />
            </div>
            <div className="flex-1 text-center sm:text-left">
              <div className="flex flex-wrap items-center justify-center gap-3 sm:justify-start">
                <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                  {MANAGER_ACCOUNT.fullName}
                </h2>
                <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600">
                  Pengelola Terverifikasi
                </span>
              </div>
              <p className="mt-1 font-medium text-[#7357FB]">
                {MANAGER_ACCOUNT.role}
              </p>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-600">
                {MANAGER_ACCOUNT.bio}
              </p>
              <div className="mt-5 flex flex-wrap justify-center gap-3 sm:justify-start">
                <Link
                  href="/pengelola/settings"
                  className="inline-flex items-center gap-2 rounded-lg bg-[#7357FB] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#6043ea]"
                >
                  <Edit3 className="h-4 w-4" />
                  Edit Profil
                </Link>
                <button
                  type="button"
                  onClick={share}
                  className="inline-flex items-center gap-2 rounded-lg border border-violet-300 px-5 py-2.5 text-sm font-semibold text-[#7357FB] hover:bg-violet-50"
                >
                  <Share2 className="h-4 w-4" />
                  {copied ? "Tautan Disalin" : "Bagikan Profil"}
                </button>
              </div>
            </div>
          </section>

          <section>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">
                Tempat yang Dikelola
              </h2>
              <Link
                href="/pengelola/tempat"
                className="text-sm font-semibold text-[#7357FB] hover:underline"
              >
                Kelola Tempat
              </Link>
            </div>
            <article className="flex flex-col gap-5 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:flex-row">
              <div className="relative h-48 w-full shrink-0 overflow-hidden rounded-xl sm:w-64">
                <Image
                  src={PLACE_IMAGE}
                  alt="Aula Kelurahan Melati"
                  fill
                  sizes="(max-width:640px) 100vw,256px"
                  className="object-cover"
                />
              </div>
              <div className="flex-1">
                <p className="flex items-center gap-1.5 text-xs text-slate-500">
                  <MapPin className="h-4 w-4" />
                  Jakarta Selatan
                </p>
                <h3 className="mt-2 text-xl font-bold text-slate-900">
                  Aula Kelurahan Melati
                </h3>
                <p className="mt-2 text-sm text-slate-500">
                  Tempat aktif dan terverifikasi untuk pertemuan serta kegiatan
                  komunitas.
                </p>
                <div className="mt-5 flex flex-wrap gap-4 text-xs">
                  <span>
                    <b className="text-slate-900">84</b> booking
                  </span>
                  <span>
                    <b className="text-slate-900">4,8</b> rating
                  </span>
                  <span className="font-semibold text-emerald-600">Aktif</span>
                </div>
              </div>
            </article>
          </section>

          <section>
            <h2 className="mb-4 text-lg font-bold text-slate-900">
              Pencapaian
            </h2>
            <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-4">
              {MANAGER_ACHIEVEMENTS.map((achievement) => {
                const Icon = achievementIcons[achievement.icon];
                return (
                  <article
                    key={achievement.id}
                    className={`flex flex-col items-center rounded-2xl p-4 text-center ${achievement.locked ? "border border-dashed border-slate-300 bg-slate-50" : "border border-slate-100 bg-white shadow-sm"}`}
                  >
                    <span
                      className={`mb-2.5 grid h-11 w-11 place-items-center rounded-full ${achievement.locked ? "bg-slate-200 text-slate-400" : "bg-violet-50 text-[#7357FB]"}`}
                    >
                      <Icon
                        className={`h-5 w-5 ${achievement.icon === "star" ? "fill-current" : ""}`}
                      />
                    </span>
                    <h3
                      className={`text-xs font-bold ${achievement.locked ? "text-slate-400" : "text-slate-900"}`}
                    >
                      {achievement.title}
                    </h3>
                    <p className="mt-1 text-[11px] text-slate-500">
                      {achievement.description}
                    </p>
                  </article>
                );
              })}
            </div>
          </section>
        </div>

        <aside className="space-y-3.5">
          {[
            {
              label: "Total Booking",
              value: "84",
              icon: CalendarCheck,
              style: "bg-blue-50 text-blue-600",
            },
            {
              label: "Komunitas Dilayani",
              value: "57",
              icon: Users,
              style: "bg-purple-50 text-[#7357FB]",
            },
            {
              label: "Pendapatan",
              value: "12,5 jt",
              icon: Wallet,
              style: "bg-emerald-50 text-emerald-500",
            },
            {
              label: "Rating Tempat",
              value: "4,8",
              icon: Star,
              style: "bg-amber-50 text-amber-500",
            },
          ].map((stat) => {
            const Icon = stat.icon;
            return (
              <article
                key={stat.label}
                className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white p-5 shadow-sm"
              >
                <div className="flex items-center gap-3.5">
                  <span
                    className={`grid h-11 w-11 place-items-center rounded-xl ${stat.style}`}
                  >
                    <Icon
                      className={`h-5 w-5 ${stat.label.includes("Rating") ? "fill-current" : ""}`}
                    />
                  </span>
                  <span className="text-sm font-bold text-slate-800">
                    {stat.label}
                  </span>
                </div>
                <strong className="text-xl text-slate-900">{stat.value}</strong>
              </article>
            );
          })}
        </aside>
      </div>
    </main>
  );
}
