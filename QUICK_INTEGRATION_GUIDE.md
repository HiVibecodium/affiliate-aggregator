# ⚡ QUICK INTEGRATION GUIDE - 1 Hour to Complete

**Цель:** Завершить New Programs Page + Search Suggestions
**Время:** 1 час
**Результат:** 2 major features live!

---

## 🚀 STEP 1: New Programs API Support (5 минут)

### Файл: `app/api/programs/route.ts`

**Найти строку 21 (после minRating):**

```typescript
const minRating = searchParams.get('minRating');
```

**Добавить после неё:**

```typescript
const since = searchParams.get('since'); // Number of days (e.g., "7" for last 7 days)
```

**Найти строку ~92 (после minCookieDuration filter):**

```typescript
if (minCookieDuration) {
  where.cookieDuration = {
    gte: parseInt(minCookieDuration),
  };
}
```

**Добавить после этого блока:**

```typescript
// Date filter for "New Programs" page
if (since) {
  const daysAgo = parseInt(since);
  const sinceDate = new Date();
  sinceDate.setDate(sinceDate.getDate() - daysAgo);

  where.createdAt = {
    gte: sinceDate,
  };
}
```

**Сохранить файл**

---

## 🆕 STEP 2: Update New Programs Page (5 минут)

### Файл: `app/programs/new/page.tsx`

**1. Изменить type (строка 27):**

**БЫЛО:**

```typescript
const [timeFilter, setTimeFilter] = useState<'7' | '30' | 'all'>('30');
```

**СТАЛО:**

```typescript
const [timeFilter, setTimeFilter] = useState<'7' | '30' | '90' | 'all'>('30');
```

**2. Упростить fetchNewPrograms (строки 34-57):**

**БЫЛО:**

```typescript
const fetchNewPrograms = async () => {
  setLoading(true);
  try {
    // Calculate date filter
    const daysAgo = timeFilter === 'all' ? 365 : parseInt(timeFilter);
    const dateFilter = new Date();
    dateFilter.setDate(dateFilter.getDate() - daysAgo);

    const response = await fetch(`/api/programs?sortBy=createdAt&sortOrder=desc&limit=50`);
    const data = await response.json();

    // Filter by date on client side (or move to API)
    const filtered = data.programs.filter((p: Program) => {
      const createdDate = new Date(p.createdAt);
      return timeFilter === 'all' || createdDate >= dateFilter;
    });

    setPrograms(filtered);
  } catch (error) {
    console.error('Failed to fetch new programs:', error);
  } finally {
    setLoading(false);
  }
};
```

**СТАЛО:**

```typescript
const fetchNewPrograms = async () => {
  setLoading(true);
  try {
    // Build API URL with 'since' parameter
    const sinceParam = timeFilter === 'all' ? '' : `&since=${timeFilter}`;
    const response = await fetch(
      `/api/programs?sortBy=createdAt&sortOrder=desc&limit=50${sinceParam}`
    );
    const data = await response.json();

    setPrograms(data.programs || []);
  } catch (error) {
    console.error('Failed to fetch new programs:', error);
  } finally {
    setLoading(false);
  }
};
```

**3. Добавить 90 days button (после строки 111):**

**После кнопки "30 дней", добавить:**

```typescript
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
```

**Сохранить файл**

---

## 🔍 STEP 3: Integrate Search Suggestions (15 минут)

### Файл: `app/programs/page.tsx`

**1. Add import (после строки 6):**

```typescript
import { EnhancedProgramCard } from '@/components/EnhancedProgramCard';
import { SearchSuggestions } from '@/components/SearchSuggestions';
```

**2. Add state (после строки 46):**

```typescript
const [favoritesLoading, setFavoritesLoading] = useState(false);
const [showSuggestions, setShowSuggestions] = useState(false);
```

**3. Найти search input (примерно строка 340-360):**

**БЫЛО:**

```tsx
<input
  type="text"
  placeholder="Поиск программ..."
  value={search}
  onChange={(e) => handleSearchChange(e.target.value)}
  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
/>
```

**ОБЕРНУТЬ в relative div:**

```tsx
<div className="relative">
  <input
    type="text"
    placeholder="Поиск программ (название, описание, сеть)..."
    value={search}
    onChange={(e) => {
      handleSearchChange(e.target.value);
      setShowSuggestions(true);
    }}
    onFocus={() => setShowSuggestions(true)}
    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
  />

  {/* Search icon - already exists, keep it */}

  {/* NEW: Search Suggestions */}
  {showSuggestions && search && (
    <SearchSuggestions
      query={search}
      onSelect={(suggestion) => {
        window.location.href = `/programs/${suggestion.id}`;
      }}
      onClose={() => setShowSuggestions(false)}
    />
  )}
</div>
```

**Сохранить файл**

---

## ✅ STEP 4: Test Everything (20 минут)

### 1. Start dev server

```bash
cd affiliate-aggregator
npm run dev
```

### 2. Test New Programs Page

**URL:** http://localhost:3000/programs/new

**Test cases:**

