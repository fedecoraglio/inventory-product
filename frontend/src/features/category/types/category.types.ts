export type CategoryListDto = {
  count: number;
  items: CategoryDto[];
  lastEvaluateKey?: string | null
};

export type CategoryDto = {
  categoryId?: string | null;
  name: string;
  summary: string;
  content: string;
};
