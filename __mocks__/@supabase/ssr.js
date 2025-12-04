/**
 * Mock for @supabase/ssr package
 * Used in tests to mock Supabase server client creation
 */

// Storage for mock user data (shared across test runs)
let mockUserData = null;
let mockError = null;

/**
 * Set mock user for tests
 * @param {Object} user - User object to return from getUser()
 * @param {Object} error - Error object (optional)
 */
function setMockUser(user, error = null) {
  mockUserData = user;
  mockError = error;
}

/**
 * Clear mock user data
 */
function clearMockUser() {
  mockUserData = null;
  mockError = null;
}

/**
 * Mock Supabase server client
 */
class MockSupabaseClient {
  constructor(url, key, options) {
    this.url = url;
    this.key = key;
    this.options = options;

    this.auth = {
      getUser: jest.fn(async () => {
        return {
          data: { user: mockUserData },
          error: mockError,
        };
      }),
      getSession: jest.fn(async () => {
        if (mockUserData) {
          return {
            data: {
              session: {
                user: mockUserData,
                access_token: 'mock-access-token',
                token_type: 'bearer',
              },
            },
            error: null,
          };
        }
        return {
          data: { session: null },
          error: { message: 'No session' },
        };
      }),
    };
  }
}

/**
 * Create server client (mocked)
 */
function createServerClient(url, key, options) {
  return new MockSupabaseClient(url, key, options);
}

/**
 * Create browser client (mocked) - for completeness
 */
function createBrowserClient(url, key, options) {
  return new MockSupabaseClient(url, key, options);
}

module.exports = {
  createServerClient: jest.fn(createServerClient),
  createBrowserClient: jest.fn(createBrowserClient),
  // Test helpers
  setMockUser,
  clearMockUser,
};
