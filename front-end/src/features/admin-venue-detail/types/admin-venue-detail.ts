export type VenueDetailStatus = "pending" | "verified" | "rejected";

export interface VenueDocumentReview {
  id: string;
  name: string;
  description: string;
  status: "valid" | "review" | "missing";
}

export interface AdminVenueDetail {
  id: string;
  submissionCode: string;
  name: string;
  location: string;
  managerName: string;
  communityName: string;
  category: string;
  capacity: number;
  description: string;
  address: string;
  status: VenueDetailStatus;
  images: string[];
  documents: VenueDocumentReview[];
}
