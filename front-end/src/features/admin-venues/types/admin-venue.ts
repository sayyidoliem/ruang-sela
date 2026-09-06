export type VenueVerificationStatus = "pending" | "verified" | "rejected";

export interface AdminVenueSubmission {
  id: string;
  name: string;
  city: string;
  managerName: string;
  managerInitials: string;
  category: string;
  submittedAt: string;
  status: VenueVerificationStatus;
  imageSrc: string;
  photoCount: number;
  address: string;
  capacity: number;
  description: string;
  documents: string[];
  verifiedAt?: string;
  rejectionReason?: string;
}
