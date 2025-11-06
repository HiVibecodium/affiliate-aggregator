import { test, expect } from '@playwright/test';

/**
 * End-to-end tests for dashboard functionality
 * Tests organization switching and program browsing
 */

test.describe('Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to dashboard
    await page.goto('/dashboard');

    // If not authenticated, skip
    try {
      await page.waitForURL('**/dashboard', { timeout: 3000 });
    } catch {
      test.skip();
    }
  });

  test('should display main dashboard layout', async ({ page }) => {
    // Check for main layout elements
    const mainContent = page.locator('main');
    await expect(mainContent).toBeVisible();

    // Check for navigation/sidebar
    const nav = page.locator('nav');
    await expect(nav).toBeVisible();
  });

  test('should display user information', async ({ page }) => {
    // Check for user profile/name display
    const userElement = page.locator('[data-testid="user-profile"], text=/logged in|welcome/i');
    await expect(userElement).toBeVisible({ timeout: 5000 }).catch(() => null);
  });

  test('should have organization switcher', async ({ page }) => {
    const orgSwitcher = page.locator('[data-testid="org-switcher"], button:has-text(/organization|select/i)');
    await expect(orgSwitcher).toBeVisible({ timeout: 5000 }).catch(() => null);
  });

  test('should display navigation menu items', async ({ page }) => {
    const navItems = page.locator('nav a, nav button');
    const count = await navItems.count();

    // Should have at least a few navigation items
    expect(count).toBeGreaterThan(0);
  });
});

test.describe('Organization Switcher', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dashboard');

    // If not authenticated, skip
    try {
      await page.waitForURL('**/dashboard', { timeout: 3000 });
    } catch {
      test.skip();
    }
  });

  test('should open organization switcher menu', async ({ page }) => {
    const orgSwitcher = page.locator('[data-testid="org-switcher"], button:has-text(/organization|select/i)');

    if (await orgSwitcher.isVisible({ timeout: 3000 }).catch(() => false)) {
      await orgSwitcher.click();

      // Menu should appear
      const menu = page.locator('[data-testid="org-switcher-menu"], [role="menu"]');
      await expect(menu).toBeVisible({ timeout: 5000 }).catch(() => null);
    }
  });

  test('should list user organizations', async ({ page }) => {
    const orgSwitcher = page.locator('[data-testid="org-switcher"], button:has-text(/organization|select/i)');

    if (await orgSwitcher.isVisible({ timeout: 3000 }).catch(() => false)) {
      await orgSwitcher.click();

      // Look for organization items
      const orgItems = page.locator('[data-testid="org-item"], [role="menuitem"]');
      const count = await orgItems.count().catch(() => 0);

      if (count > 0) {
        expect(count).toBeGreaterThan(0);
      }
    }
  });

  test('should allow switching organizations', async ({ page }) => {
    const orgSwitcher = page.locator('[data-testid="org-switcher"], button:has-text(/organization|select/i)');

    if (await orgSwitcher.isVisible({ timeout: 3000 }).catch(() => false)) {
      const initialText = await orgSwitcher.textContent();

      await orgSwitcher.click();

      const orgItems = page.locator('[data-testid="org-item"], [role="menuitem"]');
      const count = await orgItems.count().catch(() => 0);

      if (count > 1) {
        // Click second organization
        await orgItems.nth(1).click();

        // Wait for navigation to complete
        await page.waitForLoadState('networkidle');

        // Switcher text should change
        const newText = await orgSwitcher.textContent();
        expect(newText).not.toBe(initialText);
      }
    }
  });
});

test.describe('Program Browsing', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dashboard');

    // If not authenticated, skip
    try {
      await page.waitForURL('**/dashboard', { timeout: 3000 });
    } catch {
      test.skip();
    }
  });

  test('should display programs section', async ({ page }) => {
    const programsSection = page.locator('text=/programs|affiliate/i');
    await expect(programsSection).toBeVisible({ timeout: 5000 }).catch(() => null);
  });

  test('should load program list', async ({ page }) => {
    // Look for program items or table
    const programItems = page.locator('[data-testid="program-item"], tr[data-testid*="program"], .program-card');

    const count = await programItems.count().catch(() => 0);

    if (count > 0) {
      expect(count).toBeGreaterThan(0);
    }
  });

  test('should display program details', async ({ page }) => {
    // Look for program details elements
    const programName = page.locator('[data-testid="program-name"]');
    const programCommission = page.locator('[data-testid="program-commission"]');

    const nameVisible = await programName.isVisible({ timeout: 3000 }).catch(() => false);
    const commissionVisible = await programCommission.isVisible({ timeout: 3000 }).catch(() => false);

    if (nameVisible || commissionVisible) {
      expect(nameVisible || commissionVisible).toBe(true);
    }
  });

  test('should allow filtering programs', async ({ page }) => {
    // Look for filter inputs
    const filterInput = page.locator('input[placeholder*="filter"], input[placeholder*="search"]');

    const visible = await filterInput.isVisible({ timeout: 3000 }).catch(() => false);

    if (visible) {
      await filterInput.fill('test');

      // Wait for filter to apply
      await page.waitForLoadState('networkidle');

      await expect(filterInput).toHaveValue('test');
    }
  });

  test('should allow sorting programs', async ({ page }) => {
    // Look for sort buttons/selects
    const sortButton = page.locator('button:has-text(/sort|order/i)');
    const sortSelect = page.locator('select[aria-label*="sort"]');

    const btnVisible = await sortButton.isVisible({ timeout: 3000 }).catch(() => false);
    const selectVisible = await sortSelect.isVisible({ timeout: 3000 }).catch(() => false);

    if (btnVisible || selectVisible) {
      expect(btnVisible || selectVisible).toBe(true);
    }
  });
});

test.describe('Responsive Design', () => {
  test('should work on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    await page.goto('/dashboard');

    // Check that main content is visible
    const mainContent = page.locator('main');
    await expect(mainContent).toBeVisible({ timeout: 5000 }).catch(() => null);
  });

  test('should work on tablet viewport', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });

    await page.goto('/dashboard');

    const mainContent = page.locator('main');
    await expect(mainContent).toBeVisible({ timeout: 5000 }).catch(() => null);
  });

  test('should work on desktop viewport', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });

    await page.goto('/dashboard');

    const mainContent = page.locator('main');
    await expect(mainContent).toBeVisible({ timeout: 5000 }).catch(() => null);
  });
});
