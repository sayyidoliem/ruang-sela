"use client";
import { useState } from "react";
import {
  MANAGER_METRICS,
  PENDING_BOOKINGS,
  TODAY_SCHEDULE,
  VISITOR_DATA,
} from "../data/dashboard";
import DashboardSidebar from "./dashboard/DashboardSidebar";
import MetricCards from "./dashboard/MetricCards";
import RevenuePanel from "./dashboard/RevenuePanel";
import VenueOverview from "./dashboard/VenueOverview";
import VisitorPanel from "./dashboard/VisitorPanel";
export default function ManagerDashboardPage() {
  const [period, setPeriod] = useState("30 Hari");
  return (
    <main className="px-4 pb-12 sm:px-8">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">
          Dashboard Pengelola
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Pantau performa tempat dan tindak lanjuti pengajuan terbaru.
        </p>
      </header>
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="space-y-6">
          <MetricCards metrics={MANAGER_METRICS} />
          <RevenuePanel period={period} onPeriodChange={setPeriod} />
          <VisitorPanel items={VISITOR_DATA} />
          <VenueOverview />
        </div>
        <DashboardSidebar
          bookings={PENDING_BOOKINGS}
          schedule={TODAY_SCHEDULE}
        />
      </div>
    </main>
  );
}
