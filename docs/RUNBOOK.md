# Deployment Runbook - Affiliate Aggregator

## Quick Reference

### Emergency Contacts
- **On-Call Engineer**: Check team rotation
- **Database Admin**: Check escalation matrix
- **Platform Team**: Vercel support

### Critical URLs
- **Production**: https://affiliate-aggregator-five.vercel.app
- **Staging**: Will be configured in Vercel
- **Health Check**: https://affiliate-aggregator-five.vercel.app/api/health
- **Vercel Dashboard**: https://vercel.com/dashboard

---

## Incident Response Procedures

### Severity Levels

**SEV1 - Critical (Production Down)**
- Production is completely unavailable
- Data loss or corruption
- Security breach
- Response Time: Immediate (5 minutes)

**SEV2 - High (Major Degradation)**
- Significant feature not working
- Performance degradation affecting >50% users
- Database connectivity issues
- Response Time: 30 minutes

**SEV3 - Medium (Minor Issues)**
- Non-critical feature broken
- Performance issues affecting <50% users
- Response Time: 2 hours

**SEV4 - Low (Cosmetic Issues)**
- UI issues
- Documentation errors
- Response Time: 24 hours

---

## Common Scenarios

### Scenario 1: Production Deployment Failed

**Symptoms:**
- GitHub Actions deployment job failed
- Build errors in logs
- Tests failing

**Diagnosis:**
```bash
# Check GitHub Actions logs
# Go to: Actions → Continuous Deployment → Failed run

# Check local build
cd affiliate-aggregator
npm ci
npm run build
```

**Resolution:**

1. If build issue:
```bash
# Fix code locally
# Push to main
# Deployment will auto-retry
```

2. If tests failing:
```bash
# Check test logs in Actions
# Fix failing tests
# Push fix to main
```

3. If environment variable issue:
```bash
# Check Vercel dashboard → Environment Variables
# Verify all required vars are set
# Re-run deployment
```

**Prevention:**
- Always test on staging first
- Run full test suite before merging to main
- Use preview deployments for validation

---

### Scenario 2: Production is Down (SEV1)

**Symptoms:**
- Health check returning 503
- Users reporting site unavailable
- Monitoring alerts firing

**Immediate Actions:**

1. **Verify issue** (1 minute):
```bash
# Check health endpoint
curl https://affiliate-aggregator-five.vercel.app/api/health

# Check Vercel status
# Visit: https://www.vercel-status.com
```

2. **Communicate** (2 minutes):
```bash
# Post in incident channel
# Update status page if available
```

3. **Initiate rollback** (5 minutes):
```bash
# Go to: Actions → Emergency Rollback → Run workflow
# Select last known good deployment tag
# Reason: "Production down - SEV1 rollback"
# Skip tests: true (emergency)
```

4. **Monitor rollback** (5 minutes):
```bash
# Watch rollback workflow
# Check health endpoint every 30 seconds
curl https://affiliate-aggregator-five.vercel.app/api/health
```

5. **Verify recovery** (5 minutes):
```bash
# Test critical paths manually
# Check error rates in monitoring
# Verify health checks passing
```

**Post-Incident:**
- Document what happened
- Create incident report
- Schedule post-mortem
- Implement prevention measures

---

### Scenario 3: Database Migration Failed

**Symptoms:**
- Migration workflow failed
- Database in inconsistent state
- Application errors related to schema

**Diagnosis:**
```bash
# Check migration status
npx prisma migrate status

# Review migration logs
# Check GitHub Actions → Database Migration → Logs
```

**Resolution:**

1. **Minor issue** (migration can be retried):
```bash
# Fix migration file
# Re-run migration workflow
# Monitor for success
```

2. **Major issue** (need to rollback):
```bash
# Restore from backup
# Use backup created by migration workflow
# Download from: Actions → Database Migration → Artifacts

# Apply backup (example for Postgres)
# psql $DATABASE_URL < backup.sql

# Mark migration as rolled back
npx prisma migrate resolve --rolled-back <migration-name>
```

