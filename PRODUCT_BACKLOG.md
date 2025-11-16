# 📋 PRODUCT BACKLOG - Affiliate Aggregator

**Дата:** 2025-11-16
**Текущая готовность:** 95%
**Цель:** 100% market-ready product

---

## 🔥 SPRINT 1: CRITICAL & QUICK WINS (15-20 часов)

**Цель:** Довести до 98%, готовность к launch
**Timeline:** Week 1 (5 дней)
**Приоритет:** HIGHEST

---

### Epic 1.1: Email Alerts (2-3 часа) 🔥🔥🔥

**User Story:**

> Как пользователь, я хочу получать email уведомления о новых программах, соответствующих моим сохраненным поискам

**Tasks:**

- [ ] **ALERT-001:** Configure Resend API key (30 мин)
  - Get API key from resend.com
  - Add to .env.local и Vercel env
  - Test connection

- [ ] **ALERT-002:** Create email templates (1 час)
  - New programs alert template
  - HTML + text versions
  - Unsubscribe link

- [ ] **ALERT-003:** Activate cron job (15 мин)
  - Update vercel.json
  - Add cron schedule (daily 9 AM)
  - Deploy

- [ ] **ALERT-004:** Test email delivery (30 мин)
  - Create test saved search
  - Trigger cron manually
  - Verify email received

- [ ] **ALERT-005:** Unsubscribe flow (1 час)
  - Unsubscribe page
  - Update preferences
  - Confirmation

**Acceptance Criteria:**

- Email alerts отправляются ежедневно
- Users получают уведомления о новых программах
- Можно отписаться
- Все в Pro tier

**Value:** ОГРОМНЫЙ (retention!)
**Effort:** 2-3 часа
**Priority:** P0 - CRITICAL

---

### Epic 1.2: Quick Wins (2.5 часа) 🔥

**User Story:**

> Как пользователь, я хочу легко находить и использовать все функции

**Tasks:**

- [ ] **QW-001:** Add 90 days tab (5 мин)
  - app/programs/new/page.tsx
  - Insert button
  - Test

- [ ] **QW-002:** Integrate SearchSuggestions (15 мин)
  - app/programs/page.tsx
  - Add component
  - Wire up state

- [ ] **QW-003:** Add Team link to Settings (10 мин)
  - app/settings/page.tsx
  - Card with link to /settings/team

- [ ] **QW-004:** Add New Programs nav link (10 мин)
  - Header navigation
  - Link to /programs/new

- [ ] **QW-005:** Add nav links в header (10 мин)
  - Programs dropdown
  - Team в user menu

- [ ] **QW-006:** Submit sitemap to Google (30 мин)
  - Google Search Console
  - Bing Webmaster
  - Yandex

- [ ] **QW-007:** Difficulty filter (30 мин)
  - Use existing calculation
  - Add UI checkboxes
  - Wire to API

- [ ] **QW-008:** "Has Reviews" filter (15 мин)
  - Simple checkbox
  - API join query

**Acceptance Criteria:**

- Все quick wins работают
- Navigation улучшена
- Фильтров стало 11

**Value:** HIGH (visibility + UX)
**Effort:** 2.5 часа
**Priority:** P0 - CRITICAL

---

### Epic 1.3: Payment Frequency (2 часа) 🔥🔥

**User Story:**

> Как affiliate, я хочу фильтровать программы по частоте выплат (daily, weekly, monthly)

**Tasks:**

- [ ] **FREQ-001:** SQL migration (10 мин)
  - Execute ALTER TABLE в Supabase
  - Add column paymentFrequency
  - Add indexes

- [ ] **FREQ-002:** Pull schema (5 мин)
  - npx prisma db pull
  - npx prisma generate

- [ ] **FREQ-003:** Add API filter (15 мин)
  - app/api/programs/route.ts
  - Handle paymentFrequency param

- [ ] **FREQ-004:** Add UI dropdown (45 мин)
  - app/programs/page.tsx
  - State + URL + UI
  - 5 options: Daily, Weekly, NET-15, NET-30, Monthly

