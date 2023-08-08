import { ProductRepository } from '@repositories/product.repository';
import { ProductDto } from '@dtos/product.dtos';
import { AppError } from '@libs/app-error';
import {
  ListItem,
  PaginationItem,
  SimpleSearchParam,
} from '../dtos/list-item.dto';
import { Product } from '@prisma/client';

export class ProductService {
  private readonly repository = new ProductRepository();

  async create(dto: ProductDto): Promise<Product> {
    try {
      const productExits = await this.repository.getByName(
        dto.name.toLowerCase(),
      );
      if (productExits) {
        throw {
          message: `${dto.name} product is duplicated. Product name must be unique`,
        };
      }
      return await this.repository.create(dto);
    } catch (err) {
      console.error('ProductService', err);
      throw new AppError('Error creating user');
    }
  }

  async update(dto: ProductDto, id: string): Promise<Product> {
    try {
      const validateProduct = await this.repository.getById(id);
      if (validateProduct) {
        const productExits = await this.repository.getByName(
          dto.name.toLowerCase(),
        );
        if (productExits && id !== productExits.id) {
          throw {
            message: `${dto.name} is duplicated. Product name must be unique`,
          };
        }

        return await this.repository.update(dto, id);
      } else {
        throw { message: `The product ${id} id does not exits` };
      }
    } catch (err) {
      console.error(err);
      throw new AppError('Error updating product');
    }
  }

  async delete(id: string): Promise<Product> {
    try {
      return await this.repository.delete(id);
    } catch (err) {
      console.error(err);
      throw new AppError('Error deleting product. Please check the product id');
    }
  }

  async getById(id: string): Promise<Product> {
    try {
      const product = await this.repository.getById(id);
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
  ): Promise<ListItem<Product>> {
    try {
      return await this.repository.getAll(searchParam, pagination);
    } catch (err) {
      console.error(err);
      throw new AppError('Error getting product');
    }
  }
}
