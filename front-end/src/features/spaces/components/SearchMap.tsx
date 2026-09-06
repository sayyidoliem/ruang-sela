"use client";

import { Crosshair, Minus, Plus } from "lucide-react";
import type { Space } from "../types/space";

interface SearchMapProps {
  spaces: Space[];
  selectedSpaceId?: string;
  onMarkerClick?: (spaceId: string) => void;
}

function formatCompactPrice(value: number) {
  if (value >= 1_000_000) return `Rp ${value / 1_000_000} jt`;
  return `Rp ${Math.round(value / 1_000)} rb`;
}

export default function SearchMap({
  spaces,
  selectedSpaceId,
  onMarkerClick,
}: SearchMapProps) {
  return (
    <section
      className="relative hidden min-h-[500px] flex-1 overflow-hidden bg-slate-100 lg:block"
      aria-label="Peta lokasi ruang"
    >
      <div className="absolute inset-0 h-full w-full bg-slate-100 [background-image:radial-gradient(#e2e8f0_1.2px,transparent_1.2px),linear-gradient(to_right,rgba(226,232,240,0.4)_1px,transparent_1px),linear-gradient(to_bottom,rgba(226,232,240,0.4)_1px,transparent_1px)] [background-size:24px_24px,48px_48px,48px_48px]">
        <svg
          className="h-full w-full"
          fill="none"
          preserveAspectRatio="xMidYMid slice"
          viewBox="0 0 800 1000"
          aria-hidden="true"
        >
          <path
            d="M 0,0 L 800,0 L 800,240 C 720,240 680,180 580,180 C 490,180 430,280 320,240 C 230,210 180,80 0,80 Z"
            fill="#9cd3fd"
            opacity="0.8"
          />
          <path
            d="M 0,600 C 60,630 80,720 0,760 Z"
            fill="#9cd3fd"
            opacity="0.8"
          />
          <path
            d="M 120,380 C 180,360 210,420 190,480 C 160,540 100,500 80,440 Z"
            fill="#bbf7d0"
            opacity="0.6"
          />
          <path
            d="M 450,680 C 520,670 560,730 530,790 C 480,840 420,800 410,740 Z"
            fill="#bbf7d0"
            opacity="0.5"
          />
          <g
            opacity="0.9"
            stroke="#fff"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="6"
          >
            <path d="M 80,0 L 150,300 L 220,550 L 300,750 L 350,1000" />
            <path d="M 400,0 L 420,220 L 490,480 L 520,720 L 580,1000" />
            <path d="M 0,350 L 250,340 L 550,390 L 800,360" />
            <path d="M 0,550 L 320,520 L 580,560 L 800,520" />
            <path d="M 100,820 L 360,780 L 640,840 L 800,800" />
            <path d="M 280,180 L 520,360 L 680,600" />
            <path d="M 180,680 L 420,580 L 720,700" />
          </g>
          <g
            stroke="#f8fafc"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="12"
          >
            <path d="M 220,0 L 240,260 L 360,520 L 440,780 L 480,1000" />
            <path d="M 0,440 L 240,430 L 480,460 L 800,430" />
          </g>
          <g
            stroke="#e2e8f0"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="8"
          >
            <path d="M 220,0 L 240,260 L 360,520 L 440,780 L 480,1000" />
            <path d="M 0,440 L 240,430 L 480,460 L 800,430" />
          </g>
        </svg>

        {spaces.map((space) => {
          const selected = selectedSpaceId === space.id;
          return (
            <button
              key={space.id}
              type="button"
              onClick={() => onMarkerClick?.(space.id)}
              aria-label={`Pilih ${space.title}`}
              className="group absolute flex -translate-x-1/2 -translate-y-full flex-col items-center"
              style={{
                top: space.markerPosition.top,
                left: space.markerPosition.left,
              }}
            >
              <span
                className={`mb-1 rounded-md border px-2.5 py-1 text-[11px] font-bold shadow-md transition-colors ${selected ? "border-[#6347EB] bg-[#6347EB] text-white" : "border-slate-200/80 bg-white/95 text-slate-700 group-hover:bg-[#6347EB] group-hover:text-white"}`}
              >
                {formatCompactPrice(space.price)}
              </span>
              <span
                className={`h-4 w-4 rounded-full ring-4 transition-transform ${selected ? "scale-125 bg-[#6347EB] ring-[#6347EB]/30" : "bg-blue-600 ring-blue-600/30"}`}
              />
            </button>
          );
        })}
      </div>

      <div className="absolute right-6 top-6 z-20 flex flex-col gap-3">
        <div className="flex flex-col overflow-hidden rounded-lg border border-slate-200/80 bg-white shadow-md">
          <button
            type="button"
            aria-label="Perbesar peta"
            className="border-b border-slate-100 p-2.5 text-slate-600 hover:bg-slate-50"
          >
            <Plus className="h-4 w-4" />
          </button>
          <button
            type="button"
            aria-label="Perkecil peta"
            className="p-2.5 text-slate-600 hover:bg-slate-50"
          >
            <Minus className="h-4 w-4" />
          </button>
        </div>
        <button
          type="button"
          aria-label="Gunakan lokasi terkini"
          className="rounded-lg border border-slate-200/80 bg-white p-2.5 text-slate-600 shadow-md hover:bg-slate-50"
        >
          <Crosshair className="h-4 w-4" />
        </button>
      </div>
    </section>
  );
}