3. **Critical issue** (production affected):
```bash
# Rollback application first
# Then restore database
# Then fix migration
# Test on staging
# Re-deploy to production
```

**Prevention:**
- Always test migrations on staging
- Create backups before production migrations
- Use online schema changes for large tables
- Review migration files before approval

---

### Scenario 4: Performance Degradation (SEV2)

**Symptoms:**
- Slow response times
- Health check showing high latency
- User complaints about slowness

**Diagnosis:**

1. **Check application health**:
```bash
# Check health endpoint
curl https://affiliate-aggregator-five.vercel.app/api/health

# Look for:
# - High database latency
# - High memory usage
# - Slow response times
```

2. **Check Vercel metrics**:
```bash
# Go to Vercel Dashboard → Analytics
# Check:
# - Function execution time
# - Cold starts
# - Error rates
```

3. **Check database**:
```bash
# Check database metrics in Supabase dashboard
# Look for:
# - High connection count
# - Slow queries
# - Lock waits
```

**Resolution:**

1. **High database latency**:
```bash
# Check connection pooling
# Verify PgBouncer is enabled in DATABASE_URL
# Review slow queries in Supabase dashboard
# Consider adding indexes
```

2. **High memory usage**:
```bash
# Check for memory leaks
# Review recent code changes
# Consider increasing function memory limit in Vercel
```

3. **Cold starts**:
```bash
# Consider upgrading Vercel plan for faster cold starts
# Implement keep-warm strategy
# Optimize bundle size
```

**Prevention:**
- Monitor performance metrics regularly
- Set up alerts for performance degradation
- Regular performance testing
- Keep dependencies updated

---

### Scenario 5: Database Connection Exhaustion

**Symptoms:**
- "Too many connections" errors
- Intermittent database failures
- Health check showing database down

**Diagnosis:**
```bash
# Check current connections in Supabase dashboard
# Go to: Database → Connection Pooling

# Check health endpoint
curl https://affiliate-aggregator-five.vercel.app/api/health
```

**Resolution:**

1. **Immediate** (stop bleeding):
```bash
# Kill idle connections in Supabase dashboard
# Or via SQL:
SELECT pg_terminate_backend(pid)
FROM pg_stat_activity
WHERE state = 'idle'
AND state_change < NOW() - INTERVAL '5 minutes';
```

2. **Short-term** (restore service):
```bash
# Verify connection pooling is enabled
# DATABASE_URL should include: ?pgbouncer=true&connection_limit=1

# Update in Vercel environment variables if needed
# Redeploy to apply changes
```

3. **Long-term** (prevent recurrence):
```bash
# Implement connection pooling properly
# Use DIRECT_URL only for migrations
# Use DATABASE_URL for application queries
# Consider increasing database connection limit
```

**Prevention:**
- Always use connection pooling in production
- Set appropriate connection limits
- Monitor connection usage
- Implement connection retry logic

---

### Scenario 6: Deployment Stuck/Hanging

**Symptoms:**
- Deployment running for >15 minutes
- No progress in logs
- Build or deploy step hanging

**Diagnosis:**
```bash
# Check GitHub Actions logs
# Look for last successful step
# Check for timeout messages
```

**Resolution:**

1. **Cancel stuck deployment**:
```bash
# Go to: Actions → Running workflow
# Click "Cancel workflow"
```

2. **Investigate cause**:
```bash
# Common causes:
# - NPM registry timeout
# - Database connectivity during build
# - Vercel API timeout
# - Test suite hanging
```

3. **Re-run deployment**:
```bash
# Fix underlying issue
# Re-run workflow
# Monitor for completion
```

**Prevention:**
- Set timeouts on all workflow jobs
- Implement retry logic for flaky tests
- Use cached dependencies
- Monitor workflow duration trends

---

## Monitoring & Alerting

