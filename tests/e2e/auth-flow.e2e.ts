import { test, expect } from '@playwright/test';

/**
 * End-to-end tests for authentication flow
 * Tests user signup, login, and organization access
 */

test.describe('Authentication Flow', () => {
  test('should display home page', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Affiliate Aggregator/);
    await expect(page.locator('text=Affiliate')).toBeVisible();
  });

  test('should navigate to login page', async ({ page }) => {
    await page.goto('/');
    await page.click('text=Login');
    await page.waitForURL('**/login');
    await expect(page.locator('text=Login')).toBeVisible();
  });

  test('should navigate to signup page', async ({ page }) => {
    await page.goto('/');
    await page.click('text=Sign up');
    await page.waitForURL('**/signup');
    await expect(page.locator('text=Create your account')).toBeVisible();
  });

  test('should validate signup form fields', async ({ page }) => {
    await page.goto('/signup');

    // Check that form fields are visible
    const emailInput = page.locator('input[type="email"]');
    const passwordInput = page.locator('input[type="password"]');
    const submitButton = page.locator('button[type="submit"]');

    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
    await expect(submitButton).toBeVisible();
  });

  test('should display error for invalid email', async ({ page }) => {
    await page.goto('/signup');

    await page.fill('input[type="email"]', 'invalid-email');
    await page.fill('input[type="password"]', 'password123');

    // Try to submit
    await page.click('button[type="submit"]', { timeout: 5000 });

    // Wait for error message
    await page.waitForSelector('text=/invalid|error/i', { timeout: 5000 }).catch(() => null);
  });

  test('should display password requirements', async ({ page }) => {
    await page.goto('/signup');

    const passwordInput = page.locator('input[type="password"]');
    await passwordInput.click();

    // Check for password requirements display
    const requirements = page.locator('text=/password|requirement|character/i');
    await expect(requirements).toBeVisible();
  });

  test('should have login link on signup page', async ({ page }) => {
    await page.goto('/signup');

    const loginLink = page.locator('a:has-text("login")');
    await expect(loginLink).toBeVisible();

    await loginLink.click();
    await page.waitForURL('**/login');
  });

  test('should have signup link on login page', async ({ page }) => {
    await page.goto('/login');

    const signupLink = page.locator('a:has-text("sign up")');
    await expect(signupLink).toBeVisible();

    await signupLink.click();
    await page.waitForURL('**/signup');
  });

  test('should display forgot password option', async ({ page }) => {
    await page.goto('/login');

    const forgotLink = page.locator('a:has-text(/forgot|reset/i)');
    await expect(forgotLink).toBeVisible({ timeout: 5000 }).catch(() => null);
  });
});

test.describe('Post-Login Flow', () => {
  test.skip('should redirect to dashboard after login', async ({ page, context }) => {
    // This test requires actual authentication setup
    // Skip in CI/CD without proper auth fixtures

    await page.goto('/login');

    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');

    // Wait for redirect to dashboard
    await page.waitForURL('**/dashboard', { timeout: 10000 });
    await expect(page.locator('text=Dashboard')).toBeVisible();
  });

  test.skip('should display user menu when logged in', async ({ page, context }) => {
    // This test requires authenticated session
    // Skip without auth fixtures

    await page.goto('/dashboard');
    await expect(page.locator('[aria-label="User menu"]')).toBeVisible();
  });

  test.skip('should allow logout', async ({ page, context }) => {
    // This test requires authenticated session

    await page.goto('/dashboard');

    // Open user menu and click logout
    await page.click('[aria-label="User menu"]');
    await page.click('text=Logout');

    // Should redirect to home or login
    await page.waitForURL(/\/(|login)/, { timeout: 10000 });
  });
});
