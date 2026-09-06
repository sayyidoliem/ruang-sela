"use client";

import Image from "next/image";
import { MapPin, Star, BadgeCheck } from "lucide-react";

export interface CardTrendingProps {
  imageSrc: string;
  imageAlt?: string;
  title: string;
  location: string;
  rating: number;
  capacity: number;
  verified?: boolean;
  href?: string;
}

export default function CardTrending({
  imageSrc,
  imageAlt = "",
  title,
  location,
  rating,
  capacity,
  verified = true,
  href,
}: CardTrendingProps) {
  const Wrapper = href ? "a" : "div";

  return (
    <Wrapper
      {...(href ? { href } : {})}
      className="block w-full max-w-xs bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
    >
      <div className="relative aspect-[6/3]">
        <Image
          src={imageSrc}
          alt={imageAlt || title}
          fill
          className="object-cover"
        />
        {verified && (
          <span className="absolute top-3 right-3 flex items-center gap-1 bg-emerald-500 text-white text-xs font-medium px-2.5 py-1 rounded-full">
            <BadgeCheck className="w-3.5 h-3.5" />
            Terverifikasi
          </span>
        )}
      </div>

      <div className="p-4">
        <h3 className="text-base font-bold text-gray-900">{title}</h3>
        <div className="flex items-center gap-1 mt-1 text-sm text-gray-500">
          <MapPin className="w-3.5 h-3.5" />
          <span>{location}</span>
        </div>

        <hr className="my-3 border-gray-100" />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-sm font-semibold text-gray-800">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            {rating.toFixed(1)}
          </div>
          <div className="text-sm text-gray-500">
            Kapasitas:{" "}
            <span className="font-semibold text-indigo-600">{capacity}</span>
          </div>
        </div>
      </div>
    </Wrapper>
  );
}
