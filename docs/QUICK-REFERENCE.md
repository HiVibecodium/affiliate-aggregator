# Deployment Quick Reference Card

## Common Operations

### 🚀 Deploy Feature to Production

```bash
# 1. Feature branch → develop
git checkout -b feature/my-feature
# ... make changes ...
git push origin feature/my-feature
# Create PR to develop → Auto preview deployment

# 2. develop → main (after staging validation)
# Create PR from develop to main
# Merge → Auto production deployment
```

**Time**: ~10-15 minutes total

---

### 🔄 Emergency Rollback

**GitHub UI**:
1. Go to: Actions → Emergency Rollback → Run workflow
2. Enter deployment tag (e.g., `deploy-20250611-143022`)
3. Enter reason
4. Click "Run workflow"

**Time**: ~3-5 minutes

---

### 🗃️ Database Migration

**GitHub UI**:
1. Go to: Actions → Database Migration → Run workflow
2. Select environment (staging/production)
3. Enable "create_backup"
4. Click "Run workflow"

**Time**: ~5-10 minutes

---

### 🏥 Check Application Health

```bash
# Production
curl https://affiliate-aggregator-five.vercel.app/api/health

# Expected response
{
  "status": "healthy",
  "timestamp": "2025-06-11T14:30:22.000Z",
  "uptime": 3600,
  "checks": {
    "database": { "status": "up", "latency": 45 },
    "memory": { "used": 128, "total": 512, "percentage": 25 },
    "version": "0.1.0"
  }
}
```

---

### 📊 Find Deployment Tag for Rollback

```bash
# List recent deployment tags
git tag -l "deploy-*" --sort=-creatordate | head -10

# Or check GitHub releases
# Go to: Repository → Releases → Tags
```

---

### 🧪 Run Tests Locally

```bash
# All tests
npm test

# Unit tests only
npm run test:unit

# Integration tests
npm run test:integration

# E2E tests
npm run test:e2e

# With coverage
npm run test:coverage
```

---

### 🔍 Check Deployment Status

**GitHub UI**:
- Go to: Actions → Continuous Deployment
- Check latest run status

**Vercel UI**:
- Go to: https://vercel.com/dashboard
- Select project
- View deployments

---

### 🏗️ Local Development Setup

```bash
# 1. Clone and install
git clone <repository>
cd affiliate-aggregator
npm ci

# 2. Configure environment
cp .env.example .env.local
# Edit .env.local with your values

# 3. Set up database
npm run db:migrate

# 4. Start development server
npm run dev
```

---

### 📝 Pre-Deployment Checklist

```bash
# Run all checks locally
./scripts/deploy-checks.sh

# Or manually:
npm run lint          # Linting
npx tsc --noEmit      # Type check
npm test              # Tests
npm run build         # Build check
```

---

## Environment URLs

| Environment | URL | Branch | Auto-Deploy |
|-------------|-----|--------|-------------|
| **Production** | https://affiliate-aggregator-five.vercel.app | `main` | ✅ Yes |
| **Staging** | TBD | `develop` | ✅ Yes |
| **Preview** | Dynamic | PRs | ✅ Yes |
| **Local** | http://localhost:3000 | Any | Manual |

---

## Important GitHub Secrets

### Required for Deployment
- `VERCEL_TOKEN` - Vercel deployment token
- `VERCEL_ORG_ID` - Vercel organization ID
- `VERCEL_PROJECT_ID` - Vercel project ID

### Required for Testing
- `TEST_DATABASE_URL` - Test database connection
- `TEST_DIRECT_URL` - Test database direct connection
- `TEST_SUPABASE_URL` - Test Supabase URL
- `TEST_SUPABASE_ANON_KEY` - Test Supabase anon key

### Required for Environments
- `STAGING_DATABASE_URL` - Staging database
- `STAGING_DIRECT_URL` - Staging direct connection
- `PRODUCTION_DATABASE_URL` - Production database
- `PRODUCTION_DIRECT_URL` - Production direct connection

