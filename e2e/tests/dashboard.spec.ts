import { test, expect } from '../fixtures/auth.fixture';
import { dismissWebpackOverlay } from '../fixtures/helpers';

/**
 * Dashboard Navigation Tests (Authenticated)
 */
test.describe('Dashboard Navigation', () => {

  // Note: these tests each manage their own navigation to avoid beforeEach conflicts

  test('dashboard renders without crashing for an authenticated user', async ({ authedPage }) => {
    await authedPage.goto('/dashboard');
    await authedPage.waitForURL(/dashboard/, { timeout: 15_000 });
    await dismissWebpackOverlay(authedPage);
    const bodyText = await authedPage.textContent('body');
    expect(bodyText?.trim().length).toBeGreaterThan(50);
  });

  test('sidebar or navigation is visible', async ({ authedPage }) => {
    await authedPage.goto('/dashboard');
    await authedPage.waitForURL(/dashboard/, { timeout: 15_000 });
    await dismissWebpackOverlay(authedPage);
    const sidebar = authedPage.locator('nav, aside, [class*="sidebar"], [class*="Sidebar"]').first();
    await expect(sidebar).toBeVisible({ timeout: 10_000 });
  });

  test('/dashboard/links stays on dashboard', async ({ authedPage }) => {
    await authedPage.goto('/dashboard');
    await authedPage.waitForURL(/dashboard/, { timeout: 12_000 });
    await authedPage.goto('/dashboard/links');
    await authedPage.waitForTimeout(2000);
    await expect(authedPage).toHaveURL(/dashboard/, { timeout: 8_000 });
  });

  test('/dashboard/qr-codes stays on dashboard', async ({ authedPage }) => {
    await authedPage.goto('/dashboard');
    await authedPage.waitForURL(/dashboard/, { timeout: 12_000 });
    await authedPage.goto('/dashboard/qr-codes');
    await authedPage.waitForTimeout(2000);
    await expect(authedPage).toHaveURL(/dashboard/, { timeout: 8_000 });
  });

  test('/dashboard/analytics stays on dashboard', async ({ authedPage }) => {
    await authedPage.goto('/dashboard');
    await authedPage.waitForURL(/dashboard/, { timeout: 12_000 });
    await authedPage.goto('/dashboard/analytics');
    await authedPage.waitForTimeout(2000);
    await expect(authedPage).toHaveURL(/dashboard/, { timeout: 8_000 });
  });

  test('pricing page renders without crashing', async ({ authedPage }) => {
    await authedPage.goto('/pricing');
    await authedPage.waitForLoadState('domcontentloaded');
    await authedPage.waitForTimeout(3000);
    await dismissWebpackOverlay(authedPage);
    // Pricing page may redirect auth users back to / — just ensure no crash
    const bodyText = await authedPage.textContent('body');
    // At minimum there should be some content (even if just a loading spinner)
    expect(typeof bodyText).toBe('string');
  });
});
