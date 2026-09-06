export function DashboardSkeleton() {
  return (
    <div
      aria-label="Memuat dashboard"
      className="grid animate-pulse gap-4 md:grid-cols-3"
    >
      {[1, 2, 3].map((item) => (
        <div key={item} className="h-36 rounded-2xl bg-slate-200" />
      ))}
    </div>
  );
}
