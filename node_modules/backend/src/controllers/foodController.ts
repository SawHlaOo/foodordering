import { NextFunction, Request, Response } from 'express';
import { menuService } from '../services/menuService.js';
import { sendSuccess } from '../utils/api.js';

export const foodController = {
  list: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const foods = await menuService.getFoods();
      res.json(sendSuccess(foods));
    } catch (error) {
      next(error);
    }
  },
  listAll: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const foods = await menuService.getAllFoods();
      res.json(sendSuccess(foods));
    } catch (error) {
      next(error);
    }
  },
  byId: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = String(req.params.id);
      const food = await menuService.getFoodById(id);
      res.json(sendSuccess(food));
    } catch (error) {
      next(error);
    }
  },
  create: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const food = await menuService.createFood(req.body);
      res.status(201).json(sendSuccess(food));
    } catch (error) {
      next(error);
    }
  },
  update: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = String(req.params.id);
      const food = await menuService.updateFood(id, req.body);
      res.json(sendSuccess(food));
    } catch (error) {
      next(error);
    }
  },
  remove: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = String(req.params.id);
      const result = await menuService.deleteFood(id);
      res.json(sendSuccess(result));
    } catch (error) {
      next(error);
    }
  }
};
