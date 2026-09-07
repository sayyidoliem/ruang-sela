import type { UserSubmission } from "../../types/user-submission";
import { SUBMISSION_STATUS, rupiah } from "./config";
export default function SubmissionDetail({
  item,
  onCancel,
}: {
  item: UserSubmission;
  onCancel: () => void;
}) {
  const s = SUBMISSION_STATUS[item.status];
  return (
    <article className="sticky top-28 rounded-2xl border bg-white p-5 shadow-sm">
      <div className="flex justify-between">
        <h2 className="text-lg font-bold">{item.venueName}</h2>
        <span className={`rounded-lg border px-2.5 py-1 text-xs ${s.badge}`}>
          {s.label}
        </span>
      </div>
      <div className="mt-5 grid grid-cols-2 gap-3 rounded-xl bg-slate-50 p-3 text-xs">
        <div>
          Nomor
          <br />
          <b>#{item.code}</b>
        </div>
        <div>
          Jadwal
          <br />
          <b>{item.date}</b>
        </div>
        <div>
          Waktu
          <br />
          <b>{item.time}</b>
        </div>
        <div>
          Kapasitas
          <br />
          <b>{item.participants} Orang</b>
        </div>
      </div>
      <h3 className="mt-6 text-xs font-bold text-slate-400">
        PROGRES & TAHAPAN
      </h3>
      <div className="mt-3 space-y-4">
        {item.timeline.map((step) => (
          <div key={step.id}>
            <b className="text-xs">
              {step.completed ? "✓ " : step.active ? "… " : "○ "}
              {step.title}
            </b>
            <p className="text-[11px] text-slate-500">{step.description}</p>
          </div>
        ))}
      </div>
      <div className="mt-6 flex justify-between border-t pt-4">
        <b>Total</b>
        <b className="text-violet-600">{rupiah(item.total)}</b>
      </div>
      {item.status === "pending" && (
        <button
          onClick={onCancel}
          className="mt-4 w-full rounded-xl border py-2.5 text-xs text-rose-600"
        >
          Batalkan Pengajuan Ini
        </button>
      )}
    </article>
  );
}
