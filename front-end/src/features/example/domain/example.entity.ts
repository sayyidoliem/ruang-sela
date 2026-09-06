export type ExampleId = string;
export interface Example {
  id: ExampleId;
  title: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
}