### Key Metrics to Monitor

1. **Application Health**:
   - Health endpoint status
   - Response times
   - Error rates

2. **Database**:
   - Connection count
   - Query performance
   - Replication lag

3. **Infrastructure**:
   - Function execution time
   - Cold start frequency
   - Memory usage

4. **Business**:
   - User sign-ups
   - API usage
   - Feature adoption

### Setting Up Alerts

**Critical Alerts** (Immediate notification):
- Health check fails
- Error rate >5%
- Database connection failures
- Production deployment fails

**Warning Alerts** (15-minute delay):
- Response time >2 seconds
- Memory usage >80%
- Test coverage <70%
- Bundle size increases >10%

**Info Alerts** (Daily digest):
- Successful deployments
- Performance trends
- Usage statistics

---

## Maintenance Windows

### Planned Maintenance

**Scheduling**:
- Avoid Friday afternoons
- Prefer Tuesday-Thursday, 2-4 AM UTC
- Announce 24-48 hours in advance
- Post in status channel

**Procedure**:

1. **Pre-maintenance** (1 hour before):
```bash
# Create database backup
# Verify rollback procedure
# Notify team
# Post maintenance banner (if available)
```

2. **During maintenance**:
```bash
# Execute maintenance tasks
# Monitor continuously
# Document any issues
```

3. **Post-maintenance**:
```bash
# Verify all systems operational
# Run smoke tests
# Update status page
# Send completion notification
```

### Emergency Maintenance

For critical security updates or urgent fixes:

1. **Immediate approval** from on-call engineer
2. **Notify team** immediately
3. **Follow expedited deployment** process
4. **Post-mortem** within 24 hours

---

## Database Management

### Backup Strategy

**Automated Backups**:
- Daily full backups (Supabase automatic)
- Point-in-time recovery available
- 30-day retention

**Manual Backups**:
```bash
# Before major migrations
# Via GitHub Actions: Database Migration workflow
# Enable "create_backup" option

# Manual backup (if needed)
pg_dump $DATABASE_URL > backup-$(date +%Y%m%d-%H%M%S).sql
```

**Restoration**:
```bash
# Download backup from GitHub Actions artifacts
# Or from Supabase dashboard

# Restore (use DIRECT_URL)
psql $DIRECT_URL < backup.sql
```

### Migration Best Practices

1. **Test on staging first**
2. **Create backup before production migration**
3. **Run during low-traffic period**
4. **Monitor for 30 minutes post-migration**
5. **Document migration in log**

### Database Scaling

**Triggers for scaling**:
- Connection pool exhaustion
- Query latency >500ms
- Storage >80%

**Scaling options**:
1. Increase connection limit
2. Add read replicas
3. Upgrade database tier
4. Implement caching layer

---

## Security Procedures

### Secret Rotation

**Quarterly rotation** for:
- Database passwords
- API keys
- Service role keys
- JWT secrets

**Procedure**:

1. **Generate new secrets**:
```bash
# Use secure random generation
openssl rand -base64 32
```

2. **Update in Vercel**:
```bash
# Go to: Vercel → Settings → Environment Variables
# Update production values
# Update staging values
```

3. **Deploy with new secrets**:
```bash
# Deploy to staging first
# Verify functionality
# Deploy to production
```

4. **Revoke old secrets**:
```bash
# Revoke old API keys
# Update database passwords
# Document rotation
```

### Security Incident Response

**If security breach detected**:

1. **Isolate** (5 minutes):
```bash
# Enable maintenance mode if available
# Or take site offline temporarily
```

2. **Assess** (15 minutes):
```bash
# Identify scope of breach
# Check logs for unauthorized access
# Document what was accessed
```

3. **Contain** (30 minutes):
```bash
# Rotate all secrets immediately
# Patch vulnerability
# Deploy fix
```

4. **Notify** (1 hour):
```bash
# Notify affected users
# Report to relevant authorities
# Update security team
```