- [ ] **FREQ-005:** Add badge to cards (15 мин)
  - components/EnhancedProgramCard.tsx
  - Show "💵 Daily Payouts" badge

- [ ] **FREQ-006:** Test (30 мин)
  - All filter combinations
  - URL params
  - Reset works

**Acceptance Criteria:**

- Можно фильтровать по частоте выплат
- Badge показывается на карточках
- URL state работает

**Value:** HIGH (конкурентное преимущество!)
**Effort:** 2 часа
**Priority:** P0 - CRITICAL

---

### Epic 1.4: Welcome Tour (2-3 часа) 🔥

**User Story:**

> Как новый пользователь, я хочу быстро понять возможности платформы

**Tasks:**

- [ ] **TOUR-001:** Setup Shepherd.js (30 мин)
  - Import library
  - Create tour instance
  - Configure defaults

- [ ] **TOUR-002:** Create tour steps (1-1.5 часа)
  - Step 1: Welcome
  - Step 2: Search demo
  - Step 3: Filters demo
  - Step 4: Compare feature
  - Step 5: Reviews
  - Step 6: Favorites
  - Step 7: Done!

- [ ] **TOUR-003:** Tour trigger (30 мин)
  - First visit detection
  - "Take Tour" button
  - Skip option

- [ ] **TOUR-004:** Tour completion tracking (30 мин)
  - Mark as completed
  - Don't show again
  - Reset option in settings

**Acceptance Criteria:**

- Tour показывается новым users
- 7 информативных шагов
- Можно skip
- Не показывается повторно

**Value:** HIGH (onboarding!)
**Effort:** 2-3 часа
**Priority:** P0 - CRITICAL

---

### Epic 1.5: Performance (1 час) 🔥

**User Story:**

> Как пользователь, я хочу быстрый отклик платформы

**Tasks:**

- [ ] **PERF-001:** Activate Redis cache (1 час)
  - Add UPSTASH_REDIS_URL to env
  - Wrap /api/programs with cache
  - 5 min TTL
  - Test cache hit/miss

**Acceptance Criteria:**

- Cache работает
- Response time < 200ms for cached
- Hit rate > 50%

**Value:** HIGH (scale!)
**Effort:** 1 час
**Priority:** P1 - HIGH

---

## 🎯 SPRINT 2: TEAM FEATURES (10-14 часов)

**Цель:** Complete team functionality
**Timeline:** Week 2
**Приоритет:** HIGH

---

### Epic 2.1: Invite System (4-6 часов) 🔥

**User Story:**

> Как owner, я хочу приглашать членов команды по email

**Tasks:**

- [ ] **INV-001:** Create InviteToken model (30 мин)
  - Schema model
  - Migration
  - Generate

- [ ] **INV-002:** Update invite API (1 час)
  - Generate secure tokens
  - Store в DB
  - Send email (Resend)

- [ ] **INV-003:** Create acceptance page (2-3 часа)
  - app/invite/[token]/page.tsx
  - Verify token
  - Accept/Decline buttons
  - Handle acceptance

- [ ] **INV-004:** Email template (30 мин)
  - Invite email HTML
  - Organization info
  - Accept link

- [ ] **INV-005:** Test flow (1 час)
  - Create invite
  - Receive email
  - Accept
  - Verify membership

**Acceptance Criteria:**

- Full invite flow работает
- Emails отправляются
- Acceptance страница работает
- Member добавляется в org

**Value:** CRITICAL для teams
**Effort:** 4-6 часов
**Priority:** P0 - CRITICAL

---

### Epic 2.2: Team UI Polish (3-4 часа)

**User Story:**

> Как team user, я хочу удобный интерфейс управления

**Tasks:**

- [ ] **TEAM-001:** Add links everywhere (30 мин)
  - Settings card
  - Header nav
  - User menu

- [ ] **TEAM-002:** Seat usage warnings (1 час)
  - Visual indicators
  - Upgrade prompts
  - Tier comparison

- [ ] **TEAM-003:** Loading/empty states (1 час)
  - Skeleton screens
  - Empty state messages
  - Error handling

- [ ] **TEAM-004:** Mobile responsive (1-1.5 часа)
  - Test on mobile
  - Fix layouts
  - Touch targets

