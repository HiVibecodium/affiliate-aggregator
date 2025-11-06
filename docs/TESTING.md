# Testing Infrastructure - Phase 0 MVB #2

## Overview

Comprehensive testing infrastructure for the Affiliate Aggregator project, achieving 30%+ code coverage across unit, integration, and E2E tests.

## Test Structure

```
tests/
├── unit/                          # Unit tests (~15-20% coverage)
│   ├── rbac-permissions.test.ts   # RBAC role and permission tests
│   ├── rbac-utils.test.ts         # RBAC utility function tests
│   └── org-middleware.test.ts     # Organization middleware tests
├── integration/                   # Integration tests (~10% coverage)
│   ├── organizations-api.test.ts  # Organizations API endpoints
│   └── data-import.test.ts        # Data import functionality
├── e2e/                           # End-to-end tests (~5% coverage)
│   ├── auth-flow.e2e.ts           # Authentication flows
│   └── dashboard.e2e.ts           # Dashboard and organization features
└── helpers.ts                     # Shared test utilities and factories
```

## Test Frameworks

### Jest (Unit & Integration Tests)
- **Framework**: Jest 29.7.0
- **Environment**: JSDOM (client) + Node.js (server)
- **Coverage Reporter**: HTML, LCOV, JSON

### Playwright (E2E Tests)
- **Framework**: Playwright 1.45.0
- **Browsers**: Chromium, Firefox, WebKit
- **Mobile Testing**: Pixel 5 (mobile Chrome)
- **Recording**: Screenshots and videos on failure

## Running Tests

### Unit Tests Only
```bash
npm run test:unit
```

### Integration Tests Only
```bash
npm run test:integration
```

### E2E Tests
```bash
npm run test:e2e
```

### All Tests
```bash
npm test
```

### Coverage Report
```bash
npm run test:coverage
```

## Test Coverage Goals

| Category | Target | Files | Tests |
|----------|--------|-------|-------|
| Unit Tests | 15-20% | 3 | 25+ |
| Integration Tests | 10% | 2 | 15+ |
| E2E Tests | 5% | 2 | 10+ |
| **Total** | **30%+** | **7** | **50+** |

## Unit Tests

### RBAC Permissions (rbac-permissions.test.ts)
Tests the role-based access control permission system.

**Coverage**:
- Permission enum definitions
- Role hierarchy (Owner > Admin > Manager > Member > Viewer)
- Role getters (getRole, getAllRoles, isValidRole)
- Permission getters (getRolePermissions, getRoleName, getRoleDescription)
- Role hierarchy functions (hasHigherOrEqualRole, canManageRole)
- Permission consistency validation

**Key Tests**:
```typescript
✓ Owner role has maximum permissions
✓ Viewer role has minimal permissions
✓ Role hierarchy is enforced
✓ Admin cannot manage billing
✓ Manager cannot manage users
✓ Cannot manage users with equal or higher role
```

### RBAC Utils (rbac-utils.test.ts)
Tests RBAC utility functions for permission checking.

**Coverage**:
- Permission checking (hasPermission, hasAnyPermission, hasAllPermissions)
- Role validation (hasMinimumRole, validateAction)
- Context creation and manipulation
- Available permissions filtering
- User management authorization
- Permission granting
- Audit log creation
- Convenience functions (can, isRole, isOwner, isAdminOrAbove)

**Key Tests**:
```typescript
✓ Owner can manage all roles
✓ Admin can manage lower roles
✓ Viewer cannot manage any role
✓ Permission checks work with explicit and role-based
✓ RBAC context is properly created
✓ Audit log includes proper details
```

### Organization Middleware (org-middleware.test.ts)
Tests organization context and middleware functions.

**Coverage**:
- OrgContext to RBACContext conversion
- Getting user organizations
- Current organization selection
- Organization switching
- Permission validation in organizations
- Organization membership verification

**Key Tests**:
```typescript
✓ Returns all user organizations
✓ Filters only active memberships
✓ Selects most recent organization
✓ Switches organization correctly
✓ Validates permissions in correct org
✓ Handles multi-organization flows
```

## Integration Tests

### Organizations API (organizations-api.test.ts)
Tests API endpoints for organization management.

**Coverage**:
- GET /api/organizations (list user organizations)
- POST /api/organizations (create new organization)
- Authentication validation
- Database error handling
- Duplicate slug detection
- User creation on first organization
- Audit log creation

**Key Tests**:
```typescript
✓ Returns authenticated user organizations
✓ Returns 401 if user not authenticated
✓ Returns 400 for missing required fields
✓ Returns 400 for invalid slug format
✓ Returns 409 for duplicate slug
✓ Creates user if not exists
✓ Creates organization with owner membership
```

### Data Import (data-import.test.ts)
Tests bulk affiliate program import system.

**Coverage**:
- Network creation and updates (upsert)
- Program creation and updates
- Batch import operations
- Error handling
- Data validation
- Commission type handling
- Payment method arrays
- Cookie duration handling

**Key Tests**:
```typescript
✓ Creates new network if not exists
✓ Updates existing network
✓ Handles program with all commission types
✓ Handles payment methods array
✓ Processes batch imports
✓ Skips duplicate programs
✓ Maintains data integrity in batch
✓ Handles constraint violations
```

