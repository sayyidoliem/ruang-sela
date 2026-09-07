import Image from "next/image";
import Link from "next/link";
import type { VisitedSpace } from "../../types/profile";
export default function VisitedSpaces({ items }: { items: VisitedSpace[] }) {
  return (
    <section>
      <div className="mb-4 flex justify-between">
        <h2 className="text-lg font-bold">Tempat yang Baru Dikunjungi</h2>
        <Link href="/riwayat" className="text-sm font-semibold text-[#5e43f3]">
          Lihat Semua
        </Link>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {items.map((space) => (
          <Link
            key={space.id}
            href={`/ruang/${space.slug}`}
            className="flex gap-4 rounded-2xl border bg-white p-4 shadow-sm"
          >
            <span className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl">
              <Image
                src={space.imageSrc}
                alt={space.name}
                fill
                sizes="80px"
                className="object-cover"
              />
            </span>
            <span>
              <b className="block text-sm">{space.name}</b>
              <small className="line-clamp-2 text-slate-500">
                {space.description}
              </small>
              <small className="mt-2 block text-slate-400">
                Dikunjungi {space.visitedAt}
              </small>
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
