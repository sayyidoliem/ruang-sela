import Image from "next/image";
import Link from "next/link";
import { MapPin, MessageSquare, Star, Wallet } from "lucide-react";
const IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCFRubSHzrPPt0FEEnOaZl2aOA1-hQ_MuRwGdQZz7n1C6AgEwtuu7Rc5TuTj0_j2J3Fr9tQWap3pei7rsmZuz6EuzmmkfD0xGp_UxcZE_gz3O8kd-oFYBV-lAQ7ydMNrKhAx09m8OM3Jdsq_vlhaQNGP49NH_66SVKNl4ZZb09eURK7u7GwgNciSb8o1WjtWz_xObsebI6qYOMeqr8uP9SroQt8VFzjiZ_JlyQ0RDMrU5FiM6Y3rso";
export default function VenueOverview() {
  return (
    <>
      <section className="flex flex-col items-center gap-6 rounded-2xl border bg-white p-5 shadow-sm sm:flex-row">
        <div className="relative h-48 w-full shrink-0 overflow-hidden rounded-xl sm:w-64">
          <Image
            src={IMAGE}
            alt="Aula Kelurahan Melati"
            fill
            sizes="256px"
            className="object-cover"
          />
        </div>
        <div>
          <p className="flex items-center gap-1 text-xs text-slate-400">
            <MapPin className="h-4 w-4" />
            Jakarta Selatan
          </p>
          <h2 className="mt-2 text-2xl font-black">Aula Kelurahan Melati</h2>
          <p className="mt-2 text-xs">Aktif dan dapat dibooking</p>
          <div className="mt-5 flex gap-3">
            <Link
              href="/ruang/aula-kelurahan-melati"
              className="rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white"
            >
              Lihat Tempat
            </Link>
            <Link
              href="/pengelola/tempat/aula-kelurahan-melati/edit"
              className="rounded-xl border px-5 py-2.5 text-xs font-bold"
            >
              Edit Tempat
            </Link>
          </div>
        </div>
      </section>
      <div className="grid gap-5 sm:grid-cols-2">
        <article className="flex justify-between rounded-2xl border bg-white p-5">
          <div>
            <p className="text-xs">Rating Tempat</p>
            <p className="text-2xl font-black">
              4,8{" "}
              <Star className="inline h-5 w-5 fill-amber-400 text-amber-400" />
            </p>
          </div>
          <MessageSquare />
        </article>
        <article className="flex justify-between rounded-2xl border bg-white p-5">
          <div>
            <p className="text-xs">Estimasi Pendapatan</p>
            <p className="text-xl font-bold">Rp12.500.000</p>
          </div>
          <Wallet />
        </article>
      </div>
    </>
  );
}
