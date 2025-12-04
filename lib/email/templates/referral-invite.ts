/**
 * Email Template: Referral Invitation
 *
 * Sent when user invites someone through the referral system
 */

interface ReferralInviteEmailParams {
  referrerName: string;
  referralCode: string;
  signupUrl: string;
  referrerReward: string;
  referredReward: string;
  appUrl: string;
}

export function generateReferralInviteEmail({
  referrerName,
  referralCode,
  signupUrl,
  referrerReward,
  referredReward,
  appUrl,
}: ReferralInviteEmailParams): { subject: string; html: string } {
  const rewardLabels: Record<string, string> = {
    '1_month_free': '1 месяц бесплатно',
    '50_percent_off': '50% скидка на первый месяц',
    '3_months_free': '3 месяца бесплатно',
    '25_percent_off': '25% скидка',
  };

  const referredRewardLabel = rewardLabels[referredReward] || referredReward;
  const referrerRewardLabel = rewardLabels[referrerReward] || referrerReward;

  const subject = `🎁 ${referrerName} приглашает вас в Affiliate Aggregator`;

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
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
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
    .inviter-box {
      background: #ecfdf5;
      border-left: 4px solid #10b981;
      padding: 20px;
      margin: 20px 0;
      border-radius: 4px;
    }
    .inviter-box strong {
      color: #065f46;
      font-size: 18px;
      display: block;
      margin-bottom: 8px;
    }
    .inviter-box p {
      margin: 0;
      color: #047857;
    }
    .reward-box {
      background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
      padding: 24px;
      border-radius: 12px;
      margin: 24px 0;
      text-align: center;
      border: 2px solid #f59e0b;
    }
    .reward-box .icon {
      font-size: 48px;
      margin-bottom: 12px;
    }
    .reward-box .title {
      font-size: 22px;
      font-weight: 700;
      color: #92400e;
      margin: 0 0 8px 0;
    }
    .reward-box .description {
      font-size: 16px;
      color: #78350f;
      margin: 0;
    }
    .features {
      background: #f9fafb;
      padding: 24px;
      border-radius: 8px;
      margin: 24px 0;
    }
    .features h3 {
      margin: 0 0 16px 0;
      color: #1f2937;
      font-size: 18px;
    }
    .features ul {
      margin: 0;
      padding-left: 20px;
      color: #4b5563;
    }
    .features li {
      margin: 10px 0;
      line-height: 1.5;
    }
    .btn {
      display: inline-block;
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      color: white;
      padding: 18px 36px;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 600;
      font-size: 18px;
      text-align: center;
      margin: 24px 0;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      transition: transform 0.2s;
    }
    .btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
    }
    .referral-code {
      background: #f3f4f6;
      border: 2px dashed #9ca3af;
      padding: 16px;
      border-radius: 8px;
      text-align: center;
      margin: 24px 0;
    }
    .referral-code .label {
      font-size: 12px;
      color: #6b7280;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 8px;
    }
    .referral-code .code {
      font-size: 24px;
      font-weight: 700;
      color: #1f2937;
      font-family: 'Courier New', monospace;
      letter-spacing: 2px;
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
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎁 Приглашение от друга</h1>
      <p>Присоединяйтесь с эксклюзивным бонусом!</p>
    </div>

    <div class="content">
      <div class="inviter-box">
        <strong>👋 ${referrerName} приглашает вас!</strong>
        <p>Ваш друг рекомендует Affiliate Aggregator - лучшую платформу для поиска партнерских программ.</p>
      </div>

      <div class="reward-box">
        <div class="icon">🎉</div>
        <p class="title">Специальное предложение для вас</p>
        <p class="description">${referredRewardLabel}</p>
      </div>

      <div class="features">
        <h3>🚀 Что вы получите:</h3>
        <ul>
          <li><strong>80,000+ партнерских программ</strong> от крупнейших сетей мира</li>
          <li><strong>Умный поиск</strong> с каскадной фильтрацией по категориям, нишам и геолокации</li>
          <li><strong>Сравнение программ</strong> для выбора лучших условий</li>
          <li><strong>Аналитика</strong> популярных программ и трендов</li>
          <li><strong>Избранное</strong> с экспортом в CSV</li>
          <li><strong>Team collaboration</strong> для совместной работы</li>
        </ul>
      </div>

      <div style="text-align: center;">
        <a href="${signupUrl}" class="btn">
          🎁 Получить ${referredRewardLabel}
        </a>
      </div>

      <div class="referral-code">
        <div class="label">Ваш реферальный код</div>
        <div class="code">${referralCode}</div>
      </div>

      <div class="info-box">
        <p>
          <strong>💡 Как это работает:</strong><br/>
          1. Зарегистрируйтесь по ссылке выше<br/>
          2. Ваш реферальный код применится автоматически<br/>
          3. Получите ${referredRewardLabel} при оформлении подписки<br/>
          4. ${referrerName} получит ${referrerRewardLabel}
        </p>
      </div>

      <div style="margin-top: 30px; padding: 16px; background: #fef3c7; border-radius: 8px; border-left: 4px solid #f59e0b;">
        <p style="margin: 0; color: #92400e; font-size: 14px;">
          <strong>⏰ Ограниченное предложение!</strong><br/>
          Зарегистрируйтесь в течение 7 дней, чтобы воспользоваться специальной скидкой.
        </p>
      </div>

      <p style="margin-top: 24px; color: #6b7280; font-size: 14px;">
        Не знаете, что такое партнерский маркетинг? <a href="${appUrl}/learn" style="color: #3b82f6;">Узнайте больше</a>
      </p>
    </div>

    <div class="footer">
      <p>
        <strong>Affiliate Aggregator</strong><br/>
        Глобальный агрегатор партнерских программ
      </p>
      <p style="margin-top: 12px;">
        <a href="${appUrl}">Перейти на сайт</a> |
        <a href="${appUrl}/features">Возможности</a> |
        <a href="${appUrl}/pricing">Тарифы</a>
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
