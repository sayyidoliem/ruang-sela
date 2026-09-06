import type { ManagerBooking } from "../types/manager-booking";

const ROOM_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuC9OhGF1xKbTZ93AinIDKrJHWu3gYfXHpbCxDNBRwyUbRTRMTyLnXnoL16U24ELy4GCEIsxu4z5f9evku0SAEnrX5-RdHOyHelPV7CVrMbgncs3ZoYtNwW3vTpxdUep1I2wNNbbL1Ml67drnjPiMd8KQ75vbH5C3FDf7TqYshCXsdqRhq02auVI9ae1x3-smPq3uRWuDaysVTLpudHCpE1k7e1I7uADrSnpLyCLJQUswgwM_KqNe24";
const AVATARS = [
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBUpxK52UtVw20FZ_IKc0i-UI0iNrl-BqbvkIP95XclnV1AAQz4W_f1jz-SvHZ5W7fTRCRpK-XhbknU_AeC1H1OfH6wzIVPB7cduoMHw4SP_t-eq1oKLqT7ervGaCt7a1Pd4z4gdWqs-_XQmXXvCujkeEbeRfoo6SkGFN0IYqBHBmdzANaUBQFygIdFXkDM2vtQKiP3wJeOfm9Khu0kIo_9aYcyIPFF8RxO-etRRCONFfWYzVJP1Nw",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBaAvXNB01SQoxS9NhVdGemSMJuBt6pCit_1fbKbZEBL-7JGXkEnzUmi4UshX4SojDzHmsItEsdY2kfSTqT3I5G9oNCgem0Jm6RsNv0EwAhWEK1BtYIfJYsBI6U1Zug8kZIY4AvGu7hoYT8xI5pVbk9Bx1Ycb6Niyy-BzKujHug_MEaqc5MHkQ1MxIYffYRp5uxNlPoYYm2MaVud_fyGnf3vtwEtrtYyYBG7P_ZtsA2wEKPCJwHl9A",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuB56a4IcLQvokqx_bnTeOxhToe-0OevGCUr6WNtRUZoTaaBESo14s8aEwYmINSrHvgEpEyBBRI4D1yck6aSOncIfGBNi1nl2p0aAHT6eEowELw_e0-dHJ6iZD8HrvJLIPhy2sQcN_LCbppgdI8-LIAy9CViTezOLt4E44SeTSwPh4yKHsUtFtz4LY76mgN60Ti1FdSxQXbD4-2IAJh3Hfp5Vz3f3Qn8Ir2rmOM_lWFDcSvzdzxLzDk",
];

const shared = {
  borrowerName: "Budi Santoso",
  community: "Komunitas Kreatif",
  email: "budi.s@komunitaskreatif.id",
  phone: "+62 812 3456 7890",
  eventName: "Workshop Desain Inklusif",
  roomName: "Ruang Aula Utama",
  roomDetail: "Lantai 2",
  roomImageSrc: ROOM_IMAGE,
  date: "12 Okt 2026",
  time: "09.00–15.00 WIB",
  participants: 30,
  facilities: ["Proyektor", "Sound System"],
  notes: "Mohon disiapkan proyektor dan layout kursi berbentuk U.",
  roomPrice: 1200000,
  facilityPrice: 150000,
};

export const INITIAL_MANAGER_BOOKINGS: ManagerBooking[] = [
  {
    ...shared,
    id: "booking-1",
    bookingCode: "RS-9923",
    avatarSrc: AVATARS[0],
    status: "approved",
    paymentStatus: "Lunas",
  },
  {
    ...shared,
    id: "booking-2",
    bookingCode: "RS-9924",
    avatarSrc: AVATARS[1],
    status: "pending",
    paymentStatus: "DP 50%",
    roomPrice: 300000,
    facilityPrice: 150000,
  },
  {
    ...shared,
    id: "booking-3",
    bookingCode: "RS-9925",
    avatarSrc: AVATARS[2],
    status: "ongoing",
    paymentStatus: "Lunas",
    checkIn: "09.48 WIB",
  },
  {
    ...shared,
    id: "booking-4",
    bookingCode: "RS-9926",
    avatarSrc: AVATARS[0],
    status: "rejected",
    paymentStatus: "Refund 100%",
    rejectionReason: "Jadwal bertabrakan dengan agenda kelurahan.",
  },
  {
    ...shared,
    id: "booking-5",
    bookingCode: "RS-9927",
    avatarSrc: AVATARS[1],
    status: "cancelled",
    paymentStatus: "Dana Kembali",
  },
  {
    ...shared,
    id: "booking-6",
    bookingCode: "RS-9928",
    avatarSrc: AVATARS[2],
    status: "completed",
    paymentStatus: "Lunas",
    rating: 5,
  },
];
