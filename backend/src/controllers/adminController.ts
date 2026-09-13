import { NextFunction, Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';
import { menuService } from '../services/menuService.js';
import { orderService } from '../services/orderService.js';
import { sendSuccess } from '../utils/api.js';
import { ApiError } from '../middleware/errorHandler.js';

export const adminController = {
  dashboard: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const stats = await orderService.getDashboardStats();
      res.json(sendSuccess(stats));
    } catch (error) {
      next(error);
    }
  },
  listOrders: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const orders = await prisma.order.findMany({ include: { customer: true, items: { include: { food: true } } }, orderBy: { createdAt: 'desc' } });
      res.json(sendSuccess(orders));
    } catch (error) {
      next(error);
    }
  },
  listCompletedOrders: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const orders = await prisma.order.findMany({
        where: { status: 'COMPLETED' },
        select: {
          id: true,
          createdAt: true,
          updatedAt: true,
          customer: { select: { name: true } },
          items: { select: { food: { select: { name: true } } } }
        },
        orderBy: { updatedAt: 'desc' }
      });
      res.json(sendSuccess(orders.map((order) => ({
        id: order.id,
        customerName: order.customer.name,
        foodNames: order.items.map((item) => item.food.name),
        completedAt: order.updatedAt
      }))));
    } catch (error) {
      next(error);
    }
  },
  deleteCompletedOrder: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = String(req.params.id);
      const order = await prisma.order.findUnique({ where: { id }, select: { status: true } });
      if (!order) throw new ApiError('Order not found.', 404);
      if (order.status !== 'COMPLETED') {
        throw new ApiError('Only completed orders can be removed.', 400);
      }
      await prisma.order.delete({ where: { id } });
      res.json(sendSuccess({ id }));
    } catch (error) {
      next(error);
    }
  },
  listUsers: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const users = await prisma.user.findMany({ orderBy: { createdAt: 'desc' } });
      res.json(sendSuccess(users));
    } catch (error) {
      next(error);
    }
  },
  listChefs: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const chefs = await prisma.user.findMany({ where: { role: 'CHEF' }, orderBy: { createdAt: 'desc' } });
      res.json(sendSuccess(chefs));
    } catch (error) {
      next(error);
    }
  },
  listCategories: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const categories = await menuService.getCategories();
      res.json(sendSuccess(categories));
    } catch (error) {
      next(error);
    }
  },
  createCategory: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const category = await menuService.createCategory(req.body);
      res.status(201).json(sendSuccess(category));
    } catch (error) {
      next(error);
    }
  },
  updateCategory: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = String(req.params.id);
      const category = await menuService.updateCategory(id, req.body);
      res.json(sendSuccess(category));
    } catch (error) {
      next(error);
    }
  },
  deleteCategory: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = String(req.params.id);
      const result = await menuService.deleteCategory(id);
      res.json(sendSuccess(result));
    } catch (error) {
      next(error);
    }
  },
  getReports: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const orders = await prisma.order.findMany({ include: { customer: true } });
      const stats = {
        totalOrders: orders.length,
        completedOrders: orders.filter((item: { status: string }) => item.status === 'COMPLETED').length,
        cancelledOrders: orders.filter((item: { status: string }) => item.status === 'CANCELLED').length,
        revenue: orders.reduce((sum: number, item: { total: number | string | { toString: () => string } }) => {
          const value = typeof item.total === 'object' && item.total !== null ? Number(item.total.toString()) : Number(item.total ?? 0);
          return sum + value;
        }, 0)
      };
      res.json(sendSuccess(stats));
    } catch (error) {
      next(error);
    }
  }
};
