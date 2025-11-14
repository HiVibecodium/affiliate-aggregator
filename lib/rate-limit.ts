/**
 * Rate Limiting Utility
 * In-memory rate limiter for API endpoints
 * For production with multiple instances, consider Redis/Upstash
 */

import { NextRequest, NextResponse } from 'next/server';

interface RateLimitConfig {
  interval: number; // Time window in milliseconds
  uniqueTokenPerInterval: number; // Max requests per interval
}

interface RateLimitStore {
  count: number;
  resetTime: number;
}

// In-memory store (works for single instance)
// For production with multiple instances, use Redis/Upstash
const rateLimitStore = new Map<string, RateLimitStore>();

/**
 * Clean up expired entries periodically
 */
function cleanupExpiredEntries() {
  const now = Date.now();
  for (const [key, value] of rateLimitStore.entries()) {
    if (now > value.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}

// Cleanup every 5 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(cleanupExpiredEntries, 5 * 60 * 1000);
}

/**
 * Rate limit checker
 * Returns true if request should be allowed, false if rate limited
 */
export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig = { interval: 60000, uniqueTokenPerInterval: 10 }
): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now();
  const record = rateLimitStore.get(identifier);

  // No record or expired - create new
  if (!record || now > record.resetTime) {
    const resetTime = now + config.interval;
    rateLimitStore.set(identifier, { count: 1, resetTime });
    return {
      allowed: true,
      remaining: config.uniqueTokenPerInterval - 1,
      resetTime,
    };
  }

  // Check if limit exceeded
  if (record.count >= config.uniqueTokenPerInterval) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: record.resetTime,
    };
  }

  // Increment count
  record.count++;
  rateLimitStore.set(identifier, record);

  return {
    allowed: true,
    remaining: config.uniqueTokenPerInterval - record.count,
    resetTime: record.resetTime,
  };
}

/**
 * Get identifier from request (IP address or user ID)
 */
export function getIdentifier(request: NextRequest): string {
  // Try to get IP from various headers
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const ip = forwarded?.split(',')[0] || realIp || 'unknown';

  // You can also use user ID from auth if available
  // const userId = request.headers.get('x-user-id');
  // return userId || ip;

  return ip;
}

/**
 * Rate limit middleware wrapper
 * Usage: export const GET = withRateLimit(handler, { interval: 60000, uniqueTokenPerInterval: 10 });
 */
export function withRateLimit(
  handler: (request: NextRequest) => Promise<NextResponse>,
  config?: RateLimitConfig
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    const identifier = getIdentifier(request);
    const rateLimit = checkRateLimit(identifier, config);

    if (!rateLimit.allowed) {
      const retryAfter = Math.ceil((rateLimit.resetTime - Date.now()) / 1000);

      return NextResponse.json(
        {
          error: 'Rate limit exceeded',
          message: 'Too many requests. Please try again later.',
          retryAfter,
        },
        {
          status: 429,
          headers: {
            'Retry-After': retryAfter.toString(),
            'X-RateLimit-Limit': config?.uniqueTokenPerInterval.toString() || '10',
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': new Date(rateLimit.resetTime).toISOString(),
          },
        }
      );
    }

    // Add rate limit headers to response
    const response = await handler(request);
    response.headers.set('X-RateLimit-Limit', config?.uniqueTokenPerInterval.toString() || '10');
    response.headers.set('X-RateLimit-Remaining', rateLimit.remaining.toString());
    response.headers.set('X-RateLimit-Reset', new Date(rateLimit.resetTime).toISOString());

    return response;
  };
}

/**
 * Predefined rate limit configs
 */
export const RateLimitPresets = {
  // Strict - for sensitive endpoints (login, signup)
  strict: { interval: 60000, uniqueTokenPerInterval: 5 }, // 5 requests per minute

  // Standard - for normal API endpoints
  standard: { interval: 60000, uniqueTokenPerInterval: 30 }, // 30 requests per minute

  // Relaxed - for public read endpoints
  relaxed: { interval: 60000, uniqueTokenPerInterval: 100 }, // 100 requests per minute

  // Generous - for bulk operations
  generous: { interval: 60000, uniqueTokenPerInterval: 300 }, // 300 requests per minute
};
