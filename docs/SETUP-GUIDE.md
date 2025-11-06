# Continuous Deployment Setup Guide

## Overview

This guide walks you through setting up the complete continuous deployment pipeline for the Affiliate Aggregator project. Follow these steps in order for a successful setup.

## Prerequisites

- GitHub repository access with admin permissions
- Vercel account with deployment access
- Supabase project for database
- Node.js 20.x installed locally

## Step-by-Step Setup

### Step 1: Vercel Setup (15 minutes)

#### 1.1 Install Vercel CLI

```bash
npm install -g vercel@latest
```

#### 1.2 Link Your Project

```bash
cd affiliate-aggregator
vercel link
```

Follow the prompts to:
- Select your Vercel scope (team or personal)
- Link to existing project or create new one
- Confirm project settings

#### 1.3 Get Project IDs

```bash
# This creates .vercel/project.json with your IDs
cat .vercel/project.json
```

You'll need:
- `orgId` → Use as `VERCEL_ORG_ID`
- `projectId` → Use as `VERCEL_PROJECT_ID`

#### 1.4 Generate Vercel Token

1. Go to https://vercel.com/account/tokens
2. Click "Create Token"
3. Name it: "GitHub Actions Deploy"
4. Select scopes: Full Account
5. Click "Create"
6. Copy the token immediately (you won't see it again)
7. Use as `VERCEL_TOKEN`

---

### Step 2: Database Setup (20 minutes)

#### 2.1 Create Database Environments

You need three database environments:

**Test Environment** (for CI/CD):
```bash
# Option 1: Use SQLite for tests (fastest)
# DATABASE_URL="file:./test.db"

# Option 2: Use separate test database
# Create test database in Supabase or use local PostgreSQL
```

**Staging Environment**:
```bash
# Create staging database in Supabase
# Or create separate schema in production database
```

**Production Environment**:
```bash
# Your main production database in Supabase
```

#### 2.2 Get Connection Strings

From Supabase Dashboard → Settings → Database:

1. **Transaction Pooler** (for application):
   - Mode: Transaction
   - Use as: `DATABASE_URL`
   - Format: `postgresql://[user]:[password]@[host]:6543/postgres?pgbouncer=true&connection_limit=1`

2. **Session Pooler** (for migrations):
   - Mode: Session
   - Use as: `DIRECT_URL`
   - Format: `postgresql://[user]:[password]@[host]:5432/postgres`

#### 2.3 Get Supabase API Keys

From Supabase Dashboard → Settings → API:

1. **Project URL**: Use as `NEXT_PUBLIC_SUPABASE_URL`
2. **anon public key**: Use as `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. **service_role key**: Use as `SUPABASE_SERVICE_ROLE_KEY`

---

### Step 3: Configure GitHub Secrets (10 minutes)

Go to your GitHub repository → Settings → Secrets and variables → Actions

#### 3.1 Vercel Secrets (Required)

```bash
VERCEL_TOKEN           = <token from step 1.4>
VERCEL_ORG_ID         = <orgId from step 1.3>
VERCEL_PROJECT_ID     = <projectId from step 1.3>
```

#### 3.2 Test Environment Secrets (Required)

```bash
TEST_DATABASE_URL              = <test database connection string>
TEST_DIRECT_URL                = <test database direct connection>
TEST_SUPABASE_URL             = <test supabase project URL>
TEST_SUPABASE_ANON_KEY        = <test supabase anon key>
```

#### 3.3 Staging Environment Secrets (Required)

```bash
STAGING_DATABASE_URL           = <staging database connection string>
STAGING_DIRECT_URL             = <staging database direct connection>
STAGING_SUPABASE_URL          = <staging supabase project URL>
STAGING_SUPABASE_ANON_KEY     = <staging supabase anon key>
STAGING_APP_URL               = <staging app URL>
```

#### 3.4 Production Environment Secrets (Required)

```bash
PRODUCTION_DATABASE_URL        = <production database connection string>
PRODUCTION_DIRECT_URL          = <production database direct connection>
```

#### 3.5 Optional Monitoring Secrets

```bash
LHCI_GITHUB_APP_TOKEN         = <lighthouse CI token>
SENTRY_DSN                    = <sentry error tracking DSN>
```

---

### Step 4: Configure Vercel Environment Variables (15 minutes)

Go to Vercel Dashboard → Your Project → Settings → Environment Variables

#### 4.1 Production Environment

Add these variables for Production:

```bash
NODE_ENV                      = production
DATABASE_URL                  = <production pooled connection>
DIRECT_URL                    = <production direct connection>
NEXT_PUBLIC_SUPABASE_URL     = <production supabase URL>
NEXT_PUBLIC_SUPABASE_ANON_KEY = <production supabase anon key>
SUPABASE_SERVICE_ROLE_KEY    = <production service role key>
NEXT_PUBLIC_APP_URL          = https://affiliate-aggregator-five.vercel.app
```

#### 4.2 Preview Environment

Add these variables for Preview (for PR deployments):

```bash
NODE_ENV                      = preview
DATABASE_URL                  = <staging pooled connection>
DIRECT_URL                    = <staging direct connection>
NEXT_PUBLIC_SUPABASE_URL     = <staging supabase URL>
NEXT_PUBLIC_SUPABASE_ANON_KEY = <staging supabase anon key>
SUPABASE_SERVICE_ROLE_KEY    = <staging service role key>
```

#### 4.3 Development Environment

Add these variables for Development (local):

```bash
NODE_ENV                      = development
DATABASE_URL                  = <dev pooled connection>
DIRECT_URL                    = <dev direct connection>
NEXT_PUBLIC_SUPABASE_URL     = <dev supabase URL>
NEXT_PUBLIC_SUPABASE_ANON_KEY = <dev supabase anon key>
```

---

### Step 5: Set Up Branch Protection (5 minutes)

Go to GitHub → Settings → Branches → Add rule

#### 5.1 Protect `main` Branch

- Branch name pattern: `main`
- Enable:
  - ✅ Require pull request reviews before merging (1 approval)
  - ✅ Require status checks to pass before merging
    - Select: `quality-gates`
    - Select: `build-verification`
  - ✅ Require branches to be up to date before merging
  - ✅ Require linear history (optional, recommended)
  - ✅ Include administrators

#### 5.2 Protect `develop` Branch

- Branch name pattern: `develop`
- Enable:
  - ✅ Require pull request reviews before merging (1 approval)
  - ✅ Require status checks to pass before merging
    - Select: `quality-gates`
    - Select: `build-verification`
  - ✅ Require branches to be up to date before merging

---

### Step 6: Initialize Database Migrations (10 minutes)

#### 6.1 Development Setup

```bash
# Install dependencies
npm ci

# Generate Prisma client
npx prisma generate

# Create initial migration (if not already done)
npm run db:migrate
```

#### 6.2 Staging Setup

Use GitHub Actions:

1. Go to Actions → Database Migration → Run workflow
2. Select:
   - Environment: `staging`
   - Create backup: `true`
3. Click "Run workflow"
4. Monitor execution

#### 6.3 Production Setup

Use GitHub Actions:

1. Go to Actions → Database Migration → Run workflow
2. Select:
   - Environment: `production`
   - Create backup: `true`
3. Click "Run workflow"
4. Monitor execution

---

### Step 7: Test the Pipeline (20 minutes)

#### 7.1 Test Preview Deployment

```bash
# Create test branch
git checkout -b test/pipeline-setup

# Make a small change
echo "# Test" >> README.md
git add README.md
git commit -m "Test: Verify preview deployment"

# Push and create PR
git push origin test/pipeline-setup
```

1. Go to GitHub and create PR to `develop`
2. Watch GitHub Actions run
3. Wait for preview deployment URL in PR comments
4. Visit preview URL and verify it works
5. Check health endpoint: `[preview-url]/api/health`

#### 7.2 Test Staging Deployment

```bash
# Merge the test PR to develop
# Automatic deployment to staging will trigger
```

1. Watch GitHub Actions → Continuous Deployment
2. Wait for staging deployment to complete
3. Test staging URL
4. Verify health endpoint

#### 7.3 Test Production Deployment

```bash
# Create release PR from develop to main
git checkout main
git pull
git merge develop
git push origin main
```

1. Watch GitHub Actions → Continuous Deployment
2. Wait for production deployment
3. Test production URL
4. Verify health endpoint
5. Check deployment tag was created

---

### Step 8: Set Up Monitoring (15 minutes)

#### 8.1 Enable Performance Monitoring

The workflow runs automatically every 6 hours, but you can test it:

1. Go to Actions → Performance Monitoring → Run workflow
2. Select environment: `production`
3. Click "Run workflow"
4. Review results

#### 8.2 Set Up Alerts (Optional)

To receive alerts for deployment failures:

1. Go to GitHub → Settings → Notifications
2. Enable: "Actions workflow runs"
3. Configure notification preferences

#### 8.3 Vercel Analytics (Optional)

1. Go to Vercel Dashboard → Your Project → Analytics
2. Enable Vercel Analytics
3. Copy Analytics ID
4. Add to Vercel environment variables:
   ```
   VERCEL_ANALYTICS_ID = <your-analytics-id>
   ```

---

### Step 9: Document Custom Configuration (5 minutes)

Create `.env.local` for local development:

```bash
# Copy template
cp .env.example .env.local

# Edit with your local values
# DO NOT commit this file
```

Update team documentation:
- Share this setup guide with team
- Document any custom configurations
- Update incident response contacts in RUNBOOK.md

---

## Verification Checklist

After setup, verify:

- [ ] Preview deployments work for PRs
- [ ] Staging deploys from `develop` branch
- [ ] Production deploys from `main` branch
- [ ] Health endpoint returns 200
- [ ] Database migrations work
- [ ] Tests run in CI/CD
- [ ] Coverage reports generate
- [ ] Rollback workflow is accessible
- [ ] Performance monitoring runs
- [ ] All secrets are configured
- [ ] Branch protection is enabled
- [ ] Team has access to necessary tools

---

## Troubleshooting

### Issue: Vercel CLI not authenticating

**Solution**:
```bash
vercel logout
vercel login
```

### Issue: Database connection fails in CI/CD

**Solution**:
- Verify connection strings are correct
- Check if IP allowlist includes GitHub Actions IPs
- For Supabase, ensure connection pooling is enabled

### Issue: Secrets not available in workflow

**Solution**:
- Verify secrets are added to repository (not organization)
- Check secret names match exactly (case-sensitive)
- Ensure no extra spaces in secret values

### Issue: Build fails with module not found

**Solution**:
```bash
# Clear npm cache locally
npm cache clean --force
rm -rf node_modules package-lock.json
npm install

# Check if same error occurs locally
npm run build
```

### Issue: Tests timeout in CI/CD

**Solution**:
- Increase timeout in jest.config.js
- Use simpler/faster test database
- Consider splitting tests into parallel jobs

---

## Next Steps

After successful setup:

1. **Review Documentation**:
   - Read DEPLOYMENT.md for deployment procedures
   - Read RUNBOOK.md for incident response
   - Share with team

2. **Set Up Monitoring**:
   - Configure error tracking (Sentry)
   - Set up uptime monitoring
   - Create alerting rules

3. **Optimize Pipeline**:
   - Add E2E tests
   - Implement feature flags
   - Set up canary deployments

4. **Train Team**:
   - Run through deployment process
   - Practice rollback procedure
   - Schedule incident response drill

---

## Support

### Resources

- **Vercel Documentation**: https://vercel.com/docs
- **GitHub Actions Documentation**: https://docs.github.com/actions
- **Prisma Documentation**: https://www.prisma.io/docs
- **Supabase Documentation**: https://supabase.com/docs

### Getting Help

If you encounter issues:

1. Check troubleshooting section above
2. Review GitHub Actions logs
3. Check Vercel deployment logs
4. Consult RUNBOOK.md for common issues
5. Contact DevOps team

---

**Setup Time Estimate**: 1.5 - 2 hours
**Last Updated**: 2025-06-11
**Version**: 1.0
