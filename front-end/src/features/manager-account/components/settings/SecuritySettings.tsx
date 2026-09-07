import { LockKeyhole } from "lucide-react";
import Switch from "../Switch";
export default function SecuritySettings({
  twoFactor,
  onTwoFactor,
  onPassword,
}: {
  twoFactor: boolean;
  onTwoFactor: (value: boolean) => void;
  onPassword: () => void;
}) {
  return (
    <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm sm:p-8">
      <div className="mb-6 flex items-center gap-2 border-b pb-5">
        <LockKeyhole className="h-5 w-5 text-[#7357FB]" />
        <h2 className="text-xl font-bold">Keamanan</h2>
      </div>
      <div className="space-y-6">
        <div className="flex justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold">Kata Sandi</h3>
            <p className="text-xs text-gray-500">
              Terakhir diubah 3 bulan lalu.
            </p>
          </div>
          <button
            onClick={onPassword}
            className="rounded-lg border px-4 py-2 text-xs font-semibold"
          >
            Ubah Kata Sandi
          </button>
        </div>
        <div className="flex items-center justify-between border-t pt-5">
          <div>
            <h3 className="text-sm font-bold">Autentikasi Dua Faktor (2FA)</h3>
            <p className="mt-1 text-xs text-gray-500">
              Tambahkan lapisan keamanan ekstra pada akun pengelola.
            </p>
          </div>
          <Switch
            checked={twoFactor}
            onChange={onTwoFactor}
            label="Autentikasi dua faktor"
          />
        </div>
      </div>
    </section>
  );
}
