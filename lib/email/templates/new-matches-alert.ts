/**
 * Email Template: New Matches Alert
 *
 * Sent when new programs match user's saved search
 */

interface Program {
  id: string
  name: string
  description: string | null
  commissionRate: number | null
  commissionType: string | null
  network: {
    name: string
  }
}

export function generateNewMatchesEmail({
  searchName,
  matches,
  appUrl,
  unsubscribeUrl,
}: {
  searchName: string
  matches: Program[]
  appUrl: string
  unsubscribeUrl: string
}): { subject: string; html: string } {
  const subject = `🎯 ${matches.length} новых программ по запросу "${searchName}"`

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; }
    .program { background: #f9fafb; border-left: 4px solid #3b82f6; padding: 15px; margin: 15px 0; border-radius: 4px; }
    .program-name { font-size: 18px; font-weight: bold; color: #1f2937; margin-bottom: 5px; }
    .program-meta { font-size: 14px; color: #6b7280; }
    .commission { color: #10b981; font-weight: bold; }
    .btn { display: inline-block; background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; margin: 10px 5px; }
    .btn:hover { background: #2563eb; }
    .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin: 0;">🎯 Новые Программы Найдены!</h1>
      <p style="margin: 10px 0 0 0; opacity: 0.9;">Сохранённый поиск: "${searchName}"</p>
    </div>

    <div class="content">
      <p>Привет!</p>
      <p><strong>${matches.length} новых партнёрских программ</strong> соответствуют вашему сохранённому поиску "<em>${searchName}</em>":</p>

      ${matches
        .map(
          (program) => `
        <div class="program">
          <div class="program-name">${program.name}</div>
          <div class="program-meta">
            <span>📊 ${program.network.name}</span> •
            <span class="commission">💰 ${program.commissionRate || 'N/A'}% ${program.commissionType || ''}</span>
          </div>
          ${program.description ? `<p style="margin-top: 10px; font-size: 14px; color: #4b5563;">${program.description.substring(0, 150)}...</p>` : ''}
          <a href="${appUrl}/programs/${program.id}" class="btn" style="font-size: 14px; padding: 8px 16px;">Посмотреть →</a>
        </div>
      `
        )
        .join('')}

      <div style="text-align: center; margin-top: 30px;">
        <a href="${appUrl}/programs?search=${encodeURIComponent(searchName)}" class="btn">
          Посмотреть Все ${matches.length} Программ
        </a>
      </div>

      <div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 6px; padding: 15px; margin-top: 20px;">
        <p style="margin: 0; font-size: 14px;">
          💡 <strong>Совет:</strong> Чем быстрее подашь заявку, тем больше шансов на одобрение!
        </p>
      </div>
    </div>

    <div class="footer">
      <p>Вы получили это письмо, потому что включили уведомления для сохранённого поиска.</p>
      <p>
        <a href="${unsubscribeUrl}" style="color: #6b7280; text-decoration: underline;">Отключить уведомления</a> |
        <a href="${appUrl}/settings" style="color: #6b7280; text-decoration: underline;">Настройки</a>
      </p>
      <p style="margin-top: 15px;">
        © 2025 Affiliate Aggregator. Все права защищены.
      </p>
    </div>
  </div>
</body>
</html>
  `

  return { subject, html }
}
