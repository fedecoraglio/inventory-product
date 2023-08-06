import { ProductDto } from '@dtos/product.dtos';
import { Product } from '@prisma/client';

export class ProductBuilder implements Builder<Product, ProductDto> {
  static instance = new ProductBuilder();
  private constructor() {}

  transformDtoToModel(dto: ProductDto): Product {
    return {
      name: dto.name,
      summary: dto.summary,
      content: dto.content,
    } as Product;
  }
  transformModelToDto(model: Product): ProductDto {
    if (!model) return null;
    return {
      id: model.id,
      name: model.name,
      summary: model.summary,
      content: model.content,
    };
  }
  transformModelsToDtos(models: Product[]): ProductDto[] {
    return models.map((dto) => this.transformModelToDto(dto));
  }
  transformDtosToModels(dtos: ProductDto[]): Product[] {
    return dtos.map((model) => this.transformDtoToModel(model));
  }
}
