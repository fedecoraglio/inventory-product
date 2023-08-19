import { Supplier } from '@prisma/client';

import { AppError } from '@libs/app-error';
import { ListItem } from '@dtos/list-item.dto';
import { SupplierDto } from '@dtos/supplier.dtos';
import { SupplierRepository } from '@repositories/supplier.repository';

export class SupplierService {
  private readonly repository = new SupplierRepository();

  async create(dto: SupplierDto): Promise<Supplier> {
    try {
      const validate = await this.repository.getByName(dto.name.toLowerCase());
      if (validate) {
        throw {
          message: `${dto.name} Supplier is duplicated. Supplier name must be unique`,
        };
      }
      return await this.repository.create(dto);
    } catch (err) {
      console.error('SupplierService', err);
      throw new AppError(err.message ?? 'Error creating Supplier');
    }
  }

  async update(dto: SupplierDto, id: string): Promise<Supplier> {
    try {
      const validate = await this.repository.getById(id);
      if (validate) {
        const current = await this.repository.getByName(dto.name.toLowerCase());
        if (current && id !== current.id) {
          throw {
            message: `${dto.name} is duplicated. Supplier name must be unique`,
          };
        }

        return await this.repository.update(dto, id);
      } else {
        throw { message: `The Supplier ${id} id does not exits` };
      }
    } catch (err) {
      console.error(err);
      throw new AppError('Error updating Supplier');
    }
  }

  async getById(id: string): Promise<Supplier> {
    try {
      const item = await this.repository.getById(id);
      if (!item) {
        throw new AppError('Supplier does not exists', 404);
      }
      return item;
    } catch (err) {
      console.error(err);
      throw new AppError('Error getting Supplier id');
    }
  }

  async delete(id: string): Promise<SupplierDto> {
    try {
      return await this.repository.delete(id);
    } catch (err) {
      console.error(err);
      throw new AppError('Error deleting Supplier. Check list of products for this Supplier');
    }
  }

  async getAll(): Promise<ListItem<SupplierDto>> {
    try {
      return await this.repository.getAll();
    } catch (err) {
      console.error(err);
      throw new AppError('Error getting Supplier');
    }
  }
}
