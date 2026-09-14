import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

const databaseUrl = process.env.DATABASE_URL;
const configuredDatabaseUrl = databaseUrl
  ? (() => {
      const url = new URL(databaseUrl);
      if (!url.searchParams.has('connection_limit')) url.searchParams.set('connection_limit', '10');
      if (!url.searchParams.has('pool_timeout')) url.searchParams.set('pool_timeout', '10');
      return url.toString();
    })()
  : undefined;

export const prisma = globalForPrisma.prisma ?? new PrismaClient(
  configuredDatabaseUrl ? { datasources: { db: { url: configuredDatabaseUrl } } } : undefined
);

globalForPrisma.prisma = prisma;
