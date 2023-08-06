import { PrismaClient, Product } from '@prisma/client';

import { ProductDto } from '@dtos/product.dtos';
import {
  DEFAULT_LIMIT_PAGINATION,
  ListItem,
  PaginationItem,
  SimpleSearchParam,
} from '../dtos/list-item.dto';

export class ProductRepository {
  async create(dto: ProductDto): Promise<Product> {
    const prisma = new PrismaClient({});
    try {
      return await prisma.product.create({
        data: {
          name: dto.name.toLowerCase(),
          description: dto.description,
          createdAt: new Date().toUTCString(),
          metaData: []
        },
      });
    } catch (err) {
      console.error(err);
      throw err;
    } finally {
      await prisma.$disconnect();
    }
  }

  async update(dto: ProductDto, id: string): Promise<Product> {
    const prisma = new PrismaClient({});
    try {
      return await prisma.product.update({
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

  async delete(id: string): Promise<Product> {
    const prisma = new PrismaClient({});
    try {
      const deletedProduct = await prisma.product.delete({
        where: { id },
      });
      return deletedProduct;
    } catch (err) {
      console.error(err);
      throw err;
    } finally {
      await prisma.$disconnect();
    }
  }

  async getById(id: string): Promise<Product> {
    const prisma = new PrismaClient({});
    try {
      return await prisma.product.findFirst({
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

  async getByName(name: string): Promise<Product> {
    const prisma = new PrismaClient({});
    try {
      return await prisma.product.findUnique({
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
  ): Promise<ListItem<Product>> {
    const prisma = new PrismaClient({});
    try {
      const query = {
        skip: 0,
        take: pagination?.limit ?? DEFAULT_LIMIT_PAGINATION,
      };
      const [items, count] = await Promise.all([
        prisma.product.findMany(query),
        prisma.product.count(),
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
