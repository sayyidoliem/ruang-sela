import { InMemoryExampleRepository } from "./in-memory-example.repository";
// Ganti factory ini dengan SupabaseExampleRepository setelah konfigurasi database tersedia.
export function getExampleRepository() {
  return new InMemoryExampleRepository();
}
