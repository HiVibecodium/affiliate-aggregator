# Vercel Production Branch Fix

## 🔴 Problem Identified

Vercel is deploying the **wrong branch** to production!

- **Current Production Branch**: `dependabot/github_actions/actions/upload-artifact-5`
- **Should Be**: `main`

This is why your Dashboard improvements and Analytics fixes are not visible on the live site.

## ✅ Solution: Change Production Branch to `main`

### Step-by-Step Instructions

#### 1. Access Vercel Dashboard

```
URL: https://vercel.com/vibecodium/affiliate-aggregator
```

1. Open the URL in your browser
2. Login if prompted
3. You should see your project dashboard

#### 2. Navigate to Git Settings

```
Project Dashboard → Settings (left sidebar) → Git (section)
```

**Visual Path:**

```
Vercel Dashboard
└── Projects
    └── affiliate-aggregator (click to open)
        └── Settings (left sidebar, gear icon)
            └── Git (in the settings menu)
```

#### 3. Find Production Branch Setting

Look for a section labeled:

- **"Production Branch"** or
- **"Git Configuration"** or
- **"Branch Configuration"**

It will show something like:

```
Production Branch: dependabot/github_actions/actions/upload-artifact-5
```

#### 4. Change to `main` Branch

**Option A: Dropdown Menu**

- Click on the branch name dropdown
- Select `main` from the list
- Click **"Save"**

**Option B: Text Input**

- Click **"Edit"** button
- Type: `main`
- Click **"Save"** or **"Update"**

#### 5. Trigger New Deployment

After saving, you have two options:

**Option A: Wait for Auto-Deploy (2-3 minutes)**

- Vercel will automatically deploy main branch
- Watch for notification

**Option B: Manual Redeploy (Instant)**

1. Go to **"Deployments"** tab
2. Find the **most recent deployment from `main` branch**
3. Click **three dots (...)** on the right
4. Select **"Redeploy"**
5. Choose **"Rebuild"** (not "Use existing cache")
6. Click **"Redeploy"** to confirm

## 🎯 Verification Steps

### After Deployment Completes

#### 1. Check Version Endpoint

```bash
curl https://affiliate-aggregator-five.vercel.app/api/version
```

**Expected Response:**

```json
{
  "version": "2.0.0",
  "build": "dashboard-improvements",
  "commit": "e0beafb...",
  "timestamp": "2025-11-14T...",
  "features": {
    "interactiveDashboard": true,
    "quickActions": true,
    "webVitals": true,
    "performanceOptimization": true,
    "testCoverage": "18.03%"
  }
}
```

#### 2. Test Dashboard Interactivity

Visit: https://affiliate-aggregator-five.vercel.app/dashboard

**Checklist:**

- [ ] Top 4 overview cards are clickable
- [ ] Hover on cards shows scale effect
- [ ] Hint text appears on hover ("→ Browse all programs")
- [ ] "Quick Actions" panel visible at bottom
- [ ] Quick Actions cards (Browse, Favorites, Compare, Analytics) work
- [ ] "View All →" links in each section
- [ ] Network list items clickable
- [ ] Category list items clickable
- [ ] Program cards clickable

#### 3. Test Analytics Page

Visit: https://affiliate-aggregator-five.vercel.app/analytics

**Checklist:**

- [ ] Page loads without crash/error
- [ ] Shows empty state message (if no data)
- [ ] "Перейти к программам" button visible
- [ ] Yellow warning banner if API unavailable (optional)
- [ ] No error boundary shown

## 📊 Visual Indicators

### Before Fix (Wrong Branch)

```
Production: dependabot/github_actions/actions/upload-artifact-5
Status: Old version deployed
Dashboard: Cards not clickable
Analytics: Crashes with error
Build ID: CHwgho8cEk64VtBA2fEcr
```

### After Fix (Correct Branch)

```
Production: main
Status: Latest version deployed
Dashboard: All interactive ✅
Analytics: Works gracefully ✅
Build ID: [New ID different from CHwgho8cEk64VtBA2fEcr]
```

## 🔧 Troubleshooting

### If You Don't See "Production Branch" Setting

The setting might be under different names:

- **"Git Branch"**
- **"Default Branch"**
- **"Deployment Branch"**
- **"Source Branch"**

Look in these sections:

- Settings → Git
- Settings → General
- Settings → Domains (sometimes branch settings are here)

### If `main` Branch Not in Dropdown

1. Check that `main` branch exists on GitHub
2. Refresh the Vercel page
3. Try typing `main` manually if there's text input
4. Reconnect Git Integration:
   - Settings → Git
   - Disconnect & Reconnect GitHub

### If Deployment Still Fails

Check build logs:

1. Click on the failed deployment
2. View **"Building"** tab
3. Look for errors like:
   - Missing environment variables
   - Database connection errors
   - Prisma errors
   - Module not found

## 📝 Important Notes

### Current Main Branch Commits

These commits are waiting to be deployed:

```
5ed8f59 - docs: Manual deployment guide
e0beafb - fix: Analytics page error handling
6dffc2f - feat: Add /api/version endpoint
9858d5e - chore: Trigger redeploy
b27c1de - chore: Add version.json
5a30067 - docs: Dashboard improvements
47a84b0 - feat: Major improvements (Dashboard + Performance + Tests)
```

### Expected Deployment Time

- **Auto-deploy**: 2-3 minutes after branch change
- **Manual redeploy**: 2-3 minutes build time
- **Total**: ~5 minutes from start to live

### Success Indicators

When deployment is successful:

1. **Vercel Dashboard** will show:
   - ✅ Green checkmark on deployment
   - "Production" badge
   - "Ready" status
   - Recent timestamp

2. **Live Site** will have:
   - New Build ID (different from `CHwgho8cEk64VtBA2fEcr`)
   - `/api/version` returns 200
   - Dashboard fully interactive
   - Analytics doesn't crash

## 🆘 If Still Blocked

If you cannot find the setting or deployment still fails:

### Contact Vercel Support

- In Vercel Dashboard → Help (bottom left)
- Or support@vercel.com

### Alternative: Use Vercel CLI

```bash
# Install
npm install -g vercel

# Login
vercel login

# Go to project
cd affiliate-aggregator

# Deploy to production
vercel --prod
```

## 📚 Related Documentation

- `MANUAL_DEPLOY.md` - General manual deployment guide
- `docs/DASHBOARD_IMPROVEMENTS.md` - Dashboard features documentation
- `docs/PERFORMANCE_OPTIMIZATION.md` - Performance improvements

---

**After you change the production branch to `main` and redeploy, all your improvements will be live!**

## Quick Checklist

- [ ] Access Vercel Dashboard
- [ ] Go to Settings → Git
- [ ] Change Production Branch to `main`
- [ ] Save changes
- [ ] Trigger redeploy (or wait for auto-deploy)
- [ ] Wait 2-3 minutes
- [ ] Verify `/api/version` returns correct data
- [ ] Test Dashboard interactivity
- [ ] Test Analytics page
- [ ] Celebrate! 🎉
