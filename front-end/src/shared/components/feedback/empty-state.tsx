export function EmptyState({
  title = "Belum ada data",
  description = "Tambahkan data pertama untuk mulai menggunakan fitur ini.",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <section className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center">
      <h2 className="text-lg font-bold">{title}</h2>
      <p className="mt-2 text-sm text-slate-600">{description}</p>
    </section>
  );
}
