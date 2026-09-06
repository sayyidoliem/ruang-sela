import type { Example } from "../domain/example.entity";
import type {
  CreateExampleInput,
  ExampleRepository,
} from "../domain/example.repository";
export async function createExample(
  repository: ExampleRepository,
  input: CreateExampleInput,
): Promise<Example> {
  return repository.create({
    title: input.title.trim(),
    description: input.description?.trim() || undefined,
  });
}