**Acceptance Criteria:**

- Team features легко найти
- Professional UI
- Mobile friendly

**Value:** HIGH
**Effort:** 3-4 часа
**Priority:** P1 - HIGH

---

### Epic 2.3: Organization Settings (2-3 часа)

**User Story:**

> Как owner, я хочу управлять настройками организации

**Tasks:**

- [ ] **ORG-001:** Create settings page (2 часа)
  - app/settings/organization/page.tsx
  - Edit name, slug
  - Description, logo
  - Website URL

- [ ] **ORG-002:** Danger zone (1 час)
  - Delete organization
  - Transfer ownership
  - Confirmation modals

**Acceptance Criteria:**

- Можно редактировать org
- Delete работает с защитой
- Settings сохраняются

**Value:** MEDIUM
**Effort:** 2-3 часа
**Priority:** P2 - MEDIUM

---

## 📈 SPRINT 3: SEO & PERFORMANCE (10-15 часов)

**Цель:** Optimize для scale и traffic
**Timeline:** Week 3
**Приоритет:** HIGH

---

### Epic 3.1: SEO Optimization (6-10 часов) 🔥

**Tasks:**

- [ ] **SEO-001:** Submit sitemaps (30 мин)
  - Google Search Console
  - Bing Webmaster
  - Yandex Webmaster

- [ ] **SEO-002:** JSON-LD markup (2-3 часа)
  - All program pages
  - Category pages
  - Network pages
  - Organization schema

- [ ] **SEO-003:** OG images (2-3 часа)
  - Generate with @vercel/og
  - Dynamic per program
  - Category images

- [ ] **SEO-004:** Internal linking (2 часа)
  - Related programs
  - Category links
  - Network links
  - Breadcrumbs

- [ ] **SEO-005:** Meta optimization (1 час)
  - All pages meta tags
  - Descriptions
  - Keywords

**Value:** КРИТИЧЕСКИЙ для organic traffic
**Effort:** 6-10 часов
**Priority:** P0 - CRITICAL

---

### Epic 3.2: Performance Tuning (4-6 часов)

**Tasks:**

- [ ] **PERF-002:** Database optimization (2 часа)
  - Review slow queries
  - Add missing indexes
  - Optimize N+1

- [ ] **PERF-003:** Image optimization (1 час)
  - Convert to next/image
  - WebP format
  - Lazy loading

- [ ] **PERF-004:** Code splitting (1-2 часа)
  - Dynamic imports
  - Route prefetching
  - Bundle analysis

- [ ] **PERF-005:** Monitoring (1 час)
  - Web Vitals tracking
  - Performance dashboard
  - Alerts

**Value:** HIGH для scale
**Effort:** 4-6 часов
**Priority:** P1 - HIGH

---

## 💎 SPRINT 4: POLISH & ADVANCED (20-30 часов)

**Цель:** Market leader features
**Timeline:** Week 4
**Приоритет:** MEDIUM

---

### Epic 4.1: Advanced Filters (6-10 часов)

**Tasks:**

- [ ] **FILT-001:** Tracking Platform (2 часа)
  - Add field to schema
  - Migration
  - UI multi-select

- [ ] **FILT-002:** GEO Targeting (3 часа)
  - Add geoTargeting field
  - Country multi-select
  - UI integration

- [ ] **FILT-003:** Rating filter (1 час)
  - Join with reviews
  - Min rating dropdown

- [ ] **FILT-004:** Review count filter (1 час)
  - Count join
  - Filter options

- [ ] **FILT-005:** Program age filter (1 час)
  - Calculate from createdAt
  - Presets (new, established, mature)

- [ ] **FILT-006:** Smart combinations (2-3 часа)
  - Saved filter combos
  - "Beginner friendly" preset
  - "Fast cash flow" preset
  - "High paying easy" preset

**Value:** Differentiation!
**Effort:** 10-15 часов
**Priority:** P2 - MEDIUM

---

### Epic 4.2: Mobile UX (8-11 часов)

**Tasks:**

