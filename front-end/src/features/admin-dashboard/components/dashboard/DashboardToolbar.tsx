import { ChevronDown, Download } from "lucide-react";

interface DashboardToolbarProps {
  period: string;
  periods: readonly string[];
  onPeriodChange: (period: string) => void;
  onDownload: () => void;
}

export default function DashboardToolbar({
  period,
  periods,
  onPeriodChange,
  onDownload,
}: DashboardToolbarProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <label className="relative">
        <span className="sr-only">Periode laporan</span>
        <select
          value={period}
          onChange={(event) => onPeriodChange(event.target.value)}
          className="appearance-none rounded-lg border border-slate-200 bg-white py-2 pl-4 pr-10 text-xs font-semibold text-slate-700 shadow-sm outline-none"
        >
          {periods.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      </label>
      <button
        type="button"
        onClick={onDownload}
        className="inline-flex items-center gap-2 rounded-lg bg-[#6941C6] px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#5b37ae]"
      >
        <Download className="h-4 w-4" /> Unduh Laporan
      </button>
    </div>
  );
}
