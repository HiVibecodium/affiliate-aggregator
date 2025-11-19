/**
 * Unit tests for array helper functions
 */

describe('Array Helpers', () => {
  describe('Array manipulation', () => {
    it('should filter arrays', () => {
      const numbers = [1, 2, 3, 4, 5];
      const even = numbers.filter((n) => n % 2 === 0);

      expect(even).toEqual([2, 4]);
    });

    it('should map arrays', () => {
      const numbers = [1, 2, 3];
      const doubled = numbers.map((n) => n * 2);

      expect(doubled).toEqual([2, 4, 6]);
    });

    it('should reduce arrays', () => {
      const numbers = [1, 2, 3, 4];
      const sum = numbers.reduce((acc, n) => acc + n, 0);

      expect(sum).toBe(10);
    });

    it('should find items', () => {
      const items = [{ id: 1 }, { id: 2 }, { id: 3 }];
      const found = items.find((item) => item.id === 2);

      expect(found).toEqual({ id: 2 });
    });

    it('should check if all items match', () => {
      const numbers = [2, 4, 6, 8];
      const allEven = numbers.every((n) => n % 2 === 0);

      expect(allEven).toBe(true);
    });

    it('should check if some items match', () => {
      const numbers = [1, 2, 3, 4];
      const hasEven = numbers.some((n) => n % 2 === 0);

      expect(hasEven).toBe(true);
    });

    it('should sort arrays', () => {
      const numbers = [3, 1, 4, 1, 5];
      const sorted = [...numbers].sort((a, b) => a - b);

      expect(sorted).toEqual([1, 1, 3, 4, 5]);
    });

    it('should reverse arrays', () => {
      const items = [1, 2, 3];
      const reversed = [...items].reverse();

      expect(reversed).toEqual([3, 2, 1]);
    });

    it('should slice arrays', () => {
      const items = [1, 2, 3, 4, 5];

      expect(items.slice(0, 3)).toEqual([1, 2, 3]);
      expect(items.slice(2)).toEqual([3, 4, 5]);
    });

    it('should concatenate arrays', () => {
      const arr1 = [1, 2];
      const arr2 = [3, 4];
      const combined = arr1.concat(arr2);

      expect(combined).toEqual([1, 2, 3, 4]);
    });
  });

  describe('Array utilities', () => {
    it('should remove duplicates', () => {
      const removeDuplicates = (arr: unknown[]) => Array.from(new Set(arr));

      expect(removeDuplicates([1, 2, 2, 3, 3, 3])).toEqual([1, 2, 3]);
      expect(removeDuplicates(['a', 'b', 'a', 'c'])).toEqual(['a', 'b', 'c']);
    });

    it('should chunk arrays', () => {
      const chunk = (arr: unknown[], size: number) => {
        const chunks = [];
        for (let i = 0; i < arr.length; i += size) {
          chunks.push(arr.slice(i, i + size));
        }
        return chunks;
      };

      expect(chunk([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]]);
    });

    it('should flatten arrays', () => {
      const nested = [[1, 2], [3, 4], [5]];
      const flat = nested.flat();

      expect(flat).toEqual([1, 2, 3, 4, 5]);
    });

    it('should group by property', () => {
      const groupBy = <T>(arr: T[], key: keyof T) => {
        return arr.reduce(
          (groups, item) => {
            const value = String(item[key]);
            if (!groups[value]) groups[value] = [];
            groups[value].push(item);
            return groups;
          },
          {} as Record<string, T[]>
        );
      };

      const items = [
        { category: 'A', value: 1 },
        { category: 'B', value: 2 },
        { category: 'A', value: 3 },
      ];

      const grouped = groupBy(items, 'category');

      expect(grouped['A']).toHaveLength(2);
      expect(grouped['B']).toHaveLength(1);
    });

    it('should partition array', () => {
      const partition = <T>(arr: T[], predicate: (item: T) => boolean) => {
        const pass: T[] = [];
        const fail: T[] = [];

        arr.forEach((item) => {
          if (predicate(item)) pass.push(item);
          else fail.push(item);
        });

        return [pass, fail];
      };

      const [even, odd] = partition([1, 2, 3, 4, 5], (n) => n % 2 === 0);

      expect(even).toEqual([2, 4]);
      expect(odd).toEqual([1, 3, 5]);
    });

    it('should get unique values', () => {
      const unique = (arr: unknown[]) => [...new Set(arr)];

      expect(unique([1, 1, 2, 3, 2])).toEqual([1, 2, 3]);
    });

    it('should shuffle array', () => {
      const shuffle = (arr: unknown[]) => {
        const shuffled = [...arr];
        for (let i = shuffled.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
      };

      const original = [1, 2, 3, 4, 5];
      const shuffled = shuffle(original);

      expect(shuffled).toHaveLength(5);
      expect(shuffled.sort()).toEqual(original);
    });
  });

  describe('Array search', () => {
    it('should find index', () => {
      const items = ['a', 'b', 'c'];

      expect(items.indexOf('b')).toBe(1);
      expect(items.indexOf('d')).toBe(-1);
    });

    it('should check includes', () => {
      const items = [1, 2, 3];

      expect(items.includes(2)).toBe(true);
      expect(items.includes(4)).toBe(false);
    });

    it('should find last index', () => {
      const items = [1, 2, 3, 2, 1];

      expect(items.lastIndexOf(2)).toBe(3);
      expect(items.lastIndexOf(4)).toBe(-1);
    });
  });

  describe('Array statistics', () => {
    it('should calculate sum', () => {
      const sum = (arr: number[]) => arr.reduce((a, b) => a + b, 0);

      expect(sum([1, 2, 3, 4])).toBe(10);
      expect(sum([10, 20, 30])).toBe(60);
    });

    it('should calculate average', () => {
      const average = (arr: number[]) => {
        return arr.length > 0 ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;
      };

      expect(average([1, 2, 3, 4])).toBe(2.5);
      expect(average([10, 20])).toBe(15);
      expect(average([])).toBe(0);
    });

    it('should find min value', () => {
      expect(Math.min(...[3, 1, 4, 1, 5])).toBe(1);
    });

    it('should find max value', () => {
      expect(Math.max(...[3, 1, 4, 1, 5])).toBe(5);
    });

    it('should count occurrences', () => {
      const count = (arr: unknown[], value: any) => {
        return arr.filter((item) => item === value).length;
      };

      expect(count([1, 2, 1, 3, 1], 1)).toBe(3);
      expect(count(['a', 'b', 'a'], 'a')).toBe(2);
    });
  });

  describe('Array creation', () => {
    it('should create array from range', () => {
      const range = (start: number, end: number) => {
        return Array.from({ length: end - start + 1 }, (_, i) => start + i);
      };

      expect(range(1, 5)).toEqual([1, 2, 3, 4, 5]);
      expect(range(0, 3)).toEqual([0, 1, 2, 3]);
    });

    it('should create array with fill', () => {
      expect(Array(3).fill(0)).toEqual([0, 0, 0]);
      expect(Array(5).fill('x')).toEqual(['x', 'x', 'x', 'x', 'x']);
    });

    it('should create array with map', () => {
      const arr = Array.from({ length: 5 }, (_, i) => i * 2);

      expect(arr).toEqual([0, 2, 4, 6, 8]);
    });
  });
});
