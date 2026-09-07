import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PlaceDetailPage, getPlaceDetail } from "@/features/spaces";

interface PlaceDetailRouteProps {
  params: Promise<{ slug: string }>;
}

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: PlaceDetailRouteProps): Promise<Metadata> {
  const { slug } = await params;
  const place = await getPlaceDetail(slug);

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
  const place = await getPlaceDetail(slug);

  if (!place) notFound();

  return <PlaceDetailPage place={place} />;
}
