import { test, expect } from '@playwright/test';

test.describe('Admin Panel', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to admin dashboard
    await page.goto('/admin');
  });

  test('should display admin dashboard with key metrics', async ({ page }) => {
    // Check page title
    await expect(page.locator('h1')).toContainText('Admin Dashboard');

    // Check revenue section exists
    await expect(page.locator('text=Revenue')).toBeVisible();

    // Check users section exists
    await expect(page.locator('text=Users')).toBeVisible();

    // Check engagement section exists
    await expect(page.locator('text=Engagement')).toBeVisible();
  });

  test('should have working navigation sidebar', async ({ page }) => {
    // Check sidebar navigation items
    await expect(page.locator('nav a[href="/admin"]')).toBeVisible();
    await expect(page.locator('nav a[href="/admin/users"]')).toBeVisible();
    await expect(page.locator('nav a[href="/admin/programs"]')).toBeVisible();
    await expect(page.locator('nav a[href="/admin/reviews"]')).toBeVisible();
  });

  test('should navigate to users management page', async ({ page }) => {
    await page.click('nav a[href="/admin/users"]');
    await expect(page).toHaveURL('/admin/users');
    await expect(page.locator('h1')).toContainText('User Management');
  });

  test('should navigate to programs management page', async ({ page }) => {
    await page.click('nav a[href="/admin/programs"]');
    await expect(page).toHaveURL('/admin/programs');
    await expect(page.locator('h1')).toContainText('Program Management');
  });

  test('should navigate to reviews moderation page', async ({ page }) => {
    await page.click('nav a[href="/admin/reviews"]');
    await expect(page).toHaveURL('/admin/reviews');
    await expect(page.locator('h1')).toContainText('Review Moderation');
  });

  test('should have back to site link', async ({ page }) => {
    await expect(page.locator('a[href="/"]')).toBeVisible();
    await expect(page.locator('text=Back to Site')).toBeVisible();
  });
});

test.describe('Admin Users Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/admin/users');
  });

  test('should display users table', async ({ page }) => {
    await expect(page.locator('table')).toBeVisible();
    await expect(page.locator('th:has-text("User")')).toBeVisible();
    await expect(page.locator('th:has-text("Joined")')).toBeVisible();
    await expect(page.locator('th:has-text("2FA")')).toBeVisible();
  });

  test('should have search functionality', async ({ page }) => {
    const searchInput = page.locator('input[placeholder*="Search"]');
    await expect(searchInput).toBeVisible();

    await searchInput.fill('test@example.com');
    await page.click('button:has-text("Search")');

    // Wait for search to complete
    await page.waitForTimeout(500);
  });
});

test.describe('Admin Programs Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/admin/programs');
  });

  test('should display programs table', async ({ page }) => {
    await expect(page.locator('table')).toBeVisible();
    await expect(page.locator('th:has-text("Program")')).toBeVisible();
    await expect(page.locator('th:has-text("Network")')).toBeVisible();
    await expect(page.locator('th:has-text("Commission")')).toBeVisible();
    await expect(page.locator('th:has-text("Status")')).toBeVisible();
  });

  test('should have filter dropdown', async ({ page }) => {
    const filterSelect = page.locator('select');
    await expect(filterSelect).toBeVisible();

    // Check filter options
    await expect(filterSelect.locator('option[value="all"]')).toHaveText('All Programs');
    await expect(filterSelect.locator('option[value="active"]')).toHaveText('Active Only');
    await expect(filterSelect.locator('option[value="inactive"]')).toHaveText('Inactive Only');
  });
});

test.describe('Admin Reviews Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/admin/reviews');
  });

  test('should display review moderation filters', async ({ page }) => {
    await expect(page.locator('button:has-text("All")')).toBeVisible();
    await expect(page.locator('button:has-text("Pending")')).toBeVisible();
    await expect(page.locator('button:has-text("Verified")')).toBeVisible();
  });

  test('should filter reviews by status', async ({ page }) => {
    // Click pending filter
    await page.click('button:has-text("Pending")');
    await page.waitForTimeout(500);

    // Click verified filter
    await page.click('button:has-text("Verified")');
    await page.waitForTimeout(500);

    // Click all filter
    await page.click('button:has-text("All")');
    await page.waitForTimeout(500);
  });
});
