"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Bell,
  Check,
  Link2,
  LockKeyhole,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import {
  MANAGER_ACCOUNT,
  MANAGER_NOTIFICATIONS,
} from "../data/manager-account";
import type {
  ManagerAccount,
  ManagerNotifications,
  ManagerSettingsTab,
} from "../types/manager-account";
import Switch from "./Switch";

const TABS: Array<{
  id: ManagerSettingsTab;
  label: string;
  icon: typeof UserRound;
}> = [
  { id: "account", label: "Akun", icon: UserRound },
  { id: "notifications", label: "Notifikasi", icon: Bell },
  { id: "privacy", label: "Privasi & Keamanan", icon: ShieldCheck },
  { id: "linked-apps", label: "Aplikasi Tertaut", icon: Link2 },
];

export default function ManagerSettingsPage() {
  const router = useRouter();
  const fileInput = useRef<HTMLInputElement>(null);
  const [tab, setTab] = useState<ManagerSettingsTab>("account");
  const [account, setAccount] = useState<ManagerAccount>(MANAGER_ACCOUNT);
  const [notifications, setNotifications] = useState<ManagerNotifications>(
    MANAGER_NOTIFICATIONS,
  );
  const [twoFactor, setTwoFactor] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(
    () => () => {
      if (preview) URL.revokeObjectURL(preview);
    },
    [preview],
  );

  const update = <K extends keyof ManagerAccount>(
    key: K,
    value: ManagerAccount[K],
  ) => setAccount((current) => ({ ...current, [key]: value }));
  const changePicture = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (preview) URL.revokeObjectURL(preview);
    setPreview(URL.createObjectURL(file));
  };
  const save = (event: FormEvent) => {
    event.preventDefault();
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2200);
  };
  const inputClass =
    "w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm text-gray-800 outline-none transition focus:border-[#7357FB] focus:ring-2 focus:ring-[#7357FB]/15";

  return (
    <main className="px-4 pb-12 sm:px-8">
      <header className="mb-7">
        <h1 className="text-2xl font-bold text-slate-900">
          Settings Pengelola
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Kelola akun dan preferensi keamanan pengelola tempat.
        </p>
      </header>
      <div className="flex flex-col items-start gap-8 lg:flex-row lg:gap-10">
        <nav
          aria-label="Navigasi settings"
          className="grid w-full shrink-0 grid-cols-2 gap-1 sm:grid-cols-4 lg:flex lg:w-64 lg:flex-col"
        >
          {TABS.map((item) => {
            const Icon = item.icon;
            const active = tab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setTab(item.id)}
                className={`flex items-center gap-3 rounded-xl px-4 py-3.5 text-left text-sm transition ${active ? "bg-[#1C1635] font-semibold text-white shadow-sm" : "font-medium text-gray-700 hover:bg-white/80"}`}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="w-full flex-1 space-y-6">
          {tab === "account" && (
            <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm sm:p-8">
              <h2 className="mb-7 border-b border-slate-100 pb-5 text-xl font-bold text-slate-900">
                Pengaturan Akun
              </h2>
              <form onSubmit={save}>
                <div className="mb-6 flex flex-col items-start gap-8 sm:flex-row">
                  <div className="flex shrink-0 flex-col items-center gap-2.5 self-center sm:self-start">
                    <div className="relative h-24 w-24 overflow-hidden rounded-full bg-gray-100 ring-4 ring-gray-50 sm:h-28 sm:w-28">
                      <Image
                        src={preview ?? account.avatarSrc}
                        alt={account.fullName}
                        fill
                        sizes="112px"
                        className="object-cover"
                        unoptimized={Boolean(preview)}
                      />
                    </div>
                    <input
                      ref={fileInput}
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      onChange={changePicture}
                      className="sr-only"
                    />
                    <button
                      type="button"
                      onClick={() => fileInput.current?.click()}
                      className="text-xs font-semibold text-[#7357FB] hover:underline"
                    >
                      Ganti Foto
                    </button>
                  </div>
                  <div className="w-full flex-1 space-y-4">
                    <div>
                      <label
                        htmlFor="managerName"
                        className="mb-1.5 block text-xs font-semibold text-gray-700"
                      >
                        Nama Lengkap
                      </label>
                      <input
                        id="managerName"
                        required
                        value={account.fullName}
                        onChange={(event) =>
                          update("fullName", event.target.value)
                        }
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="managerEmail"
                        className="mb-1.5 block text-xs font-semibold text-gray-700"
                      >
                        Alamat Email
                      </label>
                      <div className="relative">
                        <input
                          id="managerEmail"
                          required
                          type="email"
                          value={account.email}
                          onChange={(event) =>
                            update("email", event.target.value)
                          }
                          className={`${inputClass} pr-28`}
                        />
                        {account.emailVerified && (
                          <span className="absolute right-3 top-1/2 inline-flex -translate-y-1/2 items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-600">
                            <Check className="h-3 w-3" />
                            Terverifikasi
                          </span>
                        )}
                      </div>
                    </div>
                    <div>
                      <label
                        htmlFor="managerPhone"
                        className="mb-1.5 block text-xs font-semibold text-gray-700"
                      >
                        Nomor Telepon
                      </label>
                      <input
                        id="managerPhone"
                        required
                        type="tel"
                        value={account.phone}
                        onChange={(event) =>
                          update("phone", event.target.value)
                        }
                        className={inputClass}
                      />
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-end gap-3">
                  {saved && (
                    <span className="text-xs font-semibold text-emerald-600">
                      Perubahan tersimpan.
                    </span>
                  )}
                  <button
                    type="submit"
                    className="rounded-xl bg-[#7357FB] px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#6043ea]"
                  >
                    Simpan Perubahan
                  </button>
                </div>
              </form>
            </section>
          )}

          {(tab === "account" || tab === "notifications") && (
            <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm sm:p-8">
              <h2 className="mb-6 border-b border-slate-100 pb-5 text-xl font-bold text-slate-900">
                Preferensi Notifikasi
              </h2>
              <div className="space-y-3.5">
                {[
                  {
                    key: "email" as const,
                    title: "Notifikasi Email",
                    text: "Terima pembaruan booking, laporan, dan peringatan melalui email.",
                  },
                  {
                    key: "push" as const,
                    title: "Notifikasi Push",
                    text: "Terima pemberitahuan pengajuan baru pada perangkat atau browser.",
                  },
                  {
                    key: "sms" as const,
                    title: "Pemberitahuan SMS",
                    text: "Peringatan keamanan dan booking mendesak melalui pesan teks.",
                  },
                ].map((item) => (
                  <div
                    key={item.key}
                    className="flex items-center justify-between rounded-xl border border-slate-100 p-4"
                  >
                    <div className="pr-4">
                      <h3 className="text-sm font-bold text-gray-900">
                        {item.title}
                      </h3>
                      <p className="mt-1 text-xs text-gray-500">{item.text}</p>
                    </div>
                    <Switch
                      checked={notifications[item.key]}
                      onChange={(checked) =>
                        setNotifications((current) => ({
                          ...current,
                          [item.key]: checked,
                        }))
                      }
                      label={item.title}
                    />
                  </div>
                ))}
              </div>
            </section>
          )}

          {(tab === "account" || tab === "privacy") && (
            <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm sm:p-8">
              <div className="mb-6 flex items-center gap-2 border-b border-slate-100 pb-5">
                <LockKeyhole className="h-5 w-5 text-[#7357FB]" />
                <h2 className="text-xl font-bold text-slate-900">Keamanan</h2>
              </div>
              <div className="space-y-6">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                  <div>
                    <h3 className="text-sm font-bold text-gray-900">
                      Kata Sandi
                    </h3>
                    <p className="mt-0.5 text-xs text-gray-500">
                      Terakhir diubah 3 bulan lalu.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => router.push("/pengelola/settings/password")}
                    className="self-start rounded-lg border border-gray-300 px-4 py-2 text-xs font-semibold text-gray-800 hover:bg-gray-50"
                  >
                    Ubah Kata Sandi
                  </button>
                </div>
                <div className="flex items-center justify-between border-t border-slate-100 pt-5">
                  <div className="pr-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-sm font-bold text-gray-900">
                        Autentikasi Dua Faktor (2FA)
                      </h3>
                      <span className="rounded bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-600">
                        Direkomendasikan
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      Tambahkan lapisan keamanan ekstra pada akun pengelola.
                    </p>
                  </div>
                  <Switch
                    checked={twoFactor}
                    onChange={setTwoFactor}
                    label="Autentikasi dua faktor"
                  />
                </div>
              </div>
            </section>
          )}

          {tab === "linked-apps" && (
            <section className="rounded-2xl border border-slate-100 bg-white p-8 text-center shadow-sm">
              <Link2 className="mx-auto h-10 w-10 text-slate-300" />
              <h2 className="mt-3 font-bold text-slate-900">
                Belum ada aplikasi tertaut
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Integrasi kalender dan pembayaran akan tampil di sini.
              </p>
            </section>
          )}
        </div>
      </div>
    </main>
  );
}
