import Image from "next/image";
import type { ChangeEvent, FormEvent, RefObject } from "react";
import type { ManagerAccount } from "../../types/manager-account";
export default function AccountForm({
  account,
  preview,
  fileInput,
  saved,
  onUpdate,
  onPicture,
  onSubmit,
}: {
  account: ManagerAccount;
  preview: string | null;
  fileInput: RefObject<HTMLInputElement | null>;
  saved: boolean;
  onUpdate: <K extends keyof ManagerAccount>(
    key: K,
    value: ManagerAccount[K],
  ) => void;
  onPicture: (e: ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: FormEvent) => void;
}) {
  const c =
    "w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm outline-none";
  return (
    <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm sm:p-8">
      <h2 className="mb-7 border-b pb-5 text-xl font-bold">Pengaturan Akun</h2>
      <form onSubmit={onSubmit}>
        <div className="mb-6 flex flex-col gap-8 sm:flex-row">
          <div className="flex flex-col items-center">
            <div className="relative h-28 w-28 overflow-hidden rounded-full">
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
              onChange={onPicture}
              className="sr-only"
            />
            <button
              type="button"
              onClick={() => fileInput.current?.click()}
              className="mt-2 text-xs font-semibold text-[#7357FB]"
            >
              Ganti Foto
            </button>
          </div>
          <div className="w-full space-y-4">
            <label className="block text-xs font-semibold">
              Nama Lengkap
              <input
                required
                value={account.fullName}
                onChange={(e) => onUpdate("fullName", e.target.value)}
                className={`mt-1.5 ${c}`}
              />
            </label>
            <label className="block text-xs font-semibold">
              Alamat Email
              <input
                required
                type="email"
                value={account.email}
                onChange={(e) => onUpdate("email", e.target.value)}
                className={`mt-1.5 ${c}`}
              />
            </label>
            <label className="block text-xs font-semibold">
              Nomor Telepon
              <input
                required
                type="tel"
                value={account.phone}
                onChange={(e) => onUpdate("phone", e.target.value)}
                className={`mt-1.5 ${c}`}
              />
            </label>
          </div>
        </div>
        <div className="flex justify-end gap-3">
          {saved && (
            <span className="text-xs font-semibold text-emerald-600">
              Perubahan tersimpan.
            </span>
          )}
          <button
            type="submit"
            className="rounded-xl bg-[#7357FB] px-6 py-2.5 text-sm font-semibold text-white"
          >
            Simpan Perubahan
          </button>
        </div>
      </form>
    </section>
  );
}
