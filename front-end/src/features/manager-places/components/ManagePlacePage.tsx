"use client";
import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import { useRouter } from "next/navigation";
import {
  INITIAL_MANAGED_PLACE,
  INITIAL_PLACE_MEDIA,
} from "../data/managed-place";
import type {
  ManagedPlaceForm,
  OperatingHour,
  PlaceMedia,
} from "../types/manager-place";
import BasicInfoSection from "./place/BasicInfoSection";
import MediaSection from "./place/MediaSection";
import PlaceSidebar from "./place/PlaceSidebar";
const days = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];
export default function ManagePlacePage() {
  const router = useRouter();
  const input = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState<ManagedPlaceForm>(INITIAL_MANAGED_PLACE);
  const [media, setMedia] = useState<PlaceMedia[]>(INITIAL_PLACE_MEDIA);
  const [saved, setSaved] = useState(false);
  const [newFacility, setNewFacility] = useState("");
  const [showFacilityInput, setShowFacilityInput] = useState(false);
  useEffect(
    () => () =>
      media
        .filter((x) => x.src.startsWith("blob:"))
        .forEach((x) => URL.revokeObjectURL(x.src)),
    [media],
  );
  const update = <K extends keyof ManagedPlaceForm>(
    key: K,
    value: ManagedPlaceForm[K],
  ) => {
    setForm((c) => ({ ...c, [key]: value }));
    setSaved(false);
  };
  const upload = (e: ChangeEvent<HTMLInputElement>) => {
    const additions = Array.from(e.target.files ?? []).map((f, i) => ({
      id: `${f.name}-${Date.now()}-${i}`,
      src: URL.createObjectURL(f),
      alt: f.name,
    }));
    setMedia((c) => [...c, ...additions]);
    e.target.value = "";
  };
  const remove = (id: string) =>
    setMedia((c) => {
      const t = c.find((x) => x.id === id);
      if (t?.src.startsWith("blob:")) URL.revokeObjectURL(t.src);
      return c.filter((x) => x.id !== id);
    });
  const addFacility = () => {
    const f = newFacility.trim();
    if (f && !form.facilities.includes(f))
      update("facilities", [...form.facilities, f]);
    setNewFacility("");
    setShowFacilityInput(false);
  };
  const updateHour = (id: string, key: "open" | "close", value: string) =>
    update(
      "operatingHours",
      form.operatingHours.map((h) =>
        h.id === id ? { ...h, [key]: value } : h,
      ),
    );
  const addHour = () => {
    const used = new Set(form.operatingHours.map((h) => h.day));
    const day = days.find((d) => !used.has(d));
    if (day) {
      const h: OperatingHour = {
        id: `${day}-${Date.now()}`,
        day,
        open: "08:00",
        close: "20:00",
      };
      update("operatingHours", [...form.operatingHours, h]);
    }
  };
  const submit = (e: FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2200);
  };
  return (
    <form onSubmit={submit} className="pb-24">
      <main className="mx-auto max-w-7xl p-4 sm:p-8">
        <header className="mb-6">
          <h1 className="text-2xl font-bold">Kelola Tempat</h1>
          <p className="text-sm text-slate-500">
            Perbarui informasi, harga, fasilitas, media, dan jadwal operasional
            tempat.
          </p>
        </header>
        <div className="grid gap-6 lg:grid-cols-12">
          <div className="space-y-6 lg:col-span-8">
            <BasicInfoSection form={form} onUpdate={update} />
            <MediaSection
              media={media}
              inputRef={input}
              onUpload={upload}
              onRemove={remove}
            />
          </div>
          <div className="lg:col-span-4">
            <PlaceSidebar
              form={form}
              newFacility={newFacility}
              showFacilityInput={showFacilityInput}
              onUpdate={update}
              onNewFacility={setNewFacility}
              onShowFacilityInput={setShowFacilityInput}
              onAddFacility={addFacility}
              onAddHour={addHour}
              onUpdateHour={updateHour}
            />
          </div>
        </div>
      </main>
      <footer className="fixed bottom-0 left-0 right-0 flex justify-end gap-3 border-t bg-white px-8 py-3.5 lg:left-64">
        {saved && (
          <span className="mr-auto text-xs text-emerald-600">
            Perubahan berhasil disimpan.
          </span>
        )}
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-md border px-5 py-2 text-xs"
        >
          Batal
        </button>
        <button
          type="submit"
          className="rounded-md bg-blue-600 px-5 py-2 text-xs text-white"
        >
          Simpan Perubahan
        </button>
      </footer>
    </form>
  );
}
