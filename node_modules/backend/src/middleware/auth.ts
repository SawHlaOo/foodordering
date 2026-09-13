import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { sendError } from '../utils/api.js';

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith('Bearer ')) {
    res.status(401).json(sendError('Authentication required.'));
    return;
  }

  const token = header.split(' ')[1];

  try {
    const decoded = jwt.verify(token, env.jwtSecret) as { userId: string; email?: string; role: 'CUSTOMER' | 'CHEF' | 'ADMIN' };

    req.user = {
      userId: decoded.userId,
      email: decoded.email ?? '',
      role: decoded.role
    };

    next();
  } catch {
    res.status(401).json(sendError('Invalid or expired token.'));
  }
};
