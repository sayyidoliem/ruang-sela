"use client";

import { useEffect, useRef } from "react";

interface LocationMapProps {
  lat: number;
  lng: number;
  title: string;
  address: string;
}

export default function LocationMap({
  lat,
  lng,
  title,
  address,
}: LocationMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const instanceRef = useRef<ReturnType<
    typeof import("leaflet").map
  > | null>(null);

  useEffect(() => {
    if (!mapRef.current || instanceRef.current) return;

    let L: typeof import("leaflet");
    import("leaflet").then((mod) => {
      L = mod;

      const map = L.map(mapRef.current!, {
        center: [lat, lng],
        zoom: 15,
        zoomControl: false,
        attributionControl: true,
      });

      L.control.zoom({ position: "bottomright" }).addTo(map);

      L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
          maxZoom: 19,
        },
      ).addTo(map);

      const icon = L.divIcon({
        html: `<div style="width:28px;height:28px;background:#7c3aed;border:3px solid #fff;border-radius:50%;box-shadow:0 2px 8px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;">
          <svg width="14" height="14" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="3" fill="#fff"/></svg>
        </div>`,
        className: "",
        iconSize: [28, 28],
        iconAnchor: [14, 28],
        popupAnchor: [0, -30],
      });

      L.marker([lat, lng], { icon })
        .addTo(map)
        .bindPopup(
          `<div style="min-width:180px">
            <strong style="font-size:13px;color:#1e293b">${title}</strong>
            <p style="font-size:11px;color:#64748b;margin:4px 0 0">${address}</p>
          </div>`,
        )
        .openPopup();

      instanceRef.current = map;

      setTimeout(() => map.invalidateSize(), 100);
    });

    return () => {
      instanceRef.current?.remove();
      instanceRef.current = null;
    };
  }, [lat, lng, title, address]);

  return (
    <div
      ref={mapRef}
      className="h-72 w-full overflow-hidden rounded-2xl sm:h-80"
    />
  );
}
