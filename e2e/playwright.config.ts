import { defineConfig, devices } from '@playwright/test';

/**
 * TinySlash E2E Test Configuration
 * 
 * Assumes the frontend dev server is running on port 3000.
 * For CI, set FRONTEND_URL env var. Locally, webServer auto-starts CRA.
 */

const BASE_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

export default defineConfig({
  testDir: './tests',

  // Run all tests files in parallel
  fullyParallel: true,

  // Fail the build on CI if test.only() sneaks in 
  forbidOnly: !!process.env.CI,

  // Retry flaky tests on CI once
  retries: process.env.CI ? 1 : 0,

  // Cap workers in CI to avoid resource exhaustion
  workers: process.env.CI ? 2 : undefined,

  // HTML reporter is clearest for local dev; GitHub Actions uses 'github'
  reporter: process.env.CI
    ? [['github'], ['html', { open: 'never' }]]
    : [['html', { open: 'on-failure' }]],

  use: {
    baseURL: BASE_URL,

    // Capture trace on retry for debugging failed tests
    trace: 'on-first-retry',

    // Screenshots on failure only
    screenshot: 'only-on-failure',

    // Video recording on retry
    video: 'retain-on-failure',

    // Global timeout per action (e.g., click, fill)
    actionTimeout: 15_000,
  },

  projects: [
    // Setup project to authenticate (generates auth state file)
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/,
    },

    // Chromium: primary browser for all tests
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
      },
    },

    // Firefox: secondary validation
    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
      },
    },
  ],

  // Global test timeout
  timeout: 60_000,

  // Automatically start the CRA dev server for local development
  // (Skipped in CI where the server is started separately)
  webServer: process.env.CI
    ? undefined
    : {
      command: 'npm start',
      cwd: '../tinyslash-frontend',
      url: BASE_URL,
      reuseExistingServer: true,  // Re-use the running dev server if already up
      timeout: 120_000,           // Wait up to 2 min for CRA to boot
    },
});
