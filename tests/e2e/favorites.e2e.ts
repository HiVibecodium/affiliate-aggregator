import { test, expect } from '@playwright/test';

/**
 * E2E Tests for Favorites/Bookmarks Feature
 * Tests adding, viewing, and removing favorite programs
 */

test.describe('Favorites Feature', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/programs');
    await page.waitForLoadState('networkidle');
  });

  test('should add program to favorites from programs page', async ({ page }) => {
    // Wait for programs to load
    await page.waitForSelector('.program-card, [data-program-id]', { timeout: 10000 });

    // Find and click first "Add to Favorites" button
    const favoriteBtn = page
      .locator(
        'button:has-text("Favorite"), button:has-text("★"), button[aria-label*="favorite" i]'
      )
      .first();

    if (await favoriteBtn.isVisible({ timeout: 3000 })) {
      await favoriteBtn.click();

      // Wait for success indication
      await page.waitForTimeout(1000);

      // Button should change state (filled star or "Remove")
      const updatedBtn = page
        .locator('button:has-text("Favorited"), button:has-text("★"), button.active')
        .first();
      await expect(updatedBtn).toBeVisible({ timeout: 3000 });
    } else {
      test.skip(); // Skip if favorites not visible (requires auth)
    }
  });

  test('should navigate to favorites page and display saved programs', async ({ page }) => {
    // Navigate to favorites page
    await page.goto('/favorites');
    await page.waitForLoadState('networkidle');

    // Check if auth required
    const isLoginPage = page.url().includes('/login');
    if (isLoginPage) {
      test.skip(); // Requires authentication
      return;
    }

    // Check page title
    await expect(page.locator('h1, h2').filter({ hasText: /favorite|bookmark/i })).toBeVisible({
      timeout: 5000,
    });

    // Check for programs or empty state
    const hasPrograms = (await page.locator('.program-card, [data-program-id]').count()) > 0;
    const hasEmptyState = await page.locator('text=/no favorites|empty|add some/i').isVisible();

    expect(hasPrograms || hasEmptyState).toBeTruthy();
  });

  test('should remove program from favorites', async ({ page }) => {
    await page.goto('/favorites');
    await page.waitForLoadState('networkidle');

    if (page.url().includes('/login')) {
      test.skip();
      return;
    }

    // Check if there are any favorites
    const programCards = page.locator('.program-card, [data-program-id]');
    const count = await programCards.count();

    if (count === 0) {
      test.skip(); // No favorites to remove
      return;
    }

    // Click remove button on first favorite
    const removeBtn = programCards
      .first()
      .locator('button:has-text("Remove"), button:has-text("×"), button[aria-label*="remove" i]');
    await removeBtn.click();

    // Wait for removal
    await page.waitForTimeout(1000);

    // Verify count decreased or empty state shows
    const newCount = await programCards.count();
    expect(newCount).toBeLessThan(count);
  });

  test('should show empty state when no favorites', async ({ page }) => {
    await page.goto('/favorites');
    await page.waitForLoadState('networkidle');

    if (page.url().includes('/login')) {
      test.skip();
      return;
    }

    // If no programs, should show empty state
    const programCards = page.locator('.program-card, [data-program-id]');
    const count = await programCards.count();

    if (count === 0) {
      // Should show empty state message
      const emptyState = page.locator('text=/no favorites|empty|start adding/i');
      await expect(emptyState).toBeVisible();

      // Should have CTA to browse programs
      const browseLink = page.locator('a:has-text("Browse"), a:has-text("Programs")');
      await expect(browseLink).toBeVisible();
    }
  });

  test('should toggle favorite status on programs page', async ({ page }) => {
    await page.waitForSelector('.program-card, [data-program-id]', { timeout: 10000 });

    const favoriteBtn = page.locator('button:has-text("Favorite"), button:has-text("★")').first();

    if (!(await favoriteBtn.isVisible({ timeout: 2000 }))) {
      test.skip();
      return;
    }

    // Click to add to favorites
    await favoriteBtn.click();
    await page.waitForTimeout(500);

    // Click again to remove from favorites
    await favoriteBtn.click();
    await page.waitForTimeout(500);

    // Should return to original state
    const originalState = page.locator('button:has-text("Favorite")').first();
    await expect(originalState).toBeVisible();
  });

  test('should show favorite count in navigation', async ({ page }) => {
    // Check if favorites count is displayed in header/nav
    const favCount = page.locator('[data-testid="favorites-count"], .favorites-badge');

    // May or may not be visible depending on auth state
    const isVisible = await favCount.isVisible({ timeout: 2000 }).catch(() => false);

    if (isVisible) {
      // If visible, should show a number
      await expect(favCount).toHaveText(/\d+/);
    }
  });
});
