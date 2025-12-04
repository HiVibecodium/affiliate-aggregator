/**
 * Unit tests for object helper functions
 */

describe('Object Helpers', () => {
  describe('Object manipulation', () => {
    it('should merge objects', () => {
      const obj1 = { a: 1, b: 2 };
      const obj2 = { b: 3, c: 4 };
      const merged = { ...obj1, ...obj2 };

      expect(merged).toEqual({ a: 1, b: 3, c: 4 });
    });

    it('should clone objects', () => {
      const original = { name: 'Test', nested: { value: 1 } };
      const clone = { ...original, nested: { ...original.nested } };

      clone.name = 'Changed';
      clone.nested.value = 2;

      expect(original.name).toBe('Test');
      expect(original.nested.value).toBe(1);
    });

    it('should pick properties', () => {
      const pick = <T extends object>(obj: T, keys: (keyof T)[]) => {
        const result = {} as Partial<T>;
        keys.forEach((key) => {
          if (key in obj) result[key] = obj[key];
        });
        return result;
      };

      const obj = { a: 1, b: 2, c: 3 };
      const picked = pick(obj, ['a', 'c']);

      expect(picked).toEqual({ a: 1, c: 3 });
    });

    it('should omit properties', () => {
      const omit = <T extends object>(obj: T, keys: (keyof T)[]) => {
        const result = { ...obj };
        keys.forEach((key) => delete result[key]);
        return result;
      };

      const obj = { a: 1, b: 2, c: 3 };
      const omitted = omit(obj, ['b']);

      expect(omitted).toEqual({ a: 1, c: 3 });
    });
  });

  describe('Object inspection', () => {
    it('should get object keys', () => {
      const obj = { a: 1, b: 2, c: 3 };

      expect(Object.keys(obj)).toEqual(['a', 'b', 'c']);
    });

    it('should get object values', () => {
      const obj = { a: 1, b: 2, c: 3 };

      expect(Object.values(obj)).toEqual([1, 2, 3]);
    });

    it('should get object entries', () => {
      const obj = { a: 1, b: 2 };

      expect(Object.entries(obj)).toEqual([
        ['a', 1],
        ['b', 2],
      ]);
    });

    it('should check property existence', () => {
      const obj = { name: 'Test' };

      expect('name' in obj).toBe(true);
      expect('age' in obj).toBe(false);
    });

    it('should check own property', () => {
      const obj = { name: 'Test' };

      expect(obj.hasOwnProperty('name')).toBe(true);
      expect(obj.hasOwnProperty('toString')).toBe(false);
    });
  });

  describe('Object validation', () => {
    it('should check empty object', () => {
      const isEmpty = (obj: object) => Object.keys(obj).length === 0;

      expect(isEmpty({})).toBe(true);
      expect(isEmpty({ a: 1 })).toBe(false);
    });

    it('should check required fields', () => {
      const hasFields = (obj: Record<string, unknown>, fields: string[]) => {
        return fields.every((field) => field in obj);
      };

      const obj = { id: '1', name: 'Test' };

      expect(hasFields(obj, ['id', 'name'])).toBe(true);
      expect(hasFields(obj, ['id', 'name', 'email'])).toBe(false);
    });

    it('should validate field types', () => {
      const validateTypes = (obj: Record<string, unknown>, schema: Record<string, string>) => {
        return Object.entries(schema).every(([key, type]) => typeof obj[key] === type);
      };

      const obj = { id: '123', count: 10, active: true };
      const schema = { id: 'string', count: 'number', active: 'boolean' };

      expect(validateTypes(obj, schema)).toBe(true);
    });
  });

  describe('Object transformation', () => {
    it('should transform object entries', () => {
      const obj = { a: 1, b: 2, c: 3 };
      const doubled = Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, v * 2]));

      expect(doubled).toEqual({ a: 2, b: 4, c: 6 });
    });

    it('should filter object properties', () => {
      const filterObject = (
        obj: Record<string, unknown>,
        predicate: (value: unknown) => boolean
      ) => {
        return Object.fromEntries(Object.entries(obj).filter(([_, value]) => predicate(value)));
      };

      const obj = { a: 1, b: 0, c: 3, d: null };
      const filtered = filterObject(obj, (v) => Boolean(v));

      expect(filtered).toEqual({ a: 1, c: 3 });
    });

    it('should map object values', () => {
      const mapValues = <T, U>(obj: Record<string, T>, fn: (value: T) => U) => {
        return Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, fn(v)]));
      };

      const obj = { a: 1, b: 2, c: 3 };
      const squared = mapValues(obj, (v) => v * v);

      expect(squared).toEqual({ a: 1, b: 4, c: 9 });
    });
  });

  describe('Object comparison', () => {
    it('should check deep equality', () => {
      const deepEqual = (a: unknown, b: unknown): boolean => {
        return JSON.stringify(a) === JSON.stringify(b);
      };

      expect(deepEqual({ a: 1 }, { a: 1 })).toBe(true);
      expect(deepEqual({ a: 1 }, { a: 2 })).toBe(false);
    });

    it('should check shallow equality', () => {
      const shallowEqual = (a: Record<string, unknown>, b: Record<string, unknown>) => {
        const keysA = Object.keys(a);
        const keysB = Object.keys(b);

        if (keysA.length !== keysB.length) return false;

        return keysA.every((key) => a[key] === b[key]);
      };

      expect(shallowEqual({ a: 1, b: 2 }, { a: 1, b: 2 })).toBe(true);
      expect(shallowEqual({ a: 1 }, { a: 1, b: 2 })).toBe(false);
    });
  });

  describe('Nested objects', () => {
    it('should access nested properties safely', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const get = (obj: any, path: string) => {
        return path.split('.').reduce((acc, key) => acc?.[key], obj);
      };

      const obj = { user: { profile: { name: 'Test' } } };

      expect(get(obj, 'user.profile.name')).toBe('Test');
      expect(get(obj, 'user.age')).toBeUndefined();
    });

    it('should set nested properties', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const set = (obj: any, path: string, value: unknown) => {
        const keys = path.split('.');
        const lastKey = keys.pop()!;

        const target = keys.reduce((acc, key) => {
          if (!(key in acc)) acc[key] = {};
          return acc[key];
        }, obj);

        target[lastKey] = value;
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const obj: any = {};
      set(obj, 'user.profile.name', 'Test');

      expect(obj.user.profile.name).toBe('Test');
    });
  });
});
