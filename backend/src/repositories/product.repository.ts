import { PrismaClient, Product } from '@prisma/client';

import { ProductDto } from '@dtos/product.dtos';
import {
  DEFAULT_LIMIT_PAGINATION,
  ListItem,
  PaginationItem,
  SimpleSearchParam,
} from '@dtos/list-item.dto';

export class ProductRepository {
  async create(dto: ProductDto): Promise<Product> {
    const prisma = new PrismaClient({});
    try {
      const resp = await prisma.product.create({
        data: {
          name: dto.name.toLowerCase(),
          description: dto.description,
          createdAt: new Date(),
          metaData: [],
          brandId: dto.brandId,
        },
      });
      await this.connectCategoriesProduct(resp.id, dto.categoryIds, prisma);
      return resp;
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
      const currentProduct = await prisma.product.findFirst({ where: { id } });
      const categoryIds = dto.categoryIds ?? currentProduct?.categoryIds;
      const resp = await prisma.product.update({
        where: {
          id,
        },
        data: {
          name: dto.name.toLowerCase(),
          description: dto.description,
          categoryIds,
        },
      });
      await this.connectCategoriesProduct(id, categoryIds, prisma);
      return resp;
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
        select: {
          id: true,
          name: true,
          description: true,
          categories: true,
          categoryIds: true,
          createdAt: true,
          metaData: true,
          brand: true,
          brandId: true,
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
      const baseQuery = this.createBaseQuery(pagination);
      const whereQuery = this.createWhereQuery(searchParam);
      baseQuery['where'] = whereQuery ? { ...whereQuery.where }: {};

      const [items, count] = await Promise.all([
        prisma.product.findMany({
          ...baseQuery,
        }),
        prisma.product.count({ ...whereQuery }),
      ]);
      return { items, count };
    } catch (err) {
      console.error(err);
      throw err;
    } finally {
      await prisma.$disconnect();
    }
  }

  private createBaseQuery(pagination: PaginationItem = null) {
    const page = pagination?.page ? parseInt(pagination?.page, 10) : 0;
    const take = pagination?.pageSize
      ? parseInt(pagination?.pageSize, 10)
      : DEFAULT_LIMIT_PAGINATION;

    return {
      skip: (isNaN(page) ? 0 : page - 1) * take,
      take: take,
      select: {
        id: true,
        name: true,
        description: true,
        brandId: true,
        brand: true,
        createdAt: true,
        metaData: true,
        categoryIds: true,
      },
    };
  }

  private createWhereQuery(searchParam: SimpleSearchParam | null = null) {
    let whereQuery = null;
    if (searchParam?.query) {
      whereQuery = {
        where: {
          OR: [
            {
              brand: {
                name: {
                  contains: searchParam.query.toLowerCase(),
                },
              },
            },
            {
              name: {
                contains: searchParam.query.toLowerCase(),
              },
            },
          ],
        },
      };
    }
    return whereQuery;
  }

  private async connectCategoriesProduct(
    productId: string,
    categoryIds: string[],
    prisma: PrismaClient,
  ): Promise<void> {
    if (categoryIds?.length) {
      for (let categoryId of categoryIds) {
        await prisma.product.update({
          where: {
            id: productId,
          },
          data: {
            categories: {
              connect: {
                id: categoryId,
              },
            },
          },
        });
      }
    }
  }
}
