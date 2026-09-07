import type { NotificationSettings } from "../../types/settings";
import ToggleSwitch from "../ToggleSwitch";
const items = [
  { key: "email", title: "Notifikasi Email" },
  { key: "push", title: "Notifikasi Push" },
  { key: "sms", title: "Pemberitahuan SMS" },
] as const;
export default function NotificationSettingsPanel({
  values,
  onChange,
}: {
  values: NotificationSettings;
  onChange: (values: NotificationSettings) => void;
}) {
  return (
    <section className="rounded-xl border bg-white p-6 shadow-sm">
      <h2 className="border-b pb-4 text-xl font-bold">Preferensi Notifikasi</h2>
      <div className="mt-4 space-y-3">
        {items.map((item) => (
          <div
            key={item.key}
            className="flex items-center justify-between rounded-lg border p-4"
          >
            <b className="text-sm">{item.title}</b>
            <ToggleSwitch
              checked={values[item.key]}
              onChange={(v) => onChange({ ...values, [item.key]: v })}
              label={item.title}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
