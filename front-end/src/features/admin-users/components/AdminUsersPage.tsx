"use client";

import { useMemo, useState } from "react";
import { Users } from "lucide-react";
import { INITIAL_ADMIN_USERS } from "../data/users";
import type { AdminUserRole, AdminUserStatus } from "../types/admin-user";
import UserFilters from "./users/UserFilters";
import UserReviewPanel from "./users/UserReviewPanel";
import UserSummaryCards from "./users/UserSummaryCards";
import UsersTable from "./users/UsersTable";
import { USER_STATUS } from "./users/status";

const PAGE_SIZE = 5;

export default function AdminUsersPage() {
  const [users, setUsers] = useState(INITIAL_ADMIN_USERS);
  const [query, setQuery] = useState("");
  const [role, setRole] = useState<"all" | AdminUserRole>("all");
  const [status, setStatus] = useState<"all" | AdminUserStatus>("all");
  const [selectedId, setSelectedId] = useState<string | null>("user-1");
  const [page, setPage] = useState(1);

  const filtered = useMemo(
    () =>
      users.filter((user) => {
        const searchableText =
          `${user.fullName} ${user.email} ${user.phone}`.toLocaleLowerCase(
            "id-ID",
          );

        return (
          searchableText.includes(query.trim().toLocaleLowerCase("id-ID")) &&
          (role === "all" || user.role === role) &&
          (status === "all" || user.status === status)
        );
      }),
    [users, query, role, status],
  );

  const selected = users.find((user) => user.id === selectedId) ?? null;
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const rows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const countByStatus = (value: AdminUserStatus) =>
    users.filter((user) => user.status === value).length;

  const updateStatus = (id: string, nextStatus: AdminUserStatus) => {
    setUsers((currentUsers) =>
      currentUsers.map((user) =>
        user.id === id
          ? {
              ...user,
              status: nextStatus,
              emailVerified:
                nextStatus === "active" ? true : user.emailVerified,
            }
          : user,
      ),
    );
  };

  const resetFilters = () => {
    setQuery("");
    setRole("all");
    setStatus("all");
    setPage(1);
  };

  const exportCsv = () => {
    const data = [
      ["Nama", "Email", "Role", "Status", "Tanggal Bergabung"],
      ...filtered.map((user) => [
        user.fullName,
        user.email,
        user.role,
        USER_STATUS[user.status].label,
        user.joinedAt,
      ]),
    ];

    const csv = data
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");
    const url = URL.createObjectURL(
      new Blob([csv], { type: "text/csv;charset=utf-8" }),
    );
    const anchor = document.createElement("a");

    anchor.href = url;
    anchor.download = "ruangsela-users.csv";
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main className="space-y-6 p-4 sm:p-8">
      <header>
        <h1 className="text-2xl font-bold text-slate-900">Kelola Pengguna</h1>
        <p className="mt-1 text-sm text-slate-500">
          Kelola akses, role, status, dan verifikasi identitas pengguna.
        </p>
      </header>

      <UserSummaryCards total={users.length} count={countByStatus} />

      <UserFilters
        query={query}
        role={role}
        status={status}
        onQueryChange={(value) => {
          setQuery(value);
          setPage(1);
        }}
        onRoleChange={(value) => {
          setRole(value);
          setPage(1);
        }}
        onStatusChange={(value) => {
          setStatus(value);
          setPage(1);
        }}
        onReset={resetFilters}
        onExport={exportCsv}
      />

      <section className="grid items-start gap-6 xl:grid-cols-12">
        <UsersTable
          rows={rows}
          filteredCount={filtered.length}
          pendingCount={countByStatus("pending")}
          page={page}
          pageSize={PAGE_SIZE}
          totalPages={totalPages}
          selectedId={selectedId}
          onSelect={setSelectedId}
          onPageChange={setPage}
        />

        {selected ? (
          <UserReviewPanel
            user={selected}
            onClose={() => setSelectedId(null)}
            onVerify={() => updateStatus(selected.id, "active")}
            onReject={() => updateStatus(selected.id, "suspended")}
          />
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center xl:col-span-5">
            <Users className="mx-auto h-10 w-10 text-slate-300" />
            <p className="mt-3 text-sm text-slate-500">
              Pilih pengguna untuk membuka detail.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}
