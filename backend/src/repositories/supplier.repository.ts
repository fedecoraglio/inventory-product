import { PrismaClient, Supplier } from '@prisma/client';

import { ListItem } from '@dtos/list-item.dto';
import { SupplierDto } from '@dtos/supplier.dtos';

export class SupplierRepository {
  async create(dto: SupplierDto): Promise<Supplier> {
    const prisma = new PrismaClient({});
    try {
      return await prisma.supplier.create({
        data: {
          name: dto.name.toLowerCase(),
          description: dto.description,
          email: dto.email,
          phoneNumber: dto.phoneNumber
        },
      });
    } catch (err) {
      console.error(err);
      throw err;
    } finally {
      await prisma.$disconnect();
    }
  }

  async update(dto: SupplierDto, id: string): Promise<Supplier> {
    const prisma = new PrismaClient({});
    try {
      return await prisma.supplier.update({
        where: {
          id,
        },
        data: {
          name: dto.name.toLowerCase(),
          description: dto.description,
          email: dto.email,
          phoneNumber: dto.phoneNumber,
        },
      });
    } catch (err) {
      console.error(err);
      throw err;
    } finally {
      await prisma.$disconnect();
    }
  }

  async delete(id: string): Promise<Supplier> {
    const prisma = new PrismaClient({});
    try {
      return await prisma.supplier.delete({
        where: { id },
      });
    } catch (err) {
      console.error(err);
      throw err;
    } finally {
      await prisma.$disconnect();
    }
  }

  async getById(id: string): Promise<Supplier> {
    const prisma = new PrismaClient({});
    try {
      return await prisma.supplier.findFirst({
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

  async getByName(name: string): Promise<Supplier> {
    const prisma = new PrismaClient({});
    try {
      return await prisma.supplier.findUnique({
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

  async getAll(): Promise<ListItem<Supplier>> {
    const prisma = new PrismaClient({});
    try {
      const [items, count] = await Promise.all([
        prisma.supplier.findMany({
          orderBy: [
            {
              createdAt: 'desc',
            },
          ],
        }),
        prisma.supplier.count(),
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
