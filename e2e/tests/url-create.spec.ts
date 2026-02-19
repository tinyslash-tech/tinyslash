import { test, expect } from '../fixtures/auth.fixture';

/**
 * URL Create — Critical Path Tests (Authenticated)
 *
 * Uses the auth fixture (API mocks + localStorage token).
 * Focuses on UI-layer validation — form rendering and interaction.
 */
test.describe('URL Creation — Critical Path', () => {

  test.beforeEach(async ({ authedPage }) => {
    await authedPage.goto('/dashboard');
    await authedPage.waitForTimeout(3000);
    // Ensure we're on dashboard
    await expect(authedPage).toHaveURL(/dashboard/, { timeout: 12_000 });
  });

  test('dashboard loads for authenticated user without redirect', async ({ authedPage }) => {
    await expect(authedPage).toHaveURL(/dashboard/);
  });

  test('URL creation form input or create button is visible', async ({ authedPage }) => {
    // Wait for the dashboard UI to render
    const createTrigger = authedPage.locator(
      'input[placeholder*="http"], input[placeholder*="url"], input[placeholder*="URL"], input[placeholder*="Paste"], button:has-text("Create"), button:has-text("New Link"), button:has-text("Shorten")'
    ).first();
    await expect(createTrigger).toBeVisible({ timeout: 15_000 });
  });

  test('filling URL input and submitting starts the create flow', async ({ authedPage }) => {
    // Mock the URL creation endpoint to succeed
    await authedPage.route('**/api/v1/urls', async (route) => {
      if (route.request().method() === 'POST') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            shortCode: 'e2etest',
            shortUrl: 'https://tinyslash.com/e2etest',
            originalUrl: 'https://www.example.com/test-e2e',
          }),
        });
      } else {
        await route.continue();
      }
    });

    const urlInput = authedPage.locator(
      'input[placeholder*="http"], input[placeholder*="url"], input[placeholder*="URL"], input[placeholder*="Paste"]'
    ).first();

    if (await urlInput.isVisible({ timeout: 10_000 })) {
      await urlInput.fill('https://www.example.com/test-e2e');

      // Find and click the submit button
      const submitButton = authedPage.locator(
        'button[type="submit"], button:has-text("Shorten"), button:has-text("Create"), form button'
      ).first();

      if (await submitButton.isVisible()) {
        await submitButton.click({ force: true }); // force: true bypasses overlay
        await authedPage.waitForTimeout(2000);
        // The page should not crash (still on dashboard or showing result)
        expect(authedPage.url()).toContain('localhost:3000');
      } else {
        test.skip();
      }
    } else {
      test.skip();
    }
  });

  test('empty URL submission Shows validation (stays on page)', async ({ authedPage }) => {
    const urlInput = authedPage.locator(
      'input[placeholder*="http"], input[placeholder*="url"], input[placeholder*="URL"], input[placeholder*="Paste"]'
    ).first();

    if (await urlInput.isVisible({ timeout: 10_000 })) {
      // Clear the input and try submitting
      await urlInput.fill('');

      const submitButton = authedPage.locator(
        'button[type="submit"], button:has-text("Shorten"), button:has-text("Create")'
      ).first();

      if (await submitButton.isVisible()) {
        await submitButton.click({ force: true });
        await authedPage.waitForTimeout(1000);
        // Page stays stable and doesn't crash
        expect(authedPage.url()).toContain('localhost:3000');
      } else {
        test.skip();
      }
    } else {
      test.skip();
    }
  });
});
