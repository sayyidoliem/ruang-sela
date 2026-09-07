"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  BadgeCheck,
  Heart,
  MapPin,
  Snowflake,
  Star,
  Users,
  Wifi,
} from "lucide-react";

export interface AvailableTag {
  type: "capacity" | "wifi" | "ac";
  label: string;
}

export interface CardAvailableProps {
  imageSrc: string;
  imageAlt?: string;
  title: string;
  location: string;
  distanceKm?: number;
  rating: number;
  verified?: boolean;
  tags?: AvailableTag[];
  price: number;
  priceUnit?: string;
  favorited?: boolean;
  selected?: boolean;
  priority?: boolean;
  onSelect?: () => void;
  onToggleFavorite?: (next: boolean) => void;
  onPesan?: () => void;
}

export const availableTagPresets = {
  capacity: (label: string): AvailableTag => ({ type: "capacity", label }),
  wifi: (label = "WiFi"): AvailableTag => ({ type: "wifi", label }),
  ac: (label = "AC"): AvailableTag => ({ type: "ac", label }),
};

const TAG_ICONS = { capacity: Users, wifi: Wifi, ac: Snowflake };
const formatRupiah = (value: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);

export default function CardAvailable({
  imageSrc,
  imageAlt = "",
  title,
  location,
  distanceKm,
  rating,
  verified = true,
  tags = [],
  price,
  priceUnit = "sesi",
  favorited = false,
  selected = false,
  priority = false,
  onSelect,
  onToggleFavorite,
  onPesan,
}: CardAvailableProps) {
  const [isFavorited, setIsFavorited] = useState(favorited);

  useEffect(() => setIsFavorited(favorited), [favorited]);

  const handleFavoriteClick = () => {
    const next = !isFavorited;
    setIsFavorited(next);
    onToggleFavorite?.(next);
  };

  return (
    <article
      className={`group flex w-full flex-col overflow-hidden rounded-2xl border bg-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md sm:flex-row ${selected ? "border-[#6347EB] shadow-[0_0_0_2px_rgba(99,71,235,0.12)]" : "border-slate-200/90"}`}
      onClick={onSelect}
    >
      <div className="relative h-48 shrink-0 overflow-hidden bg-slate-100 sm:h-auto sm:w-52">
        <Image
          src={imageSrc}
          alt={imageAlt || title}
          fill
          priority={priority}
          sizes="(max-width: 640px) 100vw, 208px"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {verified && (
          <span className="absolute left-3 top-3 flex items-center gap-1 rounded-md bg-[#0d825c] px-2.5 py-1 text-[11px] font-semibold text-white shadow-sm">
            <BadgeCheck className="h-3.5 w-3.5" /> Terverifikasi
          </span>
        )}
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            handleFavoriteClick();
          }}
          aria-label={
            isFavorited ? "Hapus dari favorit" : "Tambahkan ke favorit"
          }
          aria-pressed={isFavorited}
          className="absolute bottom-3 right-3 inline-flex rounded-full bg-white/90 p-2 text-slate-600 shadow-sm hover:text-rose-500 sm:hidden"
        >
          <Heart
            className={
              isFavorited ? "h-4 w-4 fill-rose-500 text-rose-500" : "h-4 w-4"
            }
          />
        </button>
      </div>

      <div className="flex flex-1 flex-col justify-between p-5">
        <div>
          <div className="flex items-start justify-between gap-3">
            <h2 className="text-lg font-bold leading-snug text-slate-900 transition-colors group-hover:text-[#6347EB]">
              {title}
            </h2>
            <div className="flex shrink-0 items-center gap-1 text-sm font-bold text-slate-800">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              <span>{rating.toFixed(1)}</span>
            </div>
          </div>
          <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-500 sm:text-sm">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-slate-400" />
            <span>
              {location}
              {distanceKm != null ? ` - ${distanceKm} km` : ""}
            </span>
          </p>
          {tags.length > 0 && (
            <div className="mt-3.5 flex flex-wrap items-center gap-2">
              {tags.map((tag, index) => {
                const Icon = TAG_ICONS[tag.type];
                return (
                  <span
                    key={`${tag.type}-${tag.label}-${index}`}
                    className="inline-flex items-center gap-1.5 rounded-md bg-purple-50 px-2.5 py-1 text-xs font-semibold text-[#6347EB]"
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {tag.label}
                  </span>
                );
              })}
            </div>
          )}
        </div>

        <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-3">
          {price > 0 ? (
            <div>
              <span className="text-base font-bold text-slate-900 sm:text-lg">
                {formatRupiah(price)}
              </span>
              <span className="text-xs text-slate-500"> / {priceUnit}</span>
            </div>
          ) : (
            <span className="text-sm font-semibold text-slate-400">
              Harga belum tersedia
            </span>
          )}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                handleFavoriteClick();
              }}
              aria-label={
                isFavorited ? "Hapus dari favorit" : "Tambahkan ke favorit"
              }
              aria-pressed={isFavorited}
              className="hidden rounded-lg border border-slate-200 p-2 text-slate-400 hover:bg-slate-50 hover:text-rose-500 sm:inline-flex"
            >
              <Heart
                className={
                  isFavorited
                    ? "h-4 w-4 fill-rose-500 text-rose-500"
                    : "h-4 w-4"
                }
              />
            </button>
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                onPesan?.();
              }}
              className="rounded-lg bg-[#6347EB] px-6 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-[#583cd9] sm:text-sm"
            >
              Pesan
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
