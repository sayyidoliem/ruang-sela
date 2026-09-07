import Image from "next/image";
import type { PlaceDetail } from "../../../types/place-detail";
export default function PlaceGallery({
  images,
}: {
  images: PlaceDetail["images"];
}) {
  if (!images.length)
    return (
      <div className="rounded-2xl bg-slate-100 py-24 text-center">
        Foto tidak tersedia
      </div>
    );
  return (
    <div className="grid gap-3 overflow-hidden rounded-2xl md:grid-cols-3">
      <div className="relative aspect-[4/3] md:col-span-2">
        <Image
          src={images[0].src}
          alt={images[0].alt}
          fill
          priority
          sizes="66vw"
          className="object-cover"
        />
      </div>
      {images.length > 1 && (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-1">
          {images.slice(1, 3).map((i) => (
            <div key={i.src} className="relative aspect-[4/3]">
              <Image
                src={i.src}
                alt={i.alt}
                fill
                sizes="22vw"
                className="object-cover"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
