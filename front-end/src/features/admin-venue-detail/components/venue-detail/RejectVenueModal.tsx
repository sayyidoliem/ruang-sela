import { X } from "lucide-react";
interface Props {
  reason: string;
  onReasonChange: (value: string) => void;
  onClose: () => void;
  onSubmit: () => void;
}
export default function RejectVenueModal(p: Props) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="reject-dialog-title"
      className="fixed inset-0 z-50 grid place-items-center bg-slate-950/50 p-4"
      onMouseDown={(e) => {
        if (e.currentTarget === e.target) p.onClose();
      }}
    >
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <div className="flex justify-between">
          <div>
            <h2 id="reject-dialog-title" className="font-bold">
              Tolak Pengajuan Venue
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Alasan akan dikirim kepada pengelola.
            </p>
          </div>
          <button onClick={p.onClose} aria-label="Tutup">
            <X />
          </button>
        </div>
        <label className="mt-5 block text-xs font-semibold">
          Alasan Penolakan
          <textarea
            value={p.reason}
            onChange={(e) => p.onReasonChange(e.target.value)}
            rows={4}
            className="mt-2 w-full resize-none rounded-xl border p-3 text-sm"
            placeholder="Jelaskan informasi yang perlu diperbaiki..."
          />
        </label>
        <div className="mt-5 flex justify-end gap-3">
          <button
            onClick={p.onClose}
            className="rounded-lg border px-4 py-2 text-xs font-semibold"
          >
            Batal
          </button>
          <button
            disabled={!p.reason.trim()}
            onClick={p.onSubmit}
            className="rounded-lg bg-rose-600 px-4 py-2 text-xs font-semibold text-white disabled:opacity-50"
          >
            Tolak Pengajuan
          </button>
        </div>
      </div>
    </div>
  );
}
