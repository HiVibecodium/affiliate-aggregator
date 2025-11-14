import { test, expect } from '@playwright/test';

/**
 * E2E Tests for Comparison Tool
 * Tests the complete user flow for comparing affiliate programs
 */

test.describe('Comparison Tool', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/programs');
    await page.waitForLoadState('networkidle');
  });

  test('should add programs to comparison from programs page', async ({ page }) => {
    // Wait for programs to load
    await page.waitForSelector('.program-card, [data-program-id]', { timeout: 10000 });

    // Find and click first "Add to Compare" button
    const firstCompareBtn = page
      .locator('button:has-text("Compare"), button:has-text("Сравнить")')
      .first();
    await firstCompareBtn.waitFor({ state: 'visible', timeout: 5000 });
    await firstCompareBtn.click();

    // Check that comparison bar appears
    const comparisonBar = page.locator('.comparison-bar, [data-testid="comparison-bar"]');
    await expect(comparisonBar).toBeVisible({ timeout: 5000 });

    // Verify count shows 1
    await expect(page.locator('text=/\\(1\\/5\\)|1 program/i')).toBeVisible();
  });

  test('should add multiple programs to comparison', async ({ page }) => {
    await page.waitForSelector('.program-card, [data-program-id]', { timeout: 10000 });

    // Add 3 programs to comparison
    const compareButtons = page.locator('button:has-text("Compare"), button:has-text("Сравнить")');

    for (let i = 0; i < 3; i++) {
      await compareButtons.nth(i).click();
      await page.waitForTimeout(500);
    }

    // Check comparison bar shows 3 programs
    await expect(page.locator('text=/\\(3\\/5\\)|3 program/i')).toBeVisible();

    // Verify 3 program cards in comparison bar
    const comparisonItems = page.locator(
      '.comparison-bar [data-program-id], .comparison-bar .program-item'
    );
    await expect(comparisonItems).toHaveCount(3, { timeout: 5000 });
  });

  test('should remove program from comparison bar', async ({ page }) => {
    await page.waitForSelector('.program-card, [data-program-id]', { timeout: 10000 });

    // Add 2 programs
    const compareButtons = page.locator('button:has-text("Compare"), button:has-text("Сравнить")');
    await compareButtons.nth(0).click();
    await page.waitForTimeout(300);
    await compareButtons.nth(1).click();

    // Wait for comparison bar
    await expect(page.locator('text=/\\(2\\/5\\)|2 program/i')).toBeVisible();

    // Click remove button on first program in comparison bar
    const removeBtn = page
      .locator('.comparison-bar button[title*="Remove"], .comparison-bar button:has-text("×")')
      .first();
    await removeBtn.click();

    // Verify count decreased
    await expect(page.locator('text=/\\(1\\/5\\)|1 program/i')).toBeVisible();
  });

  test('should clear all programs from comparison', async ({ page }) => {
    await page.waitForSelector('.program-card, [data-program-id]', { timeout: 10000 });

    // Add programs
    const compareButtons = page.locator('button:has-text("Compare"), button:has-text("Сравнить")');
    await compareButtons.nth(0).click();
    await page.waitForTimeout(300);
    await compareButtons.nth(1).click();

    // Click clear all button
    const clearBtn = page.locator('button:has-text("Clear"), button:has-text("Очистить")').first();
    await clearBtn.click();

    // Verify comparison bar disappears
    const comparisonBar = page.locator('.comparison-bar');
    await expect(comparisonBar).not.toBeVisible({ timeout: 3000 });
  });

  test('should navigate to comparison page and show programs', async ({ page }) => {
    await page.waitForSelector('.program-card, [data-program-id]', { timeout: 10000 });

    // Add 2 programs
    const compareButtons = page.locator('button:has-text("Compare"), button:has-text("Сравнить")');
    await compareButtons.nth(0).click();
    await page.waitForTimeout(300);
    await compareButtons.nth(1).click();

    // Click "Compare" button in comparison bar
    const comparePageBtn = page
      .locator('.comparison-bar a:has-text("Compare"), .comparison-bar a:has-text("Сравнить")')
      .first();
    await comparePageBtn.click();

    // Verify navigation to /compare
    await page.waitForURL('**/compare', { timeout: 5000 });

    // Verify programs are displayed on comparison page
    const comparisonCards = page.locator('.comparison-card, [data-comparison-program]');
    await expect(comparisonCards).toHaveCount(2, { timeout: 5000 });
  });

  test('should enforce maximum of 5 programs limit', async ({ page }) => {
    await page.waitForSelector('.program-card, [data-program-id]', { timeout: 10000 });

    const compareButtons = page.locator('button:has-text("Compare"), button:has-text("Сравнить")');

    // Try to add 6 programs (limit is 5)
    for (let i = 0; i < 6; i++) {
      const btn = compareButtons.nth(i);
      if (await btn.isVisible()) {
        await btn.click();
        await page.waitForTimeout(300);
      }
    }

    // Verify maximum is 5
    await expect(page.locator('text=/\\(5\\/5\\)|5 program/i')).toBeVisible();

    // Verify 6th button is disabled or shows message
    const sixthBtn = compareButtons.nth(5);
    const isDisabled = await sixthBtn.isDisabled().catch(() => false);
    const hasMaxMessage = await page
      .locator('text=/maximum|max 5|limit/i')
      .isVisible()
      .catch(() => false);

    expect(isDisabled || hasMaxMessage).toBeTruthy();
  });

  test('should persist comparison across page navigation', async ({ page }) => {
    await page.waitForSelector('.program-card, [data-program-id]', { timeout: 10000 });

    // Add programs
    const compareButtons = page.locator('button:has-text("Compare"), button:has-text("Сравнить")');
    await compareButtons.nth(0).click();

    // Navigate to dashboard
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');

    // Go back to programs
    await page.goto('/programs');
    await page.waitForLoadState('networkidle');

    // Verify comparison bar still shows 1 program
    await expect(page.locator('text=/\\(1\\/5\\)|1 program/i')).toBeVisible({ timeout: 5000 });
  });
});
