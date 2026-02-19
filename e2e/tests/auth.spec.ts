import { test, expect } from '@playwright/test';
import { dismissWebpackOverlay } from '../fixtures/helpers';

/**
 * Auth Flow Tests (UI-level)
 */
test.describe('Authentication Flows', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Use timeout-based wait — CRA HMR WebSocket prevents waitForLoadState('networkidle')
    await page.waitForTimeout(1500);
    await dismissWebpackOverlay(page);
  });

  test('"Log in" button opens the auth modal', async ({ page }) => {
    await page.locator('button:has-text("Log in")').first().click();
    await page.waitForTimeout(500);
    await expect(page.locator('input[type="email"]').first()).toBeVisible({ timeout: 8_000 });
  });

  test('"Get Started" button opens the auth signup modal', async ({ page }) => {
    await page.locator('button:has-text("Get Started")').first().click();
    await page.waitForTimeout(500);
    await expect(page.locator('input[type="email"]').first()).toBeVisible({ timeout: 8_000 });
  });

  test('auth modal has email and password inputs', async ({ page }) => {
    await page.locator('button:has-text("Log in")').first().click();
    await page.waitForTimeout(500);
    await expect(page.locator('input[type="email"]').first()).toBeVisible({ timeout: 6_000 });
    await expect(page.locator('input[type="password"]').first()).toBeVisible({ timeout: 6_000 });
  });

  test('auth modal email input validates format (HTML5 constraint)', async ({ page }) => {
    await page.locator('button:has-text("Log in")').first().click();
    await page.waitForTimeout(500);
    const emailField = page.locator('input[type="email"]').first();
    await expect(emailField).toBeVisible({ timeout: 6_000 });
    await emailField.fill('not-an-email');
    await emailField.press('Tab');
    const isInvalid = await emailField.evaluate((el: HTMLInputElement) => !el.validity.valid);
    expect(isInvalid).toBe(true);
  });

  test('/auth/callback page renders without crashing', async ({ page }) => {
    await page.goto('/auth/callback');
    await page.waitForTimeout(3000);
    const body = await page.textContent('body');
    expect(body?.trim().length).toBeGreaterThan(5);
  });
});
