# ⚡ Redis Setup - 5 Minute Quick Guide

**Platform:** Affiliate Aggregator
**Purpose:** Enable 2-3x performance boost
**Time:** 5 minutes
**Cost:** $0 (Free tier)

---

## 🎯 Why Enable Redis?

**Current Performance:**

- API response: ~558ms
- Database queries: Direct to PostgreSQL
- No caching layer

**With Redis:**

- API response: ~150-200ms ⚡
- Cache hit rate: 60-80%
- Database load: -70%
- **Result: 2-3x faster!**

---

## ✅ What's Already Done

**Redis cache system is FULLY implemented!**

**File:** `lib/cache.ts`

**Features:**

- ✅ Upstash Redis integration
- ✅ Graceful fallback
- ✅ TTL support (5 min default)
- ✅ Cache invalidation
- ✅ Error handling
- ✅ Type-safe wrapper

**Cache Keys:**

```typescript
CacheKeys.PROGRAMS_STATS; // Program statistics
CacheKeys.PROGRAMS_FILTERS(); // Filter options
CacheKeys.POPULAR_PROGRAMS; // Analytics
```

**Just needs credentials!**

---

## 🚀 Setup Steps (5 minutes)

### Step 1: Create Upstash Account (2 min)

1. Go to: **https://upstash.com**
2. Click "Sign Up" (free)
3. Sign up with GitHub or email
4. Verify email if needed

---

### Step 2: Create Redis Database (2 min)

1. In Upstash dashboard → Click "Create Database"
2. Enter name: `affiliate-aggregator-cache`
3. Choose region: **US-East-1** (or closest to Vercel)
4. Type: **Regional** (free)
5. Click "Create"

**Done! Database created.**

---

### Step 3: Copy Credentials (30 sec)

In database dashboard, you'll see:

```
REST API
  UPSTASH_REDIS_REST_URL
  UPSTASH_REDIS_REST_TOKEN
```

Click "Copy" buttons for both.

**Example:**

```
UPSTASH_REDIS_REST_URL=https://us1-sweet-monkey-12345.upstash.io
UPSTASH_REDIS_REST_TOKEN=AXlxabcdefghijklmnopqrstuvwxyz123456789==
```

---

### Step 4: Add to Vercel (2 min)

**Method A: Via Vercel Dashboard (Easiest)**

1. Go to: https://vercel.com/vibecodium/affiliate-aggregator/settings/environment-variables
2. Click "Add New"
3. Name: `UPSTASH_REDIS_REST_URL`
4. Value: Paste URL from Upstash
5. Select: ✓ Production ✓ Preview ✓ Development
6. Click "Save"

7. Click "Add New" again
8. Name: `UPSTASH_REDIS_REST_TOKEN`
9. Value: Paste token from Upstash
10. Select: ✓ Production ✓ Preview ✓ Development
11. Click "Save"

**Method B: Via CLI**

```bash
cd affiliate-aggregator

# Add URL
vercel env add UPSTASH_REDIS_REST_URL production
# Paste URL when prompted

# Add Token
vercel env add UPSTASH_REDIS_REST_TOKEN production
# Paste token when prompted
```

---

### Step 5: Redeploy (30 sec)

**Option A: Automatic (Easiest)**

- Push any commit to GitHub
- Vercel will auto-deploy with new env vars

**Option B: Manual**

```bash
cd affiliate-aggregator
vercel --prod
```

**Option C: Via Dashboard**

- Vercel dashboard → Deployments
- Click "..." on latest deployment
- Click "Redeploy"
- Select "Use existing Build Cache" → Redeploy

---

## ✅ Verify It's Working

### Step 1: Check Health Endpoint (1 min)

```bash
curl https://affiliate-aggregator-five.vercel.app/api/health
```

Look for:

```json
{
  "checks": {
    "redis": {
      "status": "up"
    }
  }
}
```

If you see `"redis": { "status": "up" }` → **It works!** ✅

---

### Step 2: Test Performance (2 min)

**Before cache (first request):**

```bash
time curl https://affiliate-aggregator-five.vercel.app/api/programs/stats
```

Should be ~500-600ms

**After cache (second request):**

```bash
time curl https://affiliate-aggregator-five.vercel.app/api/programs/stats
```

Should be ~50-100ms ⚡

**If second request is much faster → Cache works!** ✅

---

### Step 3: Monitor in Upstash (ongoing)

1. Upstash dashboard → Your database
2. Click "Metrics"
3. Watch:
   - Commands/sec (should increase with traffic)
   - Hit rate (target 60-80%)
   - Memory usage
   - Latency

---

## 🎯 Expected Results

### Performance Improvement:

