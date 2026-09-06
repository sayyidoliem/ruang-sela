import Link from "next/link";
export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center px-6 text-center">
      <div>
        <p className="font-bold text-emerald-700">404</p>
        <h1 className="mt-2 text-3xl font-bold">Halaman tidak ditemukan</h1>
        <p className="mt-3 text-slate-600">
          Periksa alamat halaman atau kembali ke beranda.
        </p>
        <Link
          className="mt-6 inline-block rounded-xl bg-emerald-700 px-5 py-3 font-semibold text-white"
          href="/"
        >
          Kembali ke beranda
        </Link>
      </div>
    </main>
  );
}
