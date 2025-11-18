/**
 * Unit tests for string helper functions
 */

describe('String Helpers', () => {
  describe('String manipulation', () => {
    it('should trim whitespace', () => {
      expect('  hello  '.trim()).toBe('hello');
      expect('\n\ttest\n'.trim()).toBe('test');
    });

    it('should convert to lowercase', () => {
      expect('HELLO'.toLowerCase()).toBe('hello');
      expect('MiXeD'.toLowerCase()).toBe('mixed');
    });

    it('should convert to uppercase', () => {
      expect('hello'.toUpperCase()).toBe('HELLO');
      expect('test'.toUpperCase()).toBe('TEST');
    });

    it('should replace substrings', () => {
      const text = 'Hello World';
      expect(text.replace('World', 'Universe')).toBe('Hello Universe');
      expect(text.replace(/o/g, '0')).toBe('Hell0 W0rld');
    });

    it('should split strings', () => {
      expect('a,b,c'.split(',')).toEqual(['a', 'b', 'c']);
      expect('one two three'.split(' ')).toEqual(['one', 'two', 'three']);
    });

    it('should check string contains substring', () => {
      expect('Hello World'.includes('World')).toBe(true);
      expect('Hello World'.includes('Universe')).toBe(false);
    });

    it('should check string starts with', () => {
      expect('Hello World'.startsWith('Hello')).toBe(true);
      expect('Hello World'.startsWith('World')).toBe(false);
    });

    it('should check string ends with', () => {
      expect('test.tsx'.endsWith('.tsx')).toBe(true);
      expect('test.tsx'.endsWith('.ts')).toBe(false);
    });

    it('should repeat strings', () => {
      expect('ab'.repeat(3)).toBe('ababab');
      expect('x'.repeat(5)).toBe('xxxxx');
    });

    it('should pad strings', () => {
      expect('5'.padStart(3, '0')).toBe('005');
      expect('test'.padEnd(10, '.')).toBe('test......');
    });
  });

  describe('String validation', () => {
    it('should check empty string', () => {
      const isEmpty = (str: string) => str.length === 0 || str.trim().length === 0;

      expect(isEmpty('')).toBe(true);
      expect(isEmpty('   ')).toBe(true);
      expect(isEmpty('text')).toBe(false);
    });

    it('should check string length', () => {
      const isValidLength = (str: string, min: number, max: number) => {
        return str.length >= min && str.length <= max;
      };

      expect(isValidLength('test', 1, 10)).toBe(true);
      expect(isValidLength('', 1, 10)).toBe(false);
      expect(isValidLength('very long text here', 1, 10)).toBe(false);
    });

    it('should match regex pattern', () => {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      expect(emailPattern.test('test@example.com')).toBe(true);
      expect(emailPattern.test('invalid-email')).toBe(false);
    });

    it('should check alphanumeric', () => {
      const isAlphanumeric = (str: string) => /^[a-zA-Z0-9]+$/.test(str);

      expect(isAlphanumeric('abc123')).toBe(true);
      expect(isAlphanumeric('abc-123')).toBe(false);
      expect(isAlphanumeric('abc 123')).toBe(false);
    });
  });

  describe('String extraction', () => {
    it('should extract substring', () => {
      const text = 'Hello World';

      expect(text.substring(0, 5)).toBe('Hello');
      expect(text.substring(6)).toBe('World');
    });

    it('should extract with slice', () => {
      const text = 'abcdef';

      expect(text.slice(0, 3)).toBe('abc');
      expect(text.slice(-3)).toBe('def');
    });

    it('should extract characters', () => {
      expect('Hello'.charAt(0)).toBe('H');
      expect('Hello'.charAt(4)).toBe('o');
    });

    it('should find index of substring', () => {
      const text = 'Hello World';

      expect(text.indexOf('World')).toBe(6);
      expect(text.indexOf('xyz')).toBe(-1);
    });
  });

  describe('String comparison', () => {
    it('should compare strings', () => {
      expect('abc' === 'abc').toBe(true);
      expect('abc' === 'ABC').toBe(false);
    });

    it('should compare case-insensitive', () => {
      const compare = (a: string, b: string) => {
        return a.toLowerCase() === b.toLowerCase();
      };

      expect(compare('Hello', 'hello')).toBe(true);
      expect(compare('Test', 'TEST')).toBe(true);
    });

    it('should sort strings alphabetically', () => {
      const items = ['Charlie', 'Alice', 'Bob'];
      const sorted = items.sort();

      expect(sorted).toEqual(['Alice', 'Bob', 'Charlie']);
    });

    it('should sort case-insensitive', () => {
      const items = ['charlie', 'Alice', 'bob'];
      const sorted = items.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));

      expect(sorted).toEqual(['Alice', 'bob', 'charlie']);
    });
  });

  describe('Template strings', () => {
    it('should interpolate variables', () => {
      const name = 'World';
      const greeting = `Hello ${name}!`;

      expect(greeting).toBe('Hello World!');
    });

    it('should handle expressions', () => {
      const a = 5;
      const b = 10;
      const result = `Sum: ${a + b}`;

      expect(result).toBe('Sum: 15');
    });

    it('should support multiline', () => {
      const multiline = `Line 1
Line 2
Line 3`;

      expect(multiline.split('\n')).toHaveLength(3);
    });
  });
});
