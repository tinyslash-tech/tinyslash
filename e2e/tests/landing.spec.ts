import { test, expect } from '@playwright/test';
import { dismissWebpackOverlay } from '../fixtures/helpers';

/**
 * Landing Page Tests (No Auth Required)
 *
 * Uses simple waitForTimeout instead of waitForLoadState('networkidle')
 * because CRA's HMR WebSocket keeps network always active, causing networkidle
 * to hang forever.
 */
test.describe('Landing Page', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait 1.5s for React to render — more reliable than waitForLoadState with CRA HMR
    await page.waitForTimeout(1500);
    await dismissWebpackOverlay(page);
  });

  test('should render the page with a visible hero heading', async ({ page }) => {
    await expect(page).toHaveURL('/');
    const heading = page.locator('h1, h2').first();
    await expect(heading).toBeVisible({ timeout: 8_000 });
  });

  test('should show "Log in" and "Get Started" buttons in the header', async ({ page }) => {
    await expect(page.locator('button:has-text("Log in")').first()).toBeVisible({ timeout: 8_000 });
    await expect(page.locator('button:has-text("Get Started")').first()).toBeVisible({ timeout: 8_000 });
  });

  test('should open auth modal when "Log in" is clicked', async ({ page }) => {
    await page.locator('button:has-text("Log in")').first().click();
    await page.waitForTimeout(500);
    // AuthModal should appear with an email input
    await expect(page.locator('input[type="email"]').first()).toBeVisible({ timeout: 8_000 });
  });

  test('should redirect unauthenticated users away from /dashboard', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForTimeout(2000);
    await expect(page).not.toHaveURL(/dashboard/);
  });

  test('Pricing button navigates to /pricing', async ({ page }) => {
    await page.locator('button:has-text("Pricing")').first().click();
    await expect(page).toHaveURL('/pricing', { timeout: 8_000 });
  });
});
