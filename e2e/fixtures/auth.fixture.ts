/**
 * Auth Fixture
 *
 * Extends Playwright's base `test` with an `authedPage` fixture.
 * The fixture:
 *  1. Mocks the POST /api/v1/auth/validate endpoint so any token is accepted
 *  2. Mocks the POST /api/v1/auth/refresh endpoint to prevent token-refresh loops
 *  3. Mocks common dashboard data endpoints to return empty arrays
 *  4. Sets localStorage token before the page loads
 *
 * Usage:
 *   import { test, expect } from '../fixtures/auth.fixture';
 *   test('dashboard loads', async ({ authedPage }) => { ... });
 */

import { test as base, Page, expect } from '@playwright/test';

const FAKE_TOKEN = 'e2e-test-jwt-token-valid';

// Mock user returned by the validate endpoint
const MOCK_USER_RESPONSE = {
  success: true,
  message: 'Token valid',
  token: FAKE_TOKEN,
  user: {
    id: 'e2e-user-id',
    email: 'e2e@tinyslash.com',
    firstName: 'E2E',
    lastName: 'TestUser',
    subscriptionPlan: 'PRO_MONTHLY',
    subscriptionExpiry: '2099-12-31T00:00:00Z',
    emailVerified: true,
    totalUrls: 5,
    totalQrCodes: 2,
    totalFiles: 1,
    totalClicks: 42,
    authProvider: 'LOCAL',
    apiKey: 'e2e-api-key',
    createdAt: '2025-01-01T00:00:00Z',
    lastLoginAt: new Date().toISOString(),
    profilePicture: null,
  },
};

/**
 * Sets up all network route mocks for an authenticated session.
 * Call this before page.goto() to intercept API calls.
 */
export async function setupAuthMocks(page: Page): Promise<void> {
  // 1. Mock token validation (the key call AuthContext makes on load)
  await page.route('**/api/v1/auth/validate', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(MOCK_USER_RESPONSE),
    });
  });

  // 2. Mock token refresh (prevents 401 loops)
  await page.route('**/api/v1/auth/refresh', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(MOCK_USER_RESPONSE),
    });
  });

  // 3. Mock dashboard data URLs (empty arrays so dashboard renders without error)
  await page.route('**/api/v1/dashboard/**', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ success: true, data: [], urls: [], qrCodes: [], files: [] }),
    });
  });

  // 4. Mock subscription info
  await page.route('**/api/v1/subscription/**', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ success: true, plan: 'PRO_MONTHLY' }),
    });
  });

  // 5. Mock team endpoints
  await page.route('**/api/v1/teams/**', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ success: true, data: [] }),
    });
  });
}

/**
 * Injects the fake auth token into localStorage before page loads.
 */
export async function injectToken(page: Page): Promise<void> {
  await page.addInitScript(({ token, user }) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', user);
  }, {
    token: FAKE_TOKEN,
    user: JSON.stringify({
      id: 'e2e-user-id',
      name: 'E2E TestUser',
      email: 'e2e@tinyslash.com',
      plan: 'PRO_MONTHLY',
      isAuthenticated: true,
      authProvider: 'LOCAL',
    }),
  });
}

type AuthFixtures = {
  /** A page with mocked auth API and valid token in localStorage. */
  authedPage: Page;
};

export const test = base.extend<AuthFixtures>({
  authedPage: async ({ page }, use) => {
    // Set up route mocks FIRST (before addInitScript takes effect is fine, routes work at network layer)
    await setupAuthMocks(page);
    // Inject token into localStorage before page loads
    await injectToken(page);
    await use(page);
  },
});

export { expect };
