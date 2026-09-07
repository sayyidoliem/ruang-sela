import type { HTMLAttributes, ReactNode } from "react";

interface DashboardCardProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode;
}

export default function DashboardCard({
  children,
  className = "",
  ...props
}: DashboardCardProps) {
  return (
    <article
      {...props}
      className={`rounded-2xl border border-slate-100 bg-white p-6 shadow-sm ${className}`.trim()}
    >
      {children}
    </article>
  );
}