- [ ] **MOB-001:** Bottom sheet filters (2 часа)
  - Mobile filter drawer
  - Slide up animation

- [ ] **MOB-002:** Swipe gestures (2 часа)
  - Swipe to favorite
  - Swipe to compare

- [ ] **MOB-003:** Pull to refresh (1 час)

- [ ] **MOB-004:** Mobile tables (2 часа)
  - Responsive tables
  - Horizontal scroll

- [ ] **MOB-005:** Touch optimization (1-2 часа)
  - Bigger touch targets
  - Spacing

- [ ] **MOB-006:** Mobile testing (2 часа)
  - iOS Safari
  - Android Chrome
  - Fix issues

**Value:** 50% users на mobile!
**Effort:** 8-11 часов
**Priority:** P1 - HIGH

---

### Epic 4.3: Loading States (8-11 часов)

**Tasks:**

- [ ] **LOAD-001:** Program card skeleton (1 час)

- [ ] **LOAD-002:** Dashboard skeleton (1 час)

- [ ] **LOAD-003:** List skeleton (1 час)

- [ ] **LOAD-004:** Progressive loading (2 часа)
  - Show cached data first
  - Update in background

- [ ] **LOAD-005:** Suspense boundaries (2 часа)
  - React Suspense
  - Error boundaries

- [ ] **LOAD-006:** Optimistic updates (2-3 часа)
  - Instant UI feedback
  - Background sync

**Value:** MEDIUM (perceived performance)
**Effort:** 8-11 часов
**Priority:** P2 - MEDIUM

---

## 🏢 BACKLOG: ENTERPRISE (15-25 часов)

**Timeline:** Month 2
**Приоритет:** MEDIUM

---

### Epic 5.1: Audit Logs UI (3-4 часа)

**Tasks:**

- [ ] **AUD-001:** Audit log page (2 часа)
  - app/settings/audit-log/page.tsx
  - List all logs
  - Pagination

- [ ] **AUD-002:** Filtering (1 час)
  - By action type
  - By user
  - By date range

- [ ] **AUD-003:** Export logs (1 час)
  - CSV export
  - Download button

**Value:** MEDIUM (enterprise feature)
**Effort:** 3-4 часа
**Priority:** P2

---

### Epic 5.2: API Documentation (4-6 часов)

**Tasks:**

- [ ] **API-001:** API docs page (3 часа)
  - List all endpoints
  - Request/response examples
  - Authentication

- [ ] **API-002:** API key management (2-3 часа)
  - Generate keys
  - Usage tracking
  - Rate limits

**Value:** MEDIUM (Business tier)
**Effort:** 4-6 часов
**Priority:** P2

---

### Epic 5.3: Advanced Analytics (10-15 часов)

**Tasks:**

- [ ] **ANAL-001:** Charts library (2 часа)
  - Line charts
  - Area charts
  - Pie charts

- [ ] **ANAL-002:** Date range selector (1 час)

- [ ] **ANAL-003:** Export analytics (1 час)

- [ ] **ANAL-004:** User behavior tracking (2-3 часа)
  - Track events
  - Funnels

- [ ] **ANAL-005:** Custom reports (4-6 часов)
  - Report builder
  - Templates
  - Scheduling

**Value:** MEDIUM
**Effort:** 10-15 часов
**Priority:** P3

---

## 🎨 BACKLOG: POLISH (20-40 часов)

**Timeline:** Month 2-3
**Приоритет:** LOW-MEDIUM

---

### Epic 6.1: Comparison Export (3-4 часа)

**Tasks:**

- [ ] **EXP-001:** PDF export (2 часа)
  - jsPDF implementation
  - Format comparison table

- [ ] **EXP-002:** CSV export (1 час)

- [ ] **EXP-003:** Share link (1 час)
  - Generate shareable URL
  - Copy to clipboard

**Priority:** P2

---

### Epic 6.2: Dark Mode (4-6 часов)

**Tasks:**

- [ ] **DARK-001:** Theme context (2 часа)
- [ ] **DARK-002:** Dark styles (2-3 часа)
- [ ] **DARK-003:** Toggle button (30 мин)
- [ ] **DARK-004:** Persistence (30 мин)

