"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { INITIAL_ADMIN_VENUES } from "../data/venues";
import type { VenueVerificationStatus } from "../types/admin-venue";
import VenueFilters from "./venues/VenueFilters";
import VenueSummaryCards from "./venues/VenueSummaryCards";
import VenuesTable from "./venues/VenuesTable";

const PAGE_SIZE = 5;

export default function AdminVenuesPage() {
  const router = useRouter();
  const [venues] = useState(INITIAL_ADMIN_VENUES);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Semua Kategori");
  const [status, setStatus] = useState<"all" | VenueVerificationStatus>("all");
  const [page, setPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);

  const categories = useMemo(
    () => [...new Set(venues.map((venue) => venue.category))],
    [venues],
  );
  const filtered = useMemo(
    () =>
      venues.filter((venue) => {
        const text =
          `${venue.name} ${venue.managerName} ${venue.city}`.toLocaleLowerCase(
            "id-ID",
          );
        return (
          text.includes(query.trim().toLocaleLowerCase("id-ID")) &&
          (category === "Semua Kategori" || venue.category === category) &&
          (status === "all" || venue.status === status)
        );
      }),
    [venues, query, category, status],
  );
  const count = (value: VenueVerificationStatus) =>
    venues.filter((venue) => venue.status === value).length;
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const rows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const refresh = () => {
    setRefreshing(true);
    window.setTimeout(() => setRefreshing(false), 900);
  };

  return (
    <main className="space-y-6 p-4 sm:p-8">
      <header>
        <h1 className="text-2xl font-bold text-slate-900">Verifikasi Tempat</h1>
        <p className="mt-1 text-sm text-slate-500">
          Tinjau dokumen dan kelayakan tempat sebelum ditampilkan pada platform.
        </p>
      </header>
      <VenueSummaryCards total={venues.length} count={count} />
      <VenueFilters
        query={query}
        category={category}
        status={status}
        categories={categories}
        refreshing={refreshing}
        onQuery={(value) => {
          setQuery(value);
          setPage(1);
        }}
        onCategory={(value) => {
          setCategory(value);
          setPage(1);
        }}
        onStatus={(value) => {
          setStatus(value);
          setPage(1);
        }}
        onRefresh={refresh}
      />
      <VenuesTable
        rows={rows}
        filteredCount={filtered.length}
        page={page}
        pageSize={PAGE_SIZE}
        totalPages={totalPages}
        onPageChange={setPage}
        onOpenDetail={(id) => router.push(`/admin/tempat/${id}`)}
      />
    </main>
  );
}
