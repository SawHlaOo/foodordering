import { prisma } from '../lib/prisma.js';

export const userRepo = {
  findByEmail: (email: string) => prisma.user.findUnique({ where: { email } }),
  findById: (id: string) => prisma.user.findUnique({ where: { id } }),
  create: (data: { email: string; name: string; password: string; role?: 'CUSTOMER' | 'CHEF' | 'ADMIN'; phone?: string | null }) =>
    prisma.user.create({ data }),
  list: () => prisma.user.findMany({ orderBy: { createdAt: 'desc' } })
};
