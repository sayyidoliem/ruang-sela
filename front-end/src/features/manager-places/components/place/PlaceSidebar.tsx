import { Plus, X } from "lucide-react";
import type {
  ManagedPlaceForm,
  OperatingHour,
} from "../../types/manager-place";
export default function PlaceSidebar({
  form,
  newFacility,
  showFacilityInput,
  onUpdate,
  onNewFacility,
  onShowFacilityInput,
  onAddFacility,
  onAddHour,
  onUpdateHour,
}: {
  form: ManagedPlaceForm;
  newFacility: string;
  showFacilityInput: boolean;
  onUpdate: <K extends keyof ManagedPlaceForm>(
    key: K,
    value: ManagedPlaceForm[K],
  ) => void;
  onNewFacility: (v: string) => void;
  onShowFacilityInput: (v: boolean) => void;
  onAddFacility: () => void;
  onAddHour: () => void;
  onUpdateHour: (id: string, key: "open" | "close", value: string) => void;
}) {
  return (
    <div className="space-y-6">
      <section className="rounded-xl border bg-white p-6">
        <h2 className="mb-4 font-bold">Harga & Ketentuan</h2>
        {(
          ["sessionPrice", "additionalHourlyPrice", "securityDeposit"] as const
        ).map((key) => (
          <label key={key} className="mb-3 block text-xs">
            {key === "sessionPrice"
              ? "Harga Per Sesi"
              : key === "additionalHourlyPrice"
                ? "Harga Per Jam"
                : "Deposit Keamanan"}
            <input
              value={form[key]}
              onChange={(e) =>
                onUpdate(key, e.target.value.replace(/[^0-9.]/g, ""))
              }
              className="mt-1.5 w-full rounded-lg border px-3 py-2"
            />
          </label>
        ))}
      </section>
      <section className="rounded-xl border bg-white p-6">
        <h2 className="mb-4 font-bold">Fasilitas Tersedia</h2>
        <div className="grid grid-cols-2 gap-2">
          {form.facilities.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() =>
                onUpdate(
                  "facilities",
                  form.facilities.filter((x) => x !== f),
                )
              }
              className="rounded border bg-purple-50 px-3 py-1.5 text-xs text-purple-700"
            >
              {f}
            </button>
          ))}
        </div>
        {showFacilityInput ? (
          <div className="mt-4 flex gap-2">
            <input
              value={newFacility}
              onChange={(e) => onNewFacility(e.target.value)}
              className="w-full rounded-lg border px-3"
            />
            <button
              type="button"
              onClick={onAddFacility}
              className="rounded-lg bg-blue-600 px-3 text-white"
            >
              <Plus />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => onShowFacilityInput(true)}
            className="mt-4 w-full rounded-lg bg-blue-50 py-2 text-xs text-blue-600"
          >
            Tambah Fasilitas
          </button>
        )}
      </section>
      <section className="rounded-xl border bg-white p-6">
        <h2 className="mb-4 font-bold">Jam Operasional</h2>
        {form.operatingHours.map((h: OperatingHour) => (
          <div key={h.id} className="mb-3">
            <div className="flex justify-between text-xs">
              <span>{h.day}</span>
              <button
                type="button"
                onClick={() =>
                  onUpdate(
                    "operatingHours",
                    form.operatingHours.filter((x) => x.id !== h.id),
                  )
                }
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
            <div className="mt-1 flex gap-2">
              <input
                type="time"
                value={h.open}
                onChange={(e) => onUpdateHour(h.id, "open", e.target.value)}
                className="w-full rounded border p-2"
              />
              <input
                type="time"
                value={h.close}
                onChange={(e) => onUpdateHour(h.id, "close", e.target.value)}
                className="w-full rounded border p-2"
              />
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={onAddHour}
          disabled={form.operatingHours.length >= 7}
          className="w-full rounded-lg bg-blue-50 py-2 text-xs text-blue-600 disabled:opacity-50"
        >
          Tambah Jam Operasional
        </button>
      </section>
    </div>
  );
}
