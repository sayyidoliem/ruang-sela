import type { Example, ExampleId } from "./example.entity";
export interface CreateExampleInput {
  title: string;
  description?: string;
}
export interface ExampleRepository {
  findAll(): Promise<Example[]>;
  findById(id: ExampleId): Promise<Example | null>;
  create(input: CreateExampleInput): Promise<Example>;
}
