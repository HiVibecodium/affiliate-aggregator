/**
 * Email Template: Payment Failed Notification
 *
 * Sent when a subscription payment fails
 */

interface PaymentFailedEmailParams {
  userName: string;
  amount: number;
  currency: string;
  lastFour: string;
  tier: string;
  invoiceUrl: string | null;
  updatePaymentUrl: string;
  appUrl: string;
  retryDate?: Date;
}

export function generatePaymentFailedEmail({
  userName,
  amount,
  currency,
  lastFour,
  tier,
  invoiceUrl,
  updatePaymentUrl,
  appUrl,
  retryDate,
}: PaymentFailedEmailParams): { subject: string; html: string } {
  const tierLabels: Record<string, string> = {
    free: 'Free',
    pro: 'Pro',
    business: 'Business',
    enterprise: 'Enterprise',
  };

  const tierLabel = tierLabels[tier] || tier;
  const formattedAmount = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(amount / 100);

  const subject = `⚠️ Не удалось обработать платёж - ${tierLabel} подписка`;

  const retryDateFormatted = retryDate
    ? new Intl.DateTimeFormat('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }).format(retryDate)
    : null;

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
      background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
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
    .alert-box {
      background: #fef2f2;
      border-left: 4px solid #ef4444;
      padding: 20px;
      margin: 20px 0;
      border-radius: 4px;
    }
    .alert-box strong {
      color: #991b1b;
      font-size: 16px;
      display: block;
      margin-bottom: 8px;
    }
    .alert-box p {
      margin: 0;
      color: #7f1d1d;
    }
    .details-box {
      background: #f9fafb;
      padding: 20px;
      border-radius: 8px;
      margin: 20px 0;
    }
    .detail-row {
      display: flex;
      justify-content: space-between;
      padding: 10px 0;
      border-bottom: 1px solid #e5e7eb;
    }
    .detail-row:last-child {
      border-bottom: none;
    }
    .detail-label {
      color: #6b7280;
      font-size: 14px;
    }
    .detail-value {
      color: #1f2937;
      font-weight: 600;
      font-size: 14px;
    }
    .btn {
      display: inline-block;
      background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
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
    .btn-secondary {
      background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%);
    }
    .info-box {
      background: #eff6ff;
      border-left: 4px solid #3b82f6;
      padding: 16px;
      margin: 20px 0;
      border-radius: 4px;
    }
    .info-box p {
      margin: 0;
      color: #1e40af;
      font-size: 14px;
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
    .steps-list {
      background: #f9fafb;
      padding: 20px;
      border-radius: 8px;
      margin: 20px 0;
    }
    .steps-list h3 {
      margin: 0 0 16px 0;
      color: #1f2937;
      font-size: 16px;
    }
    .steps-list ol {
      margin: 0;
      padding-left: 24px;
      color: #4b5563;
    }
    .steps-list li {
      margin: 10px 0;
      line-height: 1.5;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>⚠️ Ошибка оплаты</h1>
      <p>Требуется обновление способа оплаты</p>
    </div>

    <div class="content">
      <p>Здравствуйте, ${userName}!</p>

      <div class="alert-box">
        <strong>🚨 Платёж не прошёл</strong>
        <p>Мы не смогли списать оплату за вашу ${tierLabel} подписку. Пожалуйста, обновите способ оплаты, чтобы сохранить доступ ко всем функциям.</p>
      </div>

      <div class="details-box">
        <h3 style="margin: 0 0 16px 0; color: #1f2937; font-size: 16px;">💳 Детали платежа</h3>
        <div class="detail-row">
          <span class="detail-label">Сумма:</span>
          <span class="detail-value">${formattedAmount}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Подписка:</span>
          <span class="detail-value">${tierLabel}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Карта:</span>
          <span class="detail-value">•••• ${lastFour}</span>
        </div>
        ${
          retryDateFormatted
            ? `
        <div class="detail-row">
          <span class="detail-label">Следующая попытка:</span>
          <span class="detail-value">${retryDateFormatted}</span>
        </div>
        `
            : ''
        }
      </div>

      <div style="text-align: center;">
        <a href="${updatePaymentUrl}" class="btn">
          🔄 Обновить способ оплаты
        </a>
      </div>

      ${
        invoiceUrl
          ? `
      <div style="text-align: center; margin-top: 12px;">
        <a href="${invoiceUrl}" class="btn btn-secondary">
          📄 Посмотреть счёт
        </a>
      </div>
      `
          : ''
      }

      <div class="steps-list">
        <h3>📋 Что произошло?</h3>
        <ol>
          <li><strong>Недостаточно средств</strong> на карте</li>
          <li><strong>Истёк срок действия</strong> карты</li>
          <li><strong>Банк отклонил</strong> транзакцию</li>
          <li><strong>Изменились данные</strong> карты</li>
        </ol>
      </div>

      <div class="info-box">
        <p>
          <strong>⏰ Важно:</strong>
          ${
            retryDateFormatted
              ? `Мы автоматически попробуем повторить платёж ${retryDateFormatted}. `
              : 'Мы автоматически попробуем повторить платёж в ближайшее время. '
          }
          Если оплата не пройдёт, ваша подписка будет переведена на Free план, и вы потеряете доступ к премиум-функциям.
        </p>
      </div>

      <div style="margin-top: 30px; padding: 16px; background: #eff6ff; border-radius: 8px; border-left: 4px solid #3b82f6;">
        <p style="margin: 0; color: #1e40af; font-size: 14px;">
          <strong>💡 Нужна помощь?</strong><br/>
          Если у вас возникли вопросы или проблемы с оплатой, свяжитесь с нашей службой поддержки через настройки аккаунта.
        </p>
      </div>

      <p style="margin-top: 24px; color: #6b7280; font-size: 14px;">
        Если вы больше не хотите пользоваться ${tierLabel} подпиской, вы можете отменить её в настройках аккаунта.
      </p>
    </div>

    <div class="footer">
      <p>
        <strong>Affiliate Aggregator</strong><br/>
        Глобальный агрегатор партнерских программ
      </p>
      <p style="margin-top: 12px;">
        <a href="${appUrl}">Перейти на сайт</a> |
        <a href="${appUrl}/settings">Настройки</a> |
        <a href="${appUrl}/billing">Управление подпиской</a>
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
