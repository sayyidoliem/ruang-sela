import type { AccountSettings, NotificationSettings } from "../types/settings";

export const INITIAL_ACCOUNT_SETTINGS: AccountSettings = {
  fullName: "Jane Doe",
  email: "jane.doe@example.com",
  phoneNumber: "+62 812 3456 7890",
  avatarSrc:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAITB8PQ38BDTQBSkfIX90gINeYGxYbM3uf4hzYvlmQ4E8mntEM_davsw_NJ7TEqhglvqHK0zrbUL5QNsYqNw0pK7tUT6ZKTSet-iwsHt0daP5Wk5rU1SLHZSxGYmVv-EDVqBDVtsPL973uWwGSuJswdwMRGCEBZ_4jE3iG1mWWKBLmZRu8lmIJD-U3FdVjORGWhlPYy50aztDF-v7H-fZCXqKy9aQymKOvSdb3Z6vERbzsfHPQPOPw",
  emailVerified: true,
};

export const INITIAL_NOTIFICATION_SETTINGS: NotificationSettings = {
  email: true,
  push: true,
  sms: false,
};
