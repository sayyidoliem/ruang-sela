export type AchievementIcon = "leaf" | "message" | "mentor" | "lock";
export type StatIcon = "bookings" | "communities" | "activities";

export interface VisitedSpace {
  id: string;
  name: string;
  slug: string;
  description: string;
  visitedAt: string;
  imageSrc: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: AchievementIcon;
  locked?: boolean;
}

export interface ProfileStat {
  id: string;
  label: string;
  value: number;
  icon: StatIcon;
}

export interface UserProfile {
  id: string;
  username: string;
  name: string;
  initials: string;
  avatarSrc: string;
  verified: boolean;
  bio: string;
  visitedSpaces: VisitedSpace[];
  achievements: Achievement[];
  stats: ProfileStat[];
}
