/**
 * Unit tests for input validation and sanitization
 */

import {
  sanitizeHTML,
  isValidEmail,
  isValidURL,
  sanitizeSearchQuery,
  validatePagination,
  isValidId,
  sanitizeFilename,
  isValidJSON,
  detectInjectionAttempt,
  sanitizeUserInput,
} from '@/lib/security/input-validation';

describe('Input Validation', () => {
  describe('sanitizeHTML', () => {
    it('should escape HTML entities', () => {
      const input = '<script>alert("XSS")</script>';
      const result = sanitizeHTML(input);
      expect(result).toBe('&lt;script&gt;alert(&quot;XSS&quot;)&lt;&#x2F;script&gt;');
    });

    it('should escape ampersands', () => {
      expect(sanitizeHTML('A & B')).toBe('A &amp; B');
    });

    it('should escape quotes', () => {
      const input = `"Hello" and 'World'`;
      const result = sanitizeHTML(input);
      expect(result).toContain('&quot;');
      expect(result).toContain('&#x27;');
    });

    it('should handle empty string', () => {
      expect(sanitizeHTML('')).toBe('');
    });
  });

  describe('isValidEmail', () => {
    it('should validate correct email addresses', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('user.name@domain.co.uk')).toBe(true);
      expect(isValidEmail('user+tag@example.com')).toBe(true);
    });

    it('should reject invalid email addresses', () => {
      expect(isValidEmail('invalid')).toBe(false);
      expect(isValidEmail('no@domain')).toBe(false);
      expect(isValidEmail('@domain.com')).toBe(false);
      expect(isValidEmail('user@')).toBe(false);
    });
  });

  describe('isValidURL', () => {
    it('should validate correct URLs', () => {
      expect(isValidURL('https://example.com')).toBe(true);
      expect(isValidURL('http://localhost:3000')).toBe(true);
      expect(isValidURL('https://sub.domain.com/path?query=1')).toBe(true);
    });

    it('should reject invalid URLs', () => {
      expect(isValidURL('not-a-url')).toBe(false);
      expect(isValidURL('javascript:alert(1)')).toBe(false);
      expect(isValidURL('')).toBe(false);
    });
  });

  describe('sanitizeSearchQuery', () => {
    it('should trim whitespace', () => {
      expect(sanitizeSearchQuery('  test  ')).toBe('test');
    });

    it('should limit length', () => {
      const longString = 'a'.repeat(200);
      const result = sanitizeSearchQuery(longString, 50);
      expect(result.length).toBe(50);
    });

    it('should remove dangerous characters', () => {
      const input = 'search<script>test{data}';
      const result = sanitizeSearchQuery(input);
      expect(result).not.toContain('<');
      expect(result).not.toContain('>');
      expect(result).not.toContain('{');
      expect(result).not.toContain('}');
    });
  });

  describe('validatePagination', () => {
    it('should validate correct pagination params', () => {
      const result = validatePagination({ page: 1, limit: 20 });
      expect(result.page).toBe(1);
      expect(result.limit).toBe(20);
    });

    it('should use default values', () => {
      const result = validatePagination({});
      expect(result.page).toBe(1);
      expect(result.limit).toBe(20);
    });

    it('should coerce string numbers', () => {
      const result = validatePagination({ page: '2', limit: '50' });
      expect(result.page).toBe(2);
      expect(result.limit).toBe(50);
    });

    it('should reject invalid page numbers', () => {
      expect(() => validatePagination({ page: 0 })).toThrow();
      expect(() => validatePagination({ page: -1 })).toThrow();
    });

    it('should reject limits over 100', () => {
      expect(() => validatePagination({ limit: 101 })).toThrow();
    });
  });

  describe('isValidId', () => {
    it('should validate UUID', () => {
      expect(isValidId('550e8400-e29b-41d4-a716-446655440000')).toBe(true);
    });

    it('should validate numeric IDs', () => {
      expect(isValidId('123')).toBe(true);
      expect(isValidId('456789')).toBe(true);
    });

    it('should reject invalid IDs', () => {
      expect(isValidId('invalid-id')).toBe(false);
      expect(isValidId('12abc')).toBe(false);
      expect(isValidId('')).toBe(false);
    });
  });

  describe('sanitizeFilename', () => {
    it('should remove path separators', () => {
      expect(sanitizeFilename('../../../etc/passwd')).not.toContain('/');
      expect(sanitizeFilename('..\\..\\windows\\system32')).not.toContain('\\');
    });

    it('should remove parent directory references', () => {
      const result = sanitizeFilename('../file.txt');
      expect(result).not.toContain('..');
    });

    it('should allow valid characters', () => {
      const result = sanitizeFilename('my-file_name.txt');
      expect(result).toBe('my-file_name.txt');
    });

    it('should replace invalid characters with underscore', () => {
      const result = sanitizeFilename('file@#$%.txt');
      expect(result).toContain('_');
    });
  });

  describe('isValidJSON', () => {
    it('should validate correct JSON', () => {
      expect(isValidJSON('{"key": "value"}')).toBe(true);
      expect(isValidJSON('["array"]')).toBe(true);
      expect(isValidJSON('null')).toBe(true);
    });

    it('should reject invalid JSON', () => {
      expect(isValidJSON('{invalid}')).toBe(false);
      expect(isValidJSON('not json')).toBe(false);
      expect(isValidJSON('')).toBe(false);
    });
  });

  describe('detectInjectionAttempt', () => {
    it('should detect script tags', () => {
      expect(detectInjectionAttempt('<script>alert(1)</script>')).toBe(true);
      expect(detectInjectionAttempt('<SCRIPT>alert(1)</SCRIPT>')).toBe(true);
    });

    it('should detect javascript: protocol', () => {
      expect(detectInjectionAttempt('javascript:alert(1)')).toBe(true);
    });

    it('should detect event handlers', () => {
      expect(detectInjectionAttempt('onclick=alert(1)')).toBe(true);
      expect(detectInjectionAttempt('onload=badFunction()')).toBe(true);
    });

    it('should detect iframe tags', () => {
      expect(detectInjectionAttempt('<iframe src="evil.com"></iframe>')).toBe(true);
    });

    it('should detect eval calls', () => {
      expect(detectInjectionAttempt('eval(malicious_code)')).toBe(true);
    });

    it('should allow safe input', () => {
      expect(detectInjectionAttempt('This is safe text')).toBe(false);
      expect(detectInjectionAttempt('Email: user@example.com')).toBe(false);
    });
  });

  describe('sanitizeUserInput', () => {
    it('should sanitize HTML in user input', () => {
      const input = '<b>Bold text</b>';
      const result = sanitizeUserInput(input);
      expect(result).toContain('&lt;');
      expect(result).toContain('&gt;');
    });

    it('should reject input with injection attempts', () => {
      const input = '<script>alert("XSS")</script>';
      const result = sanitizeUserInput(input);
      expect(result).toBe('');
    });

    it('should allow safe text', () => {
      const input = 'This is safe text';
      const result = sanitizeUserInput(input);
      expect(result).toBe(input);
    });
  });
});
