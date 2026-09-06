import type { AvailableTag } from "@/app/components/CardAvailable";

export interface Space {
  id: string;
  slug: string;
  imageSrc: string;
  imageAlt: string;
  title: string;
  location: string;
  distanceKm: number;
  rating: number;
  verified: boolean;
  tags: AvailableTag[];
  price: number;
  priceUnit: string;
  latitude: number;
  longitude: number;
  markerPosition: {
    top: string;
    left: string;
  };
}
