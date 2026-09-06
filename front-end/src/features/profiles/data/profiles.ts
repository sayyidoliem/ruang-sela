import type { UserProfile } from "../types/profile";

export const PROFILE_DATA: UserProfile[] = [
  {
    id: "user-andi-wijaya",
    username: "andi-wijaya",
    name: "Andi Wijaya",
    initials: "AW",
    avatarSrc:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBF2EdUufBWIZ0qr0juUOS4DFohAXUF0jvn52CFXFgMcn48fbp7qE76gXdXqS9w3F_IJ7pJlf1kC163uT7ZvQKL5SWc6Eu3V4By5iYz94EHFHneoAe8kq_rPG0hx_zAJMWqcAnw_W5A2sJdH2HJz2lms46g_tBvfKFTKBKNW3AZHPsI06JtAbG5Gupbx25c3FWZ4Hlv16rjoRGKnickA2ff1CHWOHn31H1IO0Ok2WrPo2_xRAHtKguu",
    verified: true,
    bio: "Anggota komunitas aktif di Jakarta Selatan yang memiliki minat pada urban farming dan ruang publik berkelanjutan.",
    visitedSpaces: [
      {
        id: "visited-1",
        name: "Tebet Eco Park Pavilion",
        slug: "tebet-eco-park-pavilion",
        description:
          "Aula komunitas untuk lokakarya, pertemuan, dan kegiatan warga.",
        visitedAt: "12 Oktober 2024",
        imageSrc:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuAHJWn7xd04kyYR0u56ORuhzct_2TZwK2dVehIR_U8VErG2dFeIdlXAkBZ6Ug7rNfa7j8wATB3HK1PHk3LKAbCZedq5QD6UzGg3oyBSxPlKQZ48U3bvXbout_HCMCXxjdTmH30Ot1B3-odu5BbL90m1Aya2eZlPBrDvteqhIwSNZPACj-1PHjvPhFw13YqhXDcEOb3y5va6lLzdi88jrfxzGJnWWD8g7HoDjwH1IO1IIhyropIdtAQK",
      },
      {
        id: "visited-2",
        name: "Kemang Digital Hub",
        slug: "kemang-digital-hub",
        description:
          "Zona tenang bagi pekerja digital dan pengembang teknologi sipil.",
        visitedAt: "5 Oktober 2024",
        imageSrc:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuBen9d5xKa29rVoZei1ykEA3i0dgIPCBSmPd6z4fdDRWPpdbdveK8EC5djK9iQtf30wcJb55k1eHL5pkgV7iQB2eIWDA3Ad8lCM5LbZaEr-OLK_VWqxvIdJfXmhQoba2e93v4ZYt8ErsAmXnhW3Ti3NeXBMMumh7kYO8KVWrCuH9IUyNUjaP-CtBEBQqTZVuhM3WoLuuUjVdH3t54yK731FwJKoGHzd9pNxLbys7_LjpQLPouZtvDO9",
      },
    ],
    achievements: [
      {
        id: "green-thumb",
        title: "Green Thumb",
        description: "Mengikuti 5 kegiatan lingkungan",
        icon: "leaf",
      },
      {
        id: "top-voice",
        title: "Top Voice",
        description: "Mendapatkan 100+ poin diskusi",
        icon: "message",
      },
      {
        id: "mentor",
        title: "Mentor",
        description: "Mengadakan 3 lokakarya",
        icon: "mentor",
      },
      {
        id: "civic-leader",
        title: "Civic Leader",
        description: "Terbuka setelah 50 aktivitas",
        icon: "lock",
        locked: true,
      },
    ],
    stats: [
      { id: "bookings", label: "Booking", value: 24, icon: "bookings" },
      { id: "communities", label: "Komunitas", value: 7, icon: "communities" },
      { id: "activities", label: "Aktivitas", value: 12, icon: "activities" },
    ],
  },
];

export function getProfileByUsername(username: string) {
  return PROFILE_DATA.find((profile) => profile.username === username);
}
