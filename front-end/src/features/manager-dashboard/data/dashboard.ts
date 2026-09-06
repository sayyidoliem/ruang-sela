import type {
  ManagerMetric,
  ManagerSchedule,
  PendingBooking,
} from "../types/manager-dashboard";

export const MANAGER_METRICS: ManagerMetric[] = [
  {
    id: "bookings",
    label: "Total Booking",
    value: "84",
    note: "Bulan ini",
    trend: "+8%",
    tone: "blue",
  },
  {
    id: "utilization",
    label: "Tingkat Pemanfaatan",
    value: "78%",
    note: "Bulan ini",
    trend: "+8%",
    tone: "blue",
  },
  {
    id: "visitors",
    label: "Total Pengunjung",
    value: "2.458",
    note: "Bulan ini",
    trend: "+12%",
    tone: "blue",
  },
  {
    id: "pending",
    label: "Total Menunggu",
    value: "12",
    note: "Perlu dikonfirmasi",
    tone: "amber",
  },
];

export const PENDING_BOOKINGS: PendingBooking[] = [
  {
    id: "request-1",
    community: "Komunitas Digital Jakarta",
    date: "30 Agu 2026",
    time: "09.00–13.00",
    participants: 35,
  },
  {
    id: "request-2",
    community: "Forum Kreatif Melati",
    date: "31 Agu 2026",
    time: "13.00–17.00",
    participants: 28,
  },
];

export const TODAY_SCHEDULE: ManagerSchedule[] = [
  {
    id: "schedule-1",
    time: "08.00–12.00",
    title: "Senam Ibu-ibu PKK",
    room: "Aula Utama",
    active: true,
  },
  {
    id: "schedule-2",
    time: "16.00–18.00",
    title: "Arisan Warga",
    room: "Aula Utama",
  },
];

export const VISITOR_DATA = [
  { day: "Sen", visitors: 320, occupancy: 52 },
  { day: "Sel", visitors: 280, occupancy: 46 },
  { day: "Rab", visitors: 410, occupancy: 66 },
  { day: "Kam", visitors: 390, occupancy: 62 },
  { day: "Jum", visitors: 540, occupancy: 78 },
  { day: "Sab", visitors: 680, occupancy: 92 },
  { day: "Min", visitors: 590, occupancy: 84 },
];
