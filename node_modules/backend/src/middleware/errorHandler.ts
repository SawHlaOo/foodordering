import { NextFunction, Request, Response } from 'express';
import { sendError } from '../utils/api.js';

export class ApiError extends Error {
  statusCode: number;

  constructor(message: string, statusCode = 400) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
  }
}

export const notFound = (req: Request, res: Response) => {
  res.status(404).json(sendError(`Route not found: ${req.originalUrl}`));
};

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  if (res.headersSent) {
    next(err);
    return;
  }

  const statusCode = err instanceof ApiError ? err.statusCode : 500;
  const message = statusCode === 500 ? 'Something went wrong. Please try again.' : err.message;

  res.status(statusCode).json(sendError(message));
};
