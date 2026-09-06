import type { ReactNode } from "react";
import { ManagerShell } from "@/features/manager-dashboard";

export default function ManagerLayout({ children }: { children: ReactNode }) {
  return <ManagerShell>{children}</ManagerShell>;
}
