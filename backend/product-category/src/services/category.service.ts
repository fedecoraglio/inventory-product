import { AppError } from '@libs/app-error';
import {
  ListItem,
  PaginationItem,
  SimpleSearchParam,
} from '@dtos/list-item.dto';
import { CategoryDto } from '@dtos/category.dtos';
import { CategoryRepository } from '@repositories/category.repository';
import { CategoryBuilder } from '@builders/category-builder';

export class CategoryService {
  private readonly repository = new CategoryRepository();
  private readonly builder = CategoryBuilder.instance;

  async create(dto: CategoryDto): Promise<CategoryDto> {
    try {
      const validate = await this.repository.getByName(dto.name.toLowerCase());
      if (validate) {
        throw {
          message: `${dto.name} category is duplicated. Category name must be unique`,
        };
      }
      return this.builder.transformModelToDto(
        await this.repository.create(dto),
      );
    } catch (err) {
      console.error('CategoryService', err);
      throw new AppError(err.message ?? 'Error creating category');
    }
  }

  async update(dto: CategoryDto, id: string): Promise<CategoryDto> {
    try {
      const validate = await this.repository.getById(id);
      if (validate) {
        const current = await this.repository.getByName(dto.name.toLowerCase());
        if (current && id !== current.id) {
          throw {
            message: `${dto.name} is duplicated. Category name must be unique`,
          };
        }

        return this.builder.transformModelToDto(
          await this.repository.update(dto, id),
        );
      } else {
        throw { message: `The category ${id} id does not exits` };
      }
    } catch (err) {
      console.error(err);
      throw new AppError('Error updating category');
    }
  }

  async getById(id: string): Promise<CategoryDto> {
    try {
      const model = await this.repository.getById(id);
      const category = this.builder.transformModelToDto(model);
      if (!category) {
        throw new AppError('Category does not exists', 404);
      }
      return category;
    } catch (err) {
      console.error(err);
      throw new AppError('Error getting category id');
    }
  }

  async delete(id: string): Promise<CategoryDto> {
    try {
      return this.builder.transformModelToDto(await this.repository.delete(id));
    } catch (err) {
      console.error(err);
      throw new AppError(
        'Error deleting category. Please check the category id',
      );
    }
  }

  async getAll(
    searchParam: SimpleSearchParam | null = null,
    pagination: PaginationItem = null,
  ): Promise<ListItem<CategoryDto>> {
    try {
      const resp = await this.repository.getAll(searchParam, pagination);
      return {
        count: resp.count,
        items: this.builder.transformModelsToDtos(resp.items),
      };
    } catch (err) {
      console.error(err);
      throw new AppError('Error getting category');
    }
  }
}