**Priority:** P3

---

### Epic 6.3: Help Center (6-10 часов)

**Tasks:**

- [ ] **HELP-001:** FAQ page (2-3 часа)
- [ ] **HELP-002:** Documentation (3-4 часа)
- [ ] **HELP-003:** Video tutorials (4-8 часов)
- [ ] **HELP-004:** Contextual help (2-3 часа)

**Priority:** P3

---

## 📊 BACKLOG STATISTICS

### By Priority:

**P0 - CRITICAL:** 15-20 hours

- Email alerts
- Quick wins
- Payment Frequency
- Welcome tour
- Performance (Redis)

**P1 - HIGH:** 20-30 hours

- Invite system
- Team UI polish
- SEO optimization
- Mobile UX
- Performance tuning

**P2 - MEDIUM:** 30-50 hours

- Org settings
- Audit logs
- API docs
- Advanced filters
- Comparison export

**P3 - LOW:** 50-100+ hours

- Dark mode
- Help center
- Advanced analytics
- Test coverage
- Content creation

**TOTAL:** 115-200 hours to 100%

**But 98% needs only:** 15-20 hours! 🚀

---

## 🎯 SPRINT PLANNING

### Sprint 1 (Week 1): 15-20h → 98%

**Focus:** Critical & Quick wins
**Goal:** Launch ready!

**Must Do:**

- Email alerts
- Quick wins (8 tasks)
- Payment Frequency
- Welcome tour
- Redis cache

**Result:** Can launch! 🚀

---

### Sprint 2 (Week 2): 10-14h → 99%

**Focus:** Team features
**Goal:** Enterprise ready!

**Must Do:**

- Invite system
- Team UI polish
- Org settings

**Result:** Teams work! 💼

---

### Sprint 3 (Week 3): 10-15h → 99.5%

**Focus:** SEO & Performance
**Goal:** Scale ready!

**Must Do:**

- Full SEO
- Performance tuning
- Mobile UX

**Result:** Ready for traffic! 📈

---

### Sprint 4 (Week 4): 8-12h → 100%

**Focus:** Polish
**Goal:** Market leader!

**Must Do:**

- Final testing
- Polish UI
- Launch prep

**Result:** PUBLIC LAUNCH! 🎉

---

## 📋 BACKLOG GROOMING

### Definition of Done:

**For each Epic:**

- [ ] All tasks completed
- [ ] Tests written/updated
- [ ] Documentation updated
- [ ] Code reviewed
- [ ] QA passed
- [ ] Deployed to production

### Story Points (Fibonacci):

- 1 point = 30 минут
- 2 points = 1 час
- 3 points = 2 часа
- 5 points = 4 часа
- 8 points = 8 часов
- 13 points = 2 дня
- 21 points = 1 неделя

### Velocity Target:

**Week 1:** 15-20 points (15-20 hours)
**Week 2:** 10-14 points
**Week 3:** 10-15 points
**Week 4:** 8-12 points

**Total:** 43-61 points (43-61 hours)

---

## 🎊 BACKLOG SUMMARY

**Total Epics:** 16
**Total Tasks:** 100+
**Total Hours:** 115-200

**Critical (P0):** 35-45 hours
**High (P1):** 30-40 hours
**Medium (P2):** 30-50 hours
**Low (P3):** 50-100 hours

**To Launch (98%):** 15-20 hours
**To Complete (100%):** 115-200 hours

---

## 🚀 READY TO EXECUTE

**Start:** Tomorrow (Week 1, Sprint 1)
**First Epic:** Email Alerts (2-3h)
**First Task:** ALERT-001 (30 min)

**Follow:** ПЛАН*ИДЕАЛЬНОГО*ЗАПУСКА*4*НЕДЕЛИ.md

**Track:** This backlog document

**Ship:** 4 weeks! 🎉

---

**BACKLOG CREATED!** ✅

**100+ TASKS DEFINED!** ✅

**READY FOR EXECUTION!** 🚀

---

**Created:** 2025-11-16 15:45
**Total tasks:** 100+
**Total hours:** 115-200
**Critical path:** 15-20h to launch
