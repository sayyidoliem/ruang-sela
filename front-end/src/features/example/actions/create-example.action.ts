"use server";
import { revalidatePath } from "next/cache";
import { createExample } from "../application/create-example";
import { getExampleRepository } from "../infrastructure";
import { createExampleSchema } from "../schemas/example.schema";
export type CreateExampleActionState = {
  success: boolean;
  message: string;
  fieldErrors?: Record<string, string[] | undefined>;
};
export async function createExampleAction(
  _: CreateExampleActionState,
  formData: FormData,
): Promise<CreateExampleActionState> {
  const parsed = createExampleSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description") || undefined,
  });
  if (!parsed.success)
    return {
      success: false,
      message: "Data belum valid.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  try {
    await createExample(getExampleRepository(), parsed.data);
    revalidatePath("/dashboard");
    return { success: true, message: "Data berhasil disimpan." };
  } catch {
    return {
      success: false,
      message: "Data tidak dapat disimpan. Silakan coba kembali.",
    };
  }
}
