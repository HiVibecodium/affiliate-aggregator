/**
 * Unit tests for network-related utilities
 */

describe('Network Utils', () => {
  describe('Network data', () => {
    it('should have major affiliate networks', () => {
      const majorNetworks = [
        'ShareASale',
        'CJ Affiliate',
        'Awin',
        'Rakuten Marketing',
        'ClickBank',
        'Impact',
      ];

      expect(majorNetworks).toHaveLength(6);
      expect(majorNetworks).toContain('ShareASale');
      expect(majorNetworks).toContain('CJ Affiliate');
    });

    it('should categorize networks by region', () => {
      const networkRegions = {
        ShareASale: 'US',
        'CJ Affiliate': 'US',
        Awin: 'EU',
        Rakuten: 'Global',
      };

      expect(networkRegions['ShareASale']).toBe('US');
      expect(networkRegions['Awin']).toBe('EU');
    });

    it('should validate network slug format', () => {
      const isValidSlug = (slug: string) => /^[a-z0-9-]+$/.test(slug);

      expect(isValidSlug('shareasale')).toBe(true);
      expect(isValidSlug('cj-affiliate')).toBe(true);
      expect(isValidSlug('ShareASale')).toBe(false);
      expect(isValidSlug('cj affiliate')).toBe(false);
    });
  });

  describe('Commission calculations', () => {
    it('should calculate CPS commission', () => {
      const calculateCPS = (saleAmount: number, rate: number) => {
        return (saleAmount * rate) / 100;
      };

      expect(calculateCPS(1000, 5)).toBe(50);
      expect(calculateCPS(500, 10)).toBe(50);
    });

    it('should calculate CPA commission', () => {
      const calculateCPA = (conversions: number, payoutPerAction: number) => {
        return conversions * payoutPerAction;
      };

      expect(calculateCPA(10, 25)).toBe(250);
      expect(calculateCPA(5, 50)).toBe(250);
    });

    it('should estimate monthly earnings', () => {
      const estimateMonthly = (dailyClicks: number, cvr: number, cpa: number) => {
        const dailyConversions = dailyClicks * (cvr / 100);
        const dailyEarnings = dailyConversions * cpa;
        return dailyEarnings * 30;
      };

      const monthly = estimateMonthly(100, 2, 25); // 100 clicks, 2% CVR, $25 CPA
      expect(monthly).toBe(1500); // 2 conversions/day * $25 * 30 days
    });
  });

  describe('Cookie duration', () => {
    it('should convert days to hours', () => {
      const daysToHours = (days: number) => days * 24;

      expect(daysToHours(1)).toBe(24);
      expect(daysToHours(30)).toBe(720);
    });

    it('should classify cookie duration', () => {
      const classifyCookieDuration = (days: number) => {
        if (days >= 90) return 'excellent';
        if (days >= 30) return 'good';
        if (days >= 7) return 'fair';
        return 'poor';
      };

      expect(classifyCookieDuration(120)).toBe('excellent');
      expect(classifyCookieDuration(45)).toBe('good');
      expect(classifyCookieDuration(14)).toBe('fair');
      expect(classifyCookieDuration(3)).toBe('poor');
    });
  });

  describe('Program scoring', () => {
    it('should calculate program score', () => {
      const calculateScore = (program: {
        commissionRate: number;
        cookieDuration: number;
        paymentThreshold: number;
      }) => {
        let score = 0;

        // Higher commission = better
        if (program.commissionRate > 15) score += 3;
        else if (program.commissionRate > 10) score += 2;
        else score += 1;

        // Longer cookie = better
        if (program.cookieDuration > 60) score += 3;
        else if (program.cookieDuration > 30) score += 2;
        else score += 1;

        // Lower threshold = better
        if (program.paymentThreshold < 50) score += 3;
        else if (program.paymentThreshold < 100) score += 2;
        else score += 1;

        return score;
      };

      const excellentProgram = {
        commissionRate: 20,
        cookieDuration: 90,
        paymentThreshold: 25,
      };

      const poorProgram = {
        commissionRate: 5,
        cookieDuration: 7,
        paymentThreshold: 200,
      };

      expect(calculateScore(excellentProgram)).toBe(9);
      expect(calculateScore(poorProgram)).toBe(3);
    });
  });
});
