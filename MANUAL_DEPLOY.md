# Manual Deployment Guide for Vercel

## Problem

Vercel automatic deployment is not working despite Git Integration being enabled.

## Quick Solution - Redeploy via Vercel Dashboard

### Step 1: Access Vercel Dashboard

1. Go to https://vercel.com/vibecodium/affiliate-aggregator
2. Login if needed

### Step 2: Find Latest Deployment

1. Click on **"Deployments"** tab
2. You should see the most recent deployment (even if it's old)

### Step 3: Redeploy

1. Click on the **three dots (...)** on the latest deployment
2. Select **"Redeploy"**
3. Select **"Use existing Build Cache"** or **"Rebuild"** (choose Rebuild)
4. Click **"Redeploy"**

### Step 4: Wait

- Deployment usually takes 2-3 minutes
- You'll see a progress indicator
- When complete, check https://affiliate-aggregator-five.vercel.app/dashboard

## Alternative: Deploy via Vercel CLI

### Prerequisites

```bash
npm install -g vercel
vercel login
```

### Deploy Production

```bash
cd affiliate-aggregator

# Link to project (if not already linked)
vercel link

# Deploy to production
vercel --prod

# Or with specific commit
vercel --prod --force
```

## Check Deployment Status

### Via Browser

1. Visit https://affiliate-aggregator-five.vercel.app/api/version
2. Should return JSON with version info (after deployment)

### Via API

```bash
curl https://affiliate-aggregator-five.vercel.app/api/version
```

Should return:

```json
{
  "version": "2.0.0",
  "build": "dashboard-improvements",
  "commit": "e0beafb...",
  "features": {
    "interactiveDashboard": true,
    "quickActions": true,
    "webVitals": true
  }
}
```

## Verify Dashboard Works

After deployment:

1. Visit https://affiliate-aggregator-five.vercel.app/dashboard
2. Login if needed
3. Check that:
   - ✅ All 4 overview cards are clickable
   - ✅ Hover shows scale effect
   - ✅ "Quick Actions" panel visible at bottom
   - ✅ All section headers have "View All →" links

## Troubleshooting

### If Redeploy Fails

**Check Build Logs:**

1. In Vercel dashboard, click on the failed deployment
2. Click **"Building"** tab
3. Look for error messages

**Common Issues:**

- Missing environment variables
- Database connection errors
- Prisma schema issues
- Missing dependencies

### If Still Not Working

**Verify Environment Variables:**

1. Go to Vercel project → Settings → Environment Variables
2. Ensure these are set:
   - `DATABASE_URL`
   - `DIRECT_URL`
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### If Dashboard Still Not Interactive

**Clear Browser Cache:**

1. Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
2. Or clear cache in DevTools → Application → Clear Storage

**Check Browser Console:**

1. Open DevTools (F12)
2. Check Console tab for JavaScript errors
3. Check Network tab - is `/api/analytics/popular` returning 200?

## Current Commits Waiting to Deploy

```
e0beafb - fix: Analytics page error handling
6dffc2f - feat: Add /api/version endpoint
9858d5e - chore: Trigger redeploy (empty commit)
b27c1de - chore: Add version.json
5a30067 - docs: Dashboard improvements
47a84b0 - feat: Major improvements (Dashboard + Performance + Tests)
```

## Expected Results After Deployment

### Dashboard Page

- 4 clickable overview cards with hover effects
- Quick Actions panel (Browse, Favorites, Compare, Analytics)
- Platform Statistics section
- "View All →" links in every section

### Analytics Page

- No more crash/error
- Shows empty state with friendly message
- "Перейти к программам" button
- Yellow warning if analytics unavailable

### Performance

- Web Vitals tracking enabled
- Optimized Sentry (production only)
- Better code splitting

## Support

If manual deployment still doesn't work:

1. Check Vercel deployment logs for errors
2. Verify all environment variables are set
3. Contact Vercel support or check billing status
4. Consider using Vercel CLI for deployment

## Success Criteria

After successful deployment, verify:

- [ ] `/api/version` returns 200 with correct data
- [ ] Dashboard overview cards are clickable
- [ ] Analytics page doesn't crash
- [ ] Quick Actions panel visible
- [ ] All hover effects working
