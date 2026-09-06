import type {
  AdminKpi,
  AdminTask,
  PopularVenue,
} from "../types/admin-dashboard";

export const ADMIN_KPIS: AdminKpi[] = [
  {
    id: "users",
    label: "Total Pengguna",
    value: "24.592",
    trend: "+12,4%",
    note: "1.204 aktif minggu ini",
    tone: "purple",
  },
  {
    id: "bookings",
    label: "Total Booking",
    value: "3.842",
    trend: "+18,6%",
    note: "348 booking bulan ini",
    tone: "purple",
  },
  {
    id: "revenue",
    label: "Total Pendapatan",
    value: "Rp 125,4 jt",
    trend: "+24,2%",
    note: "Target tercapai 91%",
    tone: "green",
  },
  {
    id: "venues",
    label: "Venue Aktif",
    value: "142",
    trend: "+8,5%",
    note: "12 venue baru bergabung",
    tone: "amber",
  },
];

export const ADMIN_TASKS: AdminTask[] = [
  {
    id: "venue-verification",
    title: "Venue menunggu verifikasi",
    description: "Dokumen IMB dan foto ruangan perlu dicek",
    count: 8,
    tone: "amber",
    href: "/admin/tempat?status=pending",
  },
  {
    id: "payment",
    title: "Pembayaran perlu konfirmasi",
    description: "Konfirmasi transfer manual BCA dan Mandiri",
    count: 5,
    tone: "green",
    href: "/admin/transaksi?status=pending",
  },
  {
    id: "support",
    title: "Tiket dukungan pengguna",
    description: "Keluhan reschedule dan permintaan refund",
    count: 3,
    tone: "indigo",
    href: "/admin/dukungan",
  },
  {
    id: "reports",
    title: "Laporan perlu ditinjau",
    description: "Kapasitas melebihi batas ketentuan",
    count: 2,
    tone: "rose",
    href: "/admin/laporan",
  },
];

export const REVENUE_SERIES = [
  { month: "Jan", revenue: 14, bookings: 420 },
  { month: "Feb", revenue: 18, bookings: 510 },
  { month: "Mar", revenue: 22, bookings: 590 },
  { month: "Apr", revenue: 20, bookings: 565 },
  { month: "Mei", revenue: 28, bookings: 730 },
  { month: "Jun", revenue: 32.8, bookings: 845 },
];

export const BOOKING_CATEGORIES = [
  {
    name: "Ruang Rapat & Meeting Room",
    value: 1420,
    percent: 37,
    time: "09.00–15.00 WIB",
    revenue: "Rp 52,5 jt",
    color: "bg-violet-700",
  },
  {
    name: "Aula & Function Hall Serbaguna",
    value: 1075,
    percent: 28,
    time: "Akhir pekan / malam",
    revenue: "Rp 41,2 jt",
    color: "bg-blue-500",
  },
  {
    name: "Co-working Space & Shared Desk",
    value: 690,
    percent: 18,
    time: "Hari kerja reguler",
    revenue: "Rp 16,8 jt",
    color: "bg-emerald-500",
  },
  {
    name: "Studio Kreatif & Fotografi",
    value: 422,
    percent: 11,
    time: "13.00–19.00 WIB",
    revenue: "Rp 9,9 jt",
    color: "bg-amber-500",
  },
  {
    name: "Lapangan Komunitas & Olahraga",
    value: 235,
    percent: 6,
    time: "17.00–21.00 WIB",
    revenue: "Rp 5,0 jt",
    color: "bg-rose-500",
  },
];

export const POPULAR_VENUES: PopularVenue[] = [
  {
    id: "hive",
    name: "The Hive Central",
    city: "Jakarta Selatan",
    bookings: 128,
    rating: 4.9,
    imageSrc:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAwLBTn9xu7KsxvUvW1ZxyXXaSwW9bex4Jxv2GP0YZrmuuv2fB87CjDCJFk8ujOfy544b9wm_obsiMxOJBl2jfoW1fCmJOoJ9E4LuTxuXn_93wceBlB0Q2S4R5ht0EPqGTai5KAlwXf81QArXPmg_Ncdr5We4izmMdwKg30pSOViIOwrI_xrTdZC8f6RqMVIJVQeOekY0F6BriFvCWoFM3GwTdyatWJhL6bLyOmJlLlxMC0Ruwh3Zw",
  },
  {
    id: "nexus",
    name: "Nexus Boardroom",
    city: "Jakarta Pusat",
    bookings: 96,
    rating: 4.8,
    imageSrc:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA_jU0-ojBVAkAxflobeP7bBRT6SUTPoMmYWf2lILn4-heo7V4MZXEcaX98HyozyWOVEGCFAx4c89XjYbV1zUn-RHdC_miOwcyobp3KfRhLPV3S5xxG0u3teweOL0SW5gch-jVgN-e7xxe9ehByvhfWyUnDAOmLDJWcd4M0oHOjWGfTaAGJTPr5Sp40BK2R864txJqhZSM-ri-QAS19xKk-RViY4xib9RjAQXy5qucoYnohiemQU50",
  },
  {
    id: "artisan",
    name: "Artisan Loft Hub",
    city: "Jakarta Barat",
    bookings: 82,
    rating: 4.7,
    imageSrc:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB-5eFOclku94OHoZM71MEtApklKiT-SG1d767fR1keWcYWns7wA8EZ16_86ncqQDNdkbfNEOTKcBklF4GFtOuqXn44swNb50VcQ6uNYVJYtUMy5DnceyP0nDCFCJkAdTCM0xkFISErkAAnUH520hgY1n2yvDvfYGByFiM7qGxbKBGv7xAEh8olW32TDKKr1Qp9JIHYDX_jt45XJ4T07O08rSVI6iPdFlcGWKzmNRbWrgt3TzPi2CM",
  },
  {
    id: "melati",
    name: "Aula Warga Melati",
    city: "Jakarta Timur",
    bookings: 64,
    rating: 4.8,
  },
];
