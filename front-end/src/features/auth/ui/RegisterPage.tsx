"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Check,
  Loader2,
  Lock,
  Mail,
  Eye,
  EyeOff,
  MapPin,
  User,
  ShieldCheck,
  X,
} from "lucide-react";

type PasswordStrength = "Kosong" | "Lemah" | "Sedang" | "Kuat" | "Sangat Kuat";

function evaluateStrength(pw: string): { label: PasswordStrength; level: number } {
  if (!pw) return { label: "Kosong", level: 0 };
  let score = 0;
  if (pw.length >= 6) score++;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw) && /[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  if (score <= 1) return { label: "Lemah", level: 1 };
  if (score === 2) return { label: "Sedang", level: 2 };
  if (score === 3) return { label: "Kuat", level: 3 };
  return { label: "Sangat Kuat", level: 4 };
}

const STRENGTH_BG: Record<number, string> = {
  0: "bg-slate-200",
  1: "bg-rose-500",
  2: "bg-amber-500",
  3: "bg-emerald-500",
  4: "bg-emerald-600",
};

const STRENGTH_TEXT: Record<number, string> = {
  0: "text-slate-400",
  1: "text-rose-600",
  2: "text-amber-600",
  3: "text-emerald-600",
  4: "text-emerald-700",
};

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [domicile, setDomicile] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const strength = evaluateStrength(password);
  const passwordMatch = confirmPassword.length > 0 && password === confirmPassword;
  const passwordMismatch = confirmPassword.length > 0 && password !== confirmPassword;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!agreeTerms) {
      setError("Anda harus menyetujui Syarat & Ketentuan untuk melanjutkan.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Password tidak cocok.");
      return;
    }
    if (password.length < 6) {
      setError("Password minimal 6 karakter.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role: "user", domicile }),
      });
      const data = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(data?.error?.message || data?.detail || "Pendaftaran gagal.");
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
        localStorage.setItem("rs_name", user?.user_metadata?.fullName || name);
        localStorage.setItem("rs_email", user?.email || email);
      }
      if (!session?.access_token && data?.token) {
        localStorage.setItem("rs_access_token", data.token);
      }

      window.dispatchEvent(new Event("authchange"));
      router.push("/cari");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Pendaftaran gagal. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = () => {
    window.location.href = "/api/auth/google";
  };

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm font-medium text-slate-800 placeholder:text-slate-400 transition-colors focus:border-violet-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-600/15";

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row">
      {/* FORM SIDE */}
      <div className="flex w-full flex-col bg-slate-50 px-6 py-10 lg:w-1/2 lg:px-16 lg:py-12">
        <div className="mb-8 lg:hidden">
          <Link href="/" className="inline-flex items-center text-violet-700">
            <span className="text-2xl font-extrabold tracking-tight">RuangSela</span>
          </Link>
        </div>

        <div className="mx-auto flex w-full max-w-md flex-col justify-center my-auto py-8">
          <div className="mb-8">
            <span className="mb-3 inline-flex items-center rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold text-violet-700">
              Bergabung gratis
            </span>
            <h1 className="mb-2 text-3xl font-extrabold tracking-tight text-slate-900">
              Buat akun RuangSela
            </h1>
            <p className="text-sm leading-relaxed text-slate-500">
              Daftar untuk menemukan dan mengajukan penggunaan ruang yang sesuai kebutuhanmu.
            </p>
          </div>

          {error && (
            <div className="mb-5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
              {error}
            </div>
          )}

          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            {/* Nama Lengkap */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="full-name" className="text-sm font-semibold text-slate-700">
                Nama Lengkap
              </label>
              <div className="relative">
                <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  id="full-name"
                  type="text"
                  placeholder="Masukkan nama lengkap"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className={inputClass}
                />
              </div>
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email-address" className="text-sm font-semibold text-slate-700">
                Email
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  id="email-address"
                  type="email"
                  placeholder="nama@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className={inputClass}
                />
              </div>
            </div>

            {/* Domisili */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="domicile-input" className="text-sm font-semibold text-slate-700">
                Domisili / Kota
              </label>
              <div className="relative">
                <MapPin className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  id="domicile-input"
                  type="text"
                  placeholder="cth. Jakarta Selatan"
                  value={domicile}
                  onChange={(e) => setDomicile(e.target.value)}
                  required
                  className={inputClass}
                />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="password-input" className="text-sm font-semibold text-slate-700">
                Password
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  id="password-input"
                  type={showPassword ? "text" : "password"}
                  placeholder="Buat password (min. 6 karakter)"
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
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {password.length > 0 && (
                <div className="pt-1">
                  <div className="mb-1.5 flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-medium">Kekuatan kata sandi</span>
                    <span className={`font-bold ${STRENGTH_TEXT[strength.level]}`}>{strength.label}</span>
                  </div>
                  <div className="grid grid-cols-4 gap-1.5">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className={`h-1.5 rounded-full transition-colors duration-300 ${
                          i <= strength.level ? STRENGTH_BG[strength.level] : "bg-slate-200"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="mt-1.5 text-[11px] text-slate-400">
                    Gunakan minimal 6 karakter dengan huruf besar, angka, dan simbol.
                  </p>
                </div>
              )}
            </div>

            {/* Konfirmasi Password */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="confirm-password-input" className="text-sm font-semibold text-slate-700">
                Konfirmasi Password
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  id="confirm-password-input"
                  type={showConfirm ? "text" : "password"}
                  placeholder="Masukkan kembali password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className={`${inputClass} pr-11`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 text-slate-400 transition-colors hover:text-slate-600"
                  title={showConfirm ? "Sembunyikan konfirmasi" : "Tampilkan konfirmasi"}
                >
                  {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {confirmPassword.length > 0 &&
                (passwordMatch ? (
                  <div className="flex items-center gap-1 text-xs font-semibold text-emerald-600">
                    <Check className="h-3.5 w-3.5" />
                    Password sesuai
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-xs font-semibold text-rose-600">
                    <X className="h-3.5 w-3.5" />
                    Password tidak cocok
                  </div>
                ))}
            </div>

            {/* Terms Checkbox */}
            <label className="mt-1 flex cursor-pointer items-start gap-2.5">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-slate-300 accent-violet-700"
              />
              <span className="text-sm leading-relaxed text-slate-600">
                Saya menyetujui{" "}
                <Link href="/syarat-dan-ketentuan" className="font-semibold text-violet-700 hover:text-violet-800">
                  Syarat &amp; Ketentuan
                </Link>{" "}
                dan{" "}
                <Link href="/kebijakan-privasi" className="font-semibold text-violet-700 hover:text-violet-800">
                  Kebijakan Privasi
                </Link>{" "}
                RuangSela.
              </span>
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
                  Daftar
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <div className="my-6 flex items-center gap-4">
            <div className="h-px flex-1 bg-slate-200" />
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">atau</span>
            <div className="h-px flex-1 bg-slate-200" />
          </div>

          <button
            type="button"
            onClick={handleGoogleSignup}
            className="inline-flex w-full items-center justify-center gap-3 rounded-xl border border-slate-300 bg-white px-7 py-3 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50 active:scale-[0.98]"
          >
            <GoogleIcon />
            Daftar dengan Google
          </button>

          <p className="mt-8 text-center text-sm text-slate-600">
            Sudah punya akun?{" "}
            <Link href="/login" className="font-bold text-violet-700 hover:text-violet-800">
              Masuk
            </Link>
          </p>

          <p className="mt-10 flex items-center justify-center gap-1.5 text-center text-xs text-slate-400">
            <ShieldCheck className="h-3.5 w-3.5" />
            Pendaftaran Anda diamankan dengan Supabase Auth
          </p>
        </div>
      </div>

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
              50.000+ warga &amp; pengelola
              <br />
              sudah bergabung.
            </h2>
            <p className="mb-8 max-w-md text-sm leading-relaxed text-violet-100/90">
              RuangSela membantu warga menemukan ruang publik yang terverifikasi,
              lengkap dengan fasilitas, jadwal kosong, dan pengajuan yang mudah.
            </p>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3 rounded-xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/15">
                  <Check className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Pencarian Cepat &amp; Akurat</p>
                  <p className="text-xs text-violet-100/80">Filter fasilitas, lokasi, dan jadwal kosong</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/15">
                  <ShieldCheck className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Izin Resmi &amp; Aman</p>
                  <p className="text-xs text-violet-100/80">Seluruh ruang telah terverifikasi</p>
                </div>
              </div>
            </div>
          </div>
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