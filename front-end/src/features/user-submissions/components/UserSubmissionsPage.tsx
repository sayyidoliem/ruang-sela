"use client";
import { useMemo, useState } from "react";
import { INITIAL_USER_SUBMISSIONS } from "../data/submissions";
import type { SubmissionStatus } from "../types/user-submission";
import SubmissionCard from "./submissions/SubmissionCard";
import SubmissionDetail from "./submissions/SubmissionDetail";
import SubmissionFilters from "./submissions/SubmissionFilters";
export default function UserSubmissionsPage() {
  const [items, setItems] = useState(INITIAL_USER_SUBMISSIONS);
  const [filter, setFilter] = useState<"all" | SubmissionStatus>("all");
  const [query, setQuery] = useState("");
  const [period, setPeriod] = useState("all");
  const [selectedId, setSelectedId] = useState<string | null>("submission-1");
  const [visible, setVisible] = useState(5);
  const selected = items.find((i) => i.id === selectedId) ?? null;
  const filtered = useMemo(
    () =>
      items.filter(
        (i) =>
          (filter === "all" || i.status === filter) &&
          (period === "all" || i.period === period) &&
          `${i.venueName} ${i.code} ${i.location}`
            .toLowerCase()
            .includes(query.trim().toLowerCase()),
      ),
    [items, filter, period, query],
  );
  const count = (s: "all" | SubmissionStatus) =>
    s === "all" ? items.length : items.filter((i) => i.status === s).length;
  const cancel = (id: string) =>
    setItems((c) =>
      c.map((i) =>
        i.id === id
          ? { ...i, status: "cancelled", paymentStatus: "Proses pengembalian" }
          : i,
      ),
    );
  return (
    <main className="mx-auto max-w-7xl space-y-8 px-4 py-8">
      <header>
        <h1 className="text-4xl font-extrabold">Pengajuan Saya</h1>
        <p className="mt-1 text-slate-500">
          Pantau status persetujuan, jadwal, dan riwayat penggunaan ruang publik
          kamu.
        </p>
      </header>
      <SubmissionFilters
        active={filter}
        query={query}
        period={period}
        count={count}
        onActive={(v) => {
          setFilter(v);
          setVisible(5);
        }}
        onQuery={setQuery}
        onPeriod={setPeriod}
      />
      <div className="grid items-start gap-8 lg:grid-cols-12">
        <section className="space-y-4 lg:col-span-7">
          {filtered.slice(0, visible).map((item) => (
            <SubmissionCard
              key={item.id}
              item={item}
              selected={selectedId === item.id}
              onSelect={() => setSelectedId(item.id)}
              onCancel={() => cancel(item.id)}
            />
          ))}
          {visible < filtered.length && (
            <button
              onClick={() => setVisible((v) => v + 5)}
              className="w-full rounded-xl border py-3"
            >
              Muat Lebih Banyak
            </button>
          )}
        </section>
        <section className="lg:col-span-5">
          {selected ? (
            <SubmissionDetail
              item={selected}
              onCancel={() => cancel(selected.id)}
            />
          ) : (
            <div className="rounded-2xl border p-10 text-center">
              Pilih pengajuan.
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
