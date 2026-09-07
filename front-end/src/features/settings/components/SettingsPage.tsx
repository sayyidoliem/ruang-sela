"use client";
import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Link2 } from "lucide-react";
import {
  INITIAL_ACCOUNT_SETTINGS,
  INITIAL_NOTIFICATION_SETTINGS,
} from "../data/settings";
import type {
  AccountSettings,
  NotificationSettings,
  SettingsTab,
} from "../types/settings";
import AccountSettingsForm from "./settings/AccountSettingsForm";
import NotificationSettingsPanel from "./settings/NotificationSettingsPanel";
import SecurityPanel from "./settings/SecurityPanel";
import SettingsNav from "./settings/SettingsNav";
export default function SettingsPage() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [tab, setTab] = useState<SettingsTab>("account");
  const [account, setAccount] = useState<AccountSettings>(
    INITIAL_ACCOUNT_SETTINGS,
  );
  const [notifications, setNotifications] = useState<NotificationSettings>(
    INITIAL_NOTIFICATION_SETTINGS,
  );
  const [twoFactor, setTwoFactor] = useState(false);
  const [saved, setSaved] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  useEffect(
    () => () => {
      if (preview) URL.revokeObjectURL(preview);
    },
    [preview],
  );
  const update = <K extends keyof AccountSettings>(
    key: K,
    value: AccountSettings[K],
  ) => {
    setAccount((c) => ({ ...c, [key]: value }));
    setSaved(false);
  };
  const avatar = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (preview) URL.revokeObjectURL(preview);
    setPreview(URL.createObjectURL(file));
    setSaved(false);
  };
  const save = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2200);
  };
  return (
    <main className="flex-1 bg-[#f8f9fc]">
      <header className="border-b bg-white px-6 py-5">
        <div className="mx-auto flex max-w-7xl items-center gap-3">
          <button onClick={() => router.back()} aria-label="Kembali">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-xl font-bold">Settings</h1>
        </div>
      </header>
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="flex flex-col items-start gap-8 md:flex-row">
          <SettingsNav active={tab} onChange={setTab} />
          <div className="w-full flex-1 space-y-6">
            {tab === "account" && (
              <AccountSettingsForm
                account={account}
                preview={preview}
                inputRef={inputRef}
                saved={saved}
                onChange={update}
                onAvatar={avatar}
                onSubmit={save}
              />
            )}{" "}
            {(tab === "account" || tab === "notifications") && (
              <NotificationSettingsPanel
                values={notifications}
                onChange={setNotifications}
              />
            )}{" "}
            {(tab === "account" || tab === "privacy") && (
              <SecurityPanel
                enabled={twoFactor}
                onChange={setTwoFactor}
                onPassword={() => router.push("/settings/password")}
              />
            )}{" "}
            {tab === "linked-apps" && (
              <section className="rounded-xl border bg-white p-8 text-center">
                <Link2 className="mx-auto h-10 w-10 text-slate-300" />
                <h2 className="mt-3 font-semibold">
                  Belum ada aplikasi tertaut
                </h2>
              </section>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
