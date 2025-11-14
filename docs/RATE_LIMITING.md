# Rate Limiting - Документация

## 📊 Обзор

Rate limiting защищает API endpoints от злоупотреблений, DDoS атак и перегрузки.

## 🚀 Реализация

### In-Memory Rate Limiter

**Файл:** `lib/rate-limit.ts`

**Особенности:**
- ✅ In-memory хранилище (работает для одного instance)
- ✅ Автоматическая очистка старых записей каждые 5 минут
- ✅ Идентификация по IP адресу
- ✅ Гибкая конфигурация лимитов
- ✅ Rate limit headers в ответах

**Для Production с несколькими instances:**
Рекомендуется использовать Redis или Upstash для распределенного rate limiting.

## 📋 Предустановленные конфигурации

### RateLimitPresets

| Preset | Лимит | Интервал | Применение |
|--------|-------|----------|------------|
| **strict** | 5 req | 1 мин | Auth, sensitive endpoints |
| **standard** | 30 req | 1 мин | Normal API endpoints |
| **relaxed** | 100 req | 1 мин | Public read endpoints |
| **generous** | 300 req | 1 мин | Bulk operations |

## 🛠️ Использование

### Базовое использование

```typescript
import { withRateLimit, RateLimitPresets } from '@/lib/rate-limit';

async function myHandler(request: NextRequest) {
  // Your logic here
  return NextResponse.json({ data: 'success' });
}

// Apply rate limiting
export const GET = withRateLimit(myHandler, RateLimitPresets.standard);
```

### Кастомная конфигурация

```typescript
export const POST = withRateLimit(handler, {
  interval: 60000,              // 1 minute
  uniqueTokenPerInterval: 50    // 50 requests per minute
});
```

### Множественные методы

```typescript
// Different limits for different methods
export const GET = withRateLimit(getHandler, RateLimitPresets.relaxed);
export const POST = withRateLimit(postHandler, RateLimitPresets.strict);
export const DELETE = withRateLimit(deleteHandler, RateLimitPresets.standard);
```

## 📍 Применено на endpoints:

### Strict (5 req/min)
- ✅ `POST /api/auth/sync` - Авторизация
- ✅ `POST /api/import/bulk` - Bulk импорт

### Standard (30 req/min)
- ✅ `GET /api/favorites` - Получение избранного
- ✅ `POST /api/favorites` - Добавление в избранное
- ✅ `DELETE /api/favorites` - Удаление из избранного

### Relaxed (100 req/min)
- ✅ `GET /api/import/bulk` - Статистика импорта

## 📨 Rate Limit Headers

При каждом запросе возвращаются headers:

```
X-RateLimit-Limit: 30          # Максимум запросов
X-RateLimit-Remaining: 25       # Осталось запросов
X-RateLimit-Reset: 2025-11-14T... # Время сброса счетчика
```

### При превышении лимита (429):

```json
{
  "error": "Rate limit exceeded",
  "message": "Too many requests. Please try again later.",
  "retryAfter": 45
}
```

Headers:
```
Status: 429 Too Many Requests
Retry-After: 45                 # Секунд до сброса
X-RateLimit-Limit: 30
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 2025-11-14T...
```

## 🧪 Тестирование

### Локальное тестирование

```bash
# Сделать несколько запросов быстро
for i in {1..10}; do
  curl http://localhost:3000/api/favorites
  echo ""
done

# Проверить headers
curl -I http://localhost:3000/api/favorites
```

### Production тестирование

```bash
# Test rate limit
for i in {1..35}; do
  curl -s https://your-app.vercel.app/api/programs | jq '.error'
done
```

## ⚙️ Настройка лимитов

### Изменить preset

В `lib/rate-limit.ts`:

```typescript
export const RateLimitPresets = {
  strict: { interval: 60000, uniqueTokenPerInterval: 10 }, // Увеличено с 5 до 10
  // ...
};
```

### Добавить новый preset

```typescript
export const RateLimitPresets = {
  // ... existing presets

  custom: { interval: 30000, uniqueTokenPerInterval: 20 }, // 20 req/30sec
};
```

### Использовать user ID вместо IP

В `lib/rate-limit.ts` в функции `getIdentifier`:

