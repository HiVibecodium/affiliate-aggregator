/**
 * Unit tests for formatting utilities
 */

describe('Formatting Utils', () => {
  describe('Number formatting', () => {
    it('should format numbers with commas', () => {
      const formatNumber = (n: number) => n.toLocaleString('en-US');

      expect(formatNumber(1000)).toBe('1,000');
      expect(formatNumber(1000000)).toBe('1,000,000');
      expect(formatNumber(999)).toBe('999');
    });

    it('should format currency', () => {
      const formatCurrency = (amount: number, currency: string = 'USD') => {
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency,
        }).format(amount);
      };

      expect(formatCurrency(100)).toBe('$100.00');
      expect(formatCurrency(1234.56)).toBe('$1,234.56');
    });

    it('should format percentages', () => {
      const formatPercentage = (value: number, decimals: number = 1) => {
        return `${value.toFixed(decimals)}%`;
      };

      expect(formatPercentage(15.5)).toBe('15.5%');
      expect(formatPercentage(100, 0)).toBe('100%');
      expect(formatPercentage(3.14159, 2)).toBe('3.14%');
    });

    it('should format large numbers with abbreviations', () => {
      const formatLargeNumber = (n: number) => {
        if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
        if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
        return n.toString();
      };

      expect(formatLargeNumber(1500)).toBe('1.5K');
      expect(formatLargeNumber(2500000)).toBe('2.5M');
      expect(formatLargeNumber(999)).toBe('999');
    });

    it('should round to decimals', () => {
      const roundTo = (n: number, decimals: number) => {
        return Number(n.toFixed(decimals));
      };

      expect(roundTo(3.14159, 2)).toBe(3.14);
      expect(roundTo(2.5, 0)).toBe(3);
      expect(roundTo(1.999, 1)).toBe(2.0);
    });
  });

  describe('Date formatting', () => {
    it('should format date as locale string', () => {
      const formatDate = (date: Date) => {
        return date.toLocaleDateString('en-US');
      };

      const date = new Date('2024-01-15');
      const formatted = formatDate(date);

      expect(formatted).toContain('2024');
      expect(formatted).toContain('1');
      expect(formatted).toContain('15');
    });

    it('should format relative time', () => {
      const formatRelativeTime = (date: Date) => {
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;
        if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
        return `${Math.floor(diffDays / 30)} months ago`;
      };

      const today = new Date();
      const yesterday = new Date(Date.now() - 86400000);
      const threeDaysAgo = new Date(Date.now() - 3 * 86400000);

      expect(formatRelativeTime(today)).toBe('Today');
      expect(formatRelativeTime(yesterday)).toBe('Yesterday');
      expect(formatRelativeTime(threeDaysAgo)).toBe('3 days ago');
    });

    it('should format ISO timestamp', () => {
      const date = new Date('2024-01-15T12:30:00Z');
      const iso = date.toISOString();

      expect(iso).toBe('2024-01-15T12:30:00.000Z');
    });

    it('should extract date components', () => {
      const date = new Date('2024-03-15');

      expect(date.getFullYear()).toBe(2024);
      expect(date.getMonth()).toBe(2); // 0-indexed
      expect(date.getDate()).toBe(15);
    });
  });

  describe('Text formatting', () => {
    it('should capitalize first letter', () => {
      const capitalize = (str: string) => {
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
      };

      expect(capitalize('hello')).toBe('Hello');
      expect(capitalize('WORLD')).toBe('World');
    });

    it('should convert to title case', () => {
      const toTitleCase = (str: string) => {
        return str
          .toLowerCase()
          .split(' ')
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
      };

      expect(toTitleCase('hello world')).toBe('Hello World');
      expect(toTitleCase('AFFILIATE PROGRAMS')).toBe('Affiliate Programs');
    });

    it('should truncate text', () => {
      const truncate = (str: string, maxLength: number) => {
        if (str.length <= maxLength) return str;
        return str.slice(0, maxLength - 3) + '...';
      };

      expect(truncate('Short text', 20)).toBe('Short text');
      expect(truncate('Very long text that needs truncating', 20)).toBe('Very long text th...');
    });

    it('should create slug from text', () => {
      const slugify = (str: string) => {
        return str
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .trim();
      };

      expect(slugify('Hello World!')).toBe('hello-world');
      expect(slugify('Finance & Banking')).toBe('finance-banking');
    });

    it('should highlight search terms', () => {
      const highlightTerm = (text: string, term: string) => {
        const regex = new RegExp(`(${term})`, 'gi');
        return text.replace(regex, '<mark>$1</mark>');
      };

      const result = highlightTerm('Amazon Associates Program', 'amazon');

      expect(result).toContain('<mark>Amazon</mark>');
    });
  });

  describe('Array formatting', () => {
    it('should join with commas', () => {
      const items = ['Apple', 'Banana', 'Cherry'];
      const formatted = items.join(', ');

      expect(formatted).toBe('Apple, Banana, Cherry');
    });

    it('should join with "and" for last item', () => {
      const joinWithAnd = (items: string[]) => {
        if (items.length === 0) return '';
        if (items.length === 1) return items[0];
        if (items.length === 2) return items.join(' and ');

        const allButLast = items.slice(0, -1).join(', ');
        const last = items[items.length - 1];
        return `${allButLast}, and ${last}`;
      };

      expect(joinWithAnd(['Apple'])).toBe('Apple');
      expect(joinWithAnd(['Apple', 'Banana'])).toBe('Apple and Banana');
      expect(joinWithAnd(['Apple', 'Banana', 'Cherry'])).toBe('Apple, Banana, and Cherry');
    });

    it('should create comma-separated list with limit', () => {
      const formatList = (items: string[], max: number = 3) => {
        if (items.length <= max) return items.join(', ');

        const shown = items.slice(0, max);
        const remaining = items.length - max;
        return `${shown.join(', ')} +${remaining} more`;
      };

      expect(formatList(['A', 'B'], 3)).toBe('A, B');
      expect(formatList(['A', 'B', 'C', 'D', 'E'], 3)).toBe('A, B, C +2 more');
    });
  });

  describe('URL formatting', () => {
    it('should encode URL parameters', () => {
      const params = new URLSearchParams();
      params.set('query', 'Finance & Banking');

      expect(params.toString()).toContain('Finance');
      expect(params.toString()).not.toContain(' & ');
    });

    it('should build query string', () => {
      const buildQueryString = (params: Record<string, string>) => {
        const searchParams = new URLSearchParams(params);
        return searchParams.toString();
      };

      const result = buildQueryString({ category: 'Tech', page: '1' });

      expect(result).toContain('category=Tech');
      expect(result).toContain('page=1');
    });

    it('should parse query string', () => {
      const params = new URLSearchParams('category=Finance&min=15');

      expect(params.get('category')).toBe('Finance');
      expect(params.get('min')).toBe('15');
    });
  });
});
