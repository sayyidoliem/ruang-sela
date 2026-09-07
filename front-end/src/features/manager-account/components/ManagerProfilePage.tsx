"use client";
import { useState } from "react";
import { MANAGER_ACCOUNT, MANAGER_ACHIEVEMENTS } from "../data/manager-account";
import ProfileHero from "./profile/ProfileHero";
import AchievementsGrid from "./profile/AchievementsGrid";
import ManagedPlaceCard from "./profile/ManagedPlaceCard";
import ManagerStats from "./profile/ManagerStats";
export default function ManagerProfilePage() {
  const [copied, setCopied] = useState(false);
  const share = async () => {
    if (navigator.share)
      await navigator
        .share({ title: "Profil Pengelola RuangSela", url: location.href })
        .catch(() => undefined);
    else {
      await navigator.clipboard.writeText(location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    }
  };
  return (
    <main className="px-4 pb-12 sm:px-8">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">Profil Pengelola</h1>
        <p className="mt-1 text-sm text-slate-500">
          Identitas, performa, dan pencapaian pengelola tempat.
        </p>
      </header>
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="space-y-8">
          <ProfileHero
            account={MANAGER_ACCOUNT}
            copied={copied}
            onShare={share}
          />
          <ManagedPlaceCard />
          <AchievementsGrid items={MANAGER_ACHIEVEMENTS} />
        </div>
        <ManagerStats />
      </div>
    </main>
  );
}
