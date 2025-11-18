/**
 * Welcome Tour Steps
 *
 * Guided tour for new users using Shepherd.js
 */

import type { StepOptions } from 'shepherd.js';

export const tourSteps: StepOptions[] = [
  // Step 1: Welcome
  {
    id: 'welcome',
    title: '👋 Добро пожаловать в Affiliate Aggregator!',
    text: `
      <p>Мы поможем вам найти лучшие партнерские программы из 80,000+ вариантов.</p>
      <p>Этот краткий тур покажет основные возможности платформы.</p>
      <p><strong>Займёт всего 2 минуты!</strong></p>
    `,
    buttons: [
      {
        text: 'Пропустить',
        action: function () {
          return this.complete();
        },
        secondary: true,
      },
      {
        text: 'Начать тур →',
        action: function () {
          return this.next();
        },
      },
    ],
  },

  // Step 2: Search & Filters
  {
    id: 'search',
    title: '🔍 Мощный поиск',
    text: `
      <p><strong>12 умных фильтров</strong> для точного поиска:</p>
      <ul style="margin-top: 8px; padding-left: 20px;">
        <li>Категория, сеть, страна</li>
        <li>Процент комиссии</li>
        <li>Частота выплат (Daily, Weekly, NET-30)</li>
        <li>Сложность входа (🟢🟡🔴)</li>
        <li>Только с отзывами</li>
      </ul>
      <p style="margin-top: 8px;">Посмотрите на боковую панель слева с фильтрами!</p>
    `,
    buttons: [
      {
        text: '← Назад',
        action: function () {
          return this.back();
        },
        secondary: true,
      },
      {
        text: 'Далее →',
        action: function () {
          return this.next();
        },
      },
    ],
  },

  // Step 3: Program Cards
  {
    id: 'cards',
    title: '📊 Детальные карточки программ',
    text: `
      <p>Каждая карточка программы показывает:</p>
      <ul style="margin-top: 8px; padding-left: 20px;">
        <li>🆕 NEW - новые программы (30 дней)</li>
        <li>⭐ Quality tier (Excellent/Good/Average)</li>
        <li>🟢🟡🔴 Difficulty level</li>
        <li>⚡💵 Payment frequency</li>
        <li>💰 Commission, 🍪 Cookie, 💵 Payout</li>
      </ul>
      <p style="margin-top: 8px;">Вся информация для принятия решения!</p>
    `,
    buttons: [
      {
        text: '← Назад',
        action: function () {
          return this.back();
        },
        secondary: true,
      },
      {
        text: 'Далее →',
        action: function () {
          return this.next();
        },
      },
    ],
  },

  // Step 4: Compare Feature
  {
    id: 'compare',
    title: '⚖️ Сравнение программ',
    text: `
      <p>Нажмите кнопку <strong>"Compare"</strong> на любой программе.</p>
      <p>Можно сравнить <strong>до 5 программ</strong> side-by-side:</p>
      <ul style="margin-top: 8px; padding-left: 20px;">
        <li>Комиссии и условия</li>
        <li>Cookie duration</li>
        <li>Payment terms</li>
        <li>Network reputation</li>
      </ul>
      <p style="margin-top: 8px;">Панель сравнения появится внизу экрана!</p>
    `,
    buttons: [
      {
        text: '← Назад',
        action: function () {
          return this.back();
        },
        secondary: true,
      },
      {
        text: 'Далее →',
        action: function () {
          return this.next();
        },
      },
    ],
  },

  // Step 5: Favorites
  {
    id: 'favorites',
    title: '❤️ Избранное',
    text: `
      <p>Сохраняйте понравившиеся программы:</p>
      <ul style="margin-top: 8px; padding-left: 20px;">
        <li>Кнопка ❤️ на каждой карточке</li>
        <li>Быстрый доступ через /favorites</li>
        <li>Экспорт в CSV (Pro tier)</li>
        <li>Отслеживание изменений</li>
      </ul>
      <p style="margin-top: 8px;"><strong>Free tier:</strong> до 5 избранных<br/>
      <strong>Pro tier:</strong> unlimited</p>
    `,
    buttons: [
      {
        text: '← Назад',
        action: function () {
          return this.back();
        },
        secondary: true,
      },
      {
        text: 'Далее →',
        action: function () {
          return this.next();
        },
      },
    ],
  },

  // Step 6: Saved Searches & Alerts
  {
    id: 'alerts',
    title: '📧 Email Alerts (Pro)',
    text: `
      <p>С Pro tier получайте email уведомления:</p>
      <ul style="margin-top: 8px; padding-left: 20px;">
        <li>🔍 Сохраните комбинацию фильтров</li>
        <li>📧 Получайте email о новых программах</li>
        <li>⚡ Daily, Weekly или Instant alerts</li>
        <li>📊 До 10 saved searches</li>
      </ul>
      <p style="margin-top: 12px; padding: 8px; background: #eff6ff; border-radius: 4px;">
        💡 <strong>Pro tip:</strong> Создайте saved search для каждой ниши!
      </p>
    `,
    buttons: [
      {
        text: '← Назад',
        action: function () {
          return this.back();
        },
        secondary: true,
      },
      {
        text: 'Далее →',
        action: function () {
          return this.next();
        },
      },
    ],
  },

  // Step 7: Upgrade & Final
  {
    id: 'upgrade',
    title: '🚀 Готовы к большему?',
    text: `
      <p><strong>Free tier отлично подходит для старта!</strong></p>
      <p>Но если нужно больше:</p>
      <ul style="margin-top: 8px; padding-left: 20px;">
        <li>📧 Email alerts (10 saved searches)</li>
        <li>❤️ Unlimited favorites</li>
        <li>⚖️ Unlimited comparisons</li>
        <li>📊 Advanced analytics</li>
        <li>💾 CSV export</li>
      </ul>
      <p style="margin-top: 12px;"><strong>Pro tier:</strong> всего $12/month</p>
      <p><a href="/billing/upgrade" style="color: #3b82f6; text-decoration: underline;">Посмотреть все планы →</a></p>
    `,
    buttons: [
      {
        text: '← Назад',
        action: function () {
          return this.back();
        },
        secondary: true,
      },
      {
        text: 'Завершить тур ✅',
        action: function () {
          return this.complete();
        },
      },
    ],
  },
];

// Tour default options
export const tourOptions = {
  defaultStepOptions: {
    cancelIcon: {
      enabled: true,
    },
    classes: 'shepherd-theme-custom',
    scrollTo: { behavior: 'smooth', block: 'center' } as ScrollIntoViewOptions,
  },
  useModalOverlay: true,
};
