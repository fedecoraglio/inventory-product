import { ProductRepository } from '@repositories/product.repository';
import { ProductDto } from '@dtos/product.dtos';
import { ProductBuilder } from '../builders/product-builder';
import { AppError } from '../libs/app-error';
import {
  ListItem,
  PaginationItem,
  SimpleSearchParam,
} from '../dtos/list-item.dto';

export class ProductService {
  private readonly repository = new ProductRepository();
  private readonly builder = ProductBuilder.instance;

  async create(dto: ProductDto): Promise<ProductDto> {
    try {
      const productExits = await this.repository.getByName(dto.name.toLowerCase());
      if (productExits) {
        throw {
          message: `${dto.name} product is duplicated. Product name must be unique`,
        };
      }
      return this.builder.transformModelToDto(
        await this.repository.create(dto),
      );
    } catch (err) {
      console.error('ProductService', err);
      throw new AppError('Error creating user');
    }
  }

  async update(dto: ProductDto, id: string): Promise<ProductDto> {
    try {
      const validateProduct = await this.repository.getById(id);
      if (validateProduct) {
        const productExits = await this.repository.getByName(dto.name.toLowerCase());
        if (productExits && id !== productExits.id) {
          throw {
            message: `${dto.name} is duplicated. Product name must be unique`,
          };
        }

        return this.builder.transformModelToDto(
          await this.repository.update(dto, id),
        );
      } else {
        throw { message: `The product ${id} id does not exits` };
      }
    } catch (err) {
      console.error(err);
      throw new AppError('Error updating product');
    }
  }

  async delete(id: string): Promise<ProductDto> {
    try {
      return this.builder.transformModelToDto(await this.repository.delete(id));
    } catch (err) {
      console.error(err);
      throw new AppError('Error deleting product. Please check the product id');
    }
  }

  async getById(id: string): Promise<ProductDto> {
    try {
      const model = await this.repository.getById(id);
      const product = this.builder.transformModelToDto(model);
      if (!product) {
        throw new AppError('Product does not exists', 404);
      }
      return product;
    } catch (err) {
      console.error(err);
      throw new AppError('Error getting product id');
    }
  }

  async getAll(
    searchParam: SimpleSearchParam | null = null,
    pagination: PaginationItem = null,
  ): Promise<ListItem<ProductDto>> {
    try {
      const productResp = await this.repository.getAll(searchParam, pagination);
      return {
        count: productResp.count,
        items: this.builder.transformModelsToDtos(productResp.items),
      };
    } catch (err) {
      console.error(err);
      throw new AppError('Error getting product');
    }
  }
}
