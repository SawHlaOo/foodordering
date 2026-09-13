import { prisma } from '../lib/prisma.js';

export const foodRepo = {
  list: () => prisma.food.findMany({ where: { isAvailable: true }, include: { category: true }, orderBy: { createdAt: 'desc' } }),
  listAll: () => prisma.food.findMany({ include: { category: true }, orderBy: { createdAt: 'desc' } }),
  getById: (id: string) => prisma.food.findUnique({ where: { id }, include: { category: true } }),
  getByIds: (ids: string[]) => prisma.food.findMany({ where: { id: { in: ids } }, include: { category: true } }),
  create: (data: any) => prisma.food.create({ data }),
  update: (id: string, data: any) => prisma.food.update({ where: { id }, data }),
  remove: (id: string) => prisma.food.delete({ where: { id } })
};
