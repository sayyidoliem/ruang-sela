"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { env } from "@/config/env";

const BE_URL = env.NEXT_PUBLIC_API_URL.replace(/\/$/, "");

export default function AuthCallbackPage() {
  const router = useRouter();
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    const hash = window.location.hash.replace(/^#/, "");
    const params = new URLSearchParams(hash);
    const accessToken = params.get("access_token");
    const refreshToken = params.get("refresh_token");
    const provider = params.get("provider") || "google";

    if (!accessToken) {
      router.replace("/login");
      return;
    }

    localStorage.setItem("rs_access_token", accessToken);
    localStorage.setItem("rs_refresh_token", refreshToken || "");
    localStorage.setItem("rs_auth_provider", provider);

    // Ambil role + nama dari BE untuk navbar & routing
    fetch(`${BE_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
      .then((r) => r.json().catch(() => null))
      .then((json) => {
        const data = json?.data ?? json;
        const role = (data?.role || "USER").toLowerCase();
        localStorage.setItem("rs_role", role);
        if (data?.name) localStorage.setItem("rs_name", data.name);
        if (data?.email) localStorage.setItem("rs_email", data.email);
      })
      .catch(() => {})
      .finally(() => {
        window.dispatchEvent(new Event("authchange"));
        const from = sessionStorage.getItem("rs_auth_redirect") || "/cari";
        sessionStorage.removeItem("rs_auth_redirect");
        router.replace(from);
      });
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-surface-container-lowest gap-4">
      <span className="material-symbols-outlined animate-spin text-community-purple text-4xl">
        progress_activity
      </span>
      <p className="font-body-md text-body-md text-on-surface-variant">
        Memproses login Google...
      </p>
    </div>
  );
}