import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
interface Props {
  name: string;
  images: string[];
  activeImage: number;
  onSelect: (index: number) => void;
  onPrevious: () => void;
  onNext: () => void;
  onClose: () => void;
}
export default function ImagePreviewModal(p: Props) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Preview foto ${p.name}`}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90 p-3"
      onMouseDown={(e) => {
        if (e.currentTarget === e.target) p.onClose();
      }}
    >
      <div className="mb-3 flex w-full max-w-6xl justify-between text-white">
        <div>
          <h2 className="font-bold">{p.name}</h2>
          <p className="text-xs text-white/60">
            Foto {p.activeImage + 1} dari {p.images.length}
          </p>
        </div>
        <button
          onClick={p.onClose}
          aria-label="Tutup preview"
          className="grid h-10 w-10 place-items-center rounded-full bg-white/10"
        >
          <X />
        </button>
      </div>
      <div className="relative h-[76vh] w-full max-w-6xl overflow-hidden rounded-2xl bg-black">
        <Image
          src={p.images[p.activeImage]}
          alt={`${p.name} - foto ${p.activeImage + 1}`}
          fill
          sizes="1152px"
          className="object-contain"
        />
        {p.images.length > 1 && (
          <>
            <button
              onClick={p.onPrevious}
              aria-label="Foto sebelumnya"
              className="absolute left-5 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-black/60 text-white"
            >
              <ChevronLeft />
            </button>
            <button
              onClick={p.onNext}
              aria-label="Foto berikutnya"
              className="absolute right-5 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-black/60 text-white"
            >
              <ChevronRight />
            </button>
          </>
        )}
      </div>
      <div className="mt-4 flex gap-2">
        {p.images.map((_, i) => (
          <button
            key={i}
            onClick={() => p.onSelect(i)}
            aria-label={`Foto ${i + 1}`}
            className={`h-2.5 rounded-full ${i === p.activeImage ? "w-8 bg-white" : "w-2.5 bg-white/35"}`}
          />
        ))}
      </div>
    </div>
  );
}
