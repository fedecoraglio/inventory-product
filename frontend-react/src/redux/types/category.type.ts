export type CategoryListDto = Readonly<{
  count: number;
  items: CategoryDto[];
  lastEvaluatedKey?: string | null;
}>;

export type CategoryDto = Readonly<{
  categoryId?: string | null;
  name: string;
  summary: string;
  content: string;
}>;

export type CategoryPaginationDto = {
  limit: number;
  lastEvaluatedKey?: string | null;
};
