export type CategoryListDto = {
  count: number;
  items: CategoryDto[];
  lastEvaluatedKey?: string | null;
};

export type CategoryDto = {
  categoryId?: string | null;
  name: string;
  summary: string;
  content: string;
};

export type CategoryPaginationDto = {
  limit: number;
  lastEvaluatedKey?: string | null;
};
