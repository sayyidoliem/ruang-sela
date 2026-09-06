export type AdminUserRole = "User" | "Manager" | "Admin";
export type AdminUserStatus = "active" | "pending" | "suspended";

export interface AdminUserDocument {
  id: string;
  name: string;
  size: string;
  uploadedAt: string;
  status: "Verified" | "Pending" | "Not Uploaded";
}

export interface AdminUserActivity {
  id: string;
  date: string;
  description: string;
  tone: "green" | "amber" | "slate";
}

export interface AdminManagedUser {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  avatarSrc?: string;
  initials: string;
  role: AdminUserRole;
  status: AdminUserStatus;
  joinedAt: string;
  lastActiveAt: string;
  emailVerified: boolean;
  venues: number;
  bookings: number;
  rating: number;
  reviews: number;
  documents: AdminUserDocument[];
  history: AdminUserActivity[];
}
