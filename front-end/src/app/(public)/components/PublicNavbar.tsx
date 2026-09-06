"use client";

import { usePathname, useRouter } from "next/navigation";
import Navbar from "@/app/components/Navbar";

export default function PublicNavbar() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <Navbar
      activeHref={pathname}
      authenticated
      userInitial="A"
      onNotificationClick={() =>
        router.push("/notifikasi" as Parameters<typeof router.push>[0])
      }
      onSettingsClick={() => router.push("/settings")}
      onProfileClick={() => router.push("/profil/andi-wijaya")}
    />
  );
}
