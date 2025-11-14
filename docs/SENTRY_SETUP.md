# Sentry Error Tracking - Инструкция по настройке

## 📊 Обзор

Sentry интегрирован в проект для автоматического отслеживания ошибок, мониторинга производительности и сбора аналитики.

## 🚀 Быстрый старт

### Шаг 1: Создать проект в Sentry

1. Перейдите на [sentry.io](https://sentry.io/)
2. Создайте аккаунт (бесплатно до 5k ошибок/месяц)
3. Создайте новый проект → выберите **Next.js**
4. Скопируйте **DSN** (будет выглядеть как `https://xxx@xxx.ingest.sentry.io/xxx`)

### Шаг 2: Добавить переменные окружения

#### Локальная разработка (`.env.local`):

```env
# Sentry Error Tracking
NEXT_PUBLIC_SENTRY_DSN="https://your-dsn@o123456.ingest.sentry.io/123456"
SENTRY_DSN="https://your-dsn@o123456.ingest.sentry.io/123456"
SENTRY_ORG="your-org-slug"
SENTRY_PROJECT="your-project-slug"
SENTRY_AUTH_TOKEN="your-auth-token"
```

**Где взять:**
- **DSN**: Settings → Projects → [Your Project] → Client Keys (DSN)
- **ORG**: URL вашей организации (например, `my-company`)
- **PROJECT**: Имя проекта (например, `affiliate-aggregator`)
- **AUTH_TOKEN**: Settings → Account → API → Auth Tokens → Create New Token
  - Scopes: `project:read`, `project:releases`, `org:read`

#### Production (Vercel):

```bash
# Добавить в Vercel через CLI
vercel env add NEXT_PUBLIC_SENTRY_DSN
vercel env add SENTRY_DSN
vercel env add SENTRY_ORG
vercel env add SENTRY_PROJECT
vercel env add SENTRY_AUTH_TOKEN
```

Или через Vercel Dashboard:
1. Project Settings → Environment Variables
2. Добавить каждую переменную
3. Выбрать environments: Production, Preview, Development

### Шаг 3: Проверить работу

После деплоя:

```bash
# Проверить что Sentry загрузился
curl https://your-app.vercel.app/_next/static/chunks/sentry-*.js

# Или откройте DevTools → Network → найдите запросы к sentry.io
```

## 📁 Файлы конфигурации

### 1. `sentry.client.config.ts`
- Конфигурация для клиентской части (браузер)
- Session Replay включен
- Performance monitoring
- Фильтрация известных ошибок

### 2. `sentry.server.config.ts`
- Конфигурация для серверной части (Node.js)
- API routes и Server Components
- Performance monitoring

### 3. `sentry.edge.config.ts`
- Конфигурация для Edge Runtime
- Middleware и Edge Functions
- Меньший sampling rate (5%)

### 4. `instrumentation.ts`
- Автоматическая инициализация Sentry
- Загружает правильную конфигурацию для каждого runtime

### 5. `app/error.tsx` & `app/global-error.tsx`
- Error boundaries с автоматической отправкой в Sentry
- Пользовательский UI для ошибок
- Error ID для отслеживания

## 🎯 Что отслеживается

### Автоматически:
- ✅ Uncaught exceptions (необработанные исключения)
- ✅ Unhandled promise rejections
- ✅ API errors (500, 404, etc.)
- ✅ React component errors (через error boundaries)
- ✅ Server-side errors
- ✅ Edge runtime errors
- ✅ Performance metrics (sample 10%)
- ✅ Session replays (sample 10%, 100% на ошибках)

### Вручную (опционально):

```typescript
import * as Sentry from '@sentry/nextjs';

// Простая ошибка
Sentry.captureException(new Error('Something went wrong'));

// С контекстом
Sentry.captureException(error, {
  tags: {
    section: 'dashboard',
    action: 'fetch-analytics',
  },
  extra: {
    userId: user.id,
    requestId: req.id,
  },
});

// Сообщение
Sentry.captureMessage('Important event happened', 'warning');

// Добавить контекст пользователя
Sentry.setUser({
  id: user.id,
  email: user.email,
  username: user.name,
});
```

## ⚙️ Настройки

### Performance Monitoring

**Sample Rates:**
- Production: 10% запросов
- Development: 100% запросов
- Edge: 5% запросов

Изменить в `sentry.*.config.ts`:
```typescript
tracesSampleRate: 0.1, // 10%
```

### Session Replay

**Sample Rates:**
- Обычные сессии: 10%
- Сессии с ошибками: 100%

Конфиденциальность:
- ✅ Весь текст замаскирован (`maskAllText: true`)
- ✅ Медиа заблокированы (`blockAllMedia: true`)

### Error Filtering

Игнорируемые ошибки (настроено в конфигах):
- Browser extension errors
- ResizeObserver loop exceeded
- Network errors от ad blockers
- Supabase timeout (у них свой мониторинг)

## 🧪 Тестирование

### 1. Локальное тестирование

Sentry **отключен** в development по умолчанию (фильтр в `beforeSend`).

Для тестирования в dev, временно закомментируйте:
```typescript
// if (process.env.NODE_ENV === 'development') {
//   return null;
// }
```

### 2. Тестовая ошибка

Создайте тестовую страницу:
```typescript
// app/test-sentry/page.tsx
export default function TestSentry() {
  return (
    <button onClick={() => {
      throw new Error('Test Sentry Error');
    }}>
      Throw Test Error
    </button>
  );
}
```

### 3. Проверка в Sentry Dashboard

1. Откройте https://sentry.io/
2. Выберите ваш проект
3. Должны увидеть ошибку с:
   - Stack trace
   - URL где произошла
   - Browser info
   - User context (если настроен)

## 📊 Мониторинг в Production

### Dashboard Sentry

Основные метрики:
- **Issues** - все ошибки
- **Performance** - медленные транзакции
- **Replays** - записи сессий с ошибками
- **Releases** - ошибки по версиям

### Alerts

Настройте уведомления:
1. Alerts → Create Alert
2. Выберите условия (например, >10 ошибок за 5 минут)
3. Добавьте email/Slack/Discord webhook

### Releases

Каждый деплой будет создавать release в Sentry благодаря:
```typescript
release: process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA
```

## 🔧 Troubleshooting

### Ошибка: "Sentry не инициализирован"

**Решение:**
1. Проверьте `.env.local` - есть ли `NEXT_PUBLIC_SENTRY_DSN`
2. Перезапустите `npm run dev`
3. Проверьте console - должно быть сообщение от Sentry

### Source maps не загружаются

**Решение:**
1. Проверьте `SENTRY_AUTH_TOKEN` - должен иметь scope `project:releases`
2. Проверьте `SENTRY_ORG` и `SENTRY_PROJECT` - правильные названия
3. В next.config.js должно быть `hideSourceMaps: true`

### Слишком много ошибок

**Решение:**
1. Уменьшите sample rate:
   ```typescript
   tracesSampleRate: 0.05, // 5% вместо 10%
   ```
2. Добавьте больше фильтров в `ignoreErrors`
3. Улучшите `beforeSend` для фильтрации

### Нет Session Replays

**Решение:**
1. Проверьте что `replaysSessionSampleRate` > 0
2. Session Replay работает только в браузере (не в API routes)
3. Бесплатный план может иметь лимиты

## 💡 Best Practices

1. **Не логируйте чувствительные данные**
   ```typescript
   Sentry.setUser({
     id: user.id,
     // НЕ включайте passwords, tokens, API keys!
   });
   ```

2. **Используйте breadcrumbs**
   ```typescript
   Sentry.addBreadcrumb({
     message: 'User clicked button',
     level: 'info',
     data: { buttonId: 'submit' },
   });
   ```

3. **Группируйте похожие ошибки**
   ```typescript
   Sentry.captureException(error, {
     fingerprint: ['database', 'connection', 'timeout'],
   });
   ```

4. **Добавляйте контекст**
   ```typescript
   Sentry.setContext('api', {
     endpoint: '/api/programs',
     method: 'GET',
     responseTime: 1234,
   });
   ```

## 📈 Метрики и KPI

Следите за:
- **Error Rate** - процент запросов с ошибками (цель: <0.1%)
- **MTTR** - среднее время исправления (Mean Time To Resolve)
- **Apdex Score** - производительность (цель: >0.9)
- **Issue Frequency** - количество уникальных ошибок

## 🔗 Полезные ссылки

- [Sentry Next.js Docs](https://docs.sentry.io/platforms/javascript/guides/nextjs/)
- [Error Boundaries](https://nextjs.org/docs/app/building-your-application/routing/error-handling)
- [Session Replay](https://docs.sentry.io/platforms/javascript/session-replay/)
- [Performance Monitoring](https://docs.sentry.io/platforms/javascript/guides/nextjs/performance/)

---

**Создано:** 2025-11-14
**Версия:** 1.0
**Sentry SDK:** @sentry/nextjs
