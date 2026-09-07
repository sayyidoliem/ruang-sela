"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Navbar from "@/app/components/Navbar";

function readSession() {
  if (typeof window === "undefined") {
    return { authenticated: false, initial: "A", role: "user" };
  }
  const token = localStorage.getItem("rs_access_token");
  const role = localStorage.getItem("rs_role") || "user";
  const name =
    localStorage.getItem("rs_name") || localStorage.getItem("rs_email") || "Warga";
  return {
    authenticated: Boolean(token),
    initial: name.charAt(0).toUpperCase(),
    role,
  };
}

export default function PublicNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [auth, setAuth] = useState(() => readSession());

  useEffect(() => {
    const sync = () => setAuth(readSession());
    window.addEventListener("storage", sync);
    window.addEventListener("authchange", sync);
    sync();
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("authchange", sync);
    };
  }, []);

  const handleSignIn = () => router.push("/login");
  const handleSignUp = () => router.push("/signup");
  const handleProfile = () => {
    if (!auth.authenticated) {
      router.push("/login");
      return;
    }
    router.push(
      auth.role === "admin"
        ? "/admin"
        : auth.role === "manager"
          ? "/manager"
          : "/profil",
    );
  };

  return (
    <Navbar
      activeHref={pathname}
      authenticated={auth.authenticated}
      userInitial={auth.initial}
      onSignIn={handleSignIn}
      onSignUp={handleSignUp}
      onNotificationClick={() => router.push("/notifikasi")}
      onSettingsClick={() => router.push("/settings")}
      onProfileClick={handleProfile}
    />
  );
}