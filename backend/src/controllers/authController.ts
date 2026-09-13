import { NextFunction, Request, Response } from 'express';
import { authService } from '../services/authService.js';
import { sendSuccess } from '../utils/api.js';

export const authController = {
  register: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await authService.register(req.body);
      res.status(201).json(sendSuccess(result));
    } catch (error) {
      next(error);
    }
  },
  login: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await authService.login(req.body);
      res.json(sendSuccess(result));
    } catch (error) {
      next(error);
    }
  },
  me: async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Authentication required.' });
        return;
      }

      const data = await authService.me(req.user.userId);
      res.json(sendSuccess(data));
    } catch (error) {
      next(error);
    }
  }
};
