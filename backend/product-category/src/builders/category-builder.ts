import { Category } from '@prisma/client';
import { CategoryDto } from '@dtos/category.dtos';

export class CategoryBuilder implements Builder<Category, CategoryDto> {
  static instance = new CategoryBuilder();
  private constructor() {}

  transformDtoToModel(dto: CategoryDto): Category {
    return {
      name: dto.name,
      description: dto.description,
    } as Category;
  }
  transformModelToDto(model: Category): CategoryDto {
    if (!model) return null;
    return {
      id: model.id,
      name: model.name,
      description: model.description,
      createdAt: model.createdAt
    };
  }
  transformModelsToDtos(models: Category[]): CategoryDto[] {
    return models.map((dto) => this.transformModelToDto(dto));
  }
  transformDtosToModels(dtos: CategoryDto[]): Category[] {
    return dtos.map((model) => this.transformDtoToModel(model));
  }
}
