# Deployment Guide - Affiliate Aggregator

## Overview

This document describes the continuous deployment pipeline for the Affiliate Aggregator project, designed to support high-velocity development (50+ feature deployments per week) with zero-downtime deployments and automatic rollback capabilities.

## Architecture

### Environments

1. **Preview**: Automatic deployment for all pull requests
2. **Staging**: Deployed from `develop` branch
3. **Production**: Deployed from `main` branch

### Deployment Flow

```
Feature Branch → Pull Request → Preview Deployment
       ↓
   develop branch → Staging Deployment
       ↓
   main branch → Production Deployment
```

## GitHub Actions Workflows

### 1. Continuous Deployment (`continuous-deployment.yml`)

Main deployment pipeline with quality gates:

**Triggers:**
- Push to `main` or `develop` branches
- Pull requests to `main` or `develop`
- Manual workflow dispatch

**Jobs:**
- `quality-gates`: Linting, type checking, unit tests, integration tests, coverage checks
- `build-verification`: Build validation and bundle size analysis
- `migration-check`: Database migration validation
- `deploy-preview`: Preview deployments for PRs
- `deploy-staging`: Staging deployments from `develop`
- `deploy-production`: Production deployments from `main`
- `post-deployment-check`: Post-deployment health monitoring

**Quality Requirements:**
- Test coverage must be ≥70%
- All tests must pass
- Linting must pass
- Type checking must pass
- Build must succeed

### 2. Emergency Rollback (`rollback.yml`)

Manual workflow for emergency rollbacks:

**Usage:**
```bash
# Trigger via GitHub Actions UI with:
# - deployment_tag: Tag to rollback to (e.g., deploy-20250611-143022)
# - reason: Reason for rollback
# - skip_tests: Emergency flag (use with caution)
```

**Process:**
1. Validates deployment tag exists
2. Checks out code at specified tag
3. Runs tests (unless skipped)
4. Deploys previous version
5. Monitors for 5 minutes post-rollback
6. Creates incident log

### 3. Database Migration (`database-migration.yml`)

Manual workflow for database migrations:

**Usage:**
```bash
# Trigger via GitHub Actions UI with:
# - environment: staging or production
# - migration_name: Optional specific migration
# - create_backup: Create backup before migration (default: true)
```

**Process:**
1. Validates migration files
2. Creates database backup (optional)
3. Runs Prisma migrations
4. Validates post-migration state
5. Creates migration log

### 4. Performance Monitoring (`performance-monitoring.yml`)

Scheduled monitoring (every 6 hours):

**Checks:**
- Lighthouse performance audit
- Bundle size analysis
- Availability monitoring (10 checks with 10s interval)
- Response time monitoring
- Database connectivity
- API endpoint health

## Required GitHub Secrets

### Vercel Configuration
```bash
VERCEL_TOKEN           # Vercel deployment token
VERCEL_ORG_ID         # Vercel organization ID
VERCEL_PROJECT_ID     # Vercel project ID
```

### Database Configuration
```bash
# Test Environment
TEST_DATABASE_URL
TEST_DIRECT_URL
TEST_SUPABASE_URL
TEST_SUPABASE_ANON_KEY

# Staging Environment
STAGING_DATABASE_URL
STAGING_DIRECT_URL
STAGING_SUPABASE_URL
STAGING_SUPABASE_ANON_KEY
STAGING_APP_URL

# Production Environment
PRODUCTION_DATABASE_URL
PRODUCTION_DIRECT_URL
```

### Optional Monitoring
```bash
LHCI_GITHUB_APP_TOKEN  # Lighthouse CI token
SENTRY_DSN             # Error tracking
```

## Setup Instructions

### 1. Configure GitHub Secrets

Go to your repository Settings → Secrets and variables → Actions, and add all required secrets.

### 2. Set Up Vercel

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Link project:
```bash
vercel link
```

3. Get project details:
```bash
vercel project ls
```

### 3. Configure Environment Variables in Vercel

For each environment (Production, Preview, Development):

1. Go to Vercel Dashboard → Project → Settings → Environment Variables
2. Add variables from `.env.production.template` or `.env.staging.template`
3. Ensure database URLs use connection pooling for production

### 4. Set Up Database Migrations

Initialize Prisma migrations:
```bash
# Development
npm run db:migrate

# Staging (via GitHub Actions)
# Use "Database Migration" workflow

# Production (via GitHub Actions)
# Use "Database Migration" workflow with backup enabled
```

### 5. Enable Branch Protection

Configure branch protection rules for `main` and `develop`:

