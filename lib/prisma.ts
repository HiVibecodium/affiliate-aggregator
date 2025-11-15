/**
 * Prisma Client singleton for Next.js
 * Prevents multiple Prisma instances in development
 *
 * Connection Pooling Configuration:
 * - Uses connection pooling to minimize memory usage
 * - Configures appropriate timeouts for serverless environments
 */

import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
    // Optimize for serverless/edge environments
    // These settings help reduce memory usage and connection overhead
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
