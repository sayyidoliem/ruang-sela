import Image from "next/image";
import Link from "next/link";
import { Edit3, Share2 } from "lucide-react";
import type { ManagerAccount } from "../../types/manager-account";
export default function ProfileHero({
  account,
  copied,
  onShare,
}: {
  account: ManagerAccount;
  copied: boolean;
  onShare: () => void;
}) {
  return (
    <section className="flex flex-col items-center gap-6 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm sm:flex-row sm:items-start sm:p-8">
      <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full ring-4 ring-purple-100 shadow-lg sm:h-28 sm:w-28">
        <Image
          src={account.avatarSrc}
          alt={account.fullName}
          fill
          priority
          sizes="112px"
          className="object-cover"
        />
      </div>
      <div className="flex-1 text-center sm:text-left">
        <div className="flex flex-wrap items-center justify-center gap-3 sm:justify-start">
          <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            {account.fullName}
          </h2>
          <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600">
            Pengelola Terverifikasi
          </span>
        </div>
        <p className="mt-1 font-medium text-[#7357FB]">{account.role}</p>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-600">
          {account.bio}
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-3 sm:justify-start">
          <Link
            href="/pengelola/settings"
            className="inline-flex items-center gap-2 rounded-lg bg-[#7357FB] px-5 py-2.5 text-sm font-semibold text-white"
          >
            <Edit3 className="h-4 w-4" />
            Edit Profil
          </Link>
          <button
            type="button"
            onClick={onShare}
            className="inline-flex items-center gap-2 rounded-lg border border-violet-300 px-5 py-2.5 text-sm font-semibold text-[#7357FB]"
          >
            <Share2 className="h-4 w-4" />
            {copied ? "Tautan Disalin" : "Bagikan Profil"}
          </button>
        </div>
      </div>
    </section>
  );
}
