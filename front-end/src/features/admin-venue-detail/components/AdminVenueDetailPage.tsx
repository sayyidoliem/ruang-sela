"use client";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import {
  ADMIN_VENUE_DETAILS,
  FALLBACK_ADMIN_VENUE_DETAIL,
} from "../data/venue-details";
import type { VenueDetailStatus } from "../types/admin-venue-detail";
import ImagePreviewModal from "./venue-detail/ImagePreviewModal";
import RejectVenueModal from "./venue-detail/RejectVenueModal";
import ReviewSidebar from "./venue-detail/ReviewSidebar";
import VenueGallery from "./venue-detail/VenueGallery";
export default function AdminVenueDetailPage({ venueId }: { venueId: string }) {
  const router = useRouter();
  const venue = ADMIN_VENUE_DETAILS[venueId] ?? {
    ...FALLBACK_ADMIN_VENUE_DETAIL,
    id: venueId,
  };
  const [status, setStatus] = useState<VenueDetailStatus>(venue.status);
  const [activeImage, setActiveImage] = useState(0);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [notice, setNotice] = useState("");
  const total = venue.images.length;
  const previous = useCallback(() => {
    if (total > 1) setActiveImage((i) => (i === 0 ? total - 1 : i - 1));
  }, [total]);
  const next = useCallback(() => {
    if (total > 1) setActiveImage((i) => (i === total - 1 ? 0 : i + 1));
  }, [total]);
  const decide = (value: VenueDetailStatus) => {
    setStatus(value);
    setNotice(
      value === "verified"
        ? "Venue berhasil diverifikasi."
        : "Pengajuan venue berhasil ditolak.",
    );
    setRejectOpen(false);
    setReason("");
    window.setTimeout(() => setNotice(""), 2500);
  };
  useEffect(() => {
    if (!previewOpen && !rejectOpen) return;
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        rejectOpen ? setRejectOpen(false) : setPreviewOpen(false);
      }
      if (previewOpen && e.key === "ArrowLeft") previous();
      if (previewOpen && e.key === "ArrowRight") next();
    };
    document.addEventListener("keydown", key);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", key);
      document.body.style.overflow = "";
    };
  }, [previewOpen, rejectOpen, previous, next]);
  return (
    <main className="min-h-[calc(100vh-4rem)] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={() => router.push("/admin/tempat")}
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali ke Verifikasi Tempat
          </button>
          {notice && (
            <span
              role="status"
              className="rounded-lg bg-emerald-50 px-4 py-2 text-xs font-semibold text-emerald-700"
            >
              {notice}
            </span>
          )}
        </header>
        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
          <VenueGallery
            venue={venue}
            status={status}
            activeImage={activeImage}
            onSelect={setActiveImage}
            onPrevious={previous}
            onNext={next}
            onPreview={() => setPreviewOpen(true)}
          />
          <ReviewSidebar
            venue={venue}
            status={status}
            onReject={() => setRejectOpen(true)}
            onVerify={() => decide("verified")}
          />
        </div>
      </div>
      {previewOpen && total > 0 && (
        <ImagePreviewModal
          name={venue.name}
          images={venue.images}
          activeImage={activeImage}
          onSelect={setActiveImage}
          onPrevious={previous}
          onNext={next}
          onClose={() => setPreviewOpen(false)}
        />
      )}{" "}
      {rejectOpen && (
        <RejectVenueModal
          reason={reason}
          onReasonChange={setReason}
          onClose={() => setRejectOpen(false)}
          onSubmit={() => decide("rejected")}
        />
      )}
    </main>
  );
}
