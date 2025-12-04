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
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
    // Connection pool configuration optimized for serverless (Vercel)
    // Works with PgBouncer connection pooling (pgbouncer=true in DATABASE_URL)
    // connection_limit=1 in DATABASE_URL ensures single connection per instance

    // Note: __internal is not in Prisma's public TypeScript API

    __internal: {
      engine: {
        // Reduce connection acquisition timeout for faster failures
        connection_timeout: 5,
        // Close idle connections quickly in serverless
        pool_timeout: 10,
        // Maximum query execution time (30 seconds)
        query_timeout: 30000,
      },
    },
  } as any);

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// Cleanup helper for serverless environments
// Disconnect after request to free up memory
export async function disconnectPrisma() {
  await prisma.$disconnect();
}
