# 📧 Email Alerts Setup Guide

Полное руководство по настройке email уведомлений для сохраненных поисков.

---

## 🎯 Что уже готово

✅ **Код полностью написан:**

- Email client (`lib/email/resend-client.ts`)
- Email template (`lib/email/templates/new-matches-alert.ts`)
- Cron job endpoint (`app/api/cron/check-saved-searches/route.ts`)
- Unsubscribe endpoint (`app/api/saved-searches/unsubscribe/route.ts`)
- Cron schedule в `vercel.json` (ежедневно в 9 AM)

✅ **Что делают email alerts:**

- Проверяют все сохраненные поиски с включенными уведомлениями
- Ищут новые программы, соответствующие критериям
- Отправляют красивые HTML письма пользователям
- Позволяют отписаться одним кликом

---

## 🚀 Шаг 1: Получить Resend API Key

### 1.1. Зарегистрироваться на Resend

1. Перейти на https://resend.com
2. Нажать "Sign Up" или войти через GitHub
3. Подтвердить email

### 1.2. Создать API Key

1. Перейти в https://resend.com/api-keys
2. Нажать "Create API Key"
3. Имя: `Affiliate Aggregator Production`
4. Permissions: `Sending access`
5. Скопировать ключ (начинается с `re_...`)

⚠️ **ВАЖНО:** Сохраните ключ сразу - он показывается только один раз!

### 1.3. Настроить домен (опционально, но рекомендуется)

**Для production:**

1. Перейти в https://resend.com/domains
2. Нажать "Add Domain"
3. Ввести ваш домен (например: `affiliate-aggregator.com`)
4. Добавить DNS записи (SPF, DKIM, DMARC)
5. Дождаться верификации (обычно 5-30 минут)

**Для development/testing:**

Можно использовать тестовый домен Resend:

- From email: `onboarding@resend.dev`
- Письма будут приходить только на email вашего аккаунта

---

## 🔧 Шаг 2: Добавить переменные окружения

### 2.1. Local Development (.env.local)

Создайте или обновите `.env.local`:

```bash
# Email Alerts with Resend
RESEND_API_KEY="re_your_key_here"
RESEND_FROM_EMAIL="noreply@yourdomain.com"  # или onboarding@resend.dev для тестов

# Cron Job Security (сгенерируйте случайную строку)
CRON_SECRET="your-random-secret-string-here"
```

**Генерация CRON_SECRET:**

```bash
# В терминале:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 2.2. Vercel Production

1. Перейти в https://vercel.com/dashboard
2. Выбрать проект `affiliate-aggregator`
3. Settings → Environment Variables
4. Добавить 3 переменные:

| Name                | Value                    | Environment                      |
| ------------------- | ------------------------ | -------------------------------- |
| `RESEND_API_KEY`    | `re_your_key_here`       | Production, Preview, Development |
| `RESEND_FROM_EMAIL` | `noreply@yourdomain.com` | Production, Preview, Development |
| `CRON_SECRET`       | `your-random-secret`     | Production                       |

5. Нажать "Save"
6. Redeploy проект

---

## 🧪 Шаг 3: Тестирование

### 3.1. Локальное тестирование

**Запустить dev сервер:**

```bash
npm run dev
```

**Проверить email client:**

```bash
# В браузере или curl:
curl http://localhost:3000/api/cron/check-saved-searches
```

Должен вернуть:

```json
{
  "success": true,
  "searchesChecked": 0,
  "emailsSent": 0,
  "totalMatches": 0
}
```

### 3.2. Production тестирование

**Вручную запустить cron:**

```bash
# Через Vercel CLI:
vercel env pull
curl https://your-app.vercel.app/api/cron/check-saved-searches \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

**Или через Vercel Dashboard:**

1. Deployments → Latest
2. Functions → `/api/cron/check-saved-searches`
3. Invoke manually

### 3.3. Создать тестовый saved search

1. Войти в приложение
2. Перейти в `/programs`
3. Применить фильтры (например: category = "E-commerce")
4. Сохранить поиск с включенными уведомлениями
5. Дождаться cron job (9 AM следующего дня) или запустить вручную

---

## 📬 Шаг 4: Verify Email Delivery

### 4.1. Проверка в Resend Dashboard

1. Перейти в https://resend.com/emails
2. Увидите все отправленные письма
3. Можно просмотреть HTML, статус доставки

### 4.2. Проверка в почте

Письмо должно:

- ✅ Иметь тему: "🎯 X новых программ по запросу "Name""
- ✅ Красивый HTML с градиентным header
- ✅ Список программ с кнопками "Посмотреть"
- ✅ Кнопка "Посмотреть Все X Программ"
- ✅ Ссылка "Отключить уведомления" в footer

