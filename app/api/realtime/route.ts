/**
 * Real-time Updates API (Server-Sent Events)
 */

import { NextRequest, NextResponse } from 'next/server';
import { createSSEStream, subscribeUser } from '@/lib/realtime';
import { getOrganizationContext } from '@/lib/org-middleware';

// GET - Establish SSE connection
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const channel = searchParams.get('channel');

    if (!channel) {
      return NextResponse.json({ error: 'Channel parameter required' }, { status: 400 });
    }

    // Validate channel format
    const validChannelPatterns = [
      /^programs:\w+$/,
      /^program:[a-zA-Z0-9-]+$/,
      /^user:[a-zA-Z0-9-]+$/,
      /^organization:[a-zA-Z0-9-]+$/,
      /^stats:\w+$/,
      /^global$/,
    ];

    const isValidChannel = validChannelPatterns.some((pattern) => pattern.test(channel));
    if (!isValidChannel) {
      return NextResponse.json(
        {
          error: 'Invalid channel format',
          validFormats: [
            'programs:*',
            'program:{id}',
            'user:{id}',
            'organization:{id}',
            'stats:*',
            'global',
          ],
        },
        { status: 400 }
      );
    }

    // Get user context if available
    const context = await getOrganizationContext(request);

    // If user channel, verify ownership
    if (channel.startsWith('user:') && context.user) {
      const channelUserId = channel.split(':')[1];
      if (channelUserId !== context.user.id) {
        return NextResponse.json(
          { error: 'Cannot subscribe to other user channels' },
          { status: 403 }
        );
      }
      subscribeUser(context.user.id, channel);
    }

    // If organization channel, verify membership
    if (channel.startsWith('organization:') && context.organization) {
      const channelOrgId = channel.split(':')[1];
      if (channelOrgId !== context.organization.id) {
        return NextResponse.json(
          { error: 'Cannot subscribe to other organization channels' },
          { status: 403 }
        );
      }
    }

    // Create SSE stream
    const stream = createSSEStream(request, channel);

    return new NextResponse(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache, no-transform',
        Connection: 'keep-alive',
        'X-Accel-Buffering': 'no', // Disable nginx buffering
      },
    });
  } catch (error) {
    console.error('Error creating SSE stream:', error);
    return NextResponse.json({ error: 'Failed to establish connection' }, { status: 500 });
  }
}

// POST - Publish event (internal use / admin)
export async function POST(request: NextRequest) {
  try {
    const context = await getOrganizationContext(request);

    // Only allow authenticated users with admin role
    if (!context.user || context.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const body = await request.json();
    const { channel, event } = body;

    if (!channel || !event) {
      return NextResponse.json({ error: 'channel and event required' }, { status: 400 });
    }

    // Import publish function dynamically to avoid circular deps
    const { publish } = await import('@/lib/realtime');
    publish(channel, event);

    return NextResponse.json({ success: true, message: 'Event published' });
  } catch (error) {
    console.error('Error publishing event:', error);
    return NextResponse.json({ error: 'Failed to publish event' }, { status: 500 });
  }
}
