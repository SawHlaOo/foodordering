import { NextFunction, Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';
import { sendError } from '../utils/api.js';

export const blockPublicTrafficDuringMaintenance = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const publicMenuRead = req.method === 'GET' && req.path !== '/admin/all';
  const customerOrderCreate = req.method === 'POST' && req.path === '/';
  if (!publicMenuRead && !customerOrderCreate) {
    next();
    return;
  }

  try {
    const settings = await prisma.siteSettings.findUnique({
      where: { id: 'global' },
      select: { maintenanceMode: true }
    });

    if (!settings?.maintenanceMode) {
      next();
      return;
    }

    res.set('Cache-Control', 'no-store');
    res.set('Retry-After', '300');
    res.status(503).json(sendError('The website is temporarily unavailable during scheduled maintenance.'));
  } catch (error) {
    next(error);
  }
};
