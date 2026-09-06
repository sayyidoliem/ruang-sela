export interface AdminKpi {
  id: string;
  label: string;
  value: string;
  trend: string;
  note: string;
  tone: "purple" | "green" | "amber";
}

export interface AdminTask {
  id: string;
  title: string;
  description: string;
  count: number;
  tone: "amber" | "green" | "indigo" | "rose";
  href: string;
}

export interface PopularVenue {
  id: string;
  name: string;
  city: string;
  bookings: number;
  rating: number;
  imageSrc?: string;
}
