'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Replace with your actual authentication endpoint
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          rememberMe,
        }),
      });

      if (!response.ok) {
        throw new Error('Authentication failed');
      }

      const data = await response.json();
      
      // Store token if needed
      if (data.token) {
        localStorage.setItem('authToken', data.token);
      }

      // Redirect to dashboard
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    // Implement Google OAuth login
    window.location.href = '/api/auth/google';
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row">
      {/* LEFT SIDE: Authentication Form (50% on Desktop) */}
      <div className="w-full lg:w-1/2 min-h-screen bg-surface-container-lowest flex flex-col justify-between px-6 sm:px-12 lg:px-16 xl:px-24 py-10 z-10">
        {/* Brand Logo */}
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-2.5 group hover:opacity-80 transition-opacity"
          >
            <span className="font-headline-lg text-2xl font-bold tracking-tight text-community-purple">
              RuangSela
            </span>
          </Link>
        </div>

        {/* Main Form Content */}
        <div className="w-full max-w-md mx-auto my-auto py-8 flex flex-col">
          {/* Header */}
          <div className="flex flex-col mb-8 text-left">
            <h1 className="font-headline-lg text-3xl sm:text-4xl text-on-surface tracking-tight font-bold">
              Masuk ke Ruang
              <span className="text-community-purple">Sela</span>
            </h1>
            <p className="font-body-md text-body-md text-on-surface-variant mt-2.5">
              Masuk untuk menemukan dan menyewa ruang publik terbaik untuk berbagai kegiatan wargamu.
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-error/10 border border-error rounded-xl text-error text-sm font-medium">
              {error}
            </div>
          )}

          {/* Form */}
          <form className="flex flex-col gap-4.5" onSubmit={handleSubmit}>
            {/* Email Field */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="email"
                className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant font-semibold"
              >
                Email
              </label>
              <div
                className="flex items-center w-full bg-surface-container-low rounded-xl px-4 py-3 gap-3 border border-transparent focus-within:border-community-purple focus-within:bg-surface-container-lowest transition-all"
              >
                <span className="material-symbols-outlined text-outline text-[20px] shrink-0">
                  mail
                </span>
                <input
                  id="email"
                  type="email"
                  placeholder="Masukkan email kamu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-transparent font-body-md text-body-md text-on-surface placeholder:text-outline focus:outline-none"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="flex flex-col gap-1.5 mt-1">
              <label
                htmlFor="password"
                className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant font-semibold"
              >
                Password
              </label>
              <div className="flex items-center w-full bg-surface-container-low rounded-xl px-4 py-3 gap-3 border border-transparent focus-within:border-community-purple focus-within:bg-surface-container-lowest transition-all">
                <span className="material-symbols-outlined text-outline text-[20px] shrink-0">
                  lock
                </span>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Masukkan password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-transparent font-body-md text-body-md text-on-surface placeholder:text-outline focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-outline hover:text-on-surface flex items-center justify-center p-0.5 transition-colors"
                  title={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            {/* Options: Remember Me & Forgot Password */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded text-community-purple border-outline-variant focus:ring-community-purple accent-[#8b5cf6] cursor-pointer"
                />
                <span className="font-body-md text-sm sm:text-base text-on-surface-variant">
                  Ingat saya
                </span>
              </label>
              <Link
                href="/forgot-password"
                className="font-body-md text-sm sm:text-base font-semibold text-community-purple hover:underline transition-all"
              >
                Lupa password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-3 py-3.5 px-6 rounded-xl bg-community-purple text-on-secondary font-title-md text-title-md font-bold tracking-tight shadow-md hover:bg-opacity-95 hover:shadow-lg active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <span>{isLoading ? 'Memproses...' : 'Masuk'}</span>
              <span className="material-symbols-outlined text-[20px]">
                {isLoading ? 'hourglass_bottom' : 'arrow_forward'}
              </span>
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-6 gap-3">
            <div className="h-px bg-surface-container-high flex-1"></div>
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline px-1">
              ATAU
            </span>
            <div className="h-px bg-surface-container-high flex-1"></div>
          </div>

          {/* Google Login Button */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full py-3.5 px-4 rounded-xl border border-surface-container-high bg-surface-container-lowest hover:bg-surface-container-low transition-all flex items-center justify-center gap-3 active:scale-[0.99] shadow-sm"
          >
            <GoogleIcon />
            <span className="font-body-md text-body-md font-semibold text-on-surface">
              Lanjutkan dengan Google
            </span>
          </button>

          {/* Registration Prompt */}
          <div className="text-center mt-7 font-body-md text-body-md text-on-surface-variant">
            Belum punya akun?
            <Link
              href="/register"
              className="font-bold text-community-purple hover:underline ml-1"
            >
              Daftar sekarang
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-6 border-t border-surface-container-high flex flex-col sm:flex-row items-center justify-between gap-3 text-outline">
          <div className="flex items-center gap-1.5 font-label-sm text-label-sm">
            <span className="material-symbols-outlined text-[16px] text-success-verified">
              verified_user
            </span>
            <span>Terkoneksi Aman SSL 256-bit</span>
          </div>
          <p className="font-label-sm text-label-sm text-outline">
            © 2026 RuangSela. Hak cipta dilindungi.
          </p>
        </div>
      </div>

      {/* RIGHT SIDE: Visual Showcase (Hidden on Mobile) */}
      <div className="hidden lg:flex lg:w-1/2 min-h-screen relative overflow-hidden bg-slate-900 flex-col justify-between p-12 xl:p-16">
        {/* Background Image */}
        <Image
          alt="Ruang Komunitas dan Pertemuan Warga"
          fill
          priority
          className="absolute inset-0 object-cover object-center scale-105 brightness-[0.82] contrast-[1.05]"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDfVZ3vhRIqutdTwnS-8aAOypkVPsN4iHF6GFUU8ymj60nX-hfeE0DWewAxgmfiTCNxcItAoH4wLnnjyqqYThKsh3GdSjumAZOZk83VUrR8Cpa5Zu48ndUK5afCxjl_DYJtpHL8osuxzuL8zOAMJKqNKK2qmLotCJjrI_GL0HBZkthrDfAEh0y38GwThmYx63sz_3wfB2KjV9qXe5GgdqIMhszuXgb5qQUt57DPvF26JLqwy-VVGos"
        />

        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-[#8b5cf6]/35 mix-blend-multiply"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-[#8b5cf6]/40 via-transparent to-black/80 pointer-events-none"></div>

        {/* Top Badge */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-white text-xs font-semibold tracking-wide shadow-lg">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="material-symbols-outlined text-[16px] text-emerald-400">
              verified
            </span>
            <span>Jaringan Ruang Publik Terkurasi</span>
          </div>
          <div className="flex items-center gap-2 text-white/80 font-label-sm text-label-sm">
            <span className="material-symbols-outlined text-[18px]">location_on</span>
            <span>Indonesia</span>
          </div>
        </div>

        {/* Content & Testimonial */}
        <div className="relative z-10 flex flex-col gap-8 max-w-xl">
          {/* Inspirational Quote */}
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-inner">
              <span className="material-symbols-outlined text-[28px] text-community-purple">
                meeting_room
              </span>
            </div>
            <h2 className="text-3xl xl:text-4xl font-headline-lg font-bold text-white tracking-tight leading-tight">
              "Menghidupkan Ruang, Mempertemukan Warga."
            </h2>
            <p className="text-white/85 font-body-lg text-lg leading-relaxed">
              Temukan aula serbaguna, balai warga, ruang kreatif, hingga coworking space publik yang siap dipakai untuk lokakarya, musyawarah, dan pameran komunitas.
            </p>
          </div>

          {/* Stats Showcase */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-5 sm:p-6 shadow-2xl flex items-center justify-between gap-4">
            <StatCard value="450+" label="Ruang Publik Aktif" />
            <div className="h-10 w-px bg-white/20"></div>
            <StatCard value="12.5k" label="Kegiatan Warga" />
            <div className="h-10 w-px bg-white/20"></div>
            <RatingCard value="4.9" label="Kepuasan Komunitas" />
          </div>
        </div>
      </div>
    </div>
  );
}

// Google Icon Component
function GoogleIcon() {
  return (
    <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"></path>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"></path>
    </svg>
  );
}

// Stat Card Component
function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col">
      <span className="text-2xl xl:text-3xl font-bold text-white tracking-tight">{value}</span>
      <span className="text-white/70 text-xs sm:text-sm font-medium mt-0.5">{label}</span>
    </div>
  );
}

// Rating Card Component
function RatingCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-1 text-amber-300">
        <span className="text-2xl xl:text-3xl font-bold text-white tracking-tight">{value}</span>
        <span className="material-symbols-outlined text-[18px] fill-current">star</span>
      </div>
      <span className="text-white/70 text-xs sm:text-sm font-medium mt-0.5">{label}</span>
    </div>
  );
}