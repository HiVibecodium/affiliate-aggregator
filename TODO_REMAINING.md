# ✅ TODO LIST - Что осталось сделать

**Обновлено:** 2025-11-16
**Приоритет:** По убыванию важности

---

## 🔥 КРИТИЧНО (Сегодня - 30 минут)

### UI Integration (готовый код, нужна интеграция):

- [ ] **SearchSuggestions в programs page** (15 мин)
  - Импорт компонента
  - Добавить state
  - Обернуть search input
  - File: `app/programs/page.tsx`
  - Guide: `QUICK_INTEGRATION_GUIDE.md` шаг 3

- [ ] **90 Days button в New Programs** (5 мин)
  - Добавить кнопку между 30 и All
  - File: `app/programs/new/page.tsx`
  - Guide: `NEW_PROGRAMS_COMPLETION.md` раздел 3

- [ ] **Navigation links** (10 мин)
  - Link на /programs/new в header
  - Link с главной страницы
  - Files: `app/layout.tsx`, `app/page.tsx`

**Total: 30 минут**

---

## 🔥 ОЧЕНЬ ВАЖНО (Завтра - 4-6 часов)

### Filters UI (код готов в guides):

- [ ] **Payment Method Filter** (1-2 часа)
  - 8 изменений в `app/programs/page.tsx`
  - Guide: `PAYMENT_FILTER_IMPLEMENTATION.md`
  - Impact: 🔥 Критичен для international users

- [ ] **Cookie Duration Filter** (1-2 часа)
  - State + UI slider
  - API update (minCookieDuration + maxCookieDuration)
  - Files: `app/programs/page.tsx`, `app/api/programs/route.ts`

- [ ] **Payment Threshold Filter** (1 час)
  - State + UI inputs (min/max)
  - API update
  - Files: `app/programs/page.tsx`, `app/api/programs/route.ts`

**Total: 3-5 часов**

---

## 🟡 ВАЖНО (Эта неделя - 10-14 часов)

### Retention & Growth:

- [ ] **Email Alerts Setup** (2 часа)
  - Configure Resend API key
  - Create email templates
  - Activate cron in vercel.json
  - Test delivery
  - Guide: `WHATS_NOT_DONE_DETAILED.md` раздел 9

- [ ] **SEO Optimization** (4 часа)
  - Submit sitemap (30 мин)
  - Add JSON-LD markup (1 час)
  - Generate OG images (2 часа)
  - Internal linking (30 мин)
  - Guide: `WHATS_NOT_DONE_DETAILED.md` раздел 10

- [ ] **Performance Optimization** (4-6 часов)
  - Activate Redis cache (1 час)
  - Database query optimization (2 часа)
  - Image optimization (1 час)
  - Code splitting (1-2 часа)
  - Guide: `WHATS_NOT_DONE_DETAILED.md` раздел 11

- [ ] **Mobile UX** (2-3 часа)
  - Bottom sheet filters (1 час)
  - Swipeable cards (1 час)
  - Touch-friendly buttons (30 мин)
  - Guide: `WHATS_NOT_DONE_DETAILED.md` раздел 12

**Total: 12-15 часов**

---

## 🟢 NICE-TO-HAVE (Следующий месяц - 26+ часов)

### UX Enhancements:

- [ ] **Rating Filter** (30 минут)
  - Min rating dropdown
  - Requires reviews join

- [ ] **Has Reviews Filter** (15 минут)
  - Simple checkbox
  - API join

- [ ] **Loading Skeletons** (1-2 часа)
  - ProgramCardSkeleton component
  - Progressive loading
  - Guide: раздел 13

- [ ] **Onboarding Tour** (2-3 часа)
  - Setup Shepherd.js tour
  - 5-7 steps
  - Guide: раздел 18

**Subtotal: 4-6 часов**

---

### Data & Analytics:

- [ ] **User Behavior Tracking** (1 час)
  - Track searches, filters, clicks
  - Vercel Analytics events

- [ ] **Error Monitoring Enhancement** (1 час)
  - Sentry breadcrumbs
  - Custom error boundaries

- [ ] **Performance Monitoring** (1-2 часа)
  - Web Vitals tracking
  - API latency monitoring

- [ ] **Advanced Analytics Dashboard** (6-8 часов)
  - Conversion funnels
  - User cohorts
  - Revenue charts

**Subtotal: 9-12 часов**

---

### Advanced Features:

- [ ] **Comparison Export** (3-4 часа)
  - PDF export (jsPDF)
  - CSV export
  - Share links

- [ ] **Dark Mode** (4-6 часов)
  - Theme context
  - Dark styles
  - Toggle button

- [ ] **Admin Enhancements** (4-6 часов)
  - Better user management
  - Revenue dashboard
  - System monitoring

- [ ] **Test Coverage** (6-10 часов)
  - API routes tests
  - Component tests
  - E2E tests
  - Target: 60% coverage

**Subtotal: 17-26 часов**

---

## 📊 SUMMARY BY PRIORITY

### 🔥 MUST DO (Critical):

**Time:** 4-6 часов
**Impact:** Launch готовность 85% → 90%
**Tasks:** 6

### 🟡 SHOULD DO (Important):

**Time:** 12-15 часов
**Impact:** Launch готовность 90% → 95%
**Tasks:** 4

### 🟢 NICE TO HAVE:

**Time:** 30-44 часа
**Impact:** Launch готовность 95% → 100%
**Tasks:** 11

---

## 🎯 RECOMMENDED EXECUTION ORDER

### Week 1: Critical Path (4-6 hours)

**Day 1:**

1. SearchSuggestions integration (15m)
2. 90 Days tab (5m)
3. Navigation links (10m)
4. Payment Filter UI (1-2h)
5. Cookie Filter UI (1-2h)
6. Threshold Filter UI (1h)

**Result:** 90% ready

---

### Week 2: Important Path (12-15 hours)

**Day 2-3:** 7. Email Alerts (2h) 8. SEO optimization (4h)

**Day 4-5:** 9. Performance tuning (4-6h) 10. Mobile UX (2-3h)

**Result:** 95% ready → Launch! 🚀

---

### Month 1: Polish (30-44 hours)

**Weeks 3-6:** 11. All Nice-to-Have features 12. Advanced features 13. Test coverage 14. Admin improvements

**Result:** 100% ready, market leader

---

## 💡 QUICK WINS (Do First!)

**Today (30 минут):**

- SearchSuggestions integration
- 90 Days tab
- Navigation links

**Impact:** Immediate UX improvement
**Effort:** Minimal
**ROI:** Maximum!

---

## 🔄 CONTINUOUS IMPROVEMENT

После launch, добавлять постепенно:

- User feedback → features
- Analytics → optimizations
- A/B testing → conversions
- Growth → scaling

---

## 📈 COMPLETION METRICS

**Current:** 85%

**After Critical (4-6h):** 90%

**After Important (16-22h):** 95%

**After Nice-to-Have (42-61h):** 100%

---

## 🎯 START HERE

**Right now (5 minutes):**

1. Read this file ✓
2. Open `QUICK_INTEGRATION_GUIDE.md`
3. Start with Step 3 (SearchSuggestions)
4. Takes 15 minutes
5. Huge UX upgrade!

**Then:** 6. Payment Filter (1-2h) 7. Other filters (2-3h) 8. Done for the day!

---

## ✅ CHECKLIST FORMAT

Copy this to track progress:

```
CRITICAL (30 min):
[ ] SearchSuggestions UI
[ ] 90 Days Tab
[ ] Navigation Links

FILTERS (4-6h):
[ ] Payment Method Filter
[ ] Cookie Duration Filter
[ ] Payment Threshold Filter

RETENTION (2h):
[ ] Email Alerts Setup

GROWTH (4h):
[ ] SEO Optimization

PERFORMANCE (4-6h):
[ ] Redis Cache
[ ] Query Optimization
[ ] Image Optimization

UX (2-3h):
[ ] Mobile UX
[ ] Loading States

NICE-TO-HAVE (30+ hours):
[ ] Onboarding Tour
[ ] Export Features
[ ] Dark Mode
[ ] Advanced Analytics
[ ] Test Coverage
[ ] Admin Improvements
```

---

**TOTAL REMAINING: 42-61 hours**

**CRITICAL: 4-6 hours** ← Focus here!

**Path to launch: CLEAR!** 🚀

---

**Last updated:** 2025-11-16
**Next update:** После integration (30 мин)
