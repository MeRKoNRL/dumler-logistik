import { test, expect } from '@playwright/test';

test('Загрузка и навигация по сайту', async ({ page }) => {
  await page.goto('http://localhost:3000');

  await expect(page).toHaveTitle(/Logistik/);
  await expect(page.locator('text=План')).toBeVisible();

  await page.click('text=План');
  await expect(page.locator('text=Дневной план')).toBeVisible();

  await page.click('text=← Назад к списку');
  await expect(page.locator('text=Все дневные планы')).toBeVisible();

  await page.click('text=Сводка');
  await expect(page.locator('text=Сводка по дневным планам')).toBeVisible();
});
