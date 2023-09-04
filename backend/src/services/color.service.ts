import { Color } from '@prisma/client';

import { AppError } from '@libs/app-error';
import { ListItem } from '@dtos/list-item.dto';
import { ColorDto } from '@dtos/color.dtos';
import { ColorRepository } from '@repositories/color.repository';

export class ColorService {
  private readonly repository = new ColorRepository();

  async create(dto: ColorDto): Promise<Color> {
    try {
      const validate = await this.repository.getByName(dto.name.toLowerCase());
      if (validate) {
        throw {
          message: `${dto.name} color is duplicated. Color name must be unique`,
        };
      }
      return await this.repository.create(dto);
    } catch (err) {
      console.error('ColorService', err);
      throw new AppError(err.message ?? 'Error creating color');
    }
  }

  async update(dto: ColorDto, id: string): Promise<Color> {
    try {
      const validate = await this.repository.getById(id);
      if (validate) {
        const current = await this.repository.getByName(dto.name.toLowerCase());
        if (current && id !== current.id) {
          throw {
            message: `${dto.name} is duplicated. Color name must be unique`,
          };
        }

        return await this.repository.update(dto, id);
      } else {
        throw { message: `The color ${id} id does not exits` };
      }
    } catch (err) {
      console.error(err);
      throw new AppError('Error updating color');
    }
  }

  async getById(id: string): Promise<Color> {
    try {
      const item = await this.repository.getById(id);
      if (!item) {
        throw new AppError('Color does not exists', 404);
      }
      return item;
    } catch (err) {
      console.error(err);
      throw new AppError('Error getting color id');
    }
  }

  async delete(id: string): Promise<ColorDto> {
    try {
      return await this.repository.delete(id);
    } catch (err) {
      console.error(err);
      throw new AppError('Error deleting color');
    }
  }

  async getAll(): Promise<ListItem<ColorDto>> {
    try {
      return await this.repository.getAll();
    } catch (err) {
      console.error(err);
      throw new AppError('Error getting color');
    }
  }
}
