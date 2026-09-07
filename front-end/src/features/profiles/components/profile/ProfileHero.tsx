import Image from "next/image";
import { UserRoundCheck } from "lucide-react";
import type { UserProfile } from "../../types/profile";
import ProfileActions from "../ProfileActions";
export default function ProfileHero({ profile }: { profile: UserProfile }) {
  return (
    <section className="flex flex-col items-center gap-6 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm sm:flex-row sm:items-start sm:p-8">
      <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-full ring-4 ring-purple-100">
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
          <h1 className="text-3xl font-bold">{profile.name}</h1>
          {profile.verified && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600">
              <UserRoundCheck className="h-3.5 w-3.5" />
              Warga Terverifikasi
            </span>
          )}
        </div>
        <p className="mt-2.5 max-w-xl text-sm text-slate-600">{profile.bio}</p>
        <ProfileActions username={profile.username} />
      </div>
    </section>
  );
}
