"use client";

import Image from "next/image";
import { Star } from "lucide-react";

export interface CardRecommendProps {
  imageSrc: string;
  imageAlt?: string;
  title: string;
  description: string;
  rating: number;
  areaTag: string;
  href?: string;
}

export default function CardRecommend({
  imageSrc,
  imageAlt = "",
  title,
  description,
  rating,
  areaTag,
  href,
}: CardRecommendProps) {
  const Wrapper = href ? "a" : "div";

  return (
    <Wrapper
      {...(href ? { href } : {})}
      className="block w-72 shrink-0 bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
    >
      <div className="relative aspect-video">
        <Image
          src={imageSrc}
          alt={imageAlt || title}
          fill
          className="object-cover"
        />
      </div>

      <div className="p-3.5">
        <h3 className="text-sm font-bold text-gray-900">{title}</h3>
        <p className="text-xs text-gray-500 mt-1 leading-relaxed line-clamp-2">
          {description}
        </p>

        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-1 text-sm font-semibold text-gray-800">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            {rating.toFixed(1)}
          </div>
          <span className="text-xs font-medium text-indigo-600">{areaTag}</span>
        </div>
      </div>
    </Wrapper>
  );
}
