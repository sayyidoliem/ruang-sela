"use client";

import { useEffect, useRef } from "react";
import type { Space } from "../types/space";

interface SearchMapProps {
  spaces: Space[];
  selectedSpaceId?: string;
  onMarkerClick?: (spaceId: string) => void;
}

function formatCompactPrice(value: number) {
  if (value >= 1_000_000) return `Rp ${value / 1_000_000} jt`;
  return `Rp ${Math.round(value / 1_000)} rb`;
}

export default function SearchMap({
  spaces,
  selectedSpaceId,
  onMarkerClick,
}: SearchMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const instanceRef = useRef<InstanceType<typeof import("leaflet").Map> | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const markersRef = useRef<Map<string, { marker: InstanceType<typeof import("leaflet").Marker>; defaultIcon: InstanceType<typeof import("leaflet").DivIcon>; selectedIcon: InstanceType<typeof import("leaflet").DivIcon> }>>(new Map());

  useEffect(() => {
    if (!mapRef.current || instanceRef.current) return;

    let cancelled = false;

    import("leaflet").then((L) => {
      if (cancelled || !mapRef.current) return;

      const valid = spaces.filter(
        (s) => Number.isFinite(s.latitude) && Number.isFinite(s.longitude),
      );

      const center: [number, number] =
        valid.length > 0
          ? [valid[0].latitude, valid[0].longitude]
          : [-6.17, 106.76];

      const map = L.map(mapRef.current!, {
        center,
        zoom: 13,
        zoomControl: false,
        attributionControl: true,
      });

      L.control.zoom({ position: "bottomright" }).addTo(map);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map);

      const defaultIcon = L.divIcon({
        html: `<div style="width:24px;height:24px;background:#3b82f6;border:2.5px solid #fff;border-radius:50%;box-shadow:0 2px 6px rgba(0,0,0,0.3);"></div>`,
        className: "",
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });

      const selectedIcon = L.divIcon({
        html: `<div style="width:28px;height:28px;background:#6347EB;border:3px solid #fff;border-radius:50%;box-shadow:0 2px 8px rgba(99,71,235,0.5);"></div>`,
        className: "",
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });

      valid.forEach((space) => {
        const marker = L.marker([space.latitude, space.longitude], {
          icon: defaultIcon,
        }).addTo(map);

        const label =
          space.price > 0
            ? `<div style="background:#fff;border:1px solid #e2e8f0;border-radius:6px;padding:2px 6px;font-size:11px;font-weight:700;color:#1e293b;white-space:nowrap;box-shadow:0 1px 4px rgba(0,0,0,0.1);margin-bottom:4px;text-align:center">${formatCompactPrice(space.price)}</div>`
            : "";

        marker.bindTooltip(label, {
          permanent: true,
          direction: "top",
          offset: [0, -14],
          className: "",
          opacity: 1,
        });

        marker.bindPopup(
          `<div style="min-width:160px">
            <strong style="font-size:12px;color:#1e293b">${space.title}</strong>
            <p style="font-size:11px;color:#64748b;margin:2px 0 0">${space.location}</p>
          </div>`,
        );

        marker.on("click", () => onMarkerClick?.(space.id));
        markersRef.current.set(space.id, { marker, defaultIcon, selectedIcon });
      });

      if (valid.length > 1) {
        const group = L.featureGroup(valid.map((s) =>
          L.marker([s.latitude, s.longitude]),
        ));
        map.fitBounds(group.getBounds().pad(0.15));
      }

      instanceRef.current = map;
      setTimeout(() => map.invalidateSize(), 200);
    });

    return () => {
      cancelled = true;
      instanceRef.current?.remove();
      instanceRef.current = null;
      markersRef.current.clear();
    };
  }, []);

  useEffect(() => {
    markersRef.current.forEach(({ marker, defaultIcon, selectedIcon }, id) => {
      marker.setIcon(id === selectedSpaceId ? selectedIcon : defaultIcon);
    });
  }, [selectedSpaceId]);

  return (
    <section
      className="relative hidden min-h-[500px] flex-1 overflow-hidden lg:block"
      aria-label="Peta lokasi ruang"
    >
      <div ref={mapRef} className="h-full w-full" />
    </section>
  );
}
