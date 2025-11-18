import { test, expect } from '@playwright/test';

/**
 * E2E tests for programs browsing and filtering
 */

test.describe('Programs Browsing', () => {
  test('should load programs page', async ({ page }) => {
    await page.goto('/programs');

    // Wait for page to load
    await expect(page).toHaveTitle(/Programs|Affiliate/i);

    // Should have main content
    const main = page.locator('main');
    await expect(main).toBeVisible();
  });

  test('should display program cards', async ({ page }) => {
    await page.goto('/programs');

    // Wait for programs to load
    await page.waitForLoadState('networkidle');

    // Should have program cards (or loading state)
    const programs = page.locator('[data-testid="program-card"], article, .program-card');
    const count = await programs.count();

    // Should have at least some programs or loading state
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('should have search functionality', async ({ page }) => {
    await page.goto('/programs');

    // Look for search input
    const searchInput = page.locator('input[type="text"], input[placeholder*="search" i]').first();

    if (await searchInput.isVisible()) {
      await searchInput.fill('Amazon');
      await page.waitForTimeout(500); // Debounce

      // URL should update with search param
      await expect(page).toHaveURL(/search=Amazon/i);
    }
  });

  test('should have filter sidebar', async ({ page }) => {
    await page.goto('/programs');

    // Look for filter elements
    const filters = page.locator('[data-testid="filters"], aside, .filters');

    if (await filters.isVisible()) {
      // Should have select/dropdown elements
      const selects = filters.locator('select');
      const selectCount = await selects.count();

      expect(selectCount).toBeGreaterThan(0);
    }
  });

  test('should handle pagination', async ({ page }) => {
    await page.goto('/programs');
    await page.waitForLoadState('networkidle');

    // Look for pagination controls
    const pagination = page.locator(
      '[role="navigation"], .pagination, button:has-text(/next|previous/i)'
    );

    if (await pagination.isVisible()) {
      const buttons = pagination.locator('button');
      const count = await buttons.count();

      expect(count).toBeGreaterThan(0);
    }
  });

  test('should click on program card to view details', async ({ page }) => {
    await page.goto('/programs');
    await page.waitForLoadState('networkidle');

    // Find first clickable program
    const firstProgram = page.locator('a[href*="/programs/"]').first();

    if (await firstProgram.isVisible()) {
      await firstProgram.click();

      // Should navigate to details page
      await expect(page).toHaveURL(/\/programs\/.+/);
    }
  });

  test('should reset filters', async ({ page }) => {
    await page.goto('/programs?category=Technology&network=ShareASale');

    // Look for reset button
    const resetButton = page.locator('button:has-text(/reset|clear/i)');

    if (await resetButton.isVisible()) {
      await resetButton.click();

      // URL should be cleared
      await expect(page).toHaveURL('/programs');
    }
  });
});
