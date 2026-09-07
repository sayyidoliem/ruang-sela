import { Check } from "lucide-react";

const STEPS = ["Aktivitas", "Jadwal", "Persyaratan", "Pembayaran"];

export default function BookingStepper({
  currentStep,
}: {
  currentStep: number;
}) {
  return (
    <section
      aria-label="Tahapan formulir pengajuan"
      className="mb-8 max-w-2xl rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6"
    >
      <ol className="flex items-start">
        {STEPS.map((label, index) => {
          const step = index + 1;
          const completed = step < currentStep;
          const active = step === currentStep;
          return (
            <li
              key={label}
              className={`flex items-start ${index < STEPS.length - 1 ? "flex-1" : ""}`}
            >
              <div className="relative z-10 flex min-w-14 flex-col items-center text-center sm:min-w-20">
                <span
                  className={`grid h-8 w-8 place-items-center rounded-full text-xs font-bold ${completed ? "bg-emerald-500 text-white" : active ? "bg-[#7c3aed] text-white ring-4 ring-violet-100" : "border border-slate-200 bg-slate-100 text-slate-400"}`}
                >
                  {completed ? <Check className="h-4 w-4" /> : step}
                </span>
                <span
                  className={`mt-2 text-[10px] sm:text-xs ${completed ? "font-semibold text-slate-700" : active ? "font-bold text-[#7c3aed]" : "font-medium text-slate-400"}`}
                >
                  {label}
                </span>
              </div>
              {index < STEPS.length - 1 && (
                <span
                  className={`mt-4 h-0.5 flex-1 ${completed ? "bg-emerald-500" : "bg-slate-200"}`}
                />
              )}
            </li>
          );
        })}
      </ol>
    </section>
  );
}
