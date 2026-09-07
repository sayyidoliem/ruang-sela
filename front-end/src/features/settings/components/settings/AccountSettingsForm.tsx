import Image from "next/image";
import type { ChangeEvent, FormEvent, RefObject } from "react";
import type { AccountSettings } from "../../types/settings";
export default function AccountSettingsForm({
  account,
  preview,
  inputRef,
  saved,
  onChange,
  onAvatar,
  onSubmit,
}: {
  account: AccountSettings;
  preview: string | null;
  inputRef: RefObject<HTMLInputElement | null>;
  saved: boolean;
  onChange: <K extends keyof AccountSettings>(
    key: K,
    value: AccountSettings[K],
  ) => void;
  onAvatar: (e: ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
}) {
  const c = "mt-1 w-full rounded-lg border px-3.5 py-2.5 text-sm";
  return (
    <section className="rounded-xl border bg-white p-6 shadow-sm">
      <h2 className="border-b pb-4 text-xl font-bold">Pengaturan Akun</h2>
      <form
        onSubmit={onSubmit}
        className="mt-6 flex flex-col gap-8 sm:flex-row"
      >
        <div>
          <div className="relative h-24 w-24 overflow-hidden rounded-full">
            <Image
              src={preview ?? account.avatarSrc}
              alt={account.fullName}
              fill
              sizes="96px"
              className="object-cover"
              unoptimized={Boolean(preview)}
            />
          </div>
          <input
            ref={inputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={onAvatar}
            className="sr-only"
          />
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="mt-3 text-xs text-blue-600"
          >
            Ganti Foto
          </button>
        </div>
        <div className="flex-1 space-y-4">
          <label className="block text-xs font-semibold">
            Nama Lengkap
            <input
              value={account.fullName}
              onChange={(e) => onChange("fullName", e.target.value)}
              className={c}
            />
          </label>
          <label className="block text-xs font-semibold">
            Alamat Email
            <input
              type="email"
              value={account.email}
              onChange={(e) => onChange("email", e.target.value)}
              className={c}
            />
          </label>
          <label className="block text-xs font-semibold">
            Nomor Telepon
            <input
              value={account.phoneNumber}
              onChange={(e) => onChange("phoneNumber", e.target.value)}
              className={c}
            />
          </label>
          <div className="flex justify-end gap-3">
            {saved && (
              <span className="text-xs text-emerald-600">
                Perubahan tersimpan.
              </span>
            )}
            <button
              type="submit"
              className="rounded-lg bg-[#7b57fc] px-5 py-2.5 text-xs text-white"
            >
              Simpan Perubahan
            </button>
          </div>
        </div>
      </form>
    </section>
  );
}
