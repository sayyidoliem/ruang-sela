export type BookingCategory =
  | "Workshop / Pelatihan"
  | "Seni & Budaya"
  | "Sosial & Warga"
  | "Olahraga Ringan";

export type OrganizerType = "personal" | "organization";
export type PaymentMethod = "qris" | "virtual-account" | "e-wallet";

export interface BookingVenue {
  id: string;
  slug: string;
  name: string;
  location: string;
  imageSrc: string;
  hourlyPrice: number;
  serviceFee: number;
  capacity: number;
  maximumDurationHours: number;
  availableTimes: string[];
}

export interface BookingActivityInput {
  activityName: string;
  category: BookingCategory;
  description: string;
  participantCount: number;
  organizerType: OrganizerType;
  organizerProfile: string;
  additionalNotes: string;
}

export interface BookingScheduleInput {
  date: string;
  durationHours: number;
  startTime: string;
  preparationTime: boolean;
}

export interface BookingRequirementsInput {
  identityDocument: File | null;
  proposalDocument: File | null;
  agreements: boolean[];
  emergencyContact: string;
}

export interface BookingPaymentInput {
  method: PaymentMethod;
}

export interface BookingFormData {
  activity: BookingActivityInput;
  schedule: BookingScheduleInput;
  requirements: BookingRequirementsInput;
  payment: BookingPaymentInput;
}
