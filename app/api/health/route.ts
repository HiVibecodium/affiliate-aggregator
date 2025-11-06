import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface HealthCheckResult {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  uptime: number;
  checks: {
    database: {
      status: 'up' | 'down';
      latency?: number;
      error?: string;
    };
    memory: {
      used: number;
      total: number;
      percentage: number;
    };
    version: string;
  };
}

async function checkDatabase(): Promise<{ status: 'up' | 'down'; latency?: number; error?: string }> {
  try {
    const start = Date.now();
    await prisma.$queryRaw`SELECT 1`;
    const latency = Date.now() - start;

    return {
      status: 'up',
      latency
    };
  } catch (error) {
    return {
      status: 'down',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  } finally {
    await prisma.$disconnect();
  }
}

function getMemoryUsage() {
  const used = process.memoryUsage();
  return {
    used: Math.round(used.heapUsed / 1024 / 1024),
    total: Math.round(used.heapTotal / 1024 / 1024),
    percentage: Math.round((used.heapUsed / used.heapTotal) * 100)
  };
}

export async function GET() {
  try {
    const startTime = Date.now();

    // Run health checks
    const [dbCheck] = await Promise.all([
      checkDatabase()
    ]);

    const memory = getMemoryUsage();

    // Determine overall health status
    let status: 'healthy' | 'degraded' | 'unhealthy' = 'healthy';

    if (dbCheck.status === 'down') {
      status = 'unhealthy';
    } else if (dbCheck.latency && dbCheck.latency > 1000) {
      status = 'degraded';
    } else if (memory.percentage > 90) {
      status = 'degraded';
    }

    const healthCheck: HealthCheckResult = {
      status,
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      checks: {
        database: dbCheck,
        memory,
        version: process.env.npm_package_version || 'unknown'
      }
    };

    const responseStatus = status === 'healthy' ? 200 : status === 'degraded' ? 200 : 503;

    return NextResponse.json(healthCheck, {
      status: responseStatus,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'X-Health-Status': status
      }
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Health check failed'
      },
      { status: 503 }
    );
  }
}

// Readiness probe - checks if app is ready to serve traffic
export async function HEAD() {
  try {
    const dbCheck = await checkDatabase();

    if (dbCheck.status === 'up') {
      return new Response(null, { status: 200 });
    } else {
      return new Response(null, { status: 503 });
    }
  } catch (error) {
    return new Response(null, { status: 503 });
  }
}
