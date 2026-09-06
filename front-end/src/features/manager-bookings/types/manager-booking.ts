export type BookingStatus =
  | "approved"
  | "ongoing"
  | "pending"
  | "completed"
  | "rejected"
  | "cancelled";

export interface ManagerBooking {
  id: string;
  bookingCode: string;
  borrowerName: string;
  community: string;
  email: string;
  phone: string;
  avatarSrc: string;
  eventName: string;
  roomName: string;
  roomDetail: string;
  roomImageSrc: string;
  date: string;
  time: string;
  participants: number;
  facilities: string[];
  notes: string;
  status: BookingStatus;
  paymentStatus: string;
  roomPrice: number;
  facilityPrice: number;
  checkIn?: string;
  rejectionReason?: string;
  rating?: number;
}
