import { test, expect } from '@playwright/test';

test('user can complete Reading section quiz', async ({ page }) => {
  await page.goto('http://localhost:5173')

  // Start screen (assume you have one)
  await page.getByRole('link', { name: 'Reading' }).click()

  // Go through all questions
  for (let i = 0; i < 23; i++) {
    await page.getByText(/Q\d+:?/).isVisible()
    const choices = page.locator('input[type=radio]')
    await choices.first().check()
    await page.getByRole('button', { name: 'Next' }).click()
  }

  // Confirm score/result page appears
  await expect(page.locator('text=You scored')).toBeVisible()
  await expect(page.locator('text=Estimated Level')).toBeVisible()
})