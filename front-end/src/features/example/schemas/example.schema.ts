import { z } from "zod";
export const createExampleSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Judul minimal 3 karakter.")
    .max(100, "Judul maksimal 100 karakter."),
  description: z
    .string()
    .trim()
    .max(500, "Deskripsi maksimal 500 karakter.")
    .optional(),
});
export type CreateExampleFormValues = z.infer<typeof createExampleSchema>;
