/**
 * Unit tests for feature gating system
 */

import { TIER_LIMITS } from '@/lib/billing/feature-gates';

describe('Feature Gates', () => {
  describe('TIER_LIMITS', () => {
    it('should have all tiers defined', () => {
      expect(TIER_LIMITS).toHaveProperty('free');
      expect(TIER_LIMITS).toHaveProperty('pro');
      expect(TIER_LIMITS).toHaveProperty('business');
      expect(TIER_LIMITS).toHaveProperty('enterprise');
    });

    it('should have consistent feature keys across tiers', () => {
      const freeKeys = Object.keys(TIER_LIMITS.free).sort();
      const proKeys = Object.keys(TIER_LIMITS.pro).sort();
      const businessKeys = Object.keys(TIER_LIMITS.business).sort();
      const enterpriseKeys = Object.keys(TIER_LIMITS.enterprise).sort();

      expect(proKeys).toEqual(freeKeys);
      expect(businessKeys).toEqual(freeKeys);
      expect(enterpriseKeys).toEqual(freeKeys);
    });

    describe('free tier', () => {
      it('should have limited favorites', () => {
        expect(TIER_LIMITS.free.favorites).toBe(5);
      });

      it('should have limited comparisons', () => {
        expect(TIER_LIMITS.free.comparisons_daily).toBe(3);
      });

      it('should have no saved searches', () => {
        expect(TIER_LIMITS.free.saved_searches).toBe(0);
      });

      it('should not allow reviews', () => {
        expect(TIER_LIMITS.free.can_write_reviews).toBe(false);
      });

      it('should not allow export', () => {
        expect(TIER_LIMITS.free.can_export).toBe(false);
      });

      it('should not allow analytics', () => {
        expect(TIER_LIMITS.free.can_access_analytics).toBe(false);
      });

      it('should not allow API access', () => {
        expect(TIER_LIMITS.free.can_use_api).toBe(false);
      });

      it('should allow 1 team member', () => {
        expect(TIER_LIMITS.free.team_members).toBe(1);
      });
    });

    describe('pro tier', () => {
      it('should have unlimited favorites', () => {
        expect(TIER_LIMITS.pro.favorites).toBe(Infinity);
      });

      it('should have unlimited comparisons', () => {
        expect(TIER_LIMITS.pro.comparisons_daily).toBe(Infinity);
      });

      it('should allow 10 saved searches', () => {
        expect(TIER_LIMITS.pro.saved_searches).toBe(10);
      });

      it('should allow reviews', () => {
        expect(TIER_LIMITS.pro.can_write_reviews).toBe(true);
      });

      it('should allow export', () => {
        expect(TIER_LIMITS.pro.can_export).toBe(true);
      });

      it('should allow analytics', () => {
        expect(TIER_LIMITS.pro.can_access_analytics).toBe(true);
      });

      it('should not allow API', () => {
        expect(TIER_LIMITS.pro.can_use_api).toBe(false);
      });
    });

    describe('business tier', () => {
      it('should have unlimited saved searches', () => {
        expect(TIER_LIMITS.business.saved_searches).toBe(Infinity);
      });

      it('should allow API access', () => {
        expect(TIER_LIMITS.business.can_use_api).toBe(true);
      });

      it('should have API call limit', () => {
        expect(TIER_LIMITS.business.api_calls_monthly).toBe(10000);
      });

      it('should allow 5 team members', () => {
        expect(TIER_LIMITS.business.team_members).toBe(5);
      });

      it('should have all pro features', () => {
        expect(TIER_LIMITS.business.can_write_reviews).toBe(true);
        expect(TIER_LIMITS.business.can_export).toBe(true);
        expect(TIER_LIMITS.business.can_access_analytics).toBe(true);
      });
    });

    describe('enterprise tier', () => {
      it('should have unlimited everything', () => {
        expect(TIER_LIMITS.enterprise.favorites).toBe(Infinity);
        expect(TIER_LIMITS.enterprise.comparisons_daily).toBe(Infinity);
        expect(TIER_LIMITS.enterprise.saved_searches).toBe(Infinity);
        expect(TIER_LIMITS.enterprise.applications).toBe(Infinity);
        expect(TIER_LIMITS.enterprise.api_calls_monthly).toBe(Infinity);
        expect(TIER_LIMITS.enterprise.team_members).toBe(Infinity);
      });

      it('should have all features enabled', () => {
        expect(TIER_LIMITS.enterprise.can_write_reviews).toBe(true);
        expect(TIER_LIMITS.enterprise.can_export).toBe(true);
        expect(TIER_LIMITS.enterprise.can_access_analytics).toBe(true);
        expect(TIER_LIMITS.enterprise.can_use_api).toBe(true);
      });
    });

    describe('tier progression', () => {
      it('should have increasing limits from free to enterprise', () => {
        expect(TIER_LIMITS.free.favorites).toBeLessThan(TIER_LIMITS.pro.favorites);
        expect(TIER_LIMITS.free.comparisons_daily).toBeLessThan(TIER_LIMITS.pro.comparisons_daily);
        expect(TIER_LIMITS.free.saved_searches).toBeLessThan(TIER_LIMITS.pro.saved_searches);
      });

      it('should have more features in higher tiers', () => {
        const freeFeatures = Object.values(TIER_LIMITS.free).filter((v) => v === true).length;
        const proFeatures = Object.values(TIER_LIMITS.pro).filter((v) => v === true).length;
        const businessFeatures = Object.values(TIER_LIMITS.business).filter(
          (v) => v === true
        ).length;

        expect(proFeatures).toBeGreaterThan(freeFeatures);
        expect(businessFeatures).toBeGreaterThanOrEqual(proFeatures);
      });
    });
  });
});
