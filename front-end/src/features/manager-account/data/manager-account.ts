import type { ManagerAccount, ManagerAchievement, ManagerNotifications } from "../types/manager-account";

export const MANAGER_ACCOUNT: ManagerAccount = {
  fullName: "Budi Santoso",
  email: "budi.santoso@ruangsela.id",
  phone: "+62 812 3456 7890",
  avatarSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuCxFYyU-NUJ6fCZE7908kTyp09BRUFDlwFwjefT-qDYYhWeAGChPQDMoJZeMJXTwPCEIMQ6RLo1Fq5714VohahkvJ8bDYcgRKlOY9yAX6JQOHCVNhM5vnEBx7DhefHYS-AhIlwUlDYLqkvB_565sDZdOFq5q-Tb84UVt2C5YjpEOTnrSBjuayywZf8PfqkpNJX00_BiAE_wTtSa2OvPMAIZY6qTgMDIoRA5Tqq5ue_8xz9Y-5X4qN7IwVBlAst-H8PZ",
  emailVerified: true,
  role: "Pengelola Tempat",
  bio: "Pengelola ruang komunitas yang berfokus pada layanan publik, kolaborasi warga, dan pengelolaan fasilitas yang transparan.",
};

export const MANAGER_NOTIFICATIONS: ManagerNotifications = {
  email: true,
  push: true,
  sms: false,
};

export const MANAGER_ACHIEVEMENTS: ManagerAchievement[] = [
  { id: "verified-space", title: "Verified Space", description: "Mengelola tempat terverifikasi", icon: "building" },
  { id: "top-rated", title: "Top Rated", description: "Mencapai rating 4,8", icon: "star" },
  { id: "community-host", title: "Community Host", description: "Melayani 50+ komunitas", icon: "users" },
  { id: "super-manager", title: "Super Manager", description: "Terbuka pada 500 booking", icon: "lock", locked: true },
];
