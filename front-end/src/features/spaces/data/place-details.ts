import type { PlaceDetail } from "../types/place-detail";

export const PLACE_DETAILS: PlaceDetail[] = [
  {
    id: "space-1",
    slug: "aula-warga-kebayoran",
    title: "Aula Warga Kebayoran",
    location: "Kebayoran Baru, Jakarta Selatan",
    address: "Jl. Melawai No. 12, Jakarta",
    verified: true,
    price: 50000,
    priceUnit: "sesi",
    durationHours: 4,
    capacity: 50,
    minimumBooking: "1 Sesi",
    description: [
      "Aula Warga Kebayoran adalah ruang serbaguna yang dirancang untuk mendukung berbagai kegiatan komunitas, mulai dari rapat warga, lokakarya, hingga acara kebudayaan skala menengah. Fasilitas ini dikelola oleh pengurus RW setempat dan terbuka untuk disewa oleh masyarakat umum dengan tarif yang terjangkau.",
      "Ruangan ini mengutamakan kenyamanan dengan pencahayaan alami yang baik, sirkulasi udara yang memadai, dan desain interior yang fungsional namun tetap memberikan kesan hangat. Cocok untuk kegiatan yang membutuhkan fokus maupun interaksi komunal.",
    ],
    images: [
      {
        src: "https://lh3.googleusercontent.com/aida-public/AB6AXuDnWfJlRW0roy0GgADqwKL9ktXmgrH0ryoveV9xShHq4hRxYE6IASatc7DNIuUOqU0kwQz5WQUE8gfsgn0C4PpJanJPZ7HZqhQOgWQG7vktjliQDg3sc8OEUZSny_MUCx1EcRiNZ9WkBt_9VrCX_DM2c4IKEoN07pBiWRfQaxW8fFhJfuwbGMUztgsx9fm6tsIBksXq7Squ7P3q9LgbtCf4oWHicVlN8MkzZIuJIQ7bQzHmIKAdVVUm",
        alt: "Aula utama ruang serbaguna",
      },
      {
        src: "https://lh3.googleusercontent.com/aida-public/AB6AXuA14AIx4uAQvuv7Mg-Q_SgCGPU_j77YIQx1X-fbD0oT2kBZuSeDm5V-dCynvSBLt2ro_d3Vr0jjvGSG9TfI3QQGBUyttGSkExEnDze1woZhQAqSOMiJbUWEN5YOL_B5PRPllMDEiEf_R5PwC0bwfYfv7EFgh8xT4sJnyVNDzpJzLslYBHv0gmc1TZ8fD8G-p5SfK4ArKXsL6Y7DizYQ22zTDNIol7ajWBrO8ZTIKjrU5cjFLv9q4ocU",
        alt: "Soundboard mixer dan sistem audio",
      },
      {
        src: "https://lh3.googleusercontent.com/aida-public/AB6AXuD6j0mvBdG8EPzyRuK0UtcqIjaVUkrdkmU9ZumcdR4eGVIbj0smpB0TmKRFDhLP3hQV3n0zhjPQ6JEwfg8L9vM42N_d9JvQ_eTP0Gj60bM14ooDXyUT2lSaLQws_9qp_A-sLeOLqbxAwkIKyjw-DIHK5JYjzbAMwBFk_k94oVb28m6C4b-vGJgsR2jMhevsrJYAnd-LfHqIkKsBeEwCQw3mtlD6xDt8k60P6twbHTeti42OZvWlsFkm",
        alt: "Eksterior gedung Aula Warga Kebayoran",
      },
    ],
    operatingHours: [
      { day: "Senin", hours: "08.00 - 10.00" },
      { day: "Selasa", hours: "08.00 - 10.00" },
      { day: "Rabu", hours: "08.00 - 10.00" },
    ],
    facilities: [
      "WiFi",
      "AC",
      "Proyektor",
      "Sound System",
      "Kursi",
      "Meja",
      "Toilet",
      "Parkir",
      "Panggung",
      "Dapur",
    ],
    selectedDate: 30,
    bookedDates: [12, 13, 20, 21],
    crowdLevels: [
      8, 12, 15, 20, 35, 45, 65, 62, 55, 52, 48, 50, 38, 45, 48, 44, 35, 30, 18,
      10,
    ],
    reviews: [
      {
        id: "review-1",
        rating: 5,
        comment:
          "Tempatnya sangat bersih dan pengurusnya sangat kooperatif. Cocok untuk acara komunitas kami.",
        author: "Ryan Apriansyah",
        role: "Mahasiswa",
      },
      {
        id: "review-2",
        rating: 5,
        comment:
          "Fasilitas lengkap, proses pengajuan jelas, dan lokasi mudah dijangkau oleh peserta.",
        author: "Aulia Rahma",
        role: "Koordinator Komunitas",
      },
      {
        id: "review-3",
        rating: 5,
        comment:
          "Ruangannya nyaman dan sistem audionya bekerja dengan baik untuk kegiatan lokakarya.",
        author: "Dimas Pratama",
        role: "Fasilitator",
      },
    ],
  },
];

export function getPlaceBySlug(slug: string) {
  return PLACE_DETAILS.find((place) => place.slug === slug);
}
