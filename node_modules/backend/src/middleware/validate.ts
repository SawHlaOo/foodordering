import { NextFunction, Request, Response } from 'express';
import { z, ZodError } from 'zod';
import { sendError } from '../utils/api.js';

export const validate = <T extends z.ZodTypeAny>(schema: T) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = schema.parse(req.body);
      req.body = parsed;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const message = error.errors.map((issue) => issue.message).join(', ');
        res.status(400).json(sendError(message));
        return;
      }

      res.status(400).json(sendError('Invalid request body.'));
    }
  };
};
