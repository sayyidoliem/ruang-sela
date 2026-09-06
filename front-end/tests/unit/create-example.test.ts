import { describe, expect, it, vi } from "vitest";
import { createExample } from "@/features/example/application/create-example";
import type { ExampleRepository } from "@/features/example/domain/example.repository";
describe("createExample", () => {
  it("membersihkan input sebelum menyimpan", async () => {
    const repository: ExampleRepository = {
      findAll: vi.fn(),
      findById: vi.fn(),
      create: vi
        .fn()
        .mockImplementation(async (input) => ({
          id: "id",
          title: input.title,
          description: input.description ?? null,
          createdAt: new Date(),
          updatedAt: new Date(),
        })),
    };
    await createExample(repository, {
      title: "  Contoh fitur  ",
      description: "  Deskripsi  ",
    });
    expect(repository.create).toHaveBeenCalledWith({
      title: "Contoh fitur",
      description: "Deskripsi",
    });
  });
});
