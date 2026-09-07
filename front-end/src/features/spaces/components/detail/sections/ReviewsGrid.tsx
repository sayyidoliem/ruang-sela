import { Star } from "lucide-react";
import type { PlaceReview } from "../../../types/place-detail";
export default function ReviewsGrid({ items }: { items: PlaceReview[] }) {
  if (!items.length) return null;
  return (
    <section className="mt-14 border-t pt-8">
      <h2 className="mb-6 text-lg font-bold">Ulasan</h2>
      <div className="grid gap-5 md:grid-cols-3">
        {items.map((r) => (
          <article key={r.id} className="rounded-2xl border bg-white p-6">
            <div className="mb-3 flex text-amber-400">
              {Array.from({ length: r.rating }, (_, i) => (
                <Star key={i} className="h-4 w-4 fill-current" />
              ))}
            </div>
            <p className="text-xs">“{r.comment}”</p>
            <b className="mt-6 block text-xs">{r.author}</b>
          </article>
        ))}
      </div>
    </section>
  );
}
