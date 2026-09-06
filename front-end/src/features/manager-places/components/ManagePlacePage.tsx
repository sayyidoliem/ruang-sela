"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Check,
  ChevronDown,
  Plus,
  RefreshCw,
  Trash2,
  Upload,
  Users,
  X,
} from "lucide-react";
import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import {
  INITIAL_MANAGED_PLACE,
  INITIAL_PLACE_MEDIA,
  PLACE_CATEGORIES,
} from "../data/managed-place";
import type {
  ManagedPlaceForm,
  OperatingHour,
  PlaceMedia,
} from "../types/manager-place";

const WEEKDAYS = [
  "Senin",
  "Selasa",
  "Rabu",
  "Kamis",
  "Jumat",
  "Sabtu",
  "Minggu",
];

export default function ManagePlacePage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState<ManagedPlaceForm>(INITIAL_MANAGED_PLACE);
  const [media, setMedia] = useState<PlaceMedia[]>(INITIAL_PLACE_MEDIA);
  const [saved, setSaved] = useState(false);
  const [synchronizing, setSynchronizing] = useState(false);
  const [newFacility, setNewFacility] = useState("");
  const [showFacilityInput, setShowFacilityInput] = useState(false);

  useEffect(() => {
    return () => {
      media
        .filter((item) => item.src.startsWith("blob:"))
        .forEach((item) => URL.revokeObjectURL(item.src));
    };
  }, [media]);

  const update = <K extends keyof ManagedPlaceForm>(
    key: K,
    value: ManagedPlaceForm[K],
  ) => {
    setForm((current) => ({ ...current, [key]: value }));
    setSaved(false);
  };

  const handleMediaUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    if (files.length === 0) return;
    const additions = files.map((file, index) => ({
      id: `${file.name}-${Date.now()}-${index}`,
      src: URL.createObjectURL(file),
      alt: file.name,
    }));
    setMedia((current) => [...current, ...additions]);
    event.target.value = "";
  };

  const removeMedia = (id: string) => {
    setMedia((current) => {
      const target = current.find((item) => item.id === id);
      if (target?.src.startsWith("blob:")) URL.revokeObjectURL(target.src);
      return current.filter((item) => item.id !== id);
    });
  };

  const addFacility = () => {
    const facility = newFacility.trim();
    if (!facility || form.facilities.includes(facility)) return;
    update("facilities", [...form.facilities, facility]);
    setNewFacility("");
    setShowFacilityInput(false);
  };

  const updateHour = (id: string, key: "open" | "close", value: string) => {
    update(
      "operatingHours",
      form.operatingHours.map((hour) =>
        hour.id === id ? { ...hour, [key]: value } : hour,
      ),
    );
  };

  const addOperatingHour = () => {
    const existing = new Set(form.operatingHours.map((hour) => hour.day));
    const day = WEEKDAYS.find((item) => !existing.has(item));
    if (!day) return;
    const hour: OperatingHour = {
      id: `${day.toLowerCase()}-${Date.now()}`,
      day,
      open: "08:00",
      close: "20:00",
    };
    update("operatingHours", [...form.operatingHours, hour]);
  };

  const handleSynchronize = () => {
    setSynchronizing(true);
    window.setTimeout(() => setSynchronizing(false), 1200);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2200);
  };

  const inputClass =
    "w-full rounded-lg border border-violet-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-violet-600 focus:ring-2 focus:ring-violet-600/15";

  return (
    <form onSubmit={handleSubmit} className="pb-24">
      <main className="mx-auto w-full max-w-7xl p-4 sm:p-8">
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">Kelola Tempat</h1>
          <p className="mt-1 text-sm text-slate-500">
            Perbarui informasi, harga, fasilitas, media, dan jadwal operasional
            tempat.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="space-y-6 lg:col-span-8">
            <section className="rounded-xl border border-slate-200/90 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <h2 className="font-bold text-slate-800">Informasi Dasar</h2>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500 px-3 py-1 text-xs font-semibold text-white">
                  <Check className="h-3.5 w-3.5" />
                  Terverifikasi
                </span>
              </div>
              <div className="mt-5 space-y-4">
                <div>
                  <label
                    htmlFor="placeName"
                    className="mb-1.5 block text-xs font-medium text-slate-600"
                  >
                    Nama Tempat
                  </label>
                  <input
                    id="placeName"
                    required
                    value={form.name}
                    onChange={(event) => update("name", event.target.value)}
                    className={inputClass}
                  />
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label
                      htmlFor="category"
                      className="mb-1.5 block text-xs font-medium text-slate-600"
                    >
                      Kategori
                    </label>
                    <div className="relative">
                      <select
                        id="category"
                        value={form.category}
                        onChange={(event) =>
                          update("category", event.target.value)
                        }
                        className={`${inputClass} appearance-none pr-10`}
                      >
                        {PLACE_CATEGORIES.map((category) => (
                          <option key={category}>{category}</option>
                        ))}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-violet-600" />
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="capacity"
                      className="mb-1.5 block text-xs font-medium text-slate-600"
                    >
                      Kapasitas Maksimal
                    </label>
                    <div className="relative">
                      <Users className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-violet-600" />
                      <input
                        id="capacity"
                        required
                        min="1"
                        type="number"
                        value={form.capacity}
                        onChange={(event) =>
                          update("capacity", Number(event.target.value))
                        }
                        className={`${inputClass} pl-9`}
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="description"
                    className="mb-1.5 block text-xs font-medium text-slate-600"
                  >
                    Deskripsi
                  </label>
                  <textarea
                    id="description"
                    required
                    rows={4}
                    value={form.description}
                    onChange={(event) =>
                      update("description", event.target.value)
                    }
                    className={`${inputClass} leading-relaxed`}
                  />
                </div>
                <div>
                  <label
                    htmlFor="address"
                    className="mb-1.5 block text-xs font-medium text-slate-600"
                  >
                    Alamat Lengkap
                  </label>
                  <input
                    id="address"
                    required
                    value={form.address}
                    onChange={(event) => update("address", event.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>
            </section>

            <section className="rounded-xl border border-slate-200/90 bg-white p-6 shadow-sm">
              <h2 className="mb-4 font-bold text-slate-800">Foto & Media</h2>
              <div className="grid gap-3 md:grid-cols-12">
                {media[0] && (
                  <div className="group relative h-56 overflow-hidden rounded-xl md:col-span-8">
                    <Image
                      src={media[0].src}
                      alt={media[0].alt}
                      fill
                      sizes="(max-width:768px) 100vw,55vw"
                      className="object-cover"
                      unoptimized={media[0].src.startsWith("blob:")}
                    />
                    <span className="absolute left-2 top-2 rounded bg-black/70 px-2.5 py-1 text-[11px] text-white">
                      Foto Utama
                    </span>
                  </div>
                )}
                <div className="grid h-56 grid-cols-2 gap-3 md:col-span-4 md:grid-cols-1">
                  {media.slice(1, 3).map((item) => (
                    <div
                      key={item.id}
                      className="group relative overflow-hidden rounded-xl"
                    >
                      <Image
                        src={item.src}
                        alt={item.alt}
                        fill
                        sizes="(max-width:768px) 50vw,28vw"
                        className="object-cover"
                        unoptimized={item.src.startsWith("blob:")}
                      />
                      <button
                        type="button"
                        onClick={() => removeMedia(item.id)}
                        aria-label={`Hapus ${item.alt}`}
                        className="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-full bg-black/60 text-white opacity-0 transition group-hover:opacity-100"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              {media.length > 3 && (
                <div className="mt-3 grid grid-cols-3 gap-3 sm:grid-cols-5">
                  {media.slice(3).map((item) => (
                    <div
                      key={item.id}
                      className="group relative aspect-square overflow-hidden rounded-lg"
                    >
                      <Image
                        src={item.src}
                        alt={item.alt}
                        fill
                        sizes="120px"
                        className="object-cover"
                        unoptimized
                      />
                      <button
                        type="button"
                        onClick={() => removeMedia(item.id)}
                        className="absolute right-1.5 top-1.5 grid h-6 w-6 place-items-center rounded-full bg-black/60 text-white"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                multiple
                onChange={handleMediaUpload}
                className="sr-only"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-purple-300 bg-purple-50/20 p-3 text-xs font-semibold text-purple-700 transition hover:bg-purple-50"
              >
                <Upload className="h-4 w-4" />
                Unggah Foto
              </button>
            </section>

            <section className="rounded-xl border border-slate-200/90 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-bold text-slate-800">Ketersediaan</h2>
                <button
                  type="button"
                  onClick={handleSynchronize}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-900"
                >
                  <RefreshCw
                    className={`h-3.5 w-3.5 ${synchronizing ? "animate-spin" : ""}`}
                  />
                  {synchronizing ? "Menyinkronkan..." : "Sinkronisasi"}
                </button>
              </div>
              <div className="overflow-hidden rounded-lg border border-slate-200 text-xs">
                <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50/70 py-2 text-center font-medium text-slate-500">
                  {["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"].map(
                    (day) => (
                      <span key={day}>{day}</span>
                    ),
                  )}
                </div>
                <div className="grid h-28 grid-cols-7 divide-x divide-slate-100 text-slate-700">
                  {[null, null, 1, 2, 3, 4, 5].map((day, index) => (
                    <div
                      key={index}
                      className="flex flex-col justify-between p-1.5"
                    >
                      <span className="text-right font-medium">{day}</span>
                      {day === 4 && (
                        <span className="rounded bg-indigo-100 px-1 py-1 text-center text-[10px] font-semibold text-indigo-700">
                          Terbooking
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>

          <div className="space-y-6 lg:col-span-4">
            <section className="rounded-xl border border-slate-200/90 bg-white p-6 shadow-sm">
              <h2 className="mb-4 font-bold text-slate-800">
                Harga & Ketentuan
              </h2>
              <div className="space-y-4">
                {[
                  {
                    key: "sessionPrice" as const,
                    label: "Harga Per Sesi (4 Jam)",
                  },
                  {
                    key: "additionalHourlyPrice" as const,
                    label: "Harga Per Jam (Tambahan)",
                  },
                  {
                    key: "securityDeposit" as const,
                    label: "Deposit Keamanan",
                  },
                ].map((item) => (
                  <div key={item.key}>
                    <label
                      htmlFor={item.key}
                      className="mb-1.5 block text-xs font-medium text-slate-600"
                    >
                      {item.label}
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-500">
                        Rp
                      </span>
                      <input
                        id={item.key}
                        inputMode="numeric"
                        value={form[item.key]}
                        onChange={(event) =>
                          update(
                            item.key,
                            event.target.value.replace(/[^0-9.]/g, ""),
                          )
                        }
                        className={`${inputClass} pl-9`}
                      />
                    </div>
                    {item.key === "securityDeposit" && (
                      <p className="mt-1.5 text-[10px] text-slate-400">
                        Dikembalikan setelah penggunaan selesai.
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-xl border border-slate-200/90 bg-white p-6 shadow-sm">
              <h2 className="mb-4 font-bold text-slate-800">
                Fasilitas Tersedia
              </h2>
              <div className="grid grid-cols-2 gap-2">
                {form.facilities.map((facility) => (
                  <button
                    key={facility}
                    type="button"
                    onClick={() =>
                      update(
                        "facilities",
                        form.facilities.filter((item) => item !== facility),
                      )
                    }
                    title="Klik untuk menghapus"
                    className="rounded border border-purple-200 bg-purple-50 px-3 py-1.5 text-xs font-medium text-purple-700 hover:bg-rose-50 hover:text-rose-600"
                  >
                    {facility}
                  </button>
                ))}
              </div>
              {showFacilityInput ? (
                <div className="mt-4 flex gap-2">
                  <input
                    autoFocus
                    value={newFacility}
                    onChange={(event) => setNewFacility(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        event.preventDefault();
                        addFacility();
                      }
                    }}
                    placeholder="Nama fasilitas"
                    className={inputClass}
                  />
                  <button
                    type="button"
                    onClick={addFacility}
                    className="rounded-lg bg-blue-600 px-3 text-white"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowFacilityInput(true)}
                  className="mt-4 w-full rounded-lg bg-blue-50/70 px-3 py-2 text-xs font-semibold text-blue-600 hover:bg-blue-100/70"
                >
                  Tambah Fasilitas
                </button>
              )}
            </section>

            <section className="rounded-xl border border-slate-200/90 bg-white p-6 shadow-sm">
              <h2 className="mb-4 font-bold text-slate-800">Jam Operasional</h2>
              <div className="space-y-3">
                {form.operatingHours.map((hour) => (
                  <div key={hour.id}>
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-xs font-medium text-slate-700">
                        {hour.day}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          update(
                            "operatingHours",
                            form.operatingHours.filter(
                              (item) => item.id !== hour.id,
                            ),
                          )
                        }
                        aria-label={`Hapus jam ${hour.day}`}
                        className="text-slate-300 hover:text-rose-500"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="time"
                        value={hour.open}
                        onChange={(event) =>
                          updateHour(hour.id, "open", event.target.value)
                        }
                        className={`${inputClass} px-2 text-center text-xs font-medium text-purple-700`}
                      />
                      <span className="text-xs text-slate-400">-</span>
                      <input
                        type="time"
                        value={hour.close}
                        onChange={(event) =>
                          updateHour(hour.id, "close", event.target.value)
                        }
                        className={`${inputClass} px-2 text-center text-xs font-medium text-purple-700`}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={addOperatingHour}
                disabled={form.operatingHours.length >= 7}
                className="mt-4 w-full rounded-lg bg-blue-50/70 px-3 py-2 text-xs font-semibold text-blue-600 hover:bg-blue-100/70 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Tambah Jam Operasional
              </button>
            </section>
          </div>
        </div>
      </main>

      <footer className="fixed bottom-0 left-0 right-0 z-30 flex items-center justify-end gap-3 border-t border-slate-200 bg-white/95 px-4 py-3.5 shadow-lg backdrop-blur-sm lg:left-64 sm:px-8">
        {saved && (
          <span
            role="status"
            className="mr-auto text-xs font-semibold text-emerald-600"
          >
            Perubahan berhasil disimpan.
          </span>
        )}
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-md border border-slate-300 px-5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
        >
          Batal
        </button>
        <button
          type="submit"
          className="rounded-md bg-blue-600 px-5 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
        >
          Simpan Perubahan
        </button>
      </footer>
    </form>
  );
}
