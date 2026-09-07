import Image from "next/image";
import Link from "next/link";
import { MapPin } from "lucide-react";
const PLACE_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCFRubSHzrPPt0FEEnOaZl2aOA1-hQ_MuRwGdQZz7n1C6AgEwtuu7Rc5TuTj0_j2J3Fr9tQWap3pei7rsmZuz6EuzmmkfD0xGp_UxcZE_gz3O8kd-oFYBV-lAQ7ydMNrKhAx09m8OM3Jdsq_vlhaQNGP49NH_66SVKNl4ZZb09eURK7u7GwgNciSb8o1WjtWz_xObsebI6qYOMeqr8uP9SroQt8VFzjiZ_JlyQ0RDMrU5FiM6Y3rso";
export default function ManagedPlaceCard() {
  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold">Tempat yang Dikelola</h2>
        <Link
          href="/pengelola/tempat"
          className="text-sm font-semibold text-[#7357FB]"
        >
          Kelola Tempat
        </Link>
      </div>
      <article className="flex flex-col gap-5 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:flex-row">
        <div className="relative h-48 w-full shrink-0 overflow-hidden rounded-xl sm:w-64">
          <Image
            src={PLACE_IMAGE}
            alt="Aula Kelurahan Melati"
            fill
            sizes="(max-width:640px) 100vw,256px"
            className="object-cover"
          />
        </div>
        <div>
          <p className="flex items-center gap-1.5 text-xs text-slate-500">
            <MapPin className="h-4 w-4" />
            Jakarta Selatan
          </p>
          <h3 className="mt-2 text-xl font-bold">Aula Kelurahan Melati</h3>
          <p className="mt-2 text-sm text-slate-500">
            Tempat aktif dan terverifikasi untuk pertemuan serta kegiatan
            komunitas.
          </p>
          <div className="mt-5 flex gap-4 text-xs">
            <span>
              <b>84</b> booking
            </span>
            <span>
              <b>4,8</b> rating
            </span>
            <span className="font-semibold text-emerald-600">Aktif</span>
          </div>
        </div>
      </article>
    </section>
  );
}
