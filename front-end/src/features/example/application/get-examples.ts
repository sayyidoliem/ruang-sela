import type { Example } from "../domain/example.entity";
import type { ExampleRepository } from "../domain/example.repository";
export async function getExamples(
  repository: ExampleRepository,
): Promise<Example[]> {
  return repository.findAll();
}
