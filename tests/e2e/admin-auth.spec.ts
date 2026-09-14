import { test, expect } from '@playwright/test';

test.describe('Admin Authentication & Security E2E Flow', () => {
  test('should display the admin login gate when visiting /admin unauthenticated', async ({ page }) => {
    await page.goto('/admin');

    // Check if the Admin gate elements are rendered
    await expect(page.locator('text=/bảo mật quản trị viên/i')).toBeVisible();
    await expect(page.locator('input[placeholder*="mật khẩu"]')).toBeVisible();
    await expect(page.locator('button:has-text("Mở Khóa Quản Trị")')).toBeVisible();
  });

  test('should show validation error when submitting empty password', async ({ page }) => {
    await page.goto('/admin');

    const submitBtn = page.locator('button:has-text("Mở Khóa Quản Trị")');
    await submitBtn.click();

    // Verify error notification / text
    await expect(page.locator('text=/vui lòng nhập mật khẩu/i')).toBeVisible();
  });

  test('should show invalid password error when submitting incorrect password', async ({ page }) => {
    await page.goto('/admin');

    const passwordInput = page.locator('input[placeholder*="mật khẩu"]');
    await passwordInput.fill('wrong_admin_password_12345');

    const submitBtn = page.locator('button:has-text("Mở Khóa Quản Trị")');
    await submitBtn.click();

    // Verify authentication failed message
    await expect(page.locator('text=/mật khẩu quản trị không chính xác|quyền truy cập bị từ chối/i')).toBeVisible();
  });
});