## E2E Tests

### Authentication Flow (auth-flow.e2e.ts)
Tests user authentication workflows.

**Coverage**:
- Home page display
- Navigation to login/signup
- Form field validation
- Error messages
- Password requirements display
- Cross-page navigation
- Forgot password flow

**Key Tests**:
```typescript
✓ Displays home page
✓ Navigates to login page
✓ Navigates to signup page
✓ Validates signup form fields
✓ Displays error for invalid email
✓ Shows password requirements
✓ Has cross-page navigation links
```

### Dashboard (dashboard.e2e.ts)
Tests dashboard functionality and user workflows.

**Coverage**:
- Main dashboard layout
- Organization switcher
- Navigation menu
- Program browsing and filtering
- Organization switching
- Responsive design (mobile, tablet, desktop)

**Key Tests**:
```typescript
✓ Displays main dashboard layout
✓ Shows user information
✓ Has organization switcher
✓ Lists user organizations
✓ Allows switching organizations
✓ Displays programs section
✓ Allows filtering programs
✓ Works on mobile viewport
✓ Works on tablet viewport
✓ Works on desktop viewport
```

## Test Data Factories

Helper functions for creating consistent test data:

```typescript
// RBAC Context
createMockRBACContext(overrides?)
MOCK_ROLES.owner, MOCK_ROLES.admin, MOCK_ROLES.manager, etc.

// Organization Context
createMockOrgContext(overrides?)

// Data Factories
testDataFactories.user()
testDataFactories.organization()
testDataFactories.organizationMember()
testDataFactories.affiliateNetwork()
testDataFactories.affiliateProgram()
testDataFactories.auditLog()

// Assertions
assertions.assertRBACContext()
assertions.assertOrgContext()
assertions.assertPermissionResult()
```

## Jest Configuration

Key configuration in `jest.config.js`:

```javascript
{
  testEnvironment: 'jest-environment-jsdom', // or 'node' for integration
  projects: [
    {
      displayName: 'unit',
      testMatch: ['<rootDir>/tests/unit/**/*.test.{ts,tsx,js}'],
    },
    {
      displayName: 'integration',
      testMatch: ['<rootDir>/tests/integration/**/*.test.{ts,tsx,js}'],
    },
  ],
  coverageThreshold: {
    global: {
      branches: 25,
      functions: 25,
      lines: 25,
      statements: 25,
    },
  },
  coverageReporters: ['text', 'text-summary', 'html', 'lcov', 'json'],
}
```

## Playwright Configuration

Key configuration in `playwright.config.ts`:

```typescript
{
  testDir: './tests/e2e',
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    { name: 'Mobile Chrome', use: { ...devices['Pixel 5'] } },
  ],
}
```

## CI/CD Integration

### GitHub Actions Workflow Updates

Tests are integrated into the GitHub Actions CI/CD pipeline with:

1. **Test Execution**
   - Unit tests on every push
   - Integration tests on every push
   - E2E tests on PR to main

2. **Coverage Gates**
   - Minimum 25% coverage required
   - Coverage reports uploaded
   - Failed tests block merge

3. **Performance Monitoring**
   - Test execution time tracked
   - Performance regressions detected
   - Results archived for analysis

## Best Practices

### Writing Unit Tests
1. Use descriptive test names
2. Test one behavior per test
3. Use mock data factories
4. Test edge cases and error conditions
5. Verify both success and failure paths

### Writing Integration Tests
1. Mock external dependencies
2. Test API contracts
3. Verify database interactions
4. Test error handling
5. Include realistic data scenarios

### Writing E2E Tests
1. Test user workflows end-to-end
2. Avoid testing implementation details
3. Use meaningful selectors (data-testid)
4. Handle async operations properly
5. Test responsive design

## Coverage Report

Generate coverage report with:

```bash
npm run test:coverage
```

Opens at: `./coverage/index.html`

Reports include:
- Line coverage
- Branch coverage
- Function coverage
- Statement coverage
- Uncovered lines highlighted

## Troubleshooting

### Tests failing locally but passing in CI
- Check Node version (requires >=20.0.0)
- Clear node_modules: `rm -rf node_modules && npm install`
- Reset Next.js cache: `rm -rf .next`

### E2E tests failing
- Ensure dev server is running: `npm run dev`
- Check port 3000 is available
- Review browser console in test results/videos

### Low coverage reports
- Check if all source files are being collected
- Verify coverage threshold in jest.config.js
- Run with `npm run test:coverage` for detailed report

## Future Enhancements

1. **Additional E2E Tests**
   - Full authentication flow with real auth
   - Organization creation workflow
   - Data import pipeline

2. **Performance Tests**
   - Load testing for bulk imports
   - API response time benchmarks
   - Database query optimization

3. **Accessibility Tests**
   - WCAG compliance validation
   - Keyboard navigation testing
   - Screen reader compatibility

4. **Visual Regression Tests**
   - Screenshot comparisons
   - Design system consistency

## Resources

- [Jest Documentation](https://jestjs.io/)
- [Playwright Documentation](https://playwright.dev/)
- [Testing Library Best Practices](https://testing-library.com/)
- [RBAC Testing Guide](./RBAC_TESTING.md)