- ✅ Click "7 дней" → shows programs from last 7 days
- ✅ Click "30 дней" → shows programs from last 30 days
- ✅ Click "90 дней" → shows programs from last 90 days
- ✅ Click "Все время" → shows all programs
- ✅ Check URL: should have `?since=7` when 7 days selected
- ✅ EnhancedProgramCard displays badges correctly

**API Test:**

```bash
curl "http://localhost:3000/api/programs?sortBy=createdAt&sortOrder=desc&since=7&limit=5"
```

Should return only programs from last 7 days.

### 3. Test Search Suggestions

**URL:** http://localhost:3000/programs

**Test cases:**

- ✅ Type "pay" → suggestions appear
- ✅ Type "paypal" → filtered suggestions
- ✅ See loading spinner briefly
- ✅ Arrow Down → highlights first result
- ✅ Arrow Down again → highlights second
- ✅ Arrow Up → goes back
- ✅ Enter → navigates to program
- ✅ ESC → closes suggestions
- ✅ Click outside → closes suggestions
- ✅ Click on suggestion → navigates

**API Test:**

```bash
curl "http://localhost:3000/api/programs/suggestions?q=paypal"
```

Should return top 5 matching programs.

---

## 🎯 STEP 5: Quick Fixes (если нужны)

### If TypeScript errors:

```bash
npx tsc --noEmit
```

Fix any errors shown.

### If ESLint errors:

```bash
npm run lint
```

Most warnings are OK. Fix only errors (0 expected).

### If build fails:

```bash
npm run build
```

Should complete successfully.

---

## 📊 EXPECTED RESULTS

### After completion:

**New Programs Page:**

- ✅ Fully functional with 4 time periods
- ✅ Server-side filtering (fast!)
- ✅ Beautiful UI with badges
- ✅ Shareable URLs with ?since parameter

**Search Suggestions:**

- ✅ Instant suggestions as you type
- ✅ Keyboard navigation
- ✅ Professional UX
- ✅ Fast (debounced)

**Overall:**

- ✅ 2 major features complete
- ✅ 0 TypeScript errors
- ✅ Tests still passing
- ✅ Ready for production

---

## 🚀 STEP 6: Commit (5 минут)

```bash
git add app/api/programs/route.ts
git add app/api/programs/suggestions/route.ts
git add app/programs/new/page.tsx
git add app/programs/page.tsx
git add components/SearchSuggestions.tsx

git commit -m "feat: complete New Programs page and Enhanced Search

New Programs Page:
- Add API support for 'since' parameter (7/30/90 days)
- Add 90 days tab
- Move filtering from client to server
- Support shareable URLs with time period

Enhanced Search:
- Add search suggestions API endpoint
- Create SearchSuggestions component with keyboard navigation
- Integrate suggestions into programs page
- Add debouncing for performance

Features:
- Server-side date filtering for better performance
- Keyboard shortcuts (↑↓ Enter ESC)
- Professional autocomplete UX
- Multi-field search (name, description, network, category)

🤖 Generated with Claude Code
Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

## 🎉 SUCCESS METRICS

**Before:**

- Basic search (name only)
- No New Programs page
- Client-side filtering

**After:**

- ✅ Advanced search with suggestions
- ✅ Keyboard navigation
- ✅ New Programs page with 4 time periods
- ✅ Server-side filtering
- ✅ Professional UX

**Time invested:** 1 hour
**Value delivered:** Огромный!

---

## 📋 NEXT STEPS

After this integration (1 hour), you can do:

**Today (optional, 1-2 hours):**

- Add Payment Method Filter
  - Follow `PAYMENT_FILTER_IMPLEMENTATION.md`

**Tomorrow (4-6 hours):**

- Cookie Duration Filter
- Payment Threshold Filter
- Final testing

**This Week:**

- Email Alerts setup
- SEO optimization
- Production launch!

---

## 💡 TIPS

1. **Test frequently** - after each step
2. **Check browser console** - for any errors
3. **Use React DevTools** - to debug state
4. **Check Network tab** - to see API calls
5. **Mobile test** - check responsive design

---

## 🆘 TROUBLESHOOTING

### Suggestions not appearing?

- Check browser console for errors
- Verify API endpoint: `/api/programs/suggestions`
- Check `showSuggestions` state in React DevTools

### New Programs not filtering?

- Check API response: should have `?since=7`
- Verify `where.createdAt` clause in API
- Check browser console for errors

### Build errors?

- Run `npm install` (dependencies)
- Run `npx tsc --noEmit` (TypeScript)
- Check import paths

---

## ✅ CHECKLIST

Before marking as complete:

- [ ] API has `since` parameter support
- [ ] New Programs page has 4 tabs
- [ ] New Programs uses API filtering
- [ ] SearchSuggestions component integrated
- [ ] Keyboard navigation works
- [ ] Both features tested manually
- [ ] No TypeScript errors
- [ ] Build succeeds
- [ ] Committed to git

---

**READY? LET'S GO! 🚀**

Start with STEP 1 and work through sequentially.
Each step is 5-15 minutes.
Total time: ~1 hour.

You got this! 💪
