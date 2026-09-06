import type { Example } from "../domain/example.entity";
import type {
  CreateExampleInput,
  ExampleRepository,
} from "../domain/example.repository";
const seed: Example[] = [
  {
    id: "seed-1",
    title: "Indikator dampak SDG",
    description: "Placeholder fitur utama yang perlu diganti tim.",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];
export class InMemoryExampleRepository implements ExampleRepository {
  async findAll() {
    return seed;
  }
  async findById(id: string) {
    return seed.find((item) => item.id === id) ?? null;
  }
  async create(input: CreateExampleInput) {
    const item: Example = {
      id: crypto.randomUUID(),
      title: input.title,
      description: input.description ?? null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    seed.unshift(item);
    return item;
  }
}