1. Go to Settings → Branches → Add rule
2. Enable:
   - Require pull request reviews (1 approval)
   - Require status checks to pass:
     - quality-gates
     - build-verification
   - Require branches to be up to date
   - Require linear history (optional)

## Deployment Process

### Feature Development

1. Create feature branch from `develop`:
```bash
git checkout develop
git pull
git checkout -b feature/amazing-feature
```

2. Develop and commit changes

3. Create pull request to `develop`
   - Automatic preview deployment created
   - All quality gates must pass
   - Preview URL commented on PR

4. After approval and merge:
   - Automatic deployment to staging
   - Smoke tests run automatically

### Production Release

1. Create release PR from `develop` to `main`
   - Review staging deployment
   - Verify all features work as expected

2. Merge to `main`:
   - Automatic production deployment
   - Database migrations run automatically
   - Deployment tag created
   - Post-deployment monitoring for 5 minutes

### Emergency Procedures

#### Rollback Production

1. Go to Actions → Emergency Rollback → Run workflow
2. Enter deployment tag (find in recent deployments)
3. Provide reason for rollback
4. Monitor rollback process (5-minute monitoring included)

#### Manual Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to production
vercel --prod

# Deploy to preview
vercel
```

## Monitoring & Health Checks

### Health Endpoint

```bash
# Check application health
curl https://affiliate-aggregator-five.vercel.app/api/health
```

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2025-06-11T14:30:22.000Z",
  "uptime": 3600,
  "checks": {
    "database": {
      "status": "up",
      "latency": 45
    },
    "memory": {
      "used": 128,
      "total": 512,
      "percentage": 25
    },
    "version": "0.1.0"
  }
}
```

### Performance Monitoring

Automated every 6 hours:
- Lighthouse audit (Performance, Accessibility, Best Practices, SEO)
- Bundle size tracking
- Response time monitoring
- Database query performance

## Best Practices

### 1. Database Migrations

- Always create migrations on feature branch
- Test migrations on staging first
- Always create backup before production migrations
- Never edit migration files after creation

### 2. Environment Variables

- Never commit secrets to repository
- Use different keys for staging and production
- Rotate secrets regularly (recommended: quarterly)
- Document all required variables

### 3. Testing

- Maintain ≥70% test coverage
- Write integration tests for critical paths
- Test database migrations in CI/CD
- Run E2E tests on staging before production release

### 4. Deployment Timing

- Deploy to production during low-traffic periods
- Avoid Friday afternoon deployments
- Plan for 30-minute deployment window
- Have rollback ready for first 1 hour post-deployment

### 5. Monitoring

- Check health endpoint after deployment
- Monitor error rates for first hour
- Review performance metrics
- Set up alerts for critical issues

## Scaling Considerations

### High-Velocity Deployments (50+ per week)

1. **Feature Flags**: Use feature flags for gradual rollouts
2. **Canary Deployments**: Deploy to subset of users first
3. **Automated Rollback**: Set up automatic rollback on error threshold
4. **Blue-Green Deployments**: Zero-downtime deployments

### Database at Scale

1. **Connection Pooling**: Use PgBouncer (already configured)
2. **Read Replicas**: Consider for high read load
3. **Migration Strategy**: Use online schema changes for large tables
4. **Backup Strategy**: Automated daily backups with point-in-time recovery

### Multi-Region Deployment

1. **Edge Functions**: Deploy API routes to edge
2. **Database Regions**: Use Supabase read replicas
3. **CDN**: Leverage Vercel's global CDN
4. **Geo-Routing**: Route users to nearest region

## Troubleshooting

### Deployment Fails

1. Check GitHub Actions logs
2. Verify all secrets are configured
3. Test build locally: `npm run build`
4. Check database connectivity

### Database Migration Fails

1. Review migration file syntax
2. Check database permissions
3. Verify connection string
4. Test migration on staging first

### Health Check Fails

1. Check application logs in Vercel
2. Verify database connectivity
3. Check environment variables
4. Review recent deployments

### Preview Deployment Not Created

1. Verify Vercel GitHub integration
2. Check repository permissions
3. Review workflow permissions in GitHub
4. Ensure VERCEL_TOKEN is valid

## Support & Contact

For deployment issues:
1. Check GitHub Actions logs
2. Review Vercel deployment logs
3. Check application health endpoint
4. Consult this documentation

For emergencies:
1. Use Emergency Rollback workflow
2. Check incident logs in GitHub Actions artifacts
3. Monitor post-rollback health checks

## Change Log

- **2025-06-11**: Initial deployment pipeline setup
  - Continuous deployment workflow
  - Emergency rollback procedure
  - Database migration automation
  - Performance monitoring
