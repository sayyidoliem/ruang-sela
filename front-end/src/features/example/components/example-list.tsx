import { getExamples } from "../application/get-examples";
import { getExampleRepository } from "../infrastructure";
import { EmptyState } from "@/shared/components/feedback/empty-state";
export async function ExampleList() {
  const data = await getExamples(getExampleRepository());
  if (!data.length) return <EmptyState />;
  return (
    <section aria-labelledby="feature-title">
      <div className="flex items-center justify-between">
        <h2 id="feature-title" className="text-xl font-bold">
          Fitur Utama
        </h2>
        <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-800">
          {data.length} data
        </span>
      </div>
      <div className="mt-4 grid gap-4 md:grid-cols-3">
        {data.map((item) => (
          <article
            key={item.id}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <h3 className="font-bold">{item.title}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              {item.description ?? "Tidak ada deskripsi."}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
