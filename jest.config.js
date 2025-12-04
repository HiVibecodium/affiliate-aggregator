const nextJest = require('next/jest');

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
});

// Add any custom config to be passed to Jest
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  testEnvironmentOptions: {
    // Avoid issues with Next.js App Router during tests
    customExportConditions: [''],
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '@sentry/nextjs': '<rootDir>/__mocks__/@sentry/nextjs.js',
    '^uuid$': '<rootDir>/__mocks__/uuid.js',
    '^resend$': '<rootDir>/__mocks__/resend.js',
    '^next/server$': '<rootDir>/__mocks__/next/server.js',
    '^next/headers$': '<rootDir>/__mocks__/next/headers.js',
  },
  testPathIgnorePatterns: [
    '<rootDir>/.next/',
    '<rootDir>/node_modules/',
    '<rootDir>/tests/e2e/',
    '<rootDir>/tests/integration/e2e/',
  ],
  // Transform ESM modules from node_modules
  transformIgnorePatterns: ['node_modules/(?!(uuid|svix|resend)/)'],
  collectCoverageFrom: [
    'app/**/*.{js,jsx,ts,tsx}',
    'components/**/*.{js,jsx,ts,tsx}',
    'lib/**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/.next/**',
    '!**/coverage/**',
    '!**/dist/**',
  ],
  coverageThreshold: {
    global: {
      branches: 10,
      functions: 12,
      lines: 11,
      statements: 12,
    },
  },
  // Coverage reporting
  coverageReporters: ['text', 'text-summary', 'html', 'lcov', 'json'],
  coverageDirectory: '<rootDir>/coverage',
  // Test timeout for integration tests
  testTimeout: 30000,
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig);
