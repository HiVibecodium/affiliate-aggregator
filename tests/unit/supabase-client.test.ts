/**
 * Supabase Client Tests
 */

// Mock the supabase SSR module
const mockCreateBrowserClient = jest.fn().mockReturnValue({
  auth: { getSession: jest.fn() },
  from: jest.fn(),
});

jest.mock('@supabase/ssr', () => ({
  createBrowserClient: mockCreateBrowserClient,
  createServerClient: jest.fn().mockReturnValue({
    auth: { getSession: jest.fn() },
    from: jest.fn(),
  }),
}));

// Mock next/headers
const mockGetAll = jest.fn();
const mockSet = jest.fn();
jest.mock('next/headers', () => ({
  cookies: jest.fn().mockResolvedValue({
    getAll: mockGetAll,
    set: mockSet,
  }),
}));

describe('Supabase Client', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key';
  });

  describe('createClient (browser)', () => {
    it('creates browser client with env variables', () => {
      // Import after mocks are set up
      jest.resetModules();
      const { createClient } = require('@/lib/supabase/client');

      const client = createClient();

      expect(mockCreateBrowserClient).toHaveBeenCalledWith(
        'https://test.supabase.co',
        'test-anon-key'
      );
      expect(client).toBeDefined();
    });

    it('returns supabase client instance', () => {
      jest.resetModules();
      const { createClient } = require('@/lib/supabase/client');

      const client = createClient();

      expect(client.auth).toBeDefined();
      expect(client.from).toBeDefined();
    });
  });

  describe('createClient (server)', () => {
    it('creates server client with cookies', async () => {
      jest.resetModules();
      const { createServerClient } = require('@supabase/ssr');
      const { createClient } = require('@/lib/supabase/server');

      mockGetAll.mockReturnValue([{ name: 'sb-token', value: 'token-value' }]);

      const client = await createClient();

      expect(createServerClient).toHaveBeenCalledWith(
        'https://test.supabase.co',
        'test-anon-key',
        expect.objectContaining({
          cookies: expect.objectContaining({
            getAll: expect.any(Function),
            setAll: expect.any(Function),
          }),
        })
      );
      expect(client).toBeDefined();
    });

    it('getAll returns all cookies', async () => {
      jest.resetModules();
      const { createServerClient } = require('@supabase/ssr');
      const { createClient } = require('@/lib/supabase/server');

      const mockCookies = [
        { name: 'cookie1', value: 'value1' },
        { name: 'cookie2', value: 'value2' },
      ];
      mockGetAll.mockReturnValue(mockCookies);

      await createClient();

      // Get the cookies config passed to createServerClient
      const cookiesConfig = createServerClient.mock.calls[0][2].cookies;
      const result = cookiesConfig.getAll();

      expect(result).toEqual(mockCookies);
    });

    it('setAll sets multiple cookies', async () => {
      jest.resetModules();
      const { createServerClient } = require('@supabase/ssr');
      const { createClient } = require('@/lib/supabase/server');

      await createClient();

      // Get the cookies config passed to createServerClient
      const cookiesConfig = createServerClient.mock.calls[0][2].cookies;

      const cookiesToSet = [
        { name: 'cookie1', value: 'value1', options: { path: '/' } },
        { name: 'cookie2', value: 'value2', options: { path: '/' } },
      ];

      // This should not throw
      cookiesConfig.setAll(cookiesToSet);

      expect(mockSet).toHaveBeenCalledTimes(2);
      expect(mockSet).toHaveBeenCalledWith('cookie1', 'value1', { path: '/' });
      expect(mockSet).toHaveBeenCalledWith('cookie2', 'value2', { path: '/' });
    });

    it('setAll handles errors silently from Server Components', async () => {
      jest.resetModules();
      const { createServerClient } = require('@supabase/ssr');
      const { createClient } = require('@/lib/supabase/server');

      // Simulate Server Component error
      mockSet.mockImplementation(() => {
        throw new Error('Cannot set cookies in Server Component');
      });

      await createClient();

      const cookiesConfig = createServerClient.mock.calls[0][2].cookies;

      // Should not throw even when mockSet throws
      expect(() => {
        cookiesConfig.setAll([{ name: 'test', value: 'test', options: {} }]);
      }).not.toThrow();
    });
  });
});
