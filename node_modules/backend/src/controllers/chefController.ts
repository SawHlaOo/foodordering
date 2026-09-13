import { NextFunction, Request, Response } from 'express';
import { orderService } from '../services/orderService.js';
import { sendSuccess } from '../utils/api.js';

export const chefController = {
  list: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const orders = await orderService.getChefOrders();
      res.json(sendSuccess(orders));
    } catch (error) {
      next(error);
    }
  },
  updateStatus: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = String(req.params.id);
      const order = await orderService.updateChefStatus(req.user!.userId, id, req.body.status);
      res.json(sendSuccess(order));
    } catch (error) {
      next(error);
    }
  }
};
