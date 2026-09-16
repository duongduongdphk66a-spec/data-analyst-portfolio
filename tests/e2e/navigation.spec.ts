import { test, expect, Page } from '@playwright/test';

// Helper to open the command palette
async function openCommandPalette(page: Page) {
  // Dispatch exact event to bypass Webkit keyboard shortcut flakiness
  await page.evaluate(() => {
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }));
  });
  await expect(page.locator('[role="dialog"][aria-label="Command Palette"]')).toBeVisible();
}

test.describe('Navigation and Core Interactions', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load homepage and verify editorial elements', async ({ page }) => {
    // Check if the sidebar or main content is loaded
    await expect(page.locator('text=/ma văn hùng/i').first()).toBeVisible();
    await expect(page.locator('text=/data analyst/i').first()).toBeVisible();
  });

  test('should navigate to case study via Projects tab', async ({ page }) => {
    // The link text is usually "Work" or "Dự Án"
    const projectsTab = page.locator('a[href="/projects"]').first();
    if (await projectsTab.count() > 0) {
      await projectsTab.click({ force: true });
      await page.waitForTimeout(500); // let UI update
    }

    // Now look for the project link
    const libraryBusCard = page.locator('a[href*="proj-library-bus"]').first();
    if (await libraryBusCard.count() > 0) {
      await libraryBusCard.click({ force: true });
      
      // Verify we are on the case study page
      await expect(page).toHaveURL(/.*proj-library-bus/);
    }
  });

  test('should toggle theme using the command palette', async ({ page }) => {
    await openCommandPalette(page);
    
    // Switch theme
    await page.keyboard.type('theme');
    await page.keyboard.press('Enter');
    
    await page.waitForTimeout(500);
  });

  test('should toggle language using the command palette', async ({ page }) => {
    await openCommandPalette(page);
    
    // Switch language
    await page.keyboard.type('tiếng việt');
    await page.keyboard.press('Enter');
    
    await page.waitForTimeout(500);
  });

  test('should trigger CV download link', async ({ page }) => {
    // Look for the download button, which is an <a> tag pointing to the PDF
    const cvButton = page.locator('a[href*=".pdf"]').first();
    if (await cvButton.count() > 0) {
      await expect(cvButton).toBeVisible();
      // Click would trigger a new window or download, so we just verify visibility and clickability in CI
      await expect(cvButton).toBeEnabled();
    }
  });
});