---

## Monitoring Endpoints

### Health Check
```bash
curl https://affiliate-aggregator-five.vercel.app/api/health
```

**Status Codes**:
- `200` - Healthy or degraded
- `503` - Unhealthy

### Readiness Check
```bash
curl -I https://affiliate-aggregator-five.vercel.app/api/health
```

**Status Codes**:
- `200` - Ready to serve traffic
- `503` - Not ready

---

## Troubleshooting Quick Fixes

### Deployment Failed
```bash
# 1. Check GitHub Actions logs
# 2. Try local build
npm run build

# 3. If passes locally, check environment variables
# 4. Re-run deployment
```

### Tests Failing in CI
```bash
# 1. Run tests locally
npm test

# 2. Check for environment-specific issues
# 3. Review test logs in GitHub Actions
```

### Database Connection Issues
```bash
# 1. Check connection string format
# 2. Verify Supabase is accessible
# 3. Check for IP restrictions
# 4. Verify pooling is enabled (?pgbouncer=true)
```

### Preview Deployment Not Created
```bash
# 1. Check Vercel integration is active
# 2. Verify VERCEL_TOKEN is valid
# 3. Check repository permissions
# 4. Review workflow permissions
```

---

## Useful Commands

### Git Tags
```bash
# Create deployment tag (automatic in workflow)
git tag -a "deploy-$(date +%Y%m%d-%H%M%S)" -m "Production deployment"

# List recent tags
git tag -l "deploy-*" --sort=-creatordate | head -10

# Checkout specific tag
git checkout deploy-20250611-143022
```

### Prisma Database
```bash
# Check migration status
npx prisma migrate status

# Generate Prisma client
npx prisma generate

# Open Prisma Studio
npm run db:studio

# Create migration
npm run db:migrate
```

### Vercel CLI
```bash
# Deploy to production
vercel --prod

# Deploy to preview
vercel

# View logs
vercel logs <deployment-url> --follow

# List deployments
vercel ls
```

---

## Performance Targets

| Metric | Target | Alert Threshold |
|--------|--------|-----------------|
| Deployment Time | 8-10 min | >15 min |
| Test Coverage | ≥70% | <70% |
| Health Check Response | <500ms | >2s |
| Database Query Latency | <100ms | >1s |
| Memory Usage | <80% | >90% |
| Build Size | <5MB | >10MB |

---

## Incident Severity Levels

| Level | Description | Response Time | Example |
|-------|-------------|---------------|---------|
| **SEV1** | Production down | 5 min | Complete outage |
| **SEV2** | Major degradation | 30 min | 50% error rate |
| **SEV3** | Minor issues | 2 hours | Feature broken |
| **SEV4** | Cosmetic | 24 hours | UI glitch |

---

## Escalation Path

```
L1: On-call Engineer (Initial response)
  ↓
L2: Senior Engineer (Complex issues)
  ↓
L3: Engineering Lead (Critical outages)
  ↓
L4: CTO/VP Engineering (Data breach, legal)
```

---

## Key Documentation Files

| File | Purpose |
|------|---------|
| `docs/DEPLOYMENT.md` | Complete deployment guide |
| `docs/RUNBOOK.md` | Operations procedures |
| `docs/SETUP-GUIDE.md` | Initial setup instructions |
| `docs/QUICK-REFERENCE.md` | This file |
| `DEPLOYMENT-PIPELINE-SUMMARY.md` | Implementation overview |

---

## Support Resources

### Internal
- Documentation: `docs/` directory
- Runbook: `docs/RUNBOOK.md`
- Setup Guide: `docs/SETUP-GUIDE.md`

### External
- **Vercel**: https://vercel.com/docs
- **GitHub Actions**: https://docs.github.com/actions
- **Prisma**: https://www.prisma.io/docs
- **Supabase**: https://supabase.com/docs

---

**Print this page and keep it handy!**

**Last Updated**: 2025-06-11
**Version**: 1.0
