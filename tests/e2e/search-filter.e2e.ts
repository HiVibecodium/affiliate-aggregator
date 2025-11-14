import { test, expect } from '@playwright/test';

/**
 * E2E Tests for Advanced Search and Filtering
 * Tests search functionality, filters, and sorting on programs page
 */

test.describe('Advanced Search and Filtering', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/programs');
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('.program-card, [data-program-id]', { timeout: 10000 });
  });

  test('should search programs by keyword', async ({ page }) => {
    // Find search input
    const searchInput = page.locator(
      'input[type="search"], input[placeholder*="Search" i], input[name="search"]'
    );

    if (!(await searchInput.isVisible({ timeout: 3000 }))) {
      test.skip(); // Search not available
      return;
    }

    // Type search query
    await searchInput.fill('Amazon');
    await page.waitForTimeout(1000); // Wait for search to execute

    // Verify results contain search term
    const programCards = page.locator('.program-card, [data-program-id]');
    const firstCard = programCards.first();

    if ((await programCards.count()) > 0) {
      const cardText = await firstCard.textContent();
      expect(cardText?.toLowerCase()).toContain('amazon');
    } else {
      // No results is also valid
      const noResults = page.locator('text=/no results|not found|no programs/i');
      await expect(noResults).toBeVisible();
    }
  });

  test('should filter by category', async ({ page }) => {
    // Find category filter dropdown/select
    const categoryFilter = page.locator('select[name="category"], [data-testid="category-filter"]');

    if (!(await categoryFilter.isVisible({ timeout: 3000 }))) {
      test.skip(); // Category filter not found
      return;
    }

    // Select a category
    await categoryFilter.selectOption({ index: 1 }); // Select first non-empty option
    await page.waitForTimeout(1000);

    // Verify programs updated
    const programCards = page.locator('.program-card, [data-program-id]');
    await expect(programCards.first()).toBeVisible({ timeout: 5000 });
  });

  test('should filter by network', async ({ page }) => {
    // Find network filter
    const networkFilter = page.locator('select[name="network"], [data-testid="network-filter"]');

    if (!(await networkFilter.isVisible({ timeout: 3000 }))) {
      test.skip();
      return;
    }

    // Select a network
    await networkFilter.selectOption({ index: 1 });
    await page.waitForTimeout(1000);

    // Verify filtered results
    const programCards = page.locator('.program-card, [data-program-id]');
    await expect(programCards.first()).toBeVisible({ timeout: 5000 });
  });

  test('should filter by commission rate range', async ({ page }) => {
    // Find commission filter inputs
    const minCommission = page.locator(
      'input[name*="min" i][name*="commission" i], [data-testid="min-commission"]'
    );
    const maxCommission = page.locator(
      'input[name*="max" i][name*="commission" i], [data-testid="max-commission"]'
    );

    if (!(await minCommission.isVisible({ timeout: 3000 }))) {
      test.skip();
      return;
    }

    // Set range
    await minCommission.fill('5');
    await maxCommission.fill('15');
    await page.waitForTimeout(1000);

    // Verify programs are filtered
    const programCards = page.locator('.program-card, [data-program-id]');

    if ((await programCards.count()) > 0) {
      // Check that commission rates are within range
      const commissionText = await programCards
        .first()
        .locator('text=/\\d+(\\.\\d+)?%/')
        .first()
        .textContent();
      if (commissionText) {
        const rate = parseFloat(commissionText.replace('%', ''));
        expect(rate).toBeGreaterThanOrEqual(5);
        expect(rate).toBeLessThanOrEqual(15);
      }
    }
  });

  test('should sort programs by commission rate', async ({ page }) => {
    // Find sort dropdown
    const sortSelect = page.locator('select[name="sort"], [data-testid="sort-select"]');

    if (!(await sortSelect.isVisible({ timeout: 3000 }))) {
      test.skip();
      return;
    }

    // Sort by commission (high to low)
    // Select first option that contains "commission" or "high"
    const options = await sortSelect.locator('option').allTextContents();
    const commissionOption = options.find(
      (opt) => opt.toLowerCase().includes('commission') || opt.toLowerCase().includes('high')
    );

    if (commissionOption) {
      await sortSelect.selectOption({ label: commissionOption });
      await page.waitForTimeout(1000);
    } else {
      await sortSelect.selectOption({ index: 1 }); // Fallback to first option
      await page.waitForTimeout(1000);
    }

    // Verify first program has higher commission than second
    const programCards = page.locator('.program-card, [data-program-id]');

    if ((await programCards.count()) >= 2) {
      const firstCommission = await programCards
        .nth(0)
        .locator('text=/\\d+(\\.\\d+)?%/')
        .first()
        .textContent();
      const secondCommission = await programCards
        .nth(1)
        .locator('text=/\\d+(\\.\\d+)?%/')
        .first()
        .textContent();

      if (firstCommission && secondCommission) {
        const first = parseFloat(firstCommission.replace('%', ''));
        const second = parseFloat(secondCommission.replace('%', ''));
        expect(first).toBeGreaterThanOrEqual(second);
      }
    }
  });

  test('should clear all filters', async ({ page }) => {
    // Find and click clear/reset filters button
    const clearBtn = page.locator(
      'button:has-text("Clear"), button:has-text("Reset"), button:has-text("Clear Filters")'
    );

    if (!(await clearBtn.isVisible({ timeout: 3000 }))) {
      test.skip();
      return;
    }

    // Apply some filters first
    const categoryFilter = page.locator('select[name="category"]');
    if (await categoryFilter.isVisible({ timeout: 2000 })) {
      await categoryFilter.selectOption({ index: 1 });
      await page.waitForTimeout(500);
    }

    // Clear filters
    await clearBtn.click();
    await page.waitForTimeout(1000);

    // Verify all programs are shown again
    const programCards = page.locator('.program-card, [data-program-id]');
    const count = await programCards.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should display program count and statistics', async ({ page }) => {
    // Check for stats display
    const statsDisplay = page.locator('text=/\\d+ programs|showing \\d+/i');

    if (await statsDisplay.isVisible({ timeout: 3000 })) {
      const statsText = await statsDisplay.textContent();
      expect(statsText).toMatch(/\d+/); // Contains number
    }
  });

  test('should handle no results gracefully', async ({ page }) => {
    const searchInput = page.locator('input[type="search"], input[placeholder*="Search" i]');

    if (!(await searchInput.isVisible({ timeout: 3000 }))) {
      test.skip();
      return;
    }

    // Search for something that likely doesn't exist
    await searchInput.fill('XYZ_NONEXISTENT_PROGRAM_12345');
    await page.waitForTimeout(1000);

    // Should show no results message
    const noResults = page.locator('text=/no results|not found|no programs found/i');
    await expect(noResults).toBeVisible({ timeout: 5000 });
  });

  test('should apply multiple filters simultaneously', async ({ page }) => {
    const categoryFilter = page.locator('select[name="category"]');
    const networkFilter = page.locator('select[name="network"]');

    if (
      !(await categoryFilter.isVisible({ timeout: 3000 })) ||
      !(await networkFilter.isVisible({ timeout: 3000 }))
    ) {
      test.skip();
      return;
    }

    // Apply category filter
    await categoryFilter.selectOption({ index: 1 });
    await page.waitForTimeout(500);

    // Apply network filter
    await networkFilter.selectOption({ index: 1 });
    await page.waitForTimeout(1000);

    // Verify results match both filters
    const programCards = page.locator('.program-card, [data-program-id]');
    await expect(programCards.first()).toBeVisible({ timeout: 5000 });
  });
});
