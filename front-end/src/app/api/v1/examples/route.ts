import { NextResponse } from "next/server";
import { createExampleSchema } from "@/features/example/schemas/example.schema";
export async function POST(request: Request) {
  const input: unknown = await request.json().catch(() => null);
  const parsed = createExampleSchema.safeParse(input);
  if (!parsed.success)
    return NextResponse.json(
      {
        success: false,
        error: { code: "VALIDATION_ERROR", message: "Data tidak valid." },
      },
      { status: 400 },
    );
  return NextResponse.json(
    { success: true, data: { id: crypto.randomUUID(), ...parsed.data } },
    { status: 201 },
  );
}
