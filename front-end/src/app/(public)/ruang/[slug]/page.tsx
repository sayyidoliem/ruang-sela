import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  PlaceDetailPage,
  getPlaceBySlug,
  PLACE_DETAILS,
} from "@/features/spaces";

interface PlaceDetailRouteProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return PLACE_DETAILS.map((place) => ({ slug: place.slug }));
}

export async function generateMetadata({
  params,
}: PlaceDetailRouteProps): Promise<Metadata> {
  const { slug } = await params;
  const place = getPlaceBySlug(slug);

  if (!place) return { title: "Tempat Tidak Ditemukan" };

  return {
    title: `${place.title} | RuangSela`,
    description: place.description[0],
  };
}

export default async function PlaceDetailRoute({
  params,
}: PlaceDetailRouteProps) {
  const { slug } = await params;
  const place = getPlaceBySlug(slug);

  if (!place) notFound();

  return <PlaceDetailPage place={place} />;
}
