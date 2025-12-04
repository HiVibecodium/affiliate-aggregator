import { logger } from '@/lib/logger';
/**
 * API Route: Unsubscribe from Saved Search Alerts
 *
 * Handles email unsubscribe links
 */

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const searchId = searchParams.get('id');

    if (!searchId) {
      return NextResponse.json({ error: 'Search ID required' }, { status: 400 });
    }

    // Disable alerts for this search
    const search = await prisma.savedSearch.update({
      where: { id: searchId },
      data: { alertsEnabled: false },
    });

    // Return success page (HTML response)
    return new Response(
      `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Отписка успешна</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 80px auto;
      padding: 20px;
      text-align: center;
    }
    .container {
      background: #ffffff;
      border: 1px solid #e5e7eb;
      border-radius: 12px;
      padding: 40px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    .icon { font-size: 64px; margin-bottom: 20px; }
    h1 { color: #1f2937; margin-bottom: 10px; }
    p { color: #6b7280; margin: 15px 0; }
    .btn {
      display: inline-block;
      background: #3b82f6;
      color: white;
      padding: 12px 24px;
      text-decoration: none;
      border-radius: 6px;
      font-weight: 600;
      margin-top: 20px;
    }
    .btn:hover { background: #2563eb; }
  </style>
</head>
<body>
  <div class="container">
    <div class="icon">✅</div>
    <h1>Отписка успешна</h1>
    <p>Вы больше не будете получать email уведомления для поиска:</p>
    <p><strong>"${search.name}"</strong></p>
    <p>Вы можете в любое время снова включить уведомления в настройках.</p>
    <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/saved-searches" class="btn">
      Перейти к Сохранённым Поискам
    </a>
  </div>
</body>
</html>
      `,
      {
        status: 200,
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
      }
    );
  } catch (error: unknown) {
    logger.error('Unsubscribe error:', error);

    return new Response(
      `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Ошибка</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 80px auto;
      padding: 20px;
      text-align: center;
    }
    .container {
      background: #ffffff;
      border: 1px solid #e5e7eb;
      border-radius: 12px;
      padding: 40px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    .icon { font-size: 64px; margin-bottom: 20px; }
    h1 { color: #dc2626; }
    p { color: #6b7280; }
  </style>
</head>
<body>
  <div class="container">
    <div class="icon">❌</div>
    <h1>Ошибка</h1>
    <p>Не удалось отписаться от уведомлений.</p>
    <p>Пожалуйста, попробуйте позже или свяжитесь с поддержкой.</p>
  </div>
</body>
</html>
      `,
      {
        status: 500,
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
      }
    );
  }
}
