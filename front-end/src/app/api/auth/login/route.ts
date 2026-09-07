import { NextResponse } from "next/server";
import { env } from "@/config/env";

const BE_URL = env.NEXT_PUBLIC_API_URL.replace(/\/$/, "");

export async function POST(request: Request) {
  const input = (await request.json().catch(() => null)) as {
    email?: unknown;
    password?: unknown;
    rememberMe?: unknown;
  } | null;

  if (!input || typeof input.email !== "string" || typeof input.password !== "string") {
    return NextResponse.json(
      { error: { message: "Email dan kata sandi wajib diisi." } },
      { status: 400 },
    );
  }

  try {
    const res = await fetch(`${BE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: input.email, password: input.password }),
    });
    const json = await res.json().catch(() => null);

    if (!res.ok) {
      return NextResponse.json(
        { error: { message: json?.detail || "Email atau kata sandi salah." } },
        { status: res.status },
      );
    }
    return NextResponse.json(json);
  } catch {
    return NextResponse.json(
      { error: { message: "Gagal menghubungi server autentikasi." } },
      { status: 502 },
    );
  }
}