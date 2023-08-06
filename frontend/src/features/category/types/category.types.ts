export type CategoryListDto = Readonly<{
  count: number;
  items: CategoryDto[];
}>;

export type CategoryDto = Readonly<{
  id?: string | null;
  name: string;
  description: string;
  createdAt?: Date;
}>;

export type CategoryPaginationDto = {
  limit: number;
};
