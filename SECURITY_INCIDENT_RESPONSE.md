# 🚨 SECURITY INCIDENT: Exposed Secrets in Git History

**Date:** 2024-12-04
**Severity:** CRITICAL
**Status:** IN PROGRESS

## Incident Summary

Production environment files (`.env.production`, `.env.production.new`) with real secrets were accidentally committed to the git repository.

### Exposed Credentials

The following secrets were exposed in commits:

- ❌ Database credentials (PostgreSQL password)
- ❌ Supabase JWT Secret
- ❌ Supabase Service Role Key
- ❌ Upstash Redis REST Token
- ❌ Database connection strings with embedded passwords

## Immediate Actions Taken

✅ **Step 1:** Updated `.gitignore` to prevent future commits of production env files
✅ **Step 2:** Removed `.env.production*` files from git index
⏳ **Step 3:** Rotate all exposed secrets (MUST BE DONE IMMEDIATELY)
⏳ **Step 4:** Clean git history

## 🔄 Secret Rotation Checklist

### 1. Supabase Database

**Actions Required:**

1. Go to [Supabase Dashboard](https://app.supabase.com) → Project: `oourhpreewjffmfzesoq`
2. Navigate to Settings → Database
3. Click "Reset Database Password"
4. Update `DATABASE_URL` and `DIRECT_URL` in Vercel environment variables
5. Update local `.env.local` (if exists)

**Impact:**

- ⚠️ All existing connections will be terminated
- ⚠️ Application will be down until Vercel env vars are updated (~2 minutes)

### 2. Supabase JWT Secret

**Actions Required:**

1. Go to Supabase Dashboard → Settings → API
2. Generate new JWT Secret
3. Update `SUPABASE_JWT_SECRET` in Vercel

**Impact:**

- ⚠️ All existing user sessions will be invalidated
- ⚠️ Users will need to re-login

### 3. Supabase Service Role Key

**Actions Required:**

1. Go to Supabase Dashboard → Settings → API
2. Click "Generate new service role key"
3. Update `SUPABASE_SERVICE_ROLE_KEY` in Vercel

**Impact:**

- ⚠️ Admin operations will fail until updated
- ⚠️ Server-side operations requiring elevated permissions will fail

### 4. Upstash Redis

**Actions Required:**

1. Go to [Upstash Console](https://console.upstash.com)
2. Navigate to your Redis instance: `obliging-chigger-37641`
3. Click "Reset REST Token"
4. Update `UPSTASH_REDIS_REST_TOKEN` in Vercel

**Impact:**

- ⚠️ Cache will be invalidated
- ⚠️ Rate limiting may temporarily fail (will fallback to memory)

## 🧹 Git History Cleanup

### Option 1: BFG Repo-Cleaner (Recommended)

```bash
# Install BFG
# Download from: https://rtyley.github.io/bfg-repo-cleaner/

# Backup first
cd affiliate-aggregator
git bundle create ../affiliate-aggregator-backup.bundle --all

# Clone a fresh copy
cd ..
git clone --mirror git@github.com:Vibecodium/affiliate-aggregator.git affiliate-aggregator-mirror

# Clean history
java -jar bfg.jar --delete-files .env.production affiliate-aggregator-mirror
java -jar bfg.jar --delete-files .env.production.new affiliate-aggregator-mirror

# Cleanup
cd affiliate-aggregator-mirror
git reflog expire --expire=now --all
git gc --prune=now --aggressive

# Push (WARNING: This rewrites history!)
git push --force
```

### Option 2: Git Filter-Branch

```bash
cd affiliate-aggregator

# Backup first
git bundle create ../affiliate-aggregator-backup.bundle --all

# Remove files from history
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch .env.production .env.production.new" \
  --prune-empty --tag-name-filter cat -- --all

# Cleanup
git reflog expire --expire=now --all
git gc --prune=now --aggressive

# Push (WARNING: This rewrites history!)
git push origin --force --all
git push origin --force --tags
```

### Post-Cleanup Actions

After cleaning git history:

1. **Notify all team members** to re-clone the repository:

   ```bash
   git clone git@github.com:Vibecodium/affiliate-aggregator.git affiliate-aggregator-new
   ```

2. **Update all local branches**:
   ```bash
   git fetch origin
   git reset --hard origin/main
   ```

## 📋 Update Checklist

### Vercel Environment Variables

Update the following in [Vercel Dashboard](https://vercel.com/vibecodium/affiliate-aggregator-five/settings/environment-variables):

- [ ] `DATABASE_URL`
- [ ] `DIRECT_URL`
- [ ] `POSTGRES_PASSWORD`
- [ ] `POSTGRES_URL`
- [ ] `POSTGRES_URL_NON_POOLING`
- [ ] `POSTGRES_PRISMA_URL`
- [ ] `SUPABASE_JWT_SECRET`
- [ ] `SUPABASE_SERVICE_ROLE_KEY`
- [ ] `UPSTASH_REDIS_REST_TOKEN`

After updating, trigger a new deployment:

```bash
vercel --prod
```

## 🔍 Monitoring

After rotation, monitor:

1. **Application health:**
   - https://affiliate-aggregator-five.vercel.app/api/health

2. **Error logs:**
   - Check Vercel deployment logs
   - Check Sentry error tracking

3. **Database connections:**
   - Monitor Supabase dashboard for connection errors

## 🛡️ Prevention Measures

To prevent future incidents:

1. ✅ Updated `.gitignore` with comprehensive patterns
2. ✅ Added pre-commit hooks (lint-staged)
3. 🔜 Enable GitHub secret scanning
4. 🔜 Add git-secrets or similar tool
5. 🔜 Implement environment variable validation in CI/CD
6. 🔜 Regular security audits

## 📝 Lessons Learned

1. **Never commit production environment files** - only templates
2. **Use environment variable services** - consider using Vercel's built-in secrets management
3. **Enable secret scanning** - GitHub Advanced Security or similar
4. **Regular security training** - ensure all team members understand security best practices
5. **Rotate secrets regularly** - implement a 90-day rotation policy

## References

- [GitHub Secret Scanning](https://docs.github.com/en/code-security/secret-scanning)
- [Git Filter-Branch](https://git-scm.com/docs/git-filter-branch)
- [BFG Repo-Cleaner](https://rtyley.github.io/bfg-repo-cleaner/)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)

---

**Last Updated:** 2024-12-04
**Next Review:** After all secrets are rotated and verified
