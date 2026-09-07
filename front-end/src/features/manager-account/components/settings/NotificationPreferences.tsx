import type { ManagerNotifications } from "../../types/manager-account";
import Switch from "../Switch";
const items = [
  {
    key: "email",
    title: "Notifikasi Email",
    text: "Terima pembaruan booking, laporan, dan peringatan melalui email.",
  },
  {
    key: "push",
    title: "Notifikasi Push",
    text: "Terima pemberitahuan pengajuan baru pada perangkat atau browser.",
  },
  {
    key: "sms",
    title: "Pemberitahuan SMS",
    text: "Peringatan keamanan dan booking mendesak melalui pesan teks.",
  },
] as const;
export default function NotificationPreferences({
  values,
  onChange,
}: {
  values: ManagerNotifications;
  onChange: (values: ManagerNotifications) => void;
}) {
  return (
    <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm sm:p-8">
      <h2 className="mb-6 border-b border-slate-100 pb-5 text-xl font-bold">
        Preferensi Notifikasi
      </h2>
      <div className="space-y-3.5">
        {items.map((item) => (
          <div
            key={item.key}
            className="flex items-center justify-between rounded-xl border border-slate-100 p-4"
          >
            <div className="pr-4">
              <h3 className="text-sm font-bold">{item.title}</h3>
              <p className="mt-1 text-xs text-gray-500">{item.text}</p>
            </div>
            <Switch
              checked={values[item.key]}
              onChange={(checked) =>
                onChange({ ...values, [item.key]: checked })
              }
              label={item.title}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