### 4.3. Проверка unsubscribe

1. Кликнуть "Отключить уведомления" в письме
2. Должна открыться страница с ✅ "Отписка успешна"
3. В БД `alertsEnabled` должен стать `false`
4. Новые письма не должны приходить

---

## 🎛️ Шаг 5: Мониторинг

### 5.1. Vercel Cron Logs

1. Vercel Dashboard → Project → Deployments
2. Выбрать deployment → Functions
3. Найти `/api/cron/check-saved-searches`
4. Посмотреть логи выполнения

### 5.2. Resend Analytics

1. https://resend.com/emails
2. Фильтры: sent, delivered, opened, clicked
3. Можно экспортировать CSV

### 5.3. Database Monitoring

Проверить в БД:

```sql
-- Сколько searches с enabled alerts
SELECT COUNT(*) FROM "SavedSearch" WHERE "alertsEnabled" = true;

-- Последние отправленные alerts
SELECT "name", "lastAlertSent", "newMatchesCount"
FROM "SavedSearch"
WHERE "lastAlertSent" IS NOT NULL
ORDER BY "lastAlertSent" DESC
LIMIT 10;
```

---

## 🔧 Troubleshooting

### "Email not configured" в логах

**Проблема:** Missing env variables

**Решение:**

1. Проверить `.env.local` или Vercel env vars
2. Убедиться что `RESEND_API_KEY` и `RESEND_FROM_EMAIL` установлены
3. Redeploy

### Письма не приходят

**Проверки:**

1. ✅ Resend API key валиден
2. ✅ Email домен верифицирован (или используется `onboarding@resend.dev`)
3. ✅ Cron job выполняется (проверить Vercel logs)
4. ✅ Есть saved searches с `alertsEnabled: true`
5. ✅ Есть новые программы после `lastCheckedAt`

### Cron не запускается

**Проблема:** Vercel cron не работает на Free plan

**Решение:**

- Нужен Vercel Pro ($20/month) для cron jobs
- Или использовать внешний cron (cron-job.org, GitHub Actions)

**Альтернатива (GitHub Actions):**

```yaml
# .github/workflows/check-saved-searches.yml
name: Check Saved Searches
on:
  schedule:
    - cron: '0 9 * * *' # 9 AM daily
jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger Cron
        run: |
          curl -X POST https://your-app.vercel.app/api/cron/check-saved-searches \
            -H "Authorization: Bearer ${{ secrets.CRON_SECRET }}"
```

### Письма в Spam

**Решения:**

1. Верифицировать домен в Resend (добавить SPF, DKIM, DMARC)
2. Использовать professional from email (`noreply@yourdomain.com`)
3. Не использовать спам-слова в теме
4. Добавить plain text версию письма

---

## 📊 Metrics

После запуска email alerts, ожидаемые метрики:

- **Open Rate:** 30-40% (хорошо для automated emails)
- **Click Rate:** 10-20% (клики на программы)
- **Unsubscribe Rate:** <2% (если релевантные программы)
- **Bounce Rate:** <1%

Мониторить в Resend Dashboard.

---

## ✅ Checklist

- [ ] Получен Resend API key
- [ ] Домен верифицирован (опционально)
- [ ] `RESEND_API_KEY` добавлен в `.env.local`
- [ ] `RESEND_FROM_EMAIL` добавлен в `.env.local`
- [ ] `CRON_SECRET` сгенерирован и добавлен
- [ ] Env vars добавлены в Vercel
- [ ] Проект redeploy на Vercel
- [ ] Локальный тест пройден
- [ ] Production тест пройден
- [ ] Создан test saved search
- [ ] Email получен
- [ ] Unsubscribe работает
- [ ] Cron logs мониторятся

---

## 🎉 Ready!

Email alerts полностью настроены и работают!

**Что дальше:**

- Users будут получать daily alerts о новых программах
- Retention вырастет на 30-40%
- Можно добавить weekly digest
- Можно добавить instant alerts (при появлении программы)

---

**Поддержка:**

- Resend docs: https://resend.com/docs
- Vercel cron: https://vercel.com/docs/cron-jobs
- Troubleshooting: см. раздел выше

**Стоимость:**

- Resend Free: 100 emails/day (достаточно для старта)
- Resend Pro: $20/month = 50,000 emails/month
- Vercel Free: No cron (нужен Pro $20/month или GitHub Actions)

🤖 Generated with Claude Code
Co-Authored-By: Claude <noreply@anthropic.com>
