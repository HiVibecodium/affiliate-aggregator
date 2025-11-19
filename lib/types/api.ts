/**
 * Common API types and utilities
 */

// Error type guard
export function isError(error: unknown): error is Error {
  return error instanceof Error;
}

// Safe error message extraction
export function getErrorMessage(error: unknown): string {
  if (isError(error)) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'Unknown error';
}

// API Response types
export interface ApiSuccessResponse<T = unknown> {
  success: true;
  data?: T;
}

export interface ApiErrorResponse {
  success: false;
  error: string;
  message?: string;
  details?: string;
}

export type ApiResponse<T = unknown> = ApiSuccessResponse<T> | ApiErrorResponse;
