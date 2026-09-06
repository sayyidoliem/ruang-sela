import type { SupabaseClient } from "@supabase/supabase-js";
import type { Example } from "../domain/example.entity";
import type {
  CreateExampleInput,
  ExampleRepository,
} from "../domain/example.repository";
type ExampleRow = {
  id: string;
  title: string;
  description: string | null;
  created_at: string;
  updated_at: string;
};
const mapExample = (row: ExampleRow): Example => ({
  id: row.id,
  title: row.title,
  description: row.description,
  createdAt: new Date(row.created_at),
  updatedAt: new Date(row.updated_at),
});
export class SupabaseExampleRepository implements ExampleRepository {
  constructor(private readonly client: SupabaseClient) {}
  async findAll() {
    const { data, error } = await this.client
      .from("examples")
      .select("id,title,description,created_at,updated_at")
      .order("created_at", { ascending: false });
    if (error) throw new Error("EXAMPLE_FIND_ALL_FAILED");
    return (data as ExampleRow[]).map(mapExample);
  }
  async findById(id: string) {
    const { data, error } = await this.client
      .from("examples")
      .select("id,title,description,created_at,updated_at")
      .eq("id", id)
      .maybeSingle();
    if (error) throw new Error("EXAMPLE_FIND_BY_ID_FAILED");
    return data ? mapExample(data as ExampleRow) : null;
  }
  async create(input: CreateExampleInput) {
    const { data, error } = await this.client
      .from("examples")
      .insert({ title: input.title, description: input.description ?? null })
      .select("id,title,description,created_at,updated_at")
      .single();
    if (error) throw new Error("EXAMPLE_CREATE_FAILED");
    return mapExample(data as ExampleRow);
  }
}
