export type SettingsTab =
  | "account"
  | "notifications"
  | "privacy"
  | "linked-apps";

export interface AccountSettings {
  fullName: string;
  email: string;
  phoneNumber: string;
  avatarSrc: string;
  emailVerified: boolean;
}

export interface NotificationSettings {
  email: boolean;
  push: boolean;
  sms: boolean;
}
