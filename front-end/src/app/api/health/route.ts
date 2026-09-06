import { NextResponse } from "next/server";
export async function GET() {
  return NextResponse.json(
    {
      success: true,
      data: { status: "healthy", timestamp: new Date().toISOString() },
    },
    { status: 200, headers: { "Cache-Control": "no-store" } },
  );
}
