/**
 * Edge Cache Utilities Tests
 */

import {
  CacheDurations,
  getCacheControlHeader,
  withCacheHeaders,
  cachedJson,
  CachePresets,
  staleWhileRevalidate,
  generateETag,
  checkETag,
  addVaryHeader,
} from '@/lib/edge-cache';
import { NextResponse } from 'next/server';

// Mock NextResponse
jest.mock('next/server', () => ({
  NextResponse: {
    json: jest.fn((data) => ({
      data,
      headers: new Map(),
    })),
  },
}));

describe('Edge Cache Utilities', () => {
  describe('CacheDurations', () => {
    it('has correct NO_CACHE value', () => {
      expect(CacheDurations.NO_CACHE).toBe(0);
    });

    it('has correct SHORT value', () => {
      expect(CacheDurations.SHORT).toBe(60);
    });

    it('has correct MEDIUM value', () => {
      expect(CacheDurations.MEDIUM).toBe(300);
    });

    it('has correct LONG value', () => {
      expect(CacheDurations.LONG).toBe(3600);
    });

    it('has correct VERY_LONG value', () => {
      expect(CacheDurations.VERY_LONG).toBe(86400);
    });

    it('has correct IMMUTABLE value', () => {
      expect(CacheDurations.IMMUTABLE).toBe(31536000);
    });
  });

  describe('getCacheControlHeader', () => {
    it('generates public cache-control header', () => {
      const header = getCacheControlHeader({ maxAge: 300 });

      expect(header).toContain('public');
      expect(header).toContain('max-age=300');
    });

    it('generates private cache-control header', () => {
      const header = getCacheControlHeader({ maxAge: 60, private: true });

      expect(header).toContain('private');
      expect(header).toContain('max-age=60');
      expect(header).not.toContain('public');
    });

    it('includes stale-while-revalidate when specified', () => {
      const header = getCacheControlHeader({ maxAge: 300, swr: 60 });

      expect(header).toContain('stale-while-revalidate=60');
    });

    it('includes s-maxage for CDN caching when public', () => {
      const header = getCacheControlHeader({ maxAge: 300, cdnCache: true });

      expect(header).toContain('s-maxage=300');
    });

    it('does not include s-maxage for private cache', () => {
      const header = getCacheControlHeader({ maxAge: 300, cdnCache: true, private: true });

      expect(header).not.toContain('s-maxage');
    });

    it('combines all options correctly', () => {
      const header = getCacheControlHeader({
        maxAge: 3600,
        swr: 300,
        cdnCache: true,
      });

      expect(header).toBe('public, max-age=3600, stale-while-revalidate=300, s-maxage=3600');
    });
  });

  describe('withCacheHeaders', () => {
    it('sets Cache-Control header on response', () => {
      const mockResponse = {
        headers: {
          set: jest.fn(),
        },
      } as unknown as NextResponse;

      withCacheHeaders(mockResponse, { maxAge: 300 });

      expect(mockResponse.headers.set).toHaveBeenCalledWith(
        'Cache-Control',
        expect.stringContaining('max-age=300')
      );
    });

    it('sets cache tags header when tags provided', () => {
      const mockResponse = {
        headers: {
          set: jest.fn(),
        },
      } as unknown as NextResponse;

      withCacheHeaders(mockResponse, { maxAge: 300, tags: ['tag1', 'tag2'] });

      expect(mockResponse.headers.set).toHaveBeenCalledWith('x-vercel-cache-tags', 'tag1,tag2');
    });

    it('does not set cache tags header when no tags', () => {
      const mockResponse = {
        headers: {
          set: jest.fn(),
        },
      } as unknown as NextResponse;

      withCacheHeaders(mockResponse, { maxAge: 300 });

      expect(mockResponse.headers.set).not.toHaveBeenCalledWith(
        'x-vercel-cache-tags',
        expect.anything()
      );
    });
  });

  describe('CachePresets', () => {
    it('has static preset', () => {
      expect(CachePresets.static.maxAge).toBe(CacheDurations.LONG);
      expect(CachePresets.static.cdnCache).toBe(true);
    });

    it('has semiDynamic preset', () => {
      expect(CachePresets.semiDynamic.maxAge).toBe(CacheDurations.MEDIUM);
      expect(CachePresets.semiDynamic.cdnCache).toBe(true);
    });

    it('has dynamic preset', () => {
      expect(CachePresets.dynamic.maxAge).toBe(CacheDurations.SHORT);
    });

    it('has userSpecific preset', () => {
      expect(CachePresets.userSpecific.maxAge).toBe(CacheDurations.NO_CACHE);
      expect(CachePresets.userSpecific.private).toBe(true);
      expect(CachePresets.userSpecific.cdnCache).toBe(false);
    });

    it('has immutable preset', () => {
      expect(CachePresets.immutable.maxAge).toBe(CacheDurations.IMMUTABLE);
    });

    it('has realtime preset', () => {
      expect(CachePresets.realtime.maxAge).toBe(CacheDurations.NO_CACHE);
      expect(CachePresets.realtime.cdnCache).toBe(false);
    });
  });

  describe('staleWhileRevalidate', () => {
    it('returns data from fetcher', async () => {
      const fetcher = jest.fn().mockResolvedValue({ test: 'data' });

      const result = await staleWhileRevalidate('test-key', fetcher, {
        maxAge: 300,
        staleAge: 60,
      });

      expect(fetcher).toHaveBeenCalled();
      expect(result.data).toEqual({ test: 'data' });
      expect(result.stale).toBe(false);
    });

    it('calls fetcher once', async () => {
      const fetcher = jest.fn().mockResolvedValue('value');

      await staleWhileRevalidate('key', fetcher, { maxAge: 100, staleAge: 50 });

      expect(fetcher).toHaveBeenCalledTimes(1);
    });
  });

  describe('generateETag', () => {
    it('generates ETag for string', () => {
      const etag = generateETag('test content');

      expect(etag).toMatch(/^"[0-9a-f]+"$/);
    });

    it('generates ETag for object', () => {
      const etag = generateETag({ key: 'value' });

      expect(etag).toMatch(/^"[0-9a-f]+"$/);
    });

    it('generates same ETag for same content', () => {
      const etag1 = generateETag('same content');
      const etag2 = generateETag('same content');

      expect(etag1).toBe(etag2);
    });

    it('generates different ETag for different content', () => {
      const etag1 = generateETag('content1');
      const etag2 = generateETag('content2');

      expect(etag1).not.toBe(etag2);
    });

    it('generates same ETag for same object', () => {
      const etag1 = generateETag({ a: 1, b: 2 });
      const etag2 = generateETag({ a: 1, b: 2 });

      expect(etag1).toBe(etag2);
    });
  });

  describe('checkETag', () => {
    it('returns true when ETag matches', () => {
      const mockRequest = {
        headers: {
          get: jest.fn().mockReturnValue('"abc123"'),
        },
      } as unknown as Request;

      const result = checkETag(mockRequest, '"abc123"');

      expect(result).toBe(true);
    });

    it('returns false when ETag does not match', () => {
      const mockRequest = {
        headers: {
          get: jest.fn().mockReturnValue('"abc123"'),
        },
      } as unknown as Request;

      const result = checkETag(mockRequest, '"xyz789"');

      expect(result).toBe(false);
    });

    it('returns false when no If-None-Match header', () => {
      const mockRequest = {
        headers: {
          get: jest.fn().mockReturnValue(null),
        },
      } as unknown as Request;

      const result = checkETag(mockRequest, '"abc123"');

      expect(result).toBe(false);
    });
  });

  describe('addVaryHeader', () => {
    it('sets Vary header with single value', () => {
      const mockResponse = {
        headers: {
          set: jest.fn(),
        },
      } as unknown as NextResponse;

      addVaryHeader(mockResponse, ['Accept']);

      expect(mockResponse.headers.set).toHaveBeenCalledWith('Vary', 'Accept');
    });

    it('sets Vary header with multiple values', () => {
      const mockResponse = {
        headers: {
          set: jest.fn(),
        },
      } as unknown as NextResponse;

      addVaryHeader(mockResponse, ['Accept', 'Accept-Encoding', 'Authorization']);

      expect(mockResponse.headers.set).toHaveBeenCalledWith(
        'Vary',
        'Accept, Accept-Encoding, Authorization'
      );
    });

    it('returns the response', () => {
      const mockResponse = {
        headers: {
          set: jest.fn(),
        },
      } as unknown as NextResponse;

      const result = addVaryHeader(mockResponse, ['Accept']);

      expect(result).toBe(mockResponse);
    });
  });
});
