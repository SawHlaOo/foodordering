import { prisma } from '../lib/prisma.js';

export const categoryRepo = {
  list: () => prisma.category.findMany({ orderBy: { createdAt: 'desc' } }),
  getById: (id: string) => prisma.category.findUnique({ where: { id } }),
  create: (data: any) => prisma.category.create({ data }),
  update: (id: string, data: any) => prisma.category.update({ where: { id }, data }),
  remove: (id: string) => prisma.category.delete({ where: { id } })
};
