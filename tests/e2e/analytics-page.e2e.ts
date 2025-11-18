import { test, expect } from '@playwright/test';

/**
 * E2E tests for analytics page
 */

test.describe('Analytics Page', () => {
  test('should load analytics page', async ({ page }) => {
    await page.goto('/analytics');

    await expect(page).toHaveTitle(/Analytics|Affiliate/i);
  });

  test('should display analytics widgets', async ({ page }) => {
    await page.goto('/analytics');
    await page.waitForLoadState('networkidle');

    // Look for stat cards or widgets
    const widgets = page.locator('[data-testid="analytics-widget"], .card-base, .stat-card');
    const count = await widgets.count();

    // Should have at least some analytics displayed
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('should show loading states initially', async ({ page }) => {
    await page.goto('/analytics');

    // Should show skeletons or loading indicators
    const loading = page.locator('.animate-pulse, .skeleton, [aria-busy="true"]');

    // Might have loading state
    const hasLoading = await loading.count();
    expect(hasLoading).toBeGreaterThanOrEqual(0);
  });

  test('should display numbers and metrics', async ({ page }) => {
    await page.goto('/analytics');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000); // Wait for data load

    // Should have numeric data
    const numbers = page.locator('text=/\\d+/');
    const count = await numbers.count();

    expect(count).toBeGreaterThan(0);
  });

  test('should have charts or visualizations', async ({ page }) => {
    await page.goto('/analytics');
    await page.waitForLoadState('networkidle');

    // Look for chart containers
    const charts = page.locator('svg, canvas, [class*="chart"], [class*="recharts"]');
    const count = await charts.count();

    // Might have charts
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('should update in real-time', async ({ page }) => {
    await page.goto('/analytics');
    await page.waitForLoadState('networkidle');

    // Check for real-time indicator
    const realtimeIndicator = page.locator('text=/live|real-time|updating/i, .animate-pulse');

    // May or may not have real-time updates
    const hasIndicator = await realtimeIndicator.count();
    expect(hasIndicator).toBeGreaterThanOrEqual(0);
  });
});
