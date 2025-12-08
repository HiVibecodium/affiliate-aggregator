/**
 * API Types Tests
 */

import {
  isError,
  getErrorMessage,
  type ApiSuccessResponse,
  type ApiErrorResponse,
  type ApiResponse,
} from '@/lib/types/api';

describe('API Types', () => {
  describe('isError', () => {
    it('returns true for Error instance', () => {
      const error = new Error('Test error');
      expect(isError(error)).toBe(true);
    });

    it('returns true for TypeError', () => {
      const error = new TypeError('Type error');
      expect(isError(error)).toBe(true);
    });

    it('returns true for SyntaxError', () => {
      const error = new SyntaxError('Syntax error');
      expect(isError(error)).toBe(true);
    });

    it('returns true for RangeError', () => {
      const error = new RangeError('Range error');
      expect(isError(error)).toBe(true);
    });

    it('returns false for string', () => {
      expect(isError('error message')).toBe(false);
    });

    it('returns false for number', () => {
      expect(isError(500)).toBe(false);
    });

    it('returns false for null', () => {
      expect(isError(null)).toBe(false);
    });

    it('returns false for undefined', () => {
      expect(isError(undefined)).toBe(false);
    });

    it('returns false for plain object', () => {
      expect(isError({ message: 'error' })).toBe(false);
    });

    it('returns false for array', () => {
      expect(isError(['error'])).toBe(false);
    });

    it('returns true for custom Error subclass', () => {
      class CustomError extends Error {
        code: string;
        constructor(message: string, code: string) {
          super(message);
          this.code = code;
        }
      }
      const error = new CustomError('Custom error', 'ERR_001');
      expect(isError(error)).toBe(true);
    });
  });

  describe('getErrorMessage', () => {
    it('extracts message from Error instance', () => {
      const error = new Error('Test error message');
      expect(getErrorMessage(error)).toBe('Test error message');
    });

    it('extracts message from TypeError', () => {
      const error = new TypeError('Type error message');
      expect(getErrorMessage(error)).toBe('Type error message');
    });

    it('returns string as-is', () => {
      expect(getErrorMessage('String error')).toBe('String error');
    });

    it('returns "Unknown error" for null', () => {
      expect(getErrorMessage(null)).toBe('Unknown error');
    });

    it('returns "Unknown error" for undefined', () => {
      expect(getErrorMessage(undefined)).toBe('Unknown error');
    });

    it('returns "Unknown error" for number', () => {
      expect(getErrorMessage(404)).toBe('Unknown error');
    });

    it('returns "Unknown error" for object without message', () => {
      expect(getErrorMessage({ code: 'ERR' })).toBe('Unknown error');
    });

    it('returns "Unknown error" for array', () => {
      expect(getErrorMessage(['error1', 'error2'])).toBe('Unknown error');
    });

    it('returns "Unknown error" for boolean', () => {
      expect(getErrorMessage(false)).toBe('Unknown error');
    });

    it('handles empty string', () => {
      expect(getErrorMessage('')).toBe('');
    });

    it('handles Error with empty message', () => {
      const error = new Error('');
      expect(getErrorMessage(error)).toBe('');
    });
  });

  describe('Type Definitions', () => {
    it('ApiSuccessResponse has correct structure', () => {
      const response: ApiSuccessResponse<{ id: string }> = {
        success: true,
        data: { id: '123' },
      };

      expect(response.success).toBe(true);
      expect(response.data).toEqual({ id: '123' });
    });

    it('ApiSuccessResponse can have undefined data', () => {
      const response: ApiSuccessResponse = {
        success: true,
      };

      expect(response.success).toBe(true);
      expect(response.data).toBeUndefined();
    });

    it('ApiErrorResponse has correct structure', () => {
      const response: ApiErrorResponse = {
        success: false,
        error: 'Not found',
        message: 'Resource not found',
        details: 'The requested item does not exist',
      };

      expect(response.success).toBe(false);
      expect(response.error).toBe('Not found');
      expect(response.message).toBe('Resource not found');
      expect(response.details).toBe('The requested item does not exist');
    });

    it('ApiErrorResponse can have minimal fields', () => {
      const response: ApiErrorResponse = {
        success: false,
        error: 'Server error',
      };

      expect(response.success).toBe(false);
      expect(response.error).toBe('Server error');
      expect(response.message).toBeUndefined();
      expect(response.details).toBeUndefined();
    });

    it('ApiResponse can be success type', () => {
      const response: ApiResponse<string[]> = {
        success: true,
        data: ['item1', 'item2'],
      };

      if (response.success) {
        expect(response.data).toEqual(['item1', 'item2']);
      }
    });

    it('ApiResponse can be error type', () => {
      const response: ApiResponse = {
        success: false,
        error: 'Unauthorized',
      };

      if (!response.success) {
        expect(response.error).toBe('Unauthorized');
      }
    });

    it('ApiResponse type guard works correctly', () => {
      const handleResponse = (response: ApiResponse<number>) => {
        if (response.success) {
          return response.data;
        } else {
          return response.error;
        }
      };

      const successResponse: ApiResponse<number> = { success: true, data: 42 };
      const errorResponse: ApiResponse<number> = { success: false, error: 'Failed' };

      expect(handleResponse(successResponse)).toBe(42);
      expect(handleResponse(errorResponse)).toBe('Failed');
    });
  });

  describe('Edge Cases', () => {
    it('handles Error with very long message', () => {
      const longMessage = 'A'.repeat(10000);
      const error = new Error(longMessage);
      expect(getErrorMessage(error)).toBe(longMessage);
      expect(getErrorMessage(error).length).toBe(10000);
    });

    it('handles Error with special characters', () => {
      const error = new Error('Error: <script>alert("xss")</script>');
      expect(getErrorMessage(error)).toBe('Error: <script>alert("xss")</script>');
    });

    it('handles Error with unicode', () => {
      const error = new Error('Ошибка: что-то пошло не так');
      expect(getErrorMessage(error)).toBe('Ошибка: что-то пошло не так');
    });

    it('handles Error with newlines', () => {
      const error = new Error('Line 1\nLine 2\nLine 3');
      expect(getErrorMessage(error)).toBe('Line 1\nLine 2\nLine 3');
    });

    it('handles symbol as unknown error', () => {
      const symbol = Symbol('error');
      expect(getErrorMessage(symbol)).toBe('Unknown error');
    });

    it('handles function as unknown error', () => {
      const fn = () => 'error';
      expect(getErrorMessage(fn)).toBe('Unknown error');
    });
  });
});
