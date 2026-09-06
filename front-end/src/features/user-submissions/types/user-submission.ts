export type SubmissionStatus =
  | "pending"
  | "approved"
  | "ongoing"
  | "completed"
  | "rejected"
  | "cancelled";

export interface SubmissionTimelineItem {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  active?: boolean;
}

export interface UserSubmission {
  id: string;
  code: string;
  venueName: string;
  location: string;
  imageSrc: string;
  date: string;
  period: "September 2026" | "Agustus 2026";
  time: string;
  duration: string;
  participants: number;
  purpose: string;
  status: SubmissionStatus;
  total: number;
  paymentStatus: string;
  rejectionReason?: string;
  timeline: SubmissionTimelineItem[];
}
