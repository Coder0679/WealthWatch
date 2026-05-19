import { test, expect } from '@playwright/test';

test('login works', async ({ page }) => {

  // Open app
  await page.goto('http://localhost:3000');

  // Fill email
  await page.fill('input[type="email"]', 'aws@gmail.com');

  // Fill password
  await page.fill('input[type="password"]', '1234');

  // Click login button
  await page.click('button[type="submit"]');

  // Check dashboard opened
  await expect(page).toHaveURL(/dashboard/);

});