"use client";
import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import { useRouter } from "next/navigation";
import { Link2 } from "lucide-react";
import {
  MANAGER_ACCOUNT,
  MANAGER_NOTIFICATIONS,
} from "../data/manager-account";
import type {
  ManagerAccount,
  ManagerNotifications,
  ManagerSettingsTab,
} from "../types/manager-account";
import AccountForm from "./settings/AccountForm";
import NotificationPreferences from "./settings/NotificationPreferences";
import SecuritySettings from "./settings/SecuritySettings";
import SettingsNav from "./settings/SettingsNav";
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
  ) => setAccount((c) => ({ ...c, [key]: value }));
  const picture = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (preview) URL.revokeObjectURL(preview);
    setPreview(URL.createObjectURL(f));
  };
  const save = (e: FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2200);
  };
  return (
    <main className="px-4 pb-12 sm:px-8">
      <header className="mb-7">
        <h1 className="text-2xl font-bold">Settings Pengelola</h1>
        <p className="mt-1 text-sm text-slate-500">
          Kelola akun dan preferensi keamanan pengelola tempat.
        </p>
      </header>
      <div className="flex flex-col items-start gap-8 lg:flex-row">
        <SettingsNav active={tab} onChange={setTab} />
        <div className="w-full flex-1 space-y-6">
          {tab === "account" && (
            <AccountForm
              account={account}
              preview={preview}
              fileInput={fileInput}
              saved={saved}
              onUpdate={update}
              onPicture={picture}
              onSubmit={save}
            />
          )}{" "}
          {(tab === "account" || tab === "notifications") && (
            <NotificationPreferences
              values={notifications}
              onChange={setNotifications}
            />
          )}{" "}
          {(tab === "account" || tab === "privacy") && (
            <SecuritySettings
              twoFactor={twoFactor}
              onTwoFactor={setTwoFactor}
              onPassword={() => router.push("/pengelola/settings/password")}
            />
          )}{" "}
          {tab === "linked-apps" && (
            <section className="rounded-2xl bg-white p-8 text-center">
              <Link2 className="mx-auto h-10 w-10 text-slate-300" />
              <h2 className="mt-3 font-bold">Belum ada aplikasi tertaut</h2>
            </section>
          )}
        </div>
      </div>
    </main>
  );
}
