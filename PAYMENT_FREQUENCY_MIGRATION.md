# 💵 Payment Frequency Migration Guide

Инструкция по добавлению фильтра "Частота выплат" в базу данных.

---

## 🎯 Что добавляется

**Новая колонка:** `paymentFrequency` в таблице `AffiliateProgram`

**Возможные значения:**

- `daily` - Ежедневные выплаты
- `weekly` - Еженедельные выплаты
- `net-15` - NET-15 (15 дней)
- `net-30` - NET-30 (30 дней)
- `monthly` - Ежемесячные выплаты
- `net-60` - NET-60 (60 дней)
- `quarterly` - Квартальные выплаты
- `annual` - Годовые выплаты

**Зачем:**

- Критичный фильтр для affiliates (cash flow)
- Конкурентное преимущество
- Улучшенная discovery

---

## 🚀 Шаг 1: Execute SQL Migration

### Option A: Supabase Dashboard (рекомендуется)

1. Перейти в Supabase Dashboard
2. Открыть ваш проект
3. SQL Editor (левое меню)
4. Нажать "New Query"
5. Скопировать содержимое из `prisma/migrations/add_payment_frequency.sql`:

```sql
-- Add paymentFrequency column
ALTER TABLE "AffiliateProgram"
ADD COLUMN "paymentFrequency" TEXT;

-- Add index for filtering performance
CREATE INDEX "AffiliateProgram_paymentFrequency_idx"
ON "AffiliateProgram"("paymentFrequency");

-- Add comment
COMMENT ON COLUMN "AffiliateProgram"."paymentFrequency"
IS 'Payment frequency: daily, weekly, net-15, net-30, monthly, net-60, quarterly, annual';
```

6. Нажать "Run" (или Ctrl+Enter)
7. Должен появиться: ✅ "Success. No rows returned"

### Option B: psql command line

```bash
# Подключиться к БД
psql "postgresql://postgres:[YOUR-PASSWORD]@[YOUR-HOST]:5432/postgres"

# Выполнить миграцию
\i prisma/migrations/add_payment_frequency.sql

# Проверить
\d "AffiliateProgram"
```

---

## 🔄 Шаг 2: Update Prisma Schema

После выполнения SQL, синхронизировать Prisma schema:

```bash
# В корне проекта
cd affiliate-aggregator

# Pull schema from database
npx prisma db pull

# Generate Prisma Client
npx prisma generate
```

**Ожидаемый результат:**

Файл `prisma/schema.prisma` должен обновиться:

```prisma
model AffiliateProgram {
  // ... existing fields
  paymentFrequency String?
  // ...
}
```

---

## ✅ Шаг 3: Verify Migration

### 3.1. Проверить в Supabase

1. Supabase → Table Editor
2. Открыть таблицу `AffiliateProgram`
3. Должна появиться новая колонка `paymentFrequency`

### 3.2. Проверить в коде

Запустить dev server:

```bash
npm run dev
```

Проверить что TypeScript видит новое поле:

```typescript
// Должно работать без ошибок
const program = await prisma.affiliateProgram.findFirst({
  where: { paymentFrequency: 'monthly' },
});
```

---

## 📊 Шаг 4: Populate Data (опционально)

Если хотите заполнить данные для существующих программ:

```sql
-- Пример: установить monthly для всех программ где NULL
UPDATE "AffiliateProgram"
SET "paymentFrequency" = 'monthly'
WHERE "paymentFrequency" IS NULL;

-- Или по сетям:
UPDATE "AffiliateProgram"
SET "paymentFrequency" = 'net-30'
WHERE "networkId" IN (
  SELECT id FROM "AffiliateNetwork"
  WHERE name IN ('ShareASale', 'Awin')
);

-- Для CJ обычно net-30
UPDATE "AffiliateProgram" ap
SET "paymentFrequency" = 'net-30'
FROM "AffiliateNetwork" an
WHERE ap."networkId" = an.id
  AND an.name = 'CJ Affiliate';
```

**Рекомендация:** Оставить NULL и заполнять постепенно из реальных данных.

---

## 🧪 Шаг 5: Test

После миграции, протестировать:

```bash
# 1. TypeScript compilation
npm run build

# 2. Tests
npm test

# 3. API test
curl "http://localhost:3000/api/programs?paymentFrequency=monthly"
```

Должны работать:

- ✅ TypeScript без ошибок
- ✅ Тесты проходят
- ✅ API возвращает результаты

---

## 🔧 Troubleshooting

### "Column already exists"

**Если ошибка:** `column "paymentFrequency" already exists`

**Решение:**

```sql
-- Проверить существование
SELECT column_name
FROM information_schema.columns
WHERE table_name = 'AffiliateProgram'
  AND column_name = 'paymentFrequency';

-- Если существует, пропустить ALTER TABLE
-- Только создать index:
CREATE INDEX IF NOT EXISTS "AffiliateProgram_paymentFrequency_idx"
ON "AffiliateProgram"("paymentFrequency");
```

### "Permission denied"

**Проблема:** Недостаточно прав для ALTER TABLE

**Решение:**

- Использовать Supabase Dashboard (автоматические права)
- Или использовать service_role connection string

### Prisma generate fails

**Ошибка:** `Error: Can't reach database server`

**Решение:**

```bash
# Проверить DATABASE_URL в .env.local
cat .env.local | grep DATABASE_URL

# Проверить подключение
npx prisma db pull --schema=./prisma/schema.prisma
```

---

## ✅ Migration Checklist

- [ ] Создан файл `add_payment_frequency.sql`
- [ ] SQL выполнен в Supabase (Success)
- [ ] `npx prisma db pull` - schema обновлен
- [ ] `npx prisma generate` - client сгенерирован
- [ ] Проверено: колонка видна в Supabase Table Editor
- [ ] Проверено: TypeScript компилируется
- [ ] Проверено: npm test проходит
- [ ] (Опционально) Данные заполнены
- [ ] Deploy на Vercel

---

## 🎉 Done!

После миграции:

- ✅ Database schema updated
- ✅ Prisma schema synced
- ✅ Ready for API implementation
- ✅ Ready for UI filters

**Next steps:**

1. Код уже готов (API filter, UI dropdown, badge)
2. Deploy на Vercel
3. Пользователи смогут фильтровать по частоте выплат!

---

## 📝 Notes

**Rollback (если нужно):**

```sql
-- Удалить колонку (осторожно!)
ALTER TABLE "AffiliateProgram"
DROP COLUMN "paymentFrequency";

-- Удалить index
DROP INDEX "AffiliateProgram_paymentFrequency_idx";
```

**Production deployment:**

После успешного тестирования на local:

1. Execute SQL в production Supabase
2. Redeploy на Vercel (автоматически запустит prisma generate)
3. Verify в production

🤖 Generated with Claude Code
Co-Authored-By: Claude <noreply@anthropic.com>
