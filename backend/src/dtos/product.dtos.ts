import { BrandDto } from './brand.dtos';
import { CategoryDto } from './category.dtos';

export type ProductDto = Partial<{
  id: string;
  name: string;
  description: string;
  categoryIds: string[];
  categories: CategoryDto[];
  brandId: string;
  brand: BrandDto;
}>;