5. **Recover** (variable):
```bash
# Restore service
# Monitor for continued attacks
# Implement additional security measures
```

---

## Contacts & Escalation

### Escalation Matrix

**Level 1**: On-call engineer
- Initial response
- Basic troubleshooting
- Escalate if needed

**Level 2**: Senior engineer
- Complex issues
- Architecture decisions
- Database issues

**Level 3**: Engineering lead
- Critical outages
- Multiple system failures
- Business impact decisions

**Level 4**: CTO/VP Engineering
- Data breach
- Legal issues
- Major business impact

### External Contacts

**Vercel Support**:
- Email: support@vercel.com
- Dashboard: Vercel → Help

**Supabase Support**:
- Email: support@supabase.io
- Dashboard: Supabase → Support

**GitHub Support**:
- https://support.github.com

---

## Post-Incident Procedures

### Incident Report Template

```markdown
# Incident Report: [Short Description]

**Date**: YYYY-MM-DD
**Duration**: X hours Y minutes
**Severity**: SEV1/SEV2/SEV3/SEV4

## Summary
Brief description of what happened

## Timeline
- HH:MM - Incident detected
- HH:MM - Response initiated
- HH:MM - Root cause identified
- HH:MM - Fix deployed
- HH:MM - Service restored

## Root Cause
Detailed explanation of what caused the incident

## Resolution
What was done to resolve the incident

## Impact
- Users affected: X
- Downtime: Y minutes
- Revenue impact: $Z (if applicable)

## Action Items
1. [ ] Immediate fix (completed)
2. [ ] Documentation update
3. [ ] Monitoring improvements
4. [ ] Prevention measures

## Lessons Learned
What we learned and how we'll prevent similar incidents
```

### Post-Mortem Meeting

**Schedule**: Within 48 hours of incident resolution

**Attendees**:
- Incident responders
- Engineering team
- Product team (if user-facing)

**Agenda**:
1. Review timeline
2. Discuss root cause
3. Review response effectiveness
4. Identify improvements
5. Assign action items

**Output**:
- Incident report
- Action items with owners
- Process improvements
- Knowledge base updates

---

## Knowledge Base

### Useful Commands

```bash
# Check deployment status
gh api repos/OWNER/REPO/deployments

# Tail Vercel logs
vercel logs DEPLOYMENT_URL --follow

# Check database status
npx prisma migrate status

# Generate Prisma client
npx prisma generate

# Run health check
curl https://affiliate-aggregator-five.vercel.app/api/health

# Check git tags (for rollback)
git tag -l "deploy-*" --sort=-creatordate | head -10
```

### Common Issues & Solutions

**Issue**: Build fails with "out of memory"
**Solution**: Increase Node memory: `NODE_OPTIONS="--max-old-space-size=4096"`

**Issue**: Tests timeout in CI
**Solution**: Increase timeout in jest.config.js

**Issue**: Prisma client out of sync
**Solution**: Run `npx prisma generate`

**Issue**: Environment variables not updating
**Solution**: Redeploy after changing variables in Vercel

---

## Appendix

### Deployment Checklist

Before deploying to production:

- [ ] All tests passing
- [ ] Code reviewed and approved
- [ ] Tested on staging
- [ ] Database migrations tested
- [ ] Environment variables configured
- [ ] Monitoring alerts configured
- [ ] Rollback plan documented
- [ ] Team notified
- [ ] Documentation updated

### Rollback Checklist

When performing rollback:

- [ ] Identify last known good deployment
- [ ] Document reason for rollback
- [ ] Initiate rollback workflow
- [ ] Monitor rollback progress
- [ ] Verify service restoration
- [ ] Check health endpoints
- [ ] Monitor error rates
- [ ] Notify team
- [ ] Create incident report
- [ ] Schedule post-mortem

---

**Last Updated**: 2025-06-11
**Version**: 1.0
**Maintained By**: Engineering Team
