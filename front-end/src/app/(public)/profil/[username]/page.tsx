import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  PROFILE_DATA,
  ProfilePage,
  getProfileByUsername,
} from "@/features/profiles";

interface ProfileRouteProps {
  params: Promise<{ username: string }>;
}

export function generateStaticParams() {
  return PROFILE_DATA.map((profile) => ({ username: profile.username }));
}

export async function generateMetadata({
  params,
}: ProfileRouteProps): Promise<Metadata> {
  const { username } = await params;
  const profile = getProfileByUsername(username);

  if (!profile) return { title: "Profil Tidak Ditemukan" };

  return {
    title: `${profile.name} | RuangSela`,
    description: profile.bio,
  };
}

export default async function ProfileRoute({ params }: ProfileRouteProps) {
  const { username } = await params;
  const profile = getProfileByUsername(username);

  if (!profile) notFound();

  return <ProfilePage profile={profile} />;
}
