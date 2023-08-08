import { CategoryDto } from '../../category/types/category.types';

export type ProductListDto = Readonly<{
  count: number;
  items: ProductDto[];
}>;

export type ProductDto = Partial<{
  id: string | null;
  name: string;
  description: string;
  createdAt: Date;
  categoryIds: string[];
  categories: CategoryDto[];
}>;

export type ProductPaginationDto = {
  limit: number;
};
