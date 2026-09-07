export interface OperatingHour {
  day: string;
  hours: string;
}
export interface PlaceReview {
  id: string;
  rating: number;
  comment: string;
  author: string;
  role: string;
}
export interface PlaceDetail {
  id: string;
  slug: string;
  title: string;
  location: string;
  address: string;
  verified: boolean;
  price: number;
  priceUnit: string;
  durationHours: number;
  capacity: number;
  minimumBooking: string;
  description: string[];
  images: Array<{ src: string; alt: string }>;
  operatingHours: OperatingHour[];
  facilities: string[];
  selectedDate: number;
  bookedDates: number[];
  reviews: PlaceReview[];
  crowdLevels: number[];
  category?: string;
  rating?: number;
  reviewCount?: number;
  phone?: string;
  website?: string;
  priceText?: string;
  statusOpen?: string;
  lat?: number;
  lng?: number;
}