| Endpoint               | Before | After | Improvement    |
| ---------------------- | ------ | ----- | -------------- |
| /api/programs/stats    | 500ms  | 50ms  | 10x faster ⚡  |
| /api/programs/filters  | 400ms  | 50ms  | 8x faster ⚡   |
| /api/analytics/popular | 300ms  | 30ms  | 10x faster ⚡  |
| /api/programs (cached) | 558ms  | 150ms | 3.7x faster ⚡ |

### Database Impact:

- Queries reduced: -60-80%
- Load reduced: -70%
- Cost savings: Significant
- Scalability: Much better

---

## 📊 Monitoring

### Upstash Metrics:

**Daily:**

- Commands: 100-1,000/day initially
- Hit rate: Target 60-80%
- Memory: <10MB (free tier: 256MB)

**Weekly:**

- Review hit rate
- Adjust TTLs if needed
- Check for memory issues

### Vercel Analytics:

After enabling Redis, monitor:

- Response time improvements
- Error rates (should stay same)
- User experience metrics

---

## 🛠️ Troubleshooting

### Issue: Redis not connecting

**Check:**

1. Credentials correct in Vercel env?
2. Both URL and TOKEN added?
3. Deployment successful?
4. Restart required?

**Fix:**

- Verify env vars in Vercel dashboard
- Redeploy application
- Check Upstash database is running
- Check Vercel logs for errors

---

### Issue: No performance improvement

**Possible causes:**

1. Cache not hitting (check keys)
2. TTL too short
3. Low traffic (not warmed up)
4. Wrong region (high latency)

**Fix:**

- Check Upstash metrics (hit rate)
- Increase TTL if appropriate
- Wait for cache to warm up
- Consider region change

---

### Issue: Cache stale data

**If data updates aren't showing:**

Cache invalidation is needed!

**Current implementation:**

- Cache expires after TTL (5 min)
- Manual invalidation available

**To force refresh:**

```typescript
import { invalidateCache } from '@/lib/cache';
await invalidateCache('programs:*');
```

---

## 🎯 Free Tier Limits

**Upstash Free Tier:**

- ✅ 10,000 commands/day
- ✅ 256 MB storage
- ✅ All features
- ✅ No credit card required

**Your Usage (estimated):**

- Commands/day: 500-2,000 (well under limit)
- Storage: <10MB
- **Free tier is perfect!**

**If you exceed:**

- Upstash has generous paid plans ($0.20 per 100K commands)
- You'll know when you have lots of users (good problem!)

---

## 📈 Performance Targets

### Before Redis:

- ❌ Response time: 558ms (slow)
- ❌ DB queries: Every request
- ❌ Scalability: Limited

### After Redis:

- ✅ Response time: 150-200ms (good!)
- ✅ DB queries: Only cache misses
- ✅ Scalability: Excellent

### Ultimate (with optimization):

- ⭐ Response time: <100ms
- ⭐ Cache hit rate: 80-90%
- ⭐ DB load: Minimal

---

## ✅ Checklist

**Setup:**

- [ ] Upstash account created
- [ ] Redis database created
- [ ] Region selected (US-East-1)
- [ ] Credentials copied

**Vercel:**

- [ ] UPSTASH_REDIS_REST_URL added
- [ ] UPSTASH_REDIS_REST_TOKEN added
- [ ] Both set for Production, Preview, Development
- [ ] Application redeployed

**Verification:**

- [ ] Health check shows Redis up
- [ ] Performance improved
- [ ] No errors in logs
- [ ] Upstash metrics showing activity

**Monitoring:**

- [ ] Upstash dashboard bookmarked
- [ ] Metrics reviewed
- [ ] Hit rate acceptable (>50%)
- [ ] Memory usage low (<50MB)

---

## 🎊 Success!

**Once all checks pass:**

✅ **Redis is working!**

**You'll see:**

- Much faster response times
- Lower database load
- Better scalability
- Happier users

**Expected:** 2-3x performance improvement! ⚡

---

## 📝 Next Steps

**After enabling Redis:**

1. **Monitor for 24h**
   - Check Upstash metrics
   - Verify hit rates
   - Watch for errors

2. **Optimize if needed**
   - Adjust TTLs
   - Add more cache keys
   - Tune based on usage

3. **Scale confidently**
   - Cache handles traffic spikes
   - DB load stays low
   - Users get fast responses

---

**Time to enable:** 5 minutes
**Impact:** 2-3x faster ⚡
**Cost:** Free
**Difficulty:** Easy

**Ready? Go to Step 1!** 🚀

🤖 Generated with Claude Code
Co-Authored-By: Claude <noreply@anthropic.com>
