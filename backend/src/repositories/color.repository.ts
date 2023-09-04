import { Color, PrismaClient } from '@prisma/client';

import { ListItem } from '@dtos/list-item.dto';
import { ColorDto } from '@dtos/color.dtos';

export class ColorRepository {
  async create(dto: ColorDto): Promise<Color> {
    const prisma = new PrismaClient({});
    try {
      return await prisma.color.create({
        data: {
          name: dto.name.toLowerCase(),
          description: dto.description,
        },
      });
    } catch (err) {
      console.error(err);
      throw err;
    } finally {
      await prisma.$disconnect();
    }
  }

  async update(dto: ColorDto, id: string): Promise<Color> {
    const prisma = new PrismaClient({});
    try {
      return await prisma.color.update({
        where: {
          id,
        },
        data: {
          name: dto.name.toLowerCase(),
          description: dto.description,
        },
      });
    } catch (err) {
      console.error(err);
      throw err;
    } finally {
      await prisma.$disconnect();
    }
  }

  async delete(id: string): Promise<Color> {
    const prisma = new PrismaClient({});
    try {
      return await prisma.color.delete({
        where: { id },
      });
    } catch (err) {
      console.error(err);
      throw err;
    } finally {
      await prisma.$disconnect();
    }
  }

  async getById(id: string): Promise<Color> {
    const prisma = new PrismaClient({});
    try {
      return await prisma.color.findFirst({
        where: {
          id,
        },
      });
    } catch (err) {
      console.error(err);
      throw err;
    } finally {
      await prisma.$disconnect();
    }
  }

  async getByName(name: string): Promise<Color> {
    const prisma = new PrismaClient({});
    try {
      return await prisma.color.findUnique({
        where: {
          name,
        },
      });
    } catch (err) {
      console.error(err);
      throw err;
    } finally {
      await prisma.$disconnect();
    }
  }

  async getAll(): Promise<ListItem<Color>> {
    const prisma = new PrismaClient({});
    try {
      const [items, count] = await Promise.all([
        prisma.color.findMany({
          orderBy: [
            {
              createdAt: 'desc',
            },
          ],
        }),
        prisma.color.count(),
      ]);
      return { items, count };
    } catch (err) {
      console.error(err);
      throw err;
    } finally {
      await prisma.$disconnect();
    }
  }
}
