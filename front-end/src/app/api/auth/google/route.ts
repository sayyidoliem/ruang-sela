import { NextResponse } from "next/server";
import { env } from "@/config/env";

const BE_URL = env.NEXT_PUBLIC_API_URL.replace(/\/$/, "");

export async function GET(request: Request) {
  const url = new URL(request.url);
  const redirectTo = url.searchParams.get("redirect_to") || `${env.NEXT_PUBLIC_APP_URL.replace(/\/$/, "")}/auth/callback`;
  const target = `${BE_URL}/auth/google?redirect_to=${encodeURIComponent(redirectTo)}`;
  return NextResponse.redirect(target);
}