import { NextFunction, Request, Response } from 'express';
import { sendError } from '../utils/api.js';

export const authorize = (...roles: Array<'CUSTOMER' | 'CHEF' | 'ADMIN'>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      res.status(401).json(sendError('Authentication required.'));
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json(sendError('You do not have permission to access this resource.'));
      return;
    }

    next();
  };
};
