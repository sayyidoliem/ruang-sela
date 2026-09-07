import { LockKeyhole } from "lucide-react";
import ToggleSwitch from "../ToggleSwitch";
export default function SecurityPanel({
  enabled,
  onChange,
  onPassword,
}: {
  enabled: boolean;
  onChange: (v: boolean) => void;
  onPassword: () => void;
}) {
  return (
    <section className="rounded-xl border bg-white p-6 shadow-sm">
      <div className="flex items-center gap-2 border-b pb-4">
        <LockKeyhole className="h-5 w-5 text-[#7b57fc]" />
        <h2 className="text-xl font-bold">Keamanan</h2>
      </div>
      <div className="mt-5 flex justify-between">
        <div>
          <b className="text-sm">Kata Sandi</b>
          <p className="text-xs text-gray-500">Terakhir diubah 3 bulan lalu.</p>
        </div>
        <button
          onClick={onPassword}
          className="rounded-lg border px-4 py-2 text-xs"
        >
          Ubah Kata Sandi
        </button>
      </div>
      <div className="mt-6 flex justify-between border-t pt-5">
        <div>
          <b className="text-sm">Autentikasi Dua Faktor (2FA)</b>
          <p className="text-xs text-gray-500">
            Tambahkan lapisan keamanan ekstra.
          </p>
        </div>
        <ToggleSwitch
          checked={enabled}
          onChange={onChange}
          label="Autentikasi dua faktor"
        />
      </div>
    </section>
  );
}
