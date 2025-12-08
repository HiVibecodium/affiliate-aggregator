/**
 * API Route: /api/notifications/settings
 * Управление настройками email уведомлений пользователя
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createClient } from '@/lib/supabase/server';

// Типы уведомлений
export interface NotificationSettings {
  // Глобальный переключатель
  all: boolean;
  // Типы уведомлений
  newPrograms: boolean;
  commissionUpdates: boolean;
  weeklyDigest: boolean;
  savedSearchAlerts: boolean;
  favoriteUpdates: boolean;
  securityAlerts: boolean;
  marketingEmails: boolean;
  // Частота дайджеста
  digestFrequency: 'daily' | 'weekly' | 'monthly' | 'never';
}

const DEFAULT_SETTINGS: NotificationSettings = {
  all: true,
  newPrograms: true,
  commissionUpdates: true,
  weeklyDigest: true,
  savedSearchAlerts: true,
  favoriteUpdates: true,
  securityAlerts: true,
  marketingEmails: false,
  digestFrequency: 'weekly',
};

/**
 * GET /api/notifications/settings
 * Получить текущие настройки уведомлений
 */
export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let dbUser = await prisma.user.findUnique({
      where: { email: user.email! },
      select: { id: true, emailNotifications: true, email: true },
    });

    if (!dbUser) {
      dbUser = await prisma.user.create({
        data: {
          email: user.email!,
          name: user.user_metadata?.full_name || user.email!.split('@')[0],
        },
        select: { id: true, emailNotifications: true, email: true },
      });
    }

    const settings =
      (dbUser.emailNotifications as unknown as NotificationSettings) || DEFAULT_SETTINGS;

    return NextResponse.json({
      settings: { ...DEFAULT_SETTINGS, ...settings },
      email: dbUser.email,
    });
  } catch (error) {
    console.error('Error fetching notification settings:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * PUT /api/notifications/settings
 * Обновить настройки уведомлений
 */
export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const settings: Partial<NotificationSettings> = body.settings;

    if (!settings || typeof settings !== 'object') {
      return NextResponse.json({ error: 'Invalid settings format' }, { status: 400 });
    }

    // Валидация digestFrequency
    if (
      settings.digestFrequency &&
      !['daily', 'weekly', 'monthly', 'never'].includes(settings.digestFrequency)
    ) {
      return NextResponse.json({ error: 'Invalid digest frequency' }, { status: 400 });
    }

    // Получаем или создаем пользователя
    let dbUser = await prisma.user.findUnique({
      where: { email: user.email! },
      select: { id: true, emailNotifications: true },
    });

    if (!dbUser) {
      dbUser = await prisma.user.create({
        data: {
          email: user.email!,
          name: user.user_metadata?.full_name || user.email!.split('@')[0],
        },
        select: { id: true, emailNotifications: true },
      });
    }

    const currentSettings =
      (dbUser.emailNotifications as unknown as NotificationSettings) || DEFAULT_SETTINGS;

    // Мержим с новыми
    const updatedSettings: NotificationSettings = {
      ...currentSettings,
      ...settings,
    };

    // Сохраняем
    await prisma.user.update({
      where: { id: dbUser.id },
      data: {
        emailNotifications: JSON.parse(JSON.stringify(updatedSettings)),
      },
    });

    // Логируем изменение
    await prisma.auditLog.create({
      data: {
        action: 'notification_settings.updated',
        resourceType: 'user',
        resourceId: dbUser.id,
        performedBy: dbUser.id,
        details: {
          changes: settings,
        },
      },
    });

    return NextResponse.json({
      success: true,
      settings: updatedSettings,
    });
  } catch (error) {
    console.error('Error updating notification settings:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * POST /api/notifications/settings
 * Отправить тестовое уведомление
 */
export async function POST() {
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
      return NextResponse.json({ error: 'No email configured' }, { status: 400 });
    }

    // Импортируем sender динамически чтобы избежать циклических зависимостей
    const { sendEmail } = await import('@/lib/email/sender');

    const result = await sendEmail({
      to: user.email,
      subject: 'Тестовое уведомление - Affiliate Aggregator',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #2563eb;">Тестовое уведомление</h1>
          <p>Это тестовое уведомление от Affiliate Aggregator.</p>
          <p>Если вы получили это письмо, значит настройки уведомлений работают корректно.</p>
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
          <p style="color: #6b7280; font-size: 12px;">
            Вы получили это письмо потому что запросили тестовое уведомление.
          </p>
        </div>
      `,
      text: 'Это тестовое уведомление от Affiliate Aggregator. Если вы получили это письмо, значит настройки работают корректно.',
      tags: ['test', 'notification'],
    });

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'Test email sent successfully',
        messageId: result.messageId,
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          error: result.error || 'Failed to send test email',
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error sending test notification:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
