import type { ManagedPlaceForm } from "../../types/manager-place";
import { PLACE_CATEGORIES } from "../../data/managed-place";
export default function BasicInfoSection({
  form,
  onUpdate,
}: {
  form: ManagedPlaceForm;
  onUpdate: <K extends keyof ManagedPlaceForm>(
    key: K,
    value: ManagedPlaceForm[K],
  ) => void;
}) {
  const c = "w-full rounded-lg border border-violet-200 px-3 py-2 text-sm";
  return (
    <section className="rounded-xl border bg-white p-6 shadow-sm">
      <h2 className="mb-4 font-bold">Informasi Dasar</h2>
      <div className="space-y-4">
        <label className="block text-xs">
          Nama Tempat
          <input
            required
            value={form.name}
            onChange={(e) => onUpdate("name", e.target.value)}
            className={`mt-1.5 ${c}`}
          />
        </label>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="block text-xs">
            Kategori
            <select
              value={form.category}
              onChange={(e) => onUpdate("category", e.target.value)}
              className={`mt-1.5 ${c}`}
            >
              {PLACE_CATEGORIES.map((v) => (
                <option key={v}>{v}</option>
              ))}
            </select>
          </label>
          <label className="block text-xs">
            Kapasitas
            <input
              type="number"
              min="1"
              value={form.capacity}
              onChange={(e) => onUpdate("capacity", Number(e.target.value))}
              className={`mt-1.5 ${c}`}
            />
          </label>
        </div>
        <label className="block text-xs">
          Deskripsi
          <textarea
            rows={4}
            value={form.description}
            onChange={(e) => onUpdate("description", e.target.value)}
            className={`mt-1.5 ${c}`}
          />
        </label>
        <label className="block text-xs">
          Alamat
          <input
            value={form.address}
            onChange={(e) => onUpdate("address", e.target.value)}
            className={`mt-1.5 ${c}`}
          />
        </label>
      </div>
    </section>
  );
}
