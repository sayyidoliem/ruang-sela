import { Ban, FolderArchive, Hourglass, ShieldCheck } from "lucide-react";
import type { VenueVerificationStatus } from "../../types/admin-venue";
export default function VenueSummaryCards({
  total,
  count,
}: {
  total: number;
  count: (status: VenueVerificationStatus) => number;
}) {
  const items = [
    [
      "Total Pengajuan",
      total,
      FolderArchive,
      "border-slate-200",
      "bg-slate-50 text-slate-600",
      "+12% bulan ini",
    ],
    [
      "Menunggu Verifikasi",
      count("pending"),
      Hourglass,
      "border-amber-400",
      "bg-amber-50 text-amber-600",
      "Butuh tinjauan segera",
    ],
    [
      "Terverifikasi",
      count("verified"),
      ShieldCheck,
      "border-emerald-400",
      "bg-emerald-50 text-emerald-600",
      "Disetujui",
    ],
    [
      "Ditolak",
      count("rejected"),
      Ban,
      "border-red-200",
      "bg-red-50 text-red-500",
      "Tidak memenuhi syarat",
    ],
  ] as const;
  return (
    <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
      {items.map(([label, value, Icon, border, tone, note]) => (
        <article
          key={label}
          className={`flex h-36 flex-col justify-between rounded-2xl border-2 bg-white p-5 shadow-sm ${border}`}
        >
          <div className="flex justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500">{label}</p>
              <strong className="mt-1 block text-3xl text-slate-800">
                {value}
              </strong>
            </div>
            <span
              className={`grid h-10 w-10 place-items-center rounded-xl ${tone}`}
            >
              <Icon className="h-5 w-5" />
            </span>
          </div>
          <p className="text-xs font-medium text-slate-500">{note}</p>
        </article>
      ))}
    </section>
  );
}
