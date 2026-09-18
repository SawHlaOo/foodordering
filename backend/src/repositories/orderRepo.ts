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
    where: { customerId, completedOrderDismissals: { none: { userId: customerId } } },
    include: { items: { include: { food: true } }, chef: true },
    orderBy: { createdAt: 'desc' }
  }),
  listForChef: (chefId: string) => prisma.order.findMany({
    where: {
      status: { in: ['PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'COMPLETED'] },
      OR: [
        { status: { not: 'COMPLETED' } },
        { completedOrderDismissals: { none: { userId: chefId } } }
      ]
    },
    include: { customer: true, items: { include: { food: true } } },
    orderBy: { createdAt: 'asc' }
  }),
  listRecent: () => prisma.order.findMany({
    include: { customer: true, items: { include: { food: true } }, chef: true },
    orderBy: { createdAt: 'desc' }
  }),
  listCompletedForAdmin: (adminId: string) => prisma.order.findMany({
    where: { status: 'COMPLETED', completedOrderDismissals: { none: { userId: adminId } } },
    select: {
      id: true,
      createdAt: true,
      updatedAt: true,
      orderType: true,
      deliveryAddress: true,
      customerPhone: true,
      customerName: true,
      customer: { select: { name: true } },
      items: { select: { food: { select: { name: true } } } }
    },
    orderBy: { updatedAt: 'desc' }
  }),
  create: (data: OrderCreateInput) => prisma.order.create({ data }),
  update: (id: string, data: OrderUpdateInput) => prisma.order.update({ where: { id }, data }),
  createItem: (data: OrderItemCreateInput) => prisma.orderItem.create({ data }),
  createCompletedOrderDismissal: (orderId: string, userId: string) =>
    prisma.completedOrderDismissal.upsert({
      where: { orderId_userId: { orderId, userId } },
      create: { orderId, userId },
      update: {}
    })
};
