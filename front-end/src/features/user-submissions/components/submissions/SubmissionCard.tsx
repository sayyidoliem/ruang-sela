import Image from "next/image";
import { MapPin } from "lucide-react";
import type { UserSubmission } from "../../types/user-submission";
import { SUBMISSION_STATUS, rupiah } from "./config";
export default function SubmissionCard({
  item,
  selected,
  onSelect,
  onCancel,
}: {
  item: UserSubmission;
  selected: boolean;
  onSelect: () => void;
  onCancel: () => void;
}) {
  const s = SUBMISSION_STATUS[item.status];
  return (
    <article
      onClick={onSelect}
      className={`cursor-pointer rounded-2xl bg-white p-5 shadow-sm ${selected ? "border-2 border-violet-500" : "border"}`}
    >
      <div className="flex gap-4">
        <span className="relative h-32 w-36 shrink-0 overflow-hidden rounded-xl">
          <Image
            src={item.imageSrc}
            alt={item.venueName}
            fill
            sizes="144px"
            className="object-cover"
          />
        </span>
        <div className="flex-1">
          <div className="flex justify-between">
            <div>
              <h2 className="font-bold">{item.venueName}</h2>
              <p className="flex items-center gap-1 text-xs text-slate-500">
                <MapPin className="h-3.5 w-3.5" />
                {item.location}
              </p>
            </div>
            <span
              className={`rounded-lg border px-2.5 py-1 text-xs ${s.badge}`}
            >
              {s.label}
            </span>
          </div>
          <p className="mt-3 text-xs">
            {item.date} • {item.time} • {item.participants} peserta
          </p>
          <div className="mt-4 flex justify-between border-t pt-4">
            <b>{rupiah(item.total)}</b>
            <div className="flex gap-2">
              {item.status === "pending" && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onCancel();
                  }}
                  className="text-xs text-rose-600"
                >
                  Batalkan
                </button>
              )}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect();
                }}
                className="rounded-lg bg-violet-600 px-4 py-1.5 text-xs text-white"
              >
                Detail
              </button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
