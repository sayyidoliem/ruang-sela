import { NextResponse } from "next/server";

type AccountRole = "user" | "admin" | "manager";

function isAccountRole(value: unknown): value is AccountRole {
  return value === "user" || value === "admin" || value === "manager";
}

export async function POST(request: Request) {
  const input = (await request.json().catch(() => null)) as {
    email?: unknown;
    password?: unknown;
    role?: unknown;
  } | null;

  if (
    !input ||
    typeof input.email !== "string" ||
    typeof input.password !== "string" ||
    !isAccountRole(input.role)
  ) {
    return NextResponse.json(
      { error: { message: "Email, kata sandi, dan role wajib diisi." } },
      { status: 400 },
    );
  }

  // Placeholder: ganti blok ini dengan supabase.auth.signInWithPassword(...).
  // AuthPage membaca role dari data.user.app_metadata.role seperti respons Supabase.
  return NextResponse.json({
    data: {
      user: {
        email: input.email,
        app_metadata: { role: input.role },
        user_metadata: {},
      },
      session: null,
    },
    error: null,
  });
}
