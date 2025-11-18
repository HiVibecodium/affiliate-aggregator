import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/lib/logger';

export const runtime = 'edge'; // Use edge runtime for better performance

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Log web vitals (in production, you'd send to your analytics service)
    logger.log('[Web Vitals]', {
      name: body.name,
      value: body.value,
      rating: body.rating,
      timestamp: new Date().toISOString(),
    });

    // Send to Vercel Analytics if configured
    if (process.env.NEXT_PUBLIC_VERCEL_ANALYTICS_ID) {
      try {
        await fetch('https://vitals.vercel-analytics.com/v1/vitals', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            dsn: process.env.NEXT_PUBLIC_VERCEL_ANALYTICS_ID,
            id: body.id || 'unknown',
            page: body.page || '/',
            href: body.href || '',
            name: body.name,
            value: body.value,
            speed: body.speed || 'unknown',
          }),
        });
      } catch (err) {
        // Silently fail analytics
        logger.warn('Analytics error:', err);
      }
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    logger.error('Web Vitals error:', error);
    return NextResponse.json({ error: 'Failed to record web vitals' }, { status: 500 });
  }
}
