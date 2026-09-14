import { prisma } from '../lib/prisma.js';

type OrderCreateInput = Parameters<typeof prisma.order.create>[0]['data'];
type OrderUpdateInput = Parameters<typeof prisma.order.update>[0]['data'];
type OrderItemCreateInput = Parameters<typeof prisma.orderItem.create>[0]['data'];

export const orderRepo = {
  findById: (id: string) => prisma.order.findUnique({
    where: { id },
    include: { customer: true, chef: true, items: { include: { food: true } } }
  }),
  listForCustomer: (customerId: string) => prisma.order.findMany({
    where: { customerId },
    include: { items: { include: { food: true } }, chef: true },
    orderBy: { createdAt: 'desc' }
  }),
  listForChef: () => prisma.order.findMany({
    where: { status: { in: ['PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'COMPLETED'] } },
    include: { customer: true, items: { include: { food: true } } },
    orderBy: { createdAt: 'asc' }
  }),
  listRecent: () => prisma.order.findMany({
    include: { customer: true, items: { include: { food: true } }, chef: true },
    orderBy: { createdAt: 'desc' }
  }),
  create: (data: OrderCreateInput) => prisma.order.create({ data }),
  update: (id: string, data: OrderUpdateInput) => prisma.order.update({ where: { id }, data }),
  delete: (id: string) => prisma.order.delete({ where: { id } }),
  createItem: (data: OrderItemCreateInput) => prisma.orderItem.create({ data })
};
