"use client";

import { useState } from "react";
import {
  ADMIN_KPIS,
  ADMIN_TASKS,
  BOOKING_CATEGORIES,
  POPULAR_VENUES,
  REVENUE_SERIES,
} from "../data/dashboard";
import BookingCategoryPanel from "./dashboard/BookingCategoryPanel";
import DashboardToolbar from "./dashboard/DashboardToolbar";
import GrowthChart, { type ChartMode } from "./dashboard/GrowthChart";
import KpiGrid from "./dashboard/KpiGrid";
import PopularVenuesPanel from "./dashboard/PopularVenuesPanel";
import StatusPanels from "./dashboard/StatusPanels";
import TaskPanel from "./dashboard/TaskPanel";

const periods = [
  "7 Hari Terakhir",
  "30 Hari Terakhir",
  "90 Hari Terakhir",
  "Tahun Ini",
] as const;

export default function AdminDashboardPage() {
  const [period, setPeriod] = useState("30 Hari Terakhir");
  const [chartMode, setChartMode] = useState<ChartMode>("revenue");

  const downloadReport = () => {
    const rows = [
      ["Metrik", "Nilai", "Tren"],
      ...ADMIN_KPIS.map((item) => [item.label, item.value, item.trend]),
    ];
    const csv = rows
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");
    const url = URL.createObjectURL(
      new Blob([csv], { type: "text/csv;charset=utf-8" }),
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = "ruangsela-admin-report.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main className="space-y-6 p-4 sm:p-8">
      <header>
        <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500">
          Pantau kesehatan platform, transaksi, venue, dan pengguna.
        </p>
      </header>
      <DashboardToolbar
        period={period}
        periods={periods}
        onPeriodChange={setPeriod}
        onDownload={downloadReport}
      />
      <KpiGrid items={ADMIN_KPIS} />
      <section className="grid gap-6 xl:grid-cols-3">
        <GrowthChart
          mode={chartMode}
          series={REVENUE_SERIES}
          onModeChange={setChartMode}
        />
        <TaskPanel tasks={ADMIN_TASKS} />
      </section>
      <section className="grid gap-6 xl:grid-cols-3">
        <BookingCategoryPanel items={BOOKING_CATEGORIES} />
        <PopularVenuesPanel venues={POPULAR_VENUES} />
      </section>
      <StatusPanels />
    </main>
  );
}
