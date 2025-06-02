import { test, expect } from '@playwright/test';

test('доступ к странице /my', async ({ page }) => {
  await page.goto('/');
  await page.waitForTimeout(1000); // ждём редиректа
  await page.goto('/my');

  await expect(page.locator('h1')).toContainText([
    'Личный кабинет',
    'My Profile',
    'Mein Bereich'
  ]);
});