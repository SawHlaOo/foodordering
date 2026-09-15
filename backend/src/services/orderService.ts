import { prisma } from '../lib/prisma.js';
import { ApiError } from '../middleware/errorHandler.js';
import { foodRepo } from '../repositories/foodRepo.js';
import { orderRepo } from '../repositories/orderRepo.js';
import { userRepo } from '../repositories/userRepo.js';

const orderFlow: Record<string, string[]> = {
  PENDING: ['CONFIRMED', 'CANCELLED', 'REJECTED'],
  CONFIRMED: ['COMPLETED', 'CANCELLED'],
  // Legacy orders can still be completed after the workflow is shortened.
  PREPARING: ['COMPLETED', 'CANCELLED'],
  READY: ['COMPLETED', 'CANCELLED'],
  COMPLETED: [],
  CANCELLED: [],
  REJECTED: []
};

export const orderService = {
  createOrder: async (customerId: string, payload: any) => {
    if (!payload.items || payload.items.length === 0) {
      throw new ApiError('Order must contain at least one item.', 400);
    }

    const requestedItems = payload.items as Array<{ foodId: string; quantity: number; note?: string | null }>;
    const customerName = payload.customerName?.trim() || (await userRepo.findNameById(customerId))?.name;
    if (!customerName) throw new ApiError('Customer name could not be determined.', 400);
    const foodIds = requestedItems.map((item) => item.foodId);
    const foods = await foodRepo.getByIds(foodIds);
    const foodMap = new Map<string, (typeof foods)[number]>(foods.map((food) => [food.id, food]));

    for (const item of requestedItems) {
      const food = foodMap.get(item.foodId);
      if (!food) throw new ApiError(`Food item not found: ${item.foodId}`, 404);
      if (!food.isAvailable) throw new ApiError(`Food item is unavailable: ${food.name}`, 400);
    }

    const subtotal = requestedItems.reduce((total: number, item) => {
      const food = foodMap.get(item.foodId)!;
      return total + Number(food.price) * item.quantity;
    }, 0);

    const deliveryFee = payload.orderType === 'DELIVERY' ? 4.5 : 0;
    const total = subtotal + deliveryFee;

    const orderNumber = `FF-${Date.now().toString().slice(-6)}`;
    const order = await orderRepo.create({
      orderNumber,
      customer: { connect: { id: customerId } },
      orderType: payload.orderType,
      status: 'PENDING',
      tableNumber: payload.orderType === 'DINE_IN' ? payload.tableNumber : null,
      deliveryAddress: payload.orderType === 'DELIVERY' ? payload.deliveryAddress : null,
      customerPhone: payload.orderType === 'DELIVERY' ? payload.customerPhone ?? null : null,
      customerName,
      customerNote: payload.customerNote ?? null,
      subtotal: String(subtotal),
      deliveryFee: String(deliveryFee),
      total: String(total),
      items: {
        create: requestedItems.map((item) => ({
          food: { connect: { id: item.foodId } },
          quantity: item.quantity,
          price: String(foodMap.get(item.foodId)!.price),
          note: item.note ?? null
        }))
      }
    });

    return orderRepo.findById(order.id);
  },
  getCustomerOrders: async (customerId: string) => orderRepo.listForCustomer(customerId),
  getOrderById: async (userId: string, role: 'CUSTOMER' | 'CHEF' | 'ADMIN', orderId: string) => {
    const order = await orderRepo.findById(orderId);
    if (!order) throw new ApiError('Order not found.', 404);
    if (role === 'CUSTOMER' && order.customerId !== userId) {
      throw new ApiError('You can only access your own orders.', 403);
    }
    return order;
  },
  cancelOrder: async (customerId: string, orderId: string) => {
    const order = await orderRepo.findById(orderId);
    if (!order) throw new ApiError('Order not found.', 404);
    if (order.customerId !== customerId) throw new ApiError('You can only cancel your own orders.', 403);
    if (order.status === 'COMPLETED' || order.status === 'CANCELLED' || order.status === 'REJECTED') {
      throw new ApiError('This order cannot be cancelled.', 400);
    }
    return orderRepo.update(orderId, { status: 'CANCELLED' });
  },
  deleteCompletedOrder: async (customerId: string, orderId: string) => {
    const order = await orderRepo.findById(orderId);
    if (!order) throw new ApiError('Order not found.', 404);
    if (order.customerId !== customerId) throw new ApiError('You can only remove your own orders.', 403);
    if (order.status !== 'COMPLETED') {
      throw new ApiError('Only completed orders can be removed.', 400);
    }
    return orderRepo.delete(orderId);
  },
  getChefOrders: async () => orderRepo.listForChef(),
  updateChefStatus: async (chefId: string, orderId: string, status: string) => {
    const order = await orderRepo.findById(orderId);
    if (!order) throw new ApiError('Order not found.', 404);
    if (order.chefId && order.chefId !== chefId) {
      throw new ApiError('This order is assigned to a different chef.', 403);
    }

    const validTransitions = orderFlow[order.status] ?? [];
    if (!validTransitions.includes(status)) {
      throw new ApiError(`Invalid status transition from ${order.status} to ${status}.`, 400);
    }

    const updatePayload: Record<string, unknown> = { status };
    if (status === 'CONFIRMED') {
      updatePayload.chefId = chefId;
    }
    if (status === 'COMPLETED') {
      updatePayload.chefId = order.chefId ?? chefId;
    }

    return orderRepo.update(orderId, updatePayload);
  },
  deleteChefCompletedOrder: async (chefId: string, orderId: string) => {
    const order = await orderRepo.findById(orderId);
    if (!order) throw new ApiError('Order not found.', 404);
    if (order.chefId !== chefId) {
      throw new ApiError('This order is assigned to a different chef.', 403);
    }
    if (order.status !== 'COMPLETED') {
      throw new ApiError('Only completed orders can be removed.', 400);
    }
    return orderRepo.delete(orderId);
  },
  getDashboardStats: async () => {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const [allOrders, customers, chefs, foods] = await Promise.all([
      orderRepo.listRecent(),
      prisma.user.count({ where: { role: 'CUSTOMER' } }),
      prisma.user.count({ where: { role: 'CHEF' } }),
      prisma.food.count()
    ]);

    const filteredToday = allOrders.filter((order: { createdAt: Date | string }) => new Date(order.createdAt) >= startOfDay);
    const revenueTotal = filteredToday.reduce((sum: number, item: { total: number | string | { toString: () => string } }) => {
      const value = typeof item.total === 'object' && item.total !== null ? Number(item.total.toString()) : Number(item.total ?? 0);
      return sum + value;
    }, 0);

    return {
      todaysOrders: filteredToday.length,
      pendingOrders: allOrders.filter((order: { status: string }) => order.status === 'PENDING').length,
      preparingOrders: allOrders.filter((order: { status: string }) => order.status === 'PREPARING').length,
      completedOrders: allOrders.filter((order: { status: string }) => order.status === 'COMPLETED').length,
      todaysRevenue: Number(revenueTotal.toFixed(2)),
      totalCustomers: customers,
      totalChefs: chefs,
      totalMenuItems: foods
    };
  }
};
