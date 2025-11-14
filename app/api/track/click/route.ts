import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withRateLimit, RateLimitPresets } from '@/lib/rate-limit';

/**
 * POST /api/track/click
 * Track when user clicks on a program
 */
async function trackClickHandler(request: NextRequest) {
  try {
    const body = await request.json();
    const { programId } = body;

    if (!programId) {
      return NextResponse.json({ error: 'Program ID is required' }, { status: 400 });
    }

    // Verify program exists
    const program = await prisma.affiliateProgram.findUnique({
      where: { id: programId },
      select: { id: true },
    });

    if (!program) {
      return NextResponse.json({ error: 'Program not found' }, { status: 404 });
    }

    // Get user info if available (from auth)
    // For now, track anonymously

    // Get IP and user agent
    const forwarded = request.headers.get('x-forwarded-for');
    const realIp = request.headers.get('x-real-ip');
    const ipAddress = forwarded?.split(',')[0] || realIp || 'unknown';

    const userAgent = request.headers.get('user-agent') || undefined;
    const referrer = request.headers.get('referer') || undefined;

    // Create click record
    await prisma.programClick.create({
      data: {
        programId,
        userAgent,
        referrer,
        ipAddress,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Click tracking error:', error);
    return NextResponse.json(
      {
        error: 'Failed to track click',
        details: error instanceof Error ? error.message : 'Unknown',
      },
      { status: 500 }
    );
  }
}

// Apply generous rate limiting for tracking (300/min)
export const POST = withRateLimit(trackClickHandler, RateLimitPresets.generous);
