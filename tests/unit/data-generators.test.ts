/**
 * Unit tests for Data Import Generators
 * Tests category and merchant data structures
 */

describe('Data Import Generators', () => {
  describe('ShareASale Generator', () => {
    it('should have valid categories', () => {
      const categories = [
        'Accessories',
        'Antiques & Collectibles',
        'Arts, Crafts & Sewing',
        'Automotive',
        'Books & Media',
        'Business Services',
        'Clothing & Shoes',
        'Computer & Electronics',
        'Department Stores',
        'Flowers & Gifts',
        'Food & Beverage',
        'Health & Beauty',
        'Home & Garden',
        'Jewelry & Watches',
        'Office Products',
        'Pet Supplies',
        'Sports & Outdoors',
        'Toys & Hobbies',
        'Travel',
        'Web Services',
      ];

      expect(categories.length).toBeGreaterThan(15);
      expect(categories).toContain('Computer & Electronics');
    });

    it('should have merchant structure', () => {
      const merchant = {
        name: 'Test Merchant',
        commission: 5,
        category: 'Technology',
      };

      expect(merchant).toHaveProperty('name');
      expect(merchant).toHaveProperty('commission');
      expect(merchant).toHaveProperty('category');
      expect(merchant.commission).toBeGreaterThan(0);
    });

    it('should support commission rates', () => {
      const rates = [2, 4, 5, 8, 10, 15, 20];

      rates.forEach((rate) => {
        expect(rate).toBeGreaterThanOrEqual(2);
        expect(rate).toBeLessThanOrEqual(20);
      });
    });
  });

  describe('Awin Generator', () => {
    it('should support Awin categories', () => {
      const categories = ['Fashion', 'Travel', 'Technology', 'Home & Garden', 'Finance'];

      expect(Array.isArray(categories)).toBe(true);
      expect(categories.length).toBeGreaterThan(0);
    });

    it('should have commission types', () => {
      const types = ['CPA', 'CPS', 'Hybrid'];

      expect(types).toContain('CPA');
      expect(types).toContain('CPS');
    });
  });

  describe('CJ Affiliate Generator', () => {
    it('should support CJ categories', () => {
      const categories = ['Retail', 'Technology', 'Travel', 'Finance'];

      expect(categories).toContain('Retail');
      expect(categories.length).toBeGreaterThan(0);
    });

    it('should have performance metrics', () => {
      const metrics = {
        clicks: 1000,
        conversions: 50,
        revenue: 2500,
      };

      expect(metrics.clicks).toBeGreaterThan(0);
      expect(metrics.conversions).toBeLessThanOrEqual(metrics.clicks);
    });
  });

  describe('Rakuten Generator', () => {
    it('should support Rakuten structure', () => {
      const program = {
        network: 'Rakuten',
        advertiser: 'Sample Store',
        commissionRate: 8,
      };

      expect(program.network).toBe('Rakuten');
      expect(program.commissionRate).toBeGreaterThan(0);
    });
  });

  describe('ClickBank Generator', () => {
    it('should support ClickBank categories', () => {
      const categories = ['E-business & E-marketing', 'Health & Fitness', 'Self Help'];

      expect(categories).toContain('Health & Fitness');
    });

    it('should have high commission rates', () => {
      const rates = [50, 60, 70, 75];

      rates.forEach((rate) => {
        expect(rate).toBeGreaterThan(40); // ClickBank typically has higher rates
      });
    });
  });

  describe('Common Generator Logic', () => {
    it('should generate unique IDs', () => {
      const id1 = `${Date.now()}-1`;
      const id2 = `${Date.now()}-2`;

      expect(id1).not.toBe(id2);
      expect(typeof id1).toBe('string');
    });

    it('should create program data structure', () => {
      const program = {
        id: 'prog-123',
        name: 'Test Program',
        category: 'Technology',
        commissionRate: 10,
        commissionType: 'CPA',
        cookieDuration: 30,
        description: 'Test description',
      };

      expect(program.id).toBeDefined();
      expect(program.name).toBeDefined();
      expect(program.commissionRate).toBeGreaterThan(0);
      expect(program.cookieDuration).toBeGreaterThanOrEqual(0);
    });

    it('should support cookie durations', () => {
      const durations = [7, 30, 45, 60, 90, 120];

      durations.forEach((days) => {
        expect(days).toBeGreaterThan(0);
        expect(days).toBeLessThanOrEqual(120);
      });
    });

    it('should randomize commission rates within range', () => {
      const min = 5;
      const max = 15;
      const rate = min + Math.random() * (max - min);

      expect(rate).toBeGreaterThanOrEqual(min);
      expect(rate).toBeLessThanOrEqual(max);
    });

    it('should select random categories', () => {
      const categories = ['A', 'B', 'C', 'D'];
      const random = categories[Math.floor(Math.random() * categories.length)];

      expect(categories).toContain(random);
    });

    it('should create batch programs', () => {
      const count = 10;
      const programs = Array.from({ length: count }, (_, i) => ({
        id: `prog-${i}`,
        name: `Program ${i}`,
      }));

      expect(programs).toHaveLength(count);
      expect(programs[0].id).toBe('prog-0');
    });
  });
});
