import Image from "next/image";
import { Trash2, Upload } from "lucide-react";
import type { ChangeEvent, RefObject } from "react";
import type { PlaceMedia } from "../../types/manager-place";
export default function MediaSection({
  media,
  inputRef,
  onUpload,
  onRemove,
}: {
  media: PlaceMedia[];
  inputRef: RefObject<HTMLInputElement | null>;
  onUpload: (e: ChangeEvent<HTMLInputElement>) => void;
  onRemove: (id: string) => void;
}) {
  return (
    <section className="rounded-xl border bg-white p-6 shadow-sm">
      <h2 className="mb-4 font-bold">Foto & Media</h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {media.map((item) => (
          <div
            key={item.id}
            className="group relative aspect-video overflow-hidden rounded-xl"
          >
            <Image
              src={item.src}
              alt={item.alt}
              fill
              sizes="300px"
              className="object-cover"
              unoptimized={item.src.startsWith("blob:")}
            />
            <button
              type="button"
              onClick={() => onRemove(item.id)}
              className="absolute right-2 top-2 rounded-full bg-black/60 p-2 text-white"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>
      <input
        ref={inputRef}
        type="file"
        multiple
        accept="image/png,image/jpeg,image/webp"
        onChange={onUpload}
        className="sr-only"
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="mt-4 flex w-full justify-center gap-2 rounded-lg border border-dashed p-3 text-xs font-semibold text-purple-700"
      >
        <Upload className="h-4 w-4" />
        Unggah Foto
      </button>
    </section>
  );
}
