/**
 * Unit tests for data validation helpers
 */

describe('Data Validation', () => {
  describe('Number validation', () => {
    it('should validate positive numbers', () => {
      const isPositive = (n: number) => n > 0;

      expect(isPositive(10)).toBe(true);
      expect(isPositive(0)).toBe(false);
      expect(isPositive(-5)).toBe(false);
    });

    it('should validate number ranges', () => {
      const isInRange = (n: number, min: number, max: number) => {
        return n >= min && n <= max;
      };

      expect(isInRange(15, 10, 20)).toBe(true);
      expect(isInRange(5, 10, 20)).toBe(false);
      expect(isInRange(25, 10, 20)).toBe(false);
    });

    it('should validate percentages', () => {
      const isValidPercentage = (n: number) => n >= 0 && n <= 100;

      expect(isValidPercentage(50)).toBe(true);
      expect(isValidPercentage(0)).toBe(true);
      expect(isValidPercentage(100)).toBe(true);
      expect(isValidPercentage(101)).toBe(false);
      expect(isValidPercentage(-1)).toBe(false);
    });
  });

  describe('String validation', () => {
    it('should validate non-empty strings', () => {
      const isNonEmpty = (s: string) => s.trim().length > 0;

      expect(isNonEmpty('Hello')).toBe(true);
      expect(isNonEmpty('')).toBe(false);
      expect(isNonEmpty('   ')).toBe(false);
    });

    it('should validate string length', () => {
      const isValidLength = (s: string, min: number, max: number) => {
        return s.length >= min && s.length <= max;
      };

      expect(isValidLength('Test', 1, 10)).toBe(true);
      expect(isValidLength('Verylongstring', 1, 10)).toBe(false);
    });

    it('should validate alphanumeric strings', () => {
      const isAlphanumeric = (s: string) => /^[a-zA-Z0-9]+$/.test(s);

      expect(isAlphanumeric('Test123')).toBe(true);
      expect(isAlphanumeric('Test-123')).toBe(false);
      expect(isAlphanumeric('Test 123')).toBe(false);
    });
  });

  describe('Array validation', () => {
    it('should validate non-empty arrays', () => {
      const isNonEmpty = (arr: unknown[]) => Array.isArray(arr) && arr.length > 0;

      expect(isNonEmpty([1, 2, 3])).toBe(true);
      expect(isNonEmpty([])).toBe(false);
    });

    it('should validate array length', () => {
      const isValidLength = (arr: unknown[], min: number, max: number) => {
        return arr.length >= min && arr.length <= max;
      };

      expect(isValidLength([1, 2, 3], 1, 5)).toBe(true);
      expect(isValidLength([1, 2, 3], 5, 10)).toBe(false);
    });

    it('should validate array contains specific values', () => {
      const contains = (arr: unknown[], value: any) => arr.includes(value);

      expect(contains(['a', 'b', 'c'], 'b')).toBe(true);
      expect(contains(['a', 'b', 'c'], 'd')).toBe(false);
    });
  });

  describe('Object validation', () => {
    it('should validate required fields', () => {
      const hasRequiredFields = (obj: any, fields: string[]) => {
        return fields.every((field) => field in obj);
      };

      const obj = { name: 'Test', id: '123' };

      expect(hasRequiredFields(obj, ['name', 'id'])).toBe(true);
      expect(hasRequiredFields(obj, ['name', 'id', 'email'])).toBe(false);
    });

    it('should validate object not empty', () => {
      const isNonEmpty = (obj: object) => Object.keys(obj).length > 0;

      expect(isNonEmpty({ key: 'value' })).toBe(true);
      expect(isNonEmpty({})).toBe(false);
    });
  });

  describe('Date validation', () => {
    it('should validate date objects', () => {
      const isValidDate = (d: any) => d instanceof Date && !isNaN(d.getTime());

      expect(isValidDate(new Date())).toBe(true);
      expect(isValidDate(new Date('invalid'))).toBe(false);
      expect(isValidDate('2024-01-01')).toBe(false);
    });

    it('should validate ISO date strings', () => {
      const isISOString = (s: string) => {
        const d = new Date(s);
        return !isNaN(d.getTime()) && d.toISOString() === s;
      };

      const now = new Date().toISOString();

      expect(isISOString(now)).toBe(true);
      expect(isISOString('2024-01-01')).toBe(false);
      expect(isISOString('invalid')).toBe(false);
    });

    it('should validate date ranges', () => {
      const isValidDateRange = (start: Date, end: Date) => {
        return start <= end;
      };

      const yesterday = new Date(Date.now() - 86400000);
      const tomorrow = new Date(Date.now() + 86400000);

      expect(isValidDateRange(yesterday, tomorrow)).toBe(true);
      expect(isValidDateRange(tomorrow, yesterday)).toBe(false);
    });
  });

  describe('Enum validation', () => {
    it('should validate commission types', () => {
      const validTypes = ['CPA', 'CPS', 'CPL', 'CPC', 'Hybrid'];

      const isValidCommissionType = (type: string) => validTypes.includes(type);

      expect(isValidCommissionType('CPS')).toBe(true);
      expect(isValidCommissionType('Invalid')).toBe(false);
    });

    it('should validate user roles', () => {
      const validRoles = ['viewer', 'member', 'manager', 'admin', 'owner'];

      const isValidRole = (role: string) => validRoles.includes(role);

      expect(isValidRole('admin')).toBe(true);
      expect(isValidRole('superadmin')).toBe(false);
    });

    it('should validate subscription tiers', () => {
      const validTiers = ['free', 'pro', 'business', 'enterprise'];

      const isValidTier = (tier: string) => validTiers.includes(tier);

      expect(isValidTier('pro')).toBe(true);
      expect(isValidTier('premium')).toBe(false);
    });
  });

  describe('Currency and money validation', () => {
    it('should format currency', () => {
      const formatCurrency = (amount: number) => {
        return `$${amount.toFixed(2)}`;
      };

      expect(formatCurrency(100)).toBe('$100.00');
      expect(formatCurrency(99.5)).toBe('$99.50');
    });

    it('should parse currency string', () => {
      const parseCurrency = (str: string) => {
        return parseFloat(str.replace(/[$,]/g, ''));
      };

      expect(parseCurrency('$100.50')).toBe(100.5);
      expect(parseCurrency('$1,234.56')).toBe(1234.56);
    });

    it('should validate positive amounts', () => {
      const isValidAmount = (amount: number) => {
        return amount >= 0 && !isNaN(amount) && isFinite(amount);
      };

      expect(isValidAmount(100)).toBe(true);
      expect(isValidAmount(-10)).toBe(false);
      expect(isValidAmount(NaN)).toBe(false);
      expect(isValidAmount(Infinity)).toBe(false);
    });
  });
});
