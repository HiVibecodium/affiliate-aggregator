/**
 * API Route: /api/notifications/history
 * История отправленных email уведомлений
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createClient } from '@/lib/supabase/server';

/**
 * GET /api/notifications/history
 * Получить историю уведомлений пользователя
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!user.email) {
      return NextResponse.json({ error: 'User email not found' }, { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const skip = (page - 1) * limit;

    // Получаем логи отправленных писем
    const [notifications, total] = await Promise.all([
      prisma.auditLog.findMany({
        where: {
          action: 'email.sent',
          details: {
            path: ['to'],
            array_contains: user.email,
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        select: {
          id: true,
          createdAt: true,
          details: true,
        },
      }),
      prisma.auditLog.count({
        where: {
          action: 'email.sent',
          details: {
            path: ['to'],
            array_contains: user.email,
          },
        },
      }),
    ]);

    // Форматируем ответ
    const formattedNotifications = notifications.map((n) => {
      const details = n.details as {
        subject?: string;
        success?: boolean;
        provider?: string;
        tags?: string[];
      };

      return {
        id: n.id,
        sentAt: n.createdAt,
        subject: details?.subject || 'No subject',
        success: details?.success ?? true,
        provider: details?.provider || 'unknown',
        tags: details?.tags || [],
      };
    });

    return NextResponse.json({
      notifications: formattedNotifications,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching notification history:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
