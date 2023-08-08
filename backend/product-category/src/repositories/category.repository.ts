import { PrismaClient, Category } from '@prisma/client';

import {
  ListItem,
  PaginationItem,
  SimpleSearchParam,
} from '@dtos/list-item.dto';
import { CategoryDto } from '@dtos/category.dtos';

export class CategoryRepository {
  async create(dto: CategoryDto): Promise<Category> {
    const prisma = new PrismaClient({});
    try {
      return await prisma.category.create({
        data: {
          name: dto.name.toLowerCase(),
          description: dto.description,
          createdAt: new Date(),
        },
      });
    } catch (err) {
      console.error(err);
      throw err;
    } finally {
      await prisma.$disconnect();
    }
  }

  async update(dto: CategoryDto, id: string): Promise<Category> {
    const prisma = new PrismaClient({});
    try {
      return await prisma.category.update({
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

  async delete(id: string): Promise<Category> {
    const prisma = new PrismaClient({});
    try {
      const deleted = await prisma.category.update({
        where: { id },
        data: {
          isActive: false
        }
      });
      return deleted;
    } catch (err) {
      console.error(err);
      throw err;
    } finally {
      await prisma.$disconnect();
    }
  }

  async getById(id: string): Promise<Category> {
    const prisma = new PrismaClient({});
    try {
      return await prisma.category.findFirst({
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

  async getByName(name: string): Promise<Category> {
    const prisma = new PrismaClient({});
    try {
      return await prisma.category.findFirst({
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

  async getAll(
    searchParam: SimpleSearchParam | null = null,
    pagination: PaginationItem = null,
  ): Promise<ListItem<Category>> {
    const prisma = new PrismaClient({});
    try {
      const [items, count] = await Promise.all([
        prisma.category.findMany(),
        prisma.category.count(),
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
