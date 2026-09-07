import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { UserProfile } from "../types/profile";
import ProfileAchievements from "./profile/ProfileAchievements";
import ProfileHero from "./profile/ProfileHero";
import ProfileSidebar from "./profile/ProfileSidebar";
import VisitedSpaces from "./profile/VisitedSpaces";
export default function ProfilePage({ profile }: { profile: UserProfile }) {
  return (
    <main className="min-h-screen flex-1 bg-[#f8f9ff]">
      <div className="border-b bg-white px-6 py-3.5">
        <Link href="/" className="inline-flex items-center gap-2 font-bold">
          <ArrowLeft className="h-5 w-5" />
          Profil
        </Link>
      </div>
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid gap-6 lg:grid-cols-12">
          <div className="flex flex-col gap-8 lg:col-span-8">
            <ProfileHero profile={profile} />
            <VisitedSpaces items={profile.visitedSpaces} />
            <ProfileAchievements items={profile.achievements} />
          </div>
          <div className="lg:col-span-4">
            <ProfileSidebar stats={profile.stats} />
          </div>
        </div>
      </div>
    </main>
  );
}
