"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Loader2,
  Lock,
  Mail,
  Eye,
  EyeOff,
  MapPin,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, rememberMe }),
      });
      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          data?.error?.message || data?.detail || "Email atau password salah.",
        );
      }

      const user = data?.data?.user;
      const session = data?.data?.session;
      if (session?.access_token) {
        localStorage.setItem("rs_access_token", session.access_token);
        localStorage.setItem("rs_refresh_token", session.refresh_token || "");
        localStorage.setItem("rs_auth_provider", "email");
      }
      if (user) {
        const role = (user?.app_metadata?.role || user?.user_metadata?.role || "user").toLowerCase();
        localStorage.setItem("rs_role", role);
        if (user?.user_metadata?.name) localStorage.setItem("rs_name", user.user_metadata.name);
        if (user?.user_metadata?.fullName) localStorage.setItem("rs_name", user.user_metadata.fullName);
        if (user?.email) localStorage.setItem("rs_email", user.email);
      }
      if (!session?.access_token && data?.token) {
        localStorage.setItem("rs_access_token", data.token);
      }

      window.dispatchEvent(new Event("authchange"));
      router.push("/cari");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login gagal. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "/api/auth/google";
  };

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm font-medium text-slate-800 placeholder:text-slate-400 transition-colors focus:border-violet-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-600/15";

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row">
      {/* BRAND SIDE */}
      <div className="relative hidden w-1/2 lg:block">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-700 via-violet-800 to-indigo-900">
          <div className="absolute inset-0 hero-bg-grid opacity-30" />
        </div>
        <div className="relative z-10 flex h-full flex-col justify-between p-12">
          <Link href="/" className="inline-flex items-center text-white">
            <span className="text-2xl font-extrabold tracking-tight">RuangSela</span>
          </Link>
          <div>
            <h2 className="mb-4 text-3xl font-extrabold leading-tight text-white lg:text-4xl">
              Temukan ruang publik
              <br />
              untuk kebutuhanmu.
            </h2>
            <p className="mb-8 max-w-md text-sm leading-relaxed text-violet-100/90">
              Jelajahi aula, taman, hingga ruang komunitas yang telah terverifikasi di
              seluruh Indonesia — lengkap dengan fasilitas dan jadwal kosongnya.
            </p>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3 rounded-xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/15">
                  <MapPin className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Ruang Terverifikasi</p>
                  <p className="text-xs text-violet-100/80">Izin resmi &amp; lokasi terverifikasi</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/15">
                  <Lock className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Profil Keamanan</p>
                  <p className="text-xs text-violet-100/80">Akun terhubung Supabase Auth</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FORM SIDE */}
      <div className="flex w-full flex-col bg-slate-50 px-6 py-10 lg:w-1/2 lg:px-16 lg:py-14">
        <div className="mb-10 lg:hidden">
          <Link href="/" className="inline-flex items-center text-violet-700">
            <span className="text-2xl font-extrabold tracking-tight">RuangSela</span>
          </Link>
        </div>

        <div className="mx-auto flex w-full max-w-md flex-col justify-center my-auto py-8">
          <div className="mb-8">
            <span className="mb-3 inline-flex items-center rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold text-violet-700">
              Selamat datang kembali
            </span>
            <h1 className="mb-2 text-3xl font-extrabold tracking-tight text-slate-900">
              Masuk ke akun mu
            </h1>
            <p className="text-sm leading-relaxed text-slate-500">
              Silakan masuk untuk melanjutkan pencarian ruang dan pengajuan.
            </p>
          </div>

          {error && (
            <div className="mb-5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
              {error}
            </div>
          )}

          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-sm font-semibold text-slate-700">
                Email
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="nama@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className={inputClass}
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-sm font-semibold text-slate-700">
                  Password
                </label>
                <Link
                  href="/lupa-password"
                  className="text-xs font-semibold text-violet-700 hover:text-violet-800"
                >
                  Lupa password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className={`${inputClass} pr-11`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 text-slate-400 transition-colors hover:text-slate-600"
                  title={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <label className="mt-1 flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 accent-violet-700"
              />
              <span className="text-sm text-slate-600">Ingat saya</span>
            </label>

            <button
              type="submit"
              disabled={isLoading}
              className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-violet-700 px-7 py-3 text-sm font-bold text-white shadow-md shadow-violet-700/20 transition-all hover:bg-violet-800 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Memproses...
                </>
              ) : (
                <>
                  Masuk
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <div className="my-6 flex items-center gap-4">
            <div className="h-px flex-1 bg-slate-200" />
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              atau
            </span>
            <div className="h-px flex-1 bg-slate-200" />
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            className="inline-flex w-full items-center justify-center gap-3 rounded-xl border border-slate-300 bg-white px-7 py-3 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50 active:scale-[0.98]"
          >
            <GoogleIcon />
            Lanjutkan dengan Google
          </button>

          <p className="mt-8 text-center text-sm text-slate-600">
            Belum punya akun?{" "}
            <Link
              href="/signup"
              className="font-bold text-violet-700 hover:text-violet-800"
            >
              Daftar sekarang
            </Link>
          </p>

          <p className="mt-10 flex items-center justify-center gap-1.5 text-center text-xs text-slate-400">
            <Lock className="h-3.5 w-3.5" />
            Login Anda diamankan dengan Supabase Auth
          </p>
        </div>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
    </svg>
  );
}