import { z } from 'zod';

export const maintenanceSettingsSchema = z.object({
  maintenanceMode: z.boolean().optional(),
  maintenanceTitle: z.string().trim().min(3).max(120).optional(),
  maintenanceMessage: z.string().trim().min(10).max(2000).optional(),
  maintenanceUntil: z.string().datetime({ offset: true }).nullable().optional()
}).strict().refine((settings) => Object.keys(settings).length > 0, {
  message: 'At least one maintenance setting must be provided.'
});
