export interface ManagerMetric {
  id: string;
  label: string;
  value: string;
  note: string;
  trend?: string;
  tone: "blue" | "amber";
}

export interface PendingBooking {
  id: string;
  community: string;
  date: string;
  time: string;
  participants: number;
}

export interface ManagerSchedule {
  id: string;
  time: string;
  title: string;
  room: string;
  active?: boolean;
}
