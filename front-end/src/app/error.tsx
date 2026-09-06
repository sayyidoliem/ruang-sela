"use client";
import { useEffect } from "react";
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error", {
      message: error.message,
      digest: error.digest,
    });
  }, [error]);
  return (
    <main className="grid min-h-screen place-items-center px-6">
      <section className="max-w-md text-center">
        <h1 className="text-3xl font-bold">Terjadi kendala</h1>
        <p className="mt-3 text-slate-600">
          Sistem tidak dapat memuat halaman. Silakan coba kembali.
        </p>
        <button
          onClick={reset}
          className="mt-6 rounded-xl bg-emerald-700 px-5 py-3 font-semibold text-white"
        >
          Coba kembali
        </button>
      </section>
    </main>
  );
}
