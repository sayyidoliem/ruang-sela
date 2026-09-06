import type { ManagedPlaceForm, PlaceMedia } from "../types/manager-place";

export const PLACE_CATEGORIES = [
  "Ruang Rapat",
  "Coworking Space",
  "Hall & Ballroom",
  "Aula Komunitas",
];

export const INITIAL_MANAGED_PLACE: ManagedPlaceForm = {
  name: "Ruang Komunitas Menteng Utama",
  category: "Ruang Rapat",
  capacity: 50,
  description:
    "Ruang rapat modern yang terletak di jantung kota, cocok untuk pertemuan warga, diskusi komunitas, atau lokakarya kecil. Dilengkapi dengan fasilitas presentasi lengkap dan pencahayaan alami yang baik.",
  address: "Jl. Menteng Raya No. 10, Jakarta Pusat, DKI Jakarta",
  sessionPrice: "500.000",
  additionalHourlyPrice: "150.000",
  securityDeposit: "200.000",
  facilities: [
    "AC",
    "Kipas Angin",
    "Wi-Fi",
    "Televisi",
    "Meja",
    "Proyektor",
    "Lemari",
    "Aula",
  ],
  operatingHours: [
    { id: "monday", day: "Senin", open: "08:00", close: "20:00" },
    { id: "tuesday", day: "Selasa", open: "08:00", close: "20:00" },
    { id: "wednesday", day: "Rabu", open: "08:00", close: "20:00" },
    { id: "thursday", day: "Kamis", open: "08:00", close: "20:00" },
    { id: "saturday", day: "Sabtu", open: "08:00", close: "20:00" },
  ],
};

export const INITIAL_PLACE_MEDIA: PlaceMedia[] = [
  {
    id: "main",
    primary: true,
    alt: "Ruang rapat utama",
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuCzGQ0kIiLrUWQmU36aQeIlrMEGef3GzA2BxYjIv-qXPn0h2-FQd2wVfehBJa_zI0wE8CcHphf5B2R9R5TG_ahtrHoXCzEmBX-qdccxCbnDUACiIJYQcFH1YjMIavUBL29Au1BUx_t8Mtl66KPld-8-CxT6RUpo-AJJwWZzemGT2zjq5i9iaDYm6O0TYSF-qwQcw6aFFns_MxJMt0k3A6TXOCSNHkPacLB4i2UyiDgRMnXfIz9o4Ro",
  },
  {
    id: "projector",
    alt: "Proyektor dan layar",
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuBKG0vqdH1MzeV3SPmp9USWpsww2Xfp91cqtiUvY7_4jKLkJlkwWeKcvxAYIsLLdF6jeAQ-PP_LY5zqbyU6CmIfBjXEWJlPCp7jTAEen0cu4brry0Qd8RNQSkwkGuauBgwaHs_ifoBbw1WC-jDOfVoTRY8kUaUnzGWLwBbfye_6zVJ4t1ueERXBaDa4alESMXEkfgS6G-tMtTs_zPsJYpR0xutu78CMm5cNv9E-pQi4MePb-_DLW9g",
  },
  {
    id: "lounge",
    alt: "Sofa dan lounge",
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuDyQ_8fFWUZsJLBJ-Dz4TkojHnninTp_MShAuiKVpB2hhaNqOZdjov2P8GvTBz-DZD6zVeP5JTZS8iJfanHWTfAXaigURTvQ7BzLb5ga2wFh0j68F7n8MaJ7FCepNYpubi--qINh49ApBWw6_6EE7hCz6W7IzYWatiWYkSIddOKrqWxRDdUFwZ12fPvt0FXlFYkHERHVlJOWpbNv9s2ser_O-N-nP48llMgHP-Cjv17owpFesC_24Y",
  },
];