```typescript
export function getIdentifier(request: NextRequest): string {
  // Get user ID from header or session
  const userId = request.headers.get('x-user-id');

  if (userId) {
    return `user:${userId}`;
  }

  // Fallback to IP
  const ip = getIpAddress(request);
  return `ip:${ip}`;
}
```

## 🔄 Миграция на Redis (Production)

Для production с множественными instances:

### 1. Установить Upstash Redis

```bash
npm install @upstash/redis
```

### 2. Создать `lib/rate-limit-redis.ts`

```typescript
import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();

export async function checkRateLimitRedis(
  identifier: string,
  config: RateLimitConfig
) {
  const key = `rate-limit:${identifier}`;
  const now = Date.now();

  // Use Redis with sliding window
  const count = await redis.incr(key);

  if (count === 1) {
    await redis.expire(key, Math.ceil(config.interval / 1000));
  }

  return {
    allowed: count <= config.uniqueTokenPerInterval,
    remaining: Math.max(0, config.uniqueTokenPerInterval - count),
    resetTime: now + config.interval,
  };
}
```

### 3. Обновить переменные окружения

```env
UPSTASH_REDIS_REST_URL="https://..."
UPSTASH_REDIS_REST_TOKEN="..."
```

## 📊 Мониторинг

### Метрики для отслеживания:

1. **Rate Limit Hit Rate** - сколько запросов заблокировано
2. **Top Limited IPs** - кто чаще всего блокируется
3. **Endpoint Usage** - какие endpoints самые популярные
4. **Time to Reset** - среднее время до сброса лимита

### С Sentry

```typescript
import * as Sentry from '@sentry/nextjs';

if (!rateLimit.allowed) {
  Sentry.captureMessage('Rate limit exceeded', {
    level: 'warning',
    tags: {
      endpoint: request.url,
      ip: identifier,
    },
  });
}
```

## 🔒 Безопасность

### Защита от обхода

**IP Spoofing:**
```typescript
// Проверяем несколько headers
function getIpAddress(request: NextRequest): string {
  // Vercel предоставляет надежный x-forwarded-for
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const cfIp = request.headers.get('cf-connecting-ip');

  return cfIp || forwarded?.split(',')[0] || realIp || 'unknown';
}
```

**VPN/Proxy Users:**
- Используйте user ID для аутентифицированных пользователей
- Stricter limits для unauthenticated

## ⚡ Performance

### In-Memory Characteristics

**Pros:**
- ✅ Очень быстро (< 1ms overhead)
- ✅ Нет внешних зависимостей
- ✅ Простая реализация

**Cons:**
- ❌ Не работает с multiple instances
- ❌ Теряется при restart
- ❌ Ограничено памятью

### Redis/Upstash Characteristics

**Pros:**
- ✅ Работает с любым количеством instances
- ✅ Персистентность
- ✅ Масштабируемость

**Cons:**
- ❌ Дополнительная латентность (~10-50ms)
- ❌ Требует внешний сервис
- ❌ Дополнительные расходы

## 🎯 Best Practices

1. **Разные лимиты для разных endpoints**
   - Stricter для write operations
   - Relaxed для read operations

2. **Учитывайте authenticated users**
   - Более мягкие лимиты для logged in users
   - Stricter для anonymous

3. **Добавляйте retry logic на клиенте**
   ```typescript
   if (response.status === 429) {
     const retryAfter = response.headers.get('Retry-After');
     await sleep(retryAfter * 1000);
     // Retry request
   }
   ```

4. **Мониторинг**
   - Логируйте rate limit hits
   - Анализируйте паттерны
   - Adjustайте лимиты по необходимости

5. **Graceful degradation**
   - Показывайте понятное сообщение пользователю
   - Предлагайте подождать
   - Не блокируйте навсегда

## 🔗 Ссылки

- [OWASP Rate Limiting](https://cheatsheetseries.owasp.org/cheatsheets/REST_Security_Cheat_Sheet.html#rate-limiting)
- [Vercel Rate Limiting](https://vercel.com/docs/edge-network/rate-limiting)
- [Upstash Redis](https://upstash.com/)

---

**Создано:** 2025-11-14
**Версия:** 1.0
**Тип:** In-Memory (single instance)
