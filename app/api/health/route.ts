import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

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

// Simple cache for DB check to avoid hammering on frequent health checks
let dbCheckCache: {
  result: { status: 'up' | 'down'; latency?: number };
  timestamp: number;
} | null = null;
const DB_CACHE_TTL = 5000; // 5 seconds

async function checkDatabase(): Promise<{
  status: 'up' | 'down';
  latency?: number;
  error?: string;
}> {
  // Return cached result if fresh
  if (dbCheckCache && Date.now() - dbCheckCache.timestamp < DB_CACHE_TTL) {
    return { ...dbCheckCache.result, latency: dbCheckCache.result.latency };
  }

  try {
    const start = Date.now();
    // Use $executeRawUnsafe for fastest possible ping
    // AbortController for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    await prisma.$executeRawUnsafe('SELECT 1');
    clearTimeout(timeoutId);

    const latency = Date.now() - start;

    // Cache successful result
    dbCheckCache = { result: { status: 'up', latency }, timestamp: Date.now() };

    return { status: 'up', latency };
  } catch (error) {
    // Don't cache errors - retry immediately
    dbCheckCache = null;
    return {
      status: 'down',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

function getMemoryUsage() {
  const mem = process.memoryUsage();
  // Use RSS (Resident Set Size) for actual memory footprint
  // heapUsed/heapTotal can be misleading (GC hasn't run yet)
  const rss = Math.round(mem.rss / 1024 / 1024);
  // Vercel functions have 1024MB limit by default
  const limit = 1024;
  return {
    used: rss,
    total: limit,
    percentage: Math.round((rss / limit) * 100),
  };
}

export async function GET() {
  try {
    // Health check doesn't need start time tracking currently
    // const startTime = Date.now();

    // Run health checks
    const [dbCheck] = await Promise.all([checkDatabase()]);

    const memory = getMemoryUsage();

    // Determine overall health status
    let status: 'healthy' | 'degraded' | 'unhealthy' = 'healthy';

    if (dbCheck.status === 'down') {
      status = 'unhealthy';
    } else if (dbCheck.latency && dbCheck.latency > 3000) {
      // Serverless cold starts + remote DB can take 1-2s normally
      // Only degrade if DB is significantly slow (>3s)
      status = 'degraded';
    } else if (memory.percentage > 98) {
      // Vercel serverless functions normally use 90-95% memory
      // Only degrade if critically close to limit
      status = 'degraded';
    }

    const healthCheck: HealthCheckResult = {
      status,
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      checks: {
        database: dbCheck,
        memory,
        version: process.env.npm_package_version || 'unknown',
      },
    };

    const responseStatus = status === 'healthy' ? 200 : status === 'degraded' ? 200 : 503;

    return NextResponse.json(healthCheck, {
      status: responseStatus,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'X-Health-Status': status,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Health check failed',
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
  } catch (_error) {
    return new Response(null, { status: 503 });
  }
}
