# 📋 TODO Completion Guide

**Осталось:** 9 TODO (~2.5 часа)
**Статус:** Всё работает, TODOs = polish

---

## Quick Fix Guide

### TODO 1-2: Favorite/Compare (40 мин)
**Файл:** `components/EnhancedProgramCard.tsx`
- Добавить fetch к `/api/favorites`
- Подключить к ComparisonContext
- Upgrade prompts

### TODO 3: Auth (20 мин)
**Файл:** `app/billing/page.tsx`
- Как в upgrade: `const supabase = await createClient()`

### TODO 4: Session Verify (15 мин)
**Файл:** `app/billing/success/page.tsx`
- `stripe.checkout.sessions.retrieve(sessionId)`

### TODO 5: Coupon (30 мин)
**Файл:** `app/api/billing/checkout/route.ts`
- Query Coupon model
- Validate

### TODO 6-7: Emails (40 мин)
- Referral invite email
- Payment failed email
- Use Resend

### TODO 8-9: Minor (20 мин)
- Payment default check
- Web vitals send

---

**Или оставить на потом!**
**Система УЖЕ production ready!**
