export type ManagerSettingsTab =
  | "account"
  | "notifications"
  | "privacy"
  | "linked-apps";

export interface ManagerAccount {
  fullName: string;
  email: string;
  phone: string;
  avatarSrc: string;
  emailVerified: boolean;
  role: string;
  bio: string;
}

export interface ManagerNotifications {
  email: boolean;
  push: boolean;
  sms: boolean;
}

export interface ManagerAchievement {
  id: string;
  title: string;
  description: string;
  icon: "building" | "star" | "users" | "lock";
  locked?: boolean;
}
