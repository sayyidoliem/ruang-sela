KEYWORDS = [
    "aula",
    "halaman",
    "taman",
    "lapangan",
    "ruang komunitas",
    "ruang kampus",
    "area komunal",
    "balai warga",
    "gedung serbaguna",
    "co-working space",
]

TARGET_LOCATION = "Jakarta Barat"
TARGET_COORDS = "-6.168242,106.758986"  # Central Jakarta Barat
ZOOM = "14z"

# DKI Jakarta large scale
DKI_WILAYAH = [
    "Jakarta Barat",
    "Jakarta Pusat",
    "Jakarta Selatan",
    "Jakarta Timur",
    "Jakarta Utara",
]
DKI_CENTER = "-6.208763,106.845599"  # Monas center DKI
DKI_ZOOM = "11z"
DKI_BOUNDS = {
    "lat_min": -6.40,
    "lat_max": -6.05,
    "lng_min": 106.65,
    "lng_max": 107.05,
}

LIMIT_TOTAL = 5
LIMIT_DKI_TOTAL = 60  # target skala besar DKI (opsi 50-70)
LIMIT_PER_KEYWORD_DKI = 8  # max 8 per keyword -> 10 keyword ~80 sebelum dedup/filter
HEADLESS = False  # set True untuk production; False untuk debug lihat browser
TIMEOUT_MS = 25000
SCROLL_DELAY_MS = 1800
DETAIL_DELAY_MS = 1500

# Selectors robust (fallback banyak)
SELECTORS = {
    "feed": 'div[role="feed"]',
    "place_links": 'a[href*="/maps/place/"]',
    "place_links_alt": 'a[data-value="Directions"]',
    "consent": 'button:has-text("Accept all"), button:has-text("Terima semua"), button:has-text("I agree")',
}

# Untuk export
OUTPUT_DIR = "data/raw"
