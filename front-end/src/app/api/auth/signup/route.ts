import { NextResponse } from "next/server";
import { env } from "@/config/env";

const BE_URL = env.NEXT_PUBLIC_API_URL.replace(/\/$/, "");

type AccountRole = "user" | "admin" | "manager";

function isAccountRole(value: unknown): value is AccountRole {
  return value === "user" || value === "admin" || value === "manager";
}

export async function POST(request: Request) {
  const input = (await request.json().catch(() => null)) as {
    name?: unknown;
    email?: unknown;
    password?: unknown;
    role?: unknown;
  } | null;

  if (
    !input ||
    typeof input.name !== "string" ||
    typeof input.email !== "string" ||
    typeof input.password !== "string" ||
    input.password.length < 6 ||
    !isAccountRole(input.role)
  ) {
    return NextResponse.json(
      { error: { message: "Data pendaftaran tidak valid." } },
      { status: 400 },
    );
  }

  try {
    const res = await fetch(`${BE_URL}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: input.name,
        email: input.email,
        password: input.password,
        role: input.role,
      }),
    });
    const json = await res.json().catch(() => null);

    if (!res.ok) {
      return NextResponse.json(
        { error: { message: json?.detail || "Pendaftaran gagal." } },
        { status: res.status },
      );
    }
    return NextResponse.json(json, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: { message: "Gagal menghubungi server autentikasi." } },
      { status: 502 },
    );
  }
}