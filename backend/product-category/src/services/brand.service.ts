import { Brand } from '@prisma/client';

import { AppError } from '@libs/app-error';
import { BrandRepository } from '@repositories/brand.repository';
import { BrandDto } from '@dtos/brand.dtos';
import { ListItem } from '@dtos/list-item.dto';

export class BrandService {
  private readonly repository = new BrandRepository();

  async create(dto: BrandDto): Promise<Brand> {
    try {
      const validate = await this.repository.getByName(dto.name.toLowerCase());
      if (validate) {
        throw {
          message: `${dto.name} brand is duplicated. Brand name must be unique`,
        };
      }
      return await this.repository.create(dto);
    } catch (err) {
      console.error('BrandService', err);
      throw new AppError(err.message ?? 'Error creating brand');
    }
  }

  async update(dto: BrandDto, id: string): Promise<Brand> {
    try {
      const validate = await this.repository.getById(id);
      if (validate) {
        const current = await this.repository.getByName(dto.name.toLowerCase());
        if (current && id !== current.id) {
          throw {
            message: `${dto.name} is duplicated. Brand name must be unique`,
          };
        }

        return await this.repository.update(dto, id);
      } else {
        throw { message: `The brand ${id} id does not exits` };
      }
    } catch (err) {
      console.error(err);
      throw new AppError('Error updating brand');
    }
  }

  async getById(id: string): Promise<Brand> {
    try {
      const item = await this.repository.getById(id);
      if (!item) {
        throw new AppError('Brand does not exists', 404);
      }
      return item;
    } catch (err) {
      console.error(err);
      throw new AppError('Error getting brand id');
    }
  }

  async delete(id: string): Promise<BrandDto> {
    try {
      return await this.repository.delete(id);
    } catch (err) {
      console.error(err);
      throw new AppError('Error deleting brand. Check list of products for this brand');
    }
  }

  async getAll(): Promise<ListItem<BrandDto>> {
    try {
      return await this.repository.getAll();
    } catch (err) {
      console.error(err);
      throw new AppError('Error getting brand');
    }
  }
}
