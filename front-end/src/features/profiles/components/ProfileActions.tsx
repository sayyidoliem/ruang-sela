"use client";

import { useRouter } from "next/navigation";
import type { Route } from "next";
import { Check, Share2 } from "lucide-react";
import { useState } from "react";

interface ProfileActionsProps {
  username: string;
}

export default function ProfileActions({ username }: ProfileActionsProps) {
  const router = useRouter();
  const [copied, setCopied] = useState(false);

  const shareProfile = async () => {
    const url = window.location.href;

    if (navigator.share) {
      await navigator
        .share({ title: "Profil RuangSela", url })
        .catch(() => undefined);
      return;
    }

    await navigator.clipboard.writeText(url);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="mt-5 flex flex-wrap items-center justify-center gap-3.5 sm:justify-start">
      <button
        type="button"
        onClick={() => router.push(`/profil/${username}/edit` as Route)}
        className="rounded-lg bg-[#5e43f3] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#4e33df] focus:outline-none focus:ring-2 focus:ring-[#5e43f3] focus:ring-offset-2"
      >
        Edit Profil
      </button>
      <button
        type="button"
        onClick={shareProfile}
        className="inline-flex items-center gap-2 rounded-lg border border-[#5e43f3]/40 bg-white px-5 py-2.5 text-sm font-semibold text-[#5e43f3] transition-colors hover:border-[#5e43f3] hover:bg-violet-50 focus:outline-none focus:ring-2 focus:ring-[#5e43f3] focus:ring-offset-2"
      >
        {copied ? (
          <Check className="h-4 w-4" />
        ) : (
          <Share2 className="h-4 w-4" />
        )}
        {copied ? "Tautan Disalin" : "Bagikan Profil"}
      </button>
    </div>
  );
}
