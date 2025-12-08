/**
 * Data Import Generators Tests
 */

import { generateAwinData } from '@/lib/data-import/generators/awin';
import { generateClickBankData } from '@/lib/data-import/generators/clickbank';
import { generateShareASaleData } from '@/lib/data-import/generators/sharesale';
import { generateCJAffiliateData } from '@/lib/data-import/generators/cj-affiliate';
import { generateRakutenData } from '@/lib/data-import/generators/rakuten';
import type { NetworkImportConfig, NetworkProgramData } from '@/lib/data-import/types';

describe('Data Import Generators', () => {
  // Helper to validate program structure
  const validateProgram = (program: NetworkProgramData, networkPrefix: string) => {
    expect(program.externalId).toBeDefined();
    expect(program.externalId).toMatch(new RegExp(`^${networkPrefix}\\d+$`));
    expect(program.name).toBeDefined();
    expect(typeof program.name).toBe('string');
    expect(program.name.length).toBeGreaterThan(0);
    expect(program.category).toBeDefined();
    expect(program.commissionRate).toBeDefined();
    expect(program.commissionRate).toBeGreaterThanOrEqual(0);
    expect(program.commissionType).toBeDefined();
    expect(program.cookieDuration).toBeDefined();
    expect(program.cookieDuration).toBeGreaterThan(0);
    expect(program.paymentThreshold).toBeDefined();
    expect(program.paymentMethods).toBeDefined();
    expect(Array.isArray(program.paymentMethods)).toBe(true);
    expect(program.geoTargeting).toBeDefined();
    expect(Array.isArray(program.geoTargeting)).toBe(true);
    expect(typeof program.verified).toBe('boolean');
    expect(typeof program.featured).toBe('boolean');
    expect(typeof program.popularity).toBe('number');
  };

  // Helper to validate config structure
  const validateConfig = (config: NetworkImportConfig, expectedName: string) => {
    expect(config.networkName).toBe(expectedName);
    expect(config.networkDescription).toBeDefined();
    expect(config.networkWebsite).toBeDefined();
    expect(config.networkCountry).toBeDefined();
    expect(config.dataSource).toBe('scraper');
    expect(Array.isArray(config.programs)).toBe(true);
  };

  describe('generateAwinData', () => {
    it('generates default 18000 programs', () => {
      const config = generateAwinData();
      expect(config.programs.length).toBe(18000);
    });

    it('generates custom count of programs', () => {
      const config = generateAwinData(100);
      expect(config.programs.length).toBe(100);
    });

    it('generates valid network config', () => {
      const config = generateAwinData(10);
      validateConfig(config, 'Awin');
      expect(config.networkCountry).toBe('GB');
    });

    it('generates valid programs with AWIN prefix', () => {
      const config = generateAwinData(10);
      config.programs.forEach((program) => {
        validateProgram(program, 'AWIN');
      });
    });

    it('generates programs with correct externalId format', () => {
      const config = generateAwinData(10);
      expect(config.programs[0].externalId).toBe('AWIN000001');
      expect(config.programs[9].externalId).toBe('AWIN000010');
    });

    it('generates programs with commission rate 5-25%', () => {
      const config = generateAwinData(100);
      config.programs.forEach((program) => {
        expect(program.commissionRate).toBeGreaterThanOrEqual(5);
        expect(program.commissionRate).toBeLessThanOrEqual(25);
      });
    });

    it('generates programs with cookie duration 30-90 days', () => {
      const config = generateAwinData(100);
      config.programs.forEach((program) => {
        expect(program.cookieDuration).toBeGreaterThanOrEqual(30);
        expect(program.cookieDuration).toBeLessThanOrEqual(90);
      });
    });

    it('marks first 1000 programs as verified', () => {
      const config = generateAwinData(1100);
      for (let i = 0; i < 1000; i++) {
        expect(config.programs[i].verified).toBe(true);
      }
      expect(config.programs[1000].verified).toBe(false);
    });

    it('marks first 80 programs as featured', () => {
      const config = generateAwinData(100);
      for (let i = 0; i < 80; i++) {
        expect(config.programs[i].featured).toBe(true);
      }
      expect(config.programs[80].featured).toBe(false);
    });

    it('includes multiple geo targets', () => {
      const config = generateAwinData(1);
      expect(config.programs[0].geoTargeting).toContain('US');
      expect(config.programs[0].geoTargeting).toContain('GB');
      expect(config.programs[0].geoTargeting).toContain('DE');
    });

    it('includes multiple languages', () => {
      const config = generateAwinData(1);
      expect(config.programs[0].language).toContain('en');
      expect(config.programs[0].language).toContain('de');
      expect(config.programs[0].language).toContain('fr');
    });
  });

  describe('generateClickBankData', () => {
    it('generates default 10000 programs', () => {
      const config = generateClickBankData();
      expect(config.programs.length).toBe(10000);
    });

    it('generates custom count of programs', () => {
      const config = generateClickBankData(50);
      expect(config.programs.length).toBe(50);
    });

    it('generates valid network config', () => {
      const config = generateClickBankData(10);
      validateConfig(config, 'ClickBank');
      expect(config.networkCountry).toBe('US');
    });

    it('generates valid programs with CB prefix', () => {
      const config = generateClickBankData(10);
      config.programs.forEach((program) => {
        validateProgram(program, 'CB');
      });
    });

    it('generates programs with commission rate 40-75%', () => {
      const config = generateClickBankData(100);
      config.programs.forEach((program) => {
        expect(program.commissionRate).toBeGreaterThanOrEqual(40);
        expect(program.commissionRate).toBeLessThanOrEqual(75);
      });
    });

    it('has 60 day cookie duration', () => {
      const config = generateClickBankData(10);
      config.programs.forEach((program) => {
        expect(program.cookieDuration).toBe(60);
      });
    });

    it('marks first 100 programs as featured', () => {
      const config = generateClickBankData(150);
      for (let i = 0; i < 100; i++) {
        expect(config.programs[i].featured).toBe(true);
      }
      expect(config.programs[100].featured).toBe(false);
    });

    it('marks all programs as verified', () => {
      const config = generateClickBankData(50);
      config.programs.forEach((program) => {
        expect(program.verified).toBe(true);
      });
    });

    it('generates programs with EPC values', () => {
      const config = generateClickBankData(10);
      config.programs.forEach((program) => {
        expect(program.epc).toBeDefined();
        expect(program.epc).toBeGreaterThan(0);
      });
    });

    it('generates programs with average earnings $50-$500', () => {
      const config = generateClickBankData(100);
      config.programs.forEach((program) => {
        expect(program.averageEarnings).toBeGreaterThanOrEqual(50);
        expect(program.averageEarnings).toBeLessThanOrEqual(500);
      });
    });
  });

  describe('generateShareASaleData', () => {
    it('generates default 25000 programs', () => {
      const config = generateShareASaleData();
      expect(config.programs.length).toBe(25000);
    });

    it('generates custom count of programs', () => {
      const config = generateShareASaleData(75);
      expect(config.programs.length).toBe(75);
    });

    it('generates valid network config', () => {
      const config = generateShareASaleData(10);
      validateConfig(config, 'ShareASale');
      expect(config.networkCountry).toBe('US');
    });

    it('generates valid programs with SSA prefix', () => {
      const config = generateShareASaleData(10);
      config.programs.forEach((program) => {
        validateProgram(program, 'SSA');
      });
    });

    it('generates programs with commission rate 4-50%', () => {
      const config = generateShareASaleData(100);
      config.programs.forEach((program) => {
        expect(program.commissionRate).toBeGreaterThanOrEqual(4);
        expect(program.commissionRate).toBeLessThanOrEqual(50);
      });
    });

    it('generates programs with cookie duration 30-90 days', () => {
      const config = generateShareASaleData(100);
      config.programs.forEach((program) => {
        expect(program.cookieDuration).toBeGreaterThanOrEqual(30);
        expect(program.cookieDuration).toBeLessThanOrEqual(90);
      });
    });

    it('has $50 payment threshold', () => {
      const config = generateShareASaleData(10);
      config.programs.forEach((program) => {
        expect(program.paymentThreshold).toBe(50);
      });
    });

    it('marks first 1000 programs as verified', () => {
      const config = generateShareASaleData(1100);
      for (let i = 0; i < 1000; i++) {
        expect(config.programs[i].verified).toBe(true);
      }
      expect(config.programs[1000].verified).toBe(false);
    });

    it('marks first 50 programs as featured', () => {
      const config = generateShareASaleData(100);
      for (let i = 0; i < 50; i++) {
        expect(config.programs[i].featured).toBe(true);
      }
      expect(config.programs[50].featured).toBe(false);
    });
  });

  describe('generateCJAffiliateData', () => {
    it('generates default 15000 programs', () => {
      const config = generateCJAffiliateData();
      expect(config.programs.length).toBe(15000);
    });

    it('generates custom count of programs', () => {
      const config = generateCJAffiliateData(30);
      expect(config.programs.length).toBe(30);
    });

    it('generates valid network config', () => {
      const config = generateCJAffiliateData(10);
      validateConfig(config, 'CJ Affiliate');
      expect(config.networkCountry).toBe('US');
    });

    it('generates valid programs with CJ prefix', () => {
      const config = generateCJAffiliateData(10);
      config.programs.forEach((program) => {
        validateProgram(program, 'CJ');
      });
    });

    it('generates programs with reasonable commission rates', () => {
      const config = generateCJAffiliateData(100);
      config.programs.forEach((program) => {
        expect(program.commissionRate).toBeGreaterThanOrEqual(0);
        expect(program.commissionRate).toBeLessThanOrEqual(100);
      });
    });

    it('generates programs with EPC values', () => {
      const config = generateCJAffiliateData(10);
      config.programs.forEach((program) => {
        expect(program.epc).toBeDefined();
        expect(program.epc).toBeGreaterThan(0);
      });
    });
  });

  describe('generateRakutenData', () => {
    it('generates default 12000 programs', () => {
      const config = generateRakutenData();
      expect(config.programs.length).toBe(12000);
    });

    it('generates custom count of programs', () => {
      const config = generateRakutenData(25);
      expect(config.programs.length).toBe(25);
    });

    it('generates valid network config', () => {
      const config = generateRakutenData(10);
      validateConfig(config, 'Rakuten Advertising');
    });

    it('generates valid programs with RAK prefix', () => {
      const config = generateRakutenData(10);
      config.programs.forEach((program) => {
        validateProgram(program, 'RAK');
      });
    });

    it('generates programs with reasonable commission rates', () => {
      const config = generateRakutenData(100);
      config.programs.forEach((program) => {
        expect(program.commissionRate).toBeGreaterThanOrEqual(0);
        expect(program.commissionRate).toBeLessThanOrEqual(100);
      });
    });
  });

  describe('Program Data Structure', () => {
    it('all generators produce NetworkImportConfig structure', () => {
      const awin = generateAwinData(1);
      const clickbank = generateClickBankData(1);
      const sharesale = generateShareASaleData(1);
      const cj = generateCJAffiliateData(1);
      const rakuten = generateRakutenData(1);

      [awin, clickbank, sharesale, cj, rakuten].forEach((config) => {
        expect(config).toHaveProperty('networkName');
        expect(config).toHaveProperty('networkDescription');
        expect(config).toHaveProperty('networkWebsite');
        expect(config).toHaveProperty('networkCountry');
        expect(config).toHaveProperty('dataSource');
        expect(config).toHaveProperty('programs');
      });
    });

    it('all programs have required fields', () => {
      const configs = [
        generateAwinData(5),
        generateClickBankData(5),
        generateShareASaleData(5),
        generateCJAffiliateData(5),
        generateRakutenData(5),
      ];

      configs.forEach((config) => {
        config.programs.forEach((program) => {
          expect(program.externalId).toBeDefined();
          expect(program.name).toBeDefined();
          expect(program.commissionRate).toBeDefined();
          expect(program.commissionType).toBeDefined();
        });
      });
    });

    it('generates unique external IDs within network', () => {
      const config = generateClickBankData(100);
      const ids = config.programs.map((p) => p.externalId);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    it('decreasing popularity for later programs', () => {
      const config = generateAwinData(100);
      // First program should have higher popularity than last
      expect(config.programs[0].popularity).toBeGreaterThan(config.programs[99].popularity!);
    });
  });

  describe('Edge Cases', () => {
    it('generates 0 programs when count is 0', () => {
      const config = generateAwinData(0);
      expect(config.programs.length).toBe(0);
    });

    it('generates 1 program when count is 1', () => {
      const config = generateClickBankData(1);
      expect(config.programs.length).toBe(1);
    });

    it('handles large counts', () => {
      const config = generateShareASaleData(1000);
      expect(config.programs.length).toBe(1000);
    });
  });
});
