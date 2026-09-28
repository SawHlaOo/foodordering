import { prisma } from '../lib/prisma.js';
import type { z } from 'zod';
import type { maintenanceSettingsSchema } from '../validators/settings.js';

export type MaintenanceSettingsUpdate = z.infer<typeof maintenanceSettingsSchema>;

const settingsId = 'global';

export const settingsService = {
  getMaintenanceSettings: () => prisma.siteSettings.upsert({
    where: { id: settingsId },
    update: {},
    create: { id: settingsId }
  }),

  updateMaintenanceSettings: async (settings: MaintenanceSettingsUpdate, updatedById: string) => {
    const data: {
      maintenanceMode?: boolean;
      maintenanceTitle?: string;
      maintenanceMessage?: string;
      maintenanceUntil?: Date | null;
      updatedById: string;
    } = { updatedById };

    if (settings.maintenanceMode !== undefined) data.maintenanceMode = settings.maintenanceMode;
    if (settings.maintenanceTitle !== undefined) data.maintenanceTitle = settings.maintenanceTitle;
    if (settings.maintenanceMessage !== undefined) data.maintenanceMessage = settings.maintenanceMessage;
    if (settings.maintenanceUntil !== undefined) {
      data.maintenanceUntil = settings.maintenanceUntil === null ? null : new Date(settings.maintenanceUntil);
    }

    return prisma.siteSettings.upsert({
      where: { id: settingsId },
      update: data,
      create: { id: settingsId, ...data },
      include: { updatedBy: { select: { email: true } } }
    });
  },

  getAdminMaintenanceSettings: () => prisma.siteSettings.findUniqueOrThrow({
    where: { id: settingsId },
    include: { updatedBy: { select: { email: true } } }
  })
};
