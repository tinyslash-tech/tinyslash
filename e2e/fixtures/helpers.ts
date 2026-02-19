/**
 * Shared test helpers for TinySlash E2E tests
 */

import { Page } from '@playwright/test';

/**
 * Hides the CRA webpack-dev-server error overlay iframe.
 * 
 * During development, CRA sometimes shows an overlay (`#webpack-dev-server-client-overlay`)
 * that intercepts all pointer events. This function hides it using JS so tests can
 * click on elements normally.
 *
 * Call this in `test.beforeEach` after navigation.
 */
export async function dismissWebpackOverlay(page: Page): Promise<void> {
  try {
    await page.evaluate(() => {
      // Hide the webpack HMR overlay iframe if present
      const overlay = document.getElementById('webpack-dev-server-client-overlay');
      if (overlay) {
        (overlay as HTMLElement).style.display = 'none';
      }
      // Also hide the webpack error overlay div
      const overlayDiv = document.querySelector('[style*="overflow: hidden"][style*="z-index: 2147483647"]');
      if (overlayDiv) {
        (overlayDiv as HTMLElement).style.display = 'none';
      }
    });
  } catch {
    // Ignore: page may have navigated between waitForTimeout and evaluate
  }
}
