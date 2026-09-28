import { NextFunction, Request, Response } from 'express';
import { settingsService } from '../services/settingsService.js';
import { sendSuccess } from '../utils/api.js';

export const settingsController = {
  getPublicMaintenanceSettings: async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const settings = await settingsService.getMaintenanceSettings();
      res.set('Cache-Control', 'no-store');
      res.json(sendSuccess({
        maintenanceMode: settings.maintenanceMode,
        maintenanceTitle: settings.maintenanceTitle,
        maintenanceMessage: settings.maintenanceMessage,
        maintenanceUntil: settings.maintenanceUntil
      }));
    } catch (error) {
      next(error);
    }
  },

  getAdminMaintenanceSettings: async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const settings = await settingsService.getAdminMaintenanceSettings();
      res.set('Cache-Control', 'no-store');
      res.json(sendSuccess(settings));
    } catch (error) {
      next(error);
    }
  },

  updateMaintenanceSettings: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const settings = await settingsService.updateMaintenanceSettings(req.body, req.user!.userId);
      res.set('Cache-Control', 'no-store');
      res.json(sendSuccess(settings));
    } catch (error) {
      next(error);
    }
  }
};
