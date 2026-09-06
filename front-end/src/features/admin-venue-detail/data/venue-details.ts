import type { AdminVenueDetail } from "../types/admin-venue-detail";

const images = [
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDSYJv5B4XN1NmltuuXhOKm1bEGG5tAkemX8pychka_XORIvfsJBQ8JOp0rMOXWx_RtczD43MBcl-zHGkGzuPiwUSElghFjA1f9sxV8z5wstfr37Gj1yMli66_kauAPsgqrJbgRjtibaq5oLDP4xQdtgcEm5rnQ2z4YNXcphFfRJ-3llSJGDgFN04iVmmnBoLlqdGH-x1k8pEBALq4mYg0OsMKwsJfU0bLJgeTug7HjRusqQG_pnd4BHpVnutmmutfe",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCo7csl4uTWmcXMGehWzBOdA5y5NAoEsA2iiW314bqAc54um-oUZ8mhL73uPmIb5ACWiT1eOUbH9yV4Ceussg3oPV301vGdgcKadVSKIsxaphsKx9ihIybGxEG5Mo2Rk4aZDs2ov4TcpA6-W3bihkh_7sbRFg3ElzXTZnqfV8CsJrdHvpWvzbEwtn_o2ISuXPzi5PfPnM87SQivdM6OO9wOfwj_0-xRy814IACXzhhA4dvQmnezp1HYyrf35DLsjunM",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAXvV1gNYEGqTcy55_TnGfn-fSCbZmRVZWgKyrMvzcCNj2rMEZMWWtiKL965ZUjgIFvFM0IVkJ0fJQ5hGsatCnanLLlTQfSxPo7jitTW8cM4UoX0i2vNdIt1PnSFKq3CddE4Ba0nUWLP2MQISLGfy8SKYsAoAxDNQ5YSeds384YhSkClxG9n9OuSKA1CFOWJGd9NP55FU-VJd5AIZLg9eqs7SV7gr2MySfQXRpc8iRw-rKEklMvwYz13oCu8F-jrKqm",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDCNKHUKLkd4or4KMwdmY-6MCD50N_GjD16T9MqXLxEaupbBw6T-t9NX2B_MC6nmm_RpFQFmpvENiIigKIiZ2EN_gQR_E_VCUKeNQNEV17XD3ExpxrEb1z-RnmX6rO9tOsh-38Jd-EpdSJbN3yz7LnLPXTVSU8DNxbLEZLln7nWpc5c-fZlmYMKUx9HW79w1uXu4e-oGCYmJA6nfyHm1RMM4XA4hswHq4y7IXFUxwmX4EH-mYa2jNAWE3zO4mTv5OEg",
];

export const ADMIN_VENUE_DETAILS: Record<string, AdminVenueDetail> = {
  "venue-1": {
    id: "venue-1",
    submissionCode: "V-8924",
    name: "Ruang Diskusi Warga 01",
    location: "Kebayoran Baru, Jakarta Selatan",
    managerName: "Budi Santoso",
    communityName: "Komunitas Kreatif",
    category: "Ruang Rapat",
    capacity: 45,
    description:
      "Ruang serbaguna ber-AC dengan meja fleksibel dan pencahayaan alami memadai. Cocok untuk musyawarah warga, workshop komunitas, kelas coding, atau rapat kerja pengurus RT/RW.",
    address:
      "Jl. Gandaria Tengah II No. 14, RT 03 / RW 02, Kebayoran Baru, Jakarta Selatan, DKI Jakarta 12130",
    status: "pending",
    images,
    documents: [
      {
        id: "ownership",
        name: "Surat Kepemilikan",
        description: "Dokumen kepemilikan atau hak kelola venue",
        status: "valid",
      },
      {
        id: "permit",
        name: "Izin Lingkungan",
        description: "Persetujuan penggunaan ruang dari lingkungan",
        status: "valid",
      },
      {
        id: "identity",
        name: "Identitas Pengelola",
        description: "KTP pengelola yang bertanggung jawab",
        status: "valid",
      },
    ],
  },
};

export const FALLBACK_ADMIN_VENUE_DETAIL: AdminVenueDetail = {
  ...ADMIN_VENUE_DETAILS["venue-1"],
  id: "unknown",
  submissionCode: "V-UNKNOWN",
};
