import { NextResponse } from "next/server";

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

  // Placeholder: ganti blok ini dengan supabase.auth.signUp(...).
  return NextResponse.json(
    {
      data: {
        user: {
          email: input.email,
          app_metadata: { role: input.role },
          user_metadata: { name: input.name },
        },
        session: null,
      },
      error: null,
    },
    { status: 201 },
  );
}
