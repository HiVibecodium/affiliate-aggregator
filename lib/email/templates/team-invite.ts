/**
 * Email Template: Team Invitation
 *
 * Sent when user is invited to join an organization
 */

interface InviteEmailParams {
  inviterName: string;
  organizationName: string;
  role: string;
  acceptUrl: string;
  appUrl: string;
}

export function generateTeamInviteEmail({
  inviterName,
  organizationName,
  role,
  acceptUrl,
  appUrl,
}: InviteEmailParams): { subject: string; html: string } {
  const roleLabels: Record<string, string> = {
    owner: 'Владелец',
    admin: 'Администратор',
    manager: 'Менеджер',
    member: 'Участник',
    viewer: 'Наблюдатель',
  };

  const roleLabel = roleLabels[role] || role;

  const subject = `👥 Приглашение в команду "${organizationName}"`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.6;
      color: #333;
      background: #f9fafb;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background: white;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    }
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 40px 30px;
      text-align: center;
    }
    .header h1 {
      margin: 0 0 10px 0;
      font-size: 28px;
    }
    .header p {
      margin: 0;
      opacity: 0.9;
      font-size: 16px;
    }
    .content {
      padding: 40px 30px;
    }
    .inviter {
      background: #eff6ff;
      border-left: 4px solid #3b82f6;
      padding: 16px;
      margin: 20px 0;
      border-radius: 4px;
    }
    .inviter strong {
      color: #1e40af;
      font-size: 16px;
    }
    .role-badge {
      display: inline-block;
      background: #fef3c7;
      color: #92400e;
      padding: 6px 12px;
      border-radius: 6px;
      font-weight: 600;
      font-size: 14px;
      margin: 10px 0;
    }
    .features {
      background: #f9fafb;
      padding: 20px;
      border-radius: 8px;
      margin: 20px 0;
    }
    .features h3 {
      margin: 0 0 12px 0;
      color: #1f2937;
      font-size: 16px;
    }
    .features ul {
      margin: 0;
      padding-left: 20px;
      color: #6b7280;
    }
    .features li {
      margin: 6px 0;
    }
    .btn {
      display: inline-block;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 16px 32px;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 600;
      font-size: 16px;
      text-align: center;
      margin: 20px 0;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      transition: transform 0.2s;
    }
    .btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
    }
    .footer {
      background: #f9fafb;
      text-align: center;
      padding: 24px;
      color: #6b7280;
      font-size: 13px;
      border-top: 1px solid #e5e7eb;
    }
    .footer a {
      color: #3b82f6;
      text-decoration: none;
    }
    .footer a:hover {
      text-decoration: underline;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>👥 Приглашение в команду</h1>
      <p>Совместная работа над партнерскими программами</p>
    </div>

    <div class="content">
      <div class="inviter">
        <p><strong>${inviterName}</strong> приглашает вас присоединиться к организации:</p>
        <h2 style="margin: 8px 0; color: #1f2937;">${organizationName}</h2>
      </div>

      <p>Вы получили приглашение на роль:</p>
      <div class="role-badge">
        👤 ${roleLabel}
      </div>

      <div class="features">
        <h3>🎯 Что вы сможете делать:</h3>
        <ul>
          ${
            role === 'owner' || role === 'admin'
              ? `
            <li>Полный доступ ко всем функциям организации</li>
            <li>Управление командой и приглашениями</li>
            <li>Настройка billing и subscription</li>
            <li>Просмотр аналитики и отчётов</li>
          `
              : role === 'manager'
                ? `
            <li>Управление программами и заявками</li>
            <li>Просмотр аналитики команды</li>
            <li>Совместная работа с командой</li>
          `
                : role === 'member'
                  ? `
            <li>Доступ к shared favorites</li>
            <li>Совместное сравнение программ</li>
            <li>Team analytics</li>
          `
                  : `
            <li>Просмотр программ организации</li>
            <li>Базовая аналитика</li>
          `
          }
        </ul>
      </div>

      <div style="text-align: center;">
        <a href="${acceptUrl}" class="btn">
          ✅ Принять приглашение
        </a>
      </div>

      <div style="margin-top: 30px; padding: 16px; background: #fef3c7; border-radius: 8px; border-left: 4px solid #f59e0b;">
        <p style="margin: 0; color: #92400e;">
          <strong>⏰ Срок действия:</strong> Ссылка активна 7 дней
        </p>
      </div>

      <p style="margin-top: 24px; color: #6b7280; font-size: 14px;">
        Если вы не ожидали это приглашение, просто проигнорируйте это письмо.
      </p>
    </div>

    <div class="footer">
      <p>
        <strong>Affiliate Aggregator</strong><br/>
        Глобальный агрегатор партнерских программ
      </p>
      <p style="margin-top: 12px;">
        <a href="${appUrl}">Перейти на сайт</a> |
        <a href="${appUrl}/settings">Настройки</a>
      </p>
      <p style="margin-top: 15px; color: #9ca3af;">
        © 2025 Affiliate Aggregator. Все права защищены.
      </p>
    </div>
  </div>
</body>
</html>
  `;

  return { subject, html };
}
