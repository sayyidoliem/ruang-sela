export interface BookingVenue {
  id: string;
  slug: string;
  name: string;
  location: string;
  imageSrc: string;
  hourlyPrice: number;
  serviceFee: number;
  availableTimes: string[];
}

export interface BookingScheduleInput {
  activityName: string;
  category: string;
  date: string;
  durationHours: number;
  startTime: string;
  participantCount: number;
}
