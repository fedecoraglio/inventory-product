import { Brand, PrismaClient, } from '@prisma/client';

import { ListItem } from '@dtos/list-item.dto';
import { BrandDto } from '@dtos/brand.dtos';

export class BrandRepository {
  async create(dto: BrandDto): Promise<Brand> {
    const prisma = new PrismaClient({});
    try {
      return await prisma.brand.create({
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

  async update(dto: BrandDto, id: string): Promise<Brand> {
    const prisma = new PrismaClient({});
    try {
      return await prisma.brand.update({
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

  async delete(id: string): Promise<Brand> {
    const prisma = new PrismaClient({});
    try {
      return await prisma.brand.delete({
        where: { id },
      });
    } catch (err) {
      console.error(err);
      throw err;
    } finally {
      await prisma.$disconnect();
    }
  }

  async getById(id: string): Promise<Brand> {
    const prisma = new PrismaClient({});
    try {
      return await prisma.brand.findFirst({
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

  async getByName(name: string): Promise<Brand> {
    const prisma = new PrismaClient({});
    try {
      return await prisma.brand.findUnique({
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

  async getAll(): Promise<ListItem<Brand>> {
    const prisma = new PrismaClient({});
    try {
      const [items, count] = await Promise.all([
        prisma.brand.findMany({
          orderBy: [
            {
              createdAt: 'desc',
            },
          ],
        }),
        prisma.brand.count(),
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
