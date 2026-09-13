import { NextFunction, Request, Response } from 'express';
import { orderService } from '../services/orderService.js';
import { sendSuccess } from '../utils/api.js';

export const orderController = {
  create: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await orderService.createOrder(req.user!.userId, req.body);
      res.status(201).json(sendSuccess(result));
    } catch (error) {
      next(error);
    }
  },
  list: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const orders = await orderService.getCustomerOrders(req.user!.userId);
      res.json(sendSuccess(orders));
    } catch (error) {
      next(error);
    }
  },
  detail: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = String(req.params.id);
      const order = await orderService.getOrderById(req.user!.userId, id);
      res.json(sendSuccess(order));
    } catch (error) {
      next(error);
    }
  },
  cancel: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = String(req.params.id);
      const order = await orderService.cancelOrder(req.user!.userId, id);
      res.json(sendSuccess(order));
    } catch (error) {
      next(error);
    }
  },
  deleteCompleted: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = String(req.params.id);
      await orderService.deleteCompletedOrder(req.user!.userId, id);
      res.json(sendSuccess({ id }));
    } catch (error) {
      next(error);
    }
  }
};
