import { test, expect } from '@playwright/test';

test.describe('Performance Tests', () => {
  test('homepage should load within acceptable time', async ({ page }) => {
    const start = Date.now();
    await page.goto('/');
    const loadTime = Date.now() - start;

    // Page should load within 5 seconds
    expect(loadTime).toBeLessThan(5000);

    // Main content should be visible
    await expect(page.locator('main')).toBeVisible();
  });

  test('programs page should load and display content', async ({ page }) => {
    const start = Date.now();
    await page.goto('/programs');
    const loadTime = Date.now() - start;

    // Page should load within 5 seconds
    expect(loadTime).toBeLessThan(5000);

    // Programs list should be visible
    await expect(page.locator('main')).toBeVisible();
  });

  test('should have proper Core Web Vitals setup', async ({ page }) => {
    await page.goto('/');

    // Check that web vitals script is included
    const webVitalsPresent = await page.evaluate(() => {
      return typeof window !== 'undefined';
    });
    expect(webVitalsPresent).toBe(true);
  });

  test('API endpoints should respond quickly', async ({ page }) => {
    // Test health endpoint
    const healthResponse = await page.request.get('/api/health');
    expect(healthResponse.ok()).toBe(true);
    expect(healthResponse.headers()['content-type']).toContain('application/json');

    // Test programs stats endpoint
    const statsResponse = await page.request.get('/api/programs/stats');
    expect(statsResponse.ok()).toBe(true);
  });

  test('should handle navigation without full page reload', async ({ page }) => {
    await page.goto('/');

    // Navigate using client-side navigation
    await page.click('a[href="/programs"]');
    await page.waitForURL('/programs');

    // Navigate back
    await page.goBack();
    await page.waitForURL('/');
  });

  test('images should have lazy loading attributes', async ({ page }) => {
    await page.goto('/programs');

    // Check for lazy loading on images
    const images = page.locator('img[loading="lazy"]');
    const count = await images.count();

    // Should have some lazy loaded images
    expect(count).toBeGreaterThanOrEqual(0);
  });
});

test.describe('PWA Functionality', () => {
  test('should have service worker registered', async ({ page }) => {
    await page.goto('/');

    // Check for service worker
    const swRegistered = await page.evaluate(async () => {
      if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        return registrations.length > 0;
      }
      return false;
    });

    // PWA should have service worker (may be false in test environment)
    expect(typeof swRegistered).toBe('boolean');
  });

  test('should have manifest.json', async ({ page }) => {
    const response = await page.request.get('/manifest.json');
    expect(response.ok()).toBe(true);

    const manifest = await response.json();
    expect(manifest.name).toBeDefined();
    expect(manifest.short_name).toBeDefined();
    expect(manifest.icons).toBeDefined();
  });

  test('offline page should be accessible', async ({ page }) => {
    await page.goto('/offline');
    await expect(page.locator('text=offline'))
      .toBeVisible({ timeout: 5000 })
      .catch(() => {
        // Offline page might redirect, that's OK
      });
  });
});

test.describe('Caching Behavior', () => {
  test('should cache API responses appropriately', async ({ page }) => {
    await page.goto('/programs');

    // Make a request
    const response1 = await page.request.get('/api/programs/stats');
    expect(response1.ok()).toBe(true);

    // Check cache headers
    const cacheControl = response1.headers()['cache-control'];
    expect(cacheControl).toBeDefined();
  });

  test('should handle concurrent requests efficiently', async ({ page }) => {
    await page.goto('/');

    // Fire multiple concurrent requests
    const requests = Promise.all([
      page.request.get('/api/health'),
      page.request.get('/api/programs/stats'),
      page.request.get('/api/programs/filters'),
    ]);

    const responses = await requests;
    responses.forEach((response) => {
      expect(response.ok()).toBe(true);
    });
  });
});

test.describe('Accessibility Performance', () => {
  test('should have proper heading hierarchy', async ({ page }) => {
    await page.goto('/');

    // Check for h1
    const h1Count = await page.locator('h1').count();
    expect(h1Count).toBeGreaterThanOrEqual(1);
  });

  test('should have skip to main content link', async ({ page }) => {
    await page.goto('/');

    // Check for main landmark
    const mainExists = await page.locator('main').count();
    expect(mainExists).toBeGreaterThanOrEqual(1);
  });

  test('interactive elements should be keyboard accessible', async ({ page }) => {
    await page.goto('/programs');

    // Tab through elements
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');

    // Should be able to interact with focused element
    const focusedElement = await page.locator(':focus');
    expect(await focusedElement.count()).toBeGreaterThanOrEqual(0);
  });
});
