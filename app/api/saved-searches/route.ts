import { logger } from '@/lib/logger';
/**
 * Saved Searches API
 *
 * GET /api/saved-searches - List user's saved searches
 * POST /api/saved-searches - Create new saved search
 * DELETE /api/saved-searches?id={id} - Delete saved search
 * PUT /api/saved-searches - Update saved search
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { checkAndRecordUsage } from '@/lib/billing/feature-gates';

/**
 * GET - List all saved searches for user
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    const searches = await prisma.savedSearch.findMany({
      where: {
        userId,
        active: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ searches });
  } catch (error: unknown) {
    logger.error('Failed to fetch saved searches:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

/**
 * POST - Create new saved search
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, name, description, filters, alertsEnabled, alertFrequency } = body;

    if (!userId || !name || !filters) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Check feature access
    const access = await checkAndRecordUsage(userId, 'saved_searches');

    if (!access.allowed) {
      return NextResponse.json(
        {
          error: access.message,
          upgradeUrl: access.upgradeUrl,
          requiresUpgrade: true,
        },
        { status: 403 }
      );
    }

    // Create saved search
    const savedSearch = await prisma.savedSearch.create({
      data: {
        userId,
        name,
        description,
        filters,
        alertsEnabled: alertsEnabled ?? true,
        alertFrequency: alertFrequency || 'daily',
      },
    });

    return NextResponse.json({ success: true, savedSearch });
  } catch (error: unknown) {
    logger.error('Failed to create saved search:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

/**
 * PUT - Update saved search
 */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, userId, name, description, filters, alertsEnabled, alertFrequency } = body;

    if (!id || !userId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Verify ownership
    const existing = await prisma.savedSearch.findFirst({
      where: { id, userId },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Saved search not found' }, { status: 404 });
    }

    // Update
    const updated = await prisma.savedSearch.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description }),
        ...(filters && { filters }),
        ...(alertsEnabled !== undefined && { alertsEnabled }),
        ...(alertFrequency && { alertFrequency }),
      },
    });

    return NextResponse.json({ success: true, savedSearch: updated });
  } catch (error: unknown) {
    logger.error('Failed to update saved search:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

/**
 * DELETE - Delete saved search
 */
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const userId = searchParams.get('userId');

    if (!id || !userId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Verify ownership
    const existing = await prisma.savedSearch.findFirst({
      where: { id, userId },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Saved search not found' }, { status: 404 });
    }

    // Soft delete
    await prisma.savedSearch.update({
      where: { id },
      data: { active: false },
    });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    logger.error('Failed to delete saved search:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
