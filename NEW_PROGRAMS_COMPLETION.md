# ✅ NEW PROGRAMS PAGE - ЗАВЕРШЕНИЕ

## Статус: 90% ГОТОВО!

### ✅ Что уже сделано:

1. **Page Component** - ✅ ГОТОВО
   - `app/programs/new/page.tsx` существует
   - Имеет tabs для 7/30/all дней
   - Использует EnhancedProgramCard
   - Красивый дизайн

2. **Enhanced Program Cards** - ✅ ГОТОВО
   - Все badges работают
   - Cookie, payment info отображается

### ⚠️ Что нужно доделать:

#### 1. Добавить API поддержку для `since` параметра (5 минут)

**Файл:** `app/api/programs/route.ts`

**Строка 21, добавить:**

```typescript
const minRating = searchParams.get('minRating');
const since = searchParams.get('since'); // ← ADD THIS LINE
```

**Строка ~92, после minCookieDuration filter, добавить:**

```typescript
if (minCookieDuration) {
  where.cookieDuration = {
    gte: parseInt(minCookieDuration),
  };
}

// Date filter for "New Programs" page
if (since) {
  const daysAgo = parseInt(since);
  const sinceDate = new Date();
  sinceDate.setDate(sinceDate.getDate() - daysAgo);

  where.createdAt = {
    gte: sinceDate,
  };
}

// Note: Rating filter requires join with reviews...
```

#### 2. Обновить New Programs Page для использования API (5 минут)

**Файл:** `app/programs/new/page.tsx`

**Строка 42, заменить:**

```typescript
// СТАРЫЙ КОД:
const response = await fetch(`/api/programs?sortBy=createdAt&sortOrder=desc&limit=50`);
const data = await response.json();

// Filter by date on client side (or move to API)
const filtered = data.programs.filter((p: Program) => {
  const createdDate = new Date(p.createdAt);
  return timeFilter === 'all' || createdDate >= dateFilter;
});

setPrograms(filtered);

// НОВЫЙ КОД:
const sinceParam = timeFilter === 'all' ? '' : `&since=${timeFilter}`;
const response = await fetch(`/api/programs?sortBy=createdAt&sortOrder=desc&limit=50${sinceParam}`);
const data = await response.json();

setPrograms(data.programs || []);
```

**Также удалить строки 37-40** (расчет dateFilter, больше не нужен):

```typescript
// DELETE THESE LINES:
const daysAgo = timeFilter === 'all' ? 365 : parseInt(timeFilter);
const dateFilter = new Date();
dateFilter.setDate(dateFilter.getDate() - daysAgo);
```

#### 3. Добавить 90 days tab (1 минута)

**Файл:** `app/programs/new/page.tsx`

**Строка 27, изменить:**

```typescript
// СТАРЫЙ:
const [timeFilter, setTimeFilter] = useState<'7' | '30' | 'all'>('30');

// НОВЫЙ:
const [timeFilter, setTimeFilter] = useState<'7' | '30' | '90' | 'all'>('30');
```

**Строка 112-121, добавить кнопку перед "Все время":**

```typescript
            <button
              onClick={() => setTimeFilter('30')}
              className={...}
            >
              Последние 30 дней
            </button>
            <button
              onClick={() => setTimeFilter('90')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                timeFilter === '90'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Последние 90 дней
            </button>
            <button
              onClick={() => setTimeFilter('all')}
              ...
```

---

## Тестирование

### 1. Запустить dev server

```bash
cd affiliate-aggregator
npm run dev
```

### 2. Открыть страницу

http://localhost:3000/programs/new

### 3. Проверить:

- ✅ Tabs работают (7/30/90/all days)
- ✅ API запрос содержит `?since=7` когда выбрано "7 дней"
- ✅ Программы фильтруются по дате создания
- ✅ EnhancedProgramCard отображает все badges

### 4. Проверить API напрямую:

```bash
# Last 7 days
curl "http://localhost:3000/api/programs?sortBy=createdAt&sortOrder=desc&since=7&limit=5"

# Last 30 days
curl "http://localhost:3000/api/programs?since=30&limit=5"
```

---

## Добавить Navigation Link

### В главное меню (опционально)

**Файл:** `app/layout.tsx` или где у вас навигация

Добавить ссылку:

```tsx
<Link href="/programs/new" className="...">
  🆕 New Programs
</Link>
```

### В Programs Page

**Файл:** `app/programs/page.tsx`

Найти header (строка ~350-370), добавить кнопку:

```tsx
<div className="flex gap-4">
  <Link
    href="/programs/new"
    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
  >
    🆕 New Programs
  </Link>
  <Link href="/compare" ...>
    Compare
  </Link>
</div>
```

---

## После завершения

### Commit

```bash
git add app/programs/new/page.tsx app/api/programs/route.ts
git commit -m "feat: complete New Programs page with API filtering

- Add 'since' parameter to programs API for date filtering
- Support 7/30/90 days and all time periods
- Server-side filtering instead of client-side
- Beautiful UI with period tabs
- Call-to-action for email alerts

🤖 Generated with Claude Code
Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

## ИТОГО

**Осталось:** ~10-15 минут работы

**Что получим:**

- ✅ Полностью рабочая страница New Programs
- ✅ SEO benefit (новый контент)
- ✅ User engagement (легко найти новинки)
- ✅ Sharable URLs с period filter

**Следующий шаг:**
После этого можно добавить Payment Method Filter (1-2ч) или Cookie Duration Filter (1-2ч)

---

## Альтернатива - Quick Apply

Если хотите, я могу создать готовый diff-файл или полностью готовые файлы для замены.
Просто скажите "создай готовые файлы".
