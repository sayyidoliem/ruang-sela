"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
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
  INITIAL_ACCOUNT_SETTINGS,
  INITIAL_NOTIFICATION_SETTINGS,
} from "../data/settings";
import type {
  AccountSettings,
  NotificationSettings,
  SettingsTab,
} from "../types/settings";
import ToggleSwitch from "./ToggleSwitch";

const TABS: Array<{
  id: SettingsTab;
  label: string;
  icon: typeof UserRound;
}> = [
  { id: "account", label: "Akun", icon: UserRound },
  { id: "notifications", label: "Notifikasi", icon: Bell },
  { id: "privacy", label: "Privasi & Keamanan", icon: ShieldCheck },
  { id: "linked-apps", label: "Aplikasi Tertaut", icon: Link2 },
];

export default function SettingsPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState<SettingsTab>("account");
  const [account, setAccount] = useState<AccountSettings>(
    INITIAL_ACCOUNT_SETTINGS,
  );
  const [notifications, setNotifications] = useState<NotificationSettings>(
    INITIAL_NOTIFICATION_SETTINGS,
  );
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [saved, setSaved] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (avatarPreview) URL.revokeObjectURL(avatarPreview);
    };
  }, [avatarPreview]);

  const updateAccount = <K extends keyof AccountSettings>(
    key: K,
    value: AccountSettings[K],
  ) => {
    setAccount((current) => ({ ...current, [key]: value }));
    setSaved(false);
  };

  const handleAvatar = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (avatarPreview) URL.revokeObjectURL(avatarPreview);
    setAvatarPreview(URL.createObjectURL(file));
    setSaved(false);
  };

  const handleSave = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2200);
  };

  const inputClass =
    "w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm text-gray-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20";

  return (
    <main className="flex-1 bg-[#f8f9fc]">
      <header className="border-b border-gray-100 bg-white px-6 py-5 sm:px-10">
        <div className="mx-auto flex max-w-7xl items-center gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            aria-label="Kembali"
            className="grid rounded-lg p-1 text-gray-900 transition-colors hover:text-[#7b57fc]"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-xl font-bold tracking-tight text-gray-900">
            Settings
          </h1>
        </div>
      </header>

      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-8">
        <div className="flex flex-col items-start gap-8 md:flex-row">
          <aside className="w-full shrink-0 md:w-64">
            <nav
              aria-label="Navigasi pengaturan"
              className="grid grid-cols-2 gap-1 sm:grid-cols-4 md:flex md:flex-col"
            >
              {TABS.map((tab) => {
                const Icon = tab.icon;
                const active = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-3 rounded-lg px-4 py-3 text-left text-sm font-medium transition-all ${active ? "bg-[#191543] text-white shadow-sm" : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"}`}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </aside>

          <div className="w-full flex-1 space-y-6">
            <section
              className={`rounded-xl border border-gray-100 bg-white p-6 shadow-[0_2px_10px_rgba(0,0,0,0.03)] md:p-8 ${activeTab !== "account" ? "hidden" : ""}`}
            >
              <h2 className="border-b border-gray-100 pb-4 text-xl font-bold text-gray-900">
                Pengaturan Akun
              </h2>
              <form
                onSubmit={handleSave}
                className="mt-6 flex flex-col items-center gap-8 sm:flex-row sm:items-start"
              >
                <div className="flex shrink-0 flex-col items-center">
                  <div className="relative h-24 w-24 overflow-hidden rounded-full border border-gray-200 bg-slate-100 shadow-inner">
                    <Image
                      src={avatarPreview ?? account.avatarSrc}
                      alt={`Foto profil ${account.fullName}`}
                      fill
                      sizes="96px"
                      className="object-cover"
                      unoptimized={Boolean(avatarPreview)}
                    />
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={handleAvatar}
                    className="sr-only"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="mt-3 text-xs font-semibold text-blue-600 hover:text-blue-700"
                  >
                    Ganti Foto
                  </button>
                </div>

                <div className="w-full flex-1 space-y-4">
                  <div>
                    <label
                      htmlFor="fullName"
                      className="mb-1 block text-xs font-semibold text-gray-800"
                    >
                      Nama Lengkap
                    </label>
                    <input
                      id="fullName"
                      required
                      value={account.fullName}
                      onChange={(event) =>
                        updateAccount("fullName", event.target.value)
                      }
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="mb-1 block text-xs font-semibold text-gray-800"
                    >
                      Alamat Email
                    </label>
                    <div className="relative flex items-center">
                      <input
                        id="email"
                        required
                        type="email"
                        value={account.email}
                        onChange={(event) =>
                          updateAccount("email", event.target.value)
                        }
                        className={`${inputClass} pr-24`}
                      />
                      {account.emailVerified && (
                        <span className="absolute right-3 inline-flex items-center gap-1 rounded border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-600">
                          <Check className="h-3 w-3" />
                          Terverifikasi
                        </span>
                      )}
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="phone"
                      className="mb-1 block text-xs font-semibold text-gray-800"
                    >
                      Nomor Telepon
                    </label>
                    <input
                      id="phone"
                      required
                      type="tel"
                      value={account.phoneNumber}
                      onChange={(event) =>
                        updateAccount("phoneNumber", event.target.value)
                      }
                      className={inputClass}
                    />
                  </div>
                  <div className="flex items-center justify-end gap-3 pt-2">
                    {saved && (
                      <span
                        role="status"
                        className="text-xs font-semibold text-emerald-600"
                      >
                        Perubahan tersimpan.
                      </span>
                    )}
                    <button
                      type="submit"
                      className="rounded-lg bg-[#7b57fc] px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-[#6a47ea]"
                    >
                      Simpan Perubahan
                    </button>
                  </div>
                </div>
              </form>
            </section>

            <section
              className={`rounded-xl border border-gray-100 bg-white p-6 shadow-[0_2px_10px_rgba(0,0,0,0.03)] md:p-8 ${activeTab !== "notifications" && activeTab !== "account" ? "hidden" : ""}`}
            >
              <h2 className="border-b border-gray-100 pb-4 text-xl font-bold text-gray-900">
                Preferensi Notifikasi
              </h2>
              <div className="mt-4 space-y-3">
                {[
                  {
                    key: "email" as const,
                    title: "Notifikasi Email",
                    description:
                      "Terima pembaruan, buletin, dan pemberitahuan melalui email.",
                  },
                  {
                    key: "push" as const,
                    title: "Notifikasi Push",
                    description:
                      "Terima pemberitahuan langsung pada perangkat atau browser.",
                  },
                  {
                    key: "sms" as const,
                    title: "Pemberitahuan SMS",
                    description:
                      "Pemberitahuan keamanan penting melalui pesan teks.",
                  },
                ].map((item) => (
                  <div
                    key={item.key}
                    className="flex items-center justify-between rounded-lg border border-gray-100 p-4 transition-colors hover:bg-gray-50/50"
                  >
                    <div className="pr-4">
                      <h3 className="text-sm font-semibold text-gray-900">
                        {item.title}
                      </h3>
                      <p className="mt-0.5 text-xs text-gray-500">
                        {item.description}
                      </p>
                    </div>
                    <ToggleSwitch
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

            <section
              className={`rounded-xl border border-gray-100 bg-white p-6 shadow-[0_2px_10px_rgba(0,0,0,0.03)] md:p-8 ${activeTab !== "privacy" && activeTab !== "account" ? "hidden" : ""}`}
            >
              <div className="flex items-center gap-2 border-b border-gray-100 pb-4">
                <LockKeyhole className="h-5 w-5 text-[#7b57fc]" />
                <h2 className="text-xl font-bold text-gray-900">Keamanan</h2>
              </div>
              <div className="mt-5 space-y-6">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">
                      Kata Sandi
                    </h3>
                    <p className="mt-0.5 text-xs text-gray-500">
                      Terakhir diubah 3 bulan lalu.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => router.push("/settings/password" as never)}
                    className="shrink-0 rounded-lg border border-[#191543] px-4 py-2 text-xs font-semibold text-[#191543] transition-colors hover:bg-gray-50"
                  >
                    Ubah Kata Sandi
                  </button>
                </div>
                <div className="flex flex-col justify-between gap-4 pt-2 sm:flex-row sm:items-center">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-sm font-semibold text-gray-900">
                        Autentikasi Dua Faktor (2FA)
                      </h3>
                      <span className="rounded border border-amber-200 bg-amber-50 px-1.5 py-0.5 text-[10px] font-semibold text-amber-600">
                        Direkomendasikan
                      </span>
                    </div>
                    <p className="mt-0.5 text-xs text-gray-500">
                      Tambahkan lapisan keamanan ekstra pada akun Anda.
                    </p>
                  </div>
                  <ToggleSwitch
                    checked={twoFactorEnabled}
                    onChange={setTwoFactorEnabled}
                    label="Autentikasi dua faktor"
                  />
                </div>
              </div>
            </section>

            {activeTab === "linked-apps" && (
              <section className="rounded-xl border border-gray-100 bg-white p-6 shadow-[0_2px_10px_rgba(0,0,0,0.03)] md:p-8">
                <h2 className="border-b border-gray-100 pb-4 text-xl font-bold text-gray-900">
                  Aplikasi Tertaut
                </h2>
                <div className="py-10 text-center">
                  <Link2 className="mx-auto h-10 w-10 text-slate-300" />
                  <h3 className="mt-3 font-semibold text-slate-900">
                    Belum ada aplikasi tertaut
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">
                    Aplikasi yang Anda hubungkan akan tampil di sini.
                  </p>
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
