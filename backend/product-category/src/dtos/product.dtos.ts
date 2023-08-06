export type ProductDto = Partial<{
  id: string;
  name: string;
  description: string;
  categoryIds: string[];
}>;
