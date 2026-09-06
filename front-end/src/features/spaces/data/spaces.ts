import { availableTagPresets } from "@/app/components/CardAvailable";
import type { Space } from "../types/space";

export const SPACES: Space[] = [
  {
    id: "space-1",
    slug: "aula-warga-kebayoran",
    imageSrc:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAFzODiHGoFKXDrxHF1xhcxtUEGsPLuq_BzDaPxPpR2mcr-ngXv2IwFdRV8b4C30LfOGU6kCdKEalr8K_5OvDiXwoPUCv9IVEZtCo5gPL-1fECyKj9cZqgKdG3V2h9YMPlBPi4D3oTa1toQF81a4SgYrxUugODWk8jK9GuhNKvMQ1bzg3aBPVHw9jxnN7rAJNrUPaccatH0zP0xjk_IaiQ3fwsnBB4gAHnPoyKWlP9m7HxU9w5IWd_U",
    imageAlt: "Interior Aula Warga Kebayoran",
    title: "Aula Warga Kebayoran",
    location: "Jakarta Selatan",
    distanceKm: 2.5,
    rating: 4.8,
    verified: true,
    tags: [
      // availableTagPresets.capacity("150 Orang"),
      // availableTagPresets.wifi(),
      // availableTagPresets.ac(),
    ],
    price: 50000,
    priceUnit: "sesi",
    latitude: -6.244,
    longitude: 106.799,
    markerPosition: { top: "21%", left: "28%" },
  },
  {
    id: "space-2",
    slug: "ruang-kolaborasi-cilandak",
    imageSrc:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAoQIsssxvxiLqeyulGJCR86L2iD1izlwjJloDJVojWs1yjkMpbl2aI8gxkmN57Zdrh_UH9JBw5NjdWixsEB2de_eypaYZE9YLl7Y4cXcPXmeqC-fSwqDACaDiq4oSAdZmMu8V5MhLhPgEma83fGWGj7EFVHGJV1hKaemRwCjde4otyJf2IEOVej8_M1goVC6YlZ2VqHFDf5dgePkMsaW9HscIy6E-Ie8aSwXuIAh-LCHyCUk9gpjpa",
    imageAlt: "Ruang Kolaborasi Cilandak",
    title: "Ruang Kolaborasi Cilandak",
    location: "Jakarta Selatan",
    distanceKm: 3.1,
    rating: 4.9,
    verified: true,
    tags: [
      // availableTagPresets.capacity("80 Orang"),
      // availableTagPresets.wifi(),
      // availableTagPresets.ac(),
    ],
    price: 75000,
    priceUnit: "sesi",
    latitude: -6.289,
    longitude: 106.798,
    markerPosition: { top: "35%", left: "63%" },
  },
  {
    id: "space-3",
    slug: "balai-kreatif-tebet",
    imageSrc:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCkGoRdO9NpLQTFLFrHBxxo2CvElOH90fdBMMosTUSEUKRMnDwtL9_dlSax8rBvXR6_lYKWH7jLr85a-ZCzMrA4BCUljID-mspUmgoEs1X5VQrFDJ2frAYjiKzJUGNzekbh392Fw3B419VGT9W9h1Hmwk9M1tLgTttsV8gqkam1lA4j9RQgbnghQ2jxfC6m86Ai2cSJBwLifaGr5Uct1JTfDOXBgZ_Kc6Votgy-gkAQ0wJ98Fu810qX",
    imageAlt: "Balai Kreatif Tebet",
    title: "Balai Kreatif Tebet",
    location: "Jakarta Selatan",
    distanceKm: 4.2,
    rating: 4.7,
    verified: true,
    tags: [
      // availableTagPresets.capacity("120 Orang"),
      // availableTagPresets.wifi(),
      // availableTagPresets.ac(),
    ],
    price: 65000,
    priceUnit: "sesi",
    latitude: -6.229,
    longitude: 106.852,
    markerPosition: { top: "49%", left: "53%" },
  },
];
