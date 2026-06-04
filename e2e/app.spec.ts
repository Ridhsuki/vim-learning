import { test, expect } from '@playwright/test';

test.describe('VimTutor E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('app loads and shows main components', async ({ page }) => {
    await expect(page.getByText('VimTutor', { exact: true })).toBeVisible();
    await expect(page.getByRole('navigation', { name: 'Lesson roadmap' })).toBeVisible();
    await expect(page.getByRole('article')).toBeVisible(); // LessonPanel
    await expect(page.locator('.cm-editor')).toBeVisible();
  });

  test('user can reveal a hint', async ({ page }) => {
    const showHintBtn = page.getByRole('button', { name: 'Reveal hint for this lesson' });
    if (await showHintBtn.isVisible()) {
      await showHintBtn.click();
      await expect(page.getByText('Hint', { exact: true })).toBeVisible();
    }
  });

  test('user can complete a manual lesson', async ({ page }) => {
    // Navigate to Lesson 2 (which is manual)
    await page.getByRole('button', { name: /Normal Mode is Home/ }).click();
    
    const completeBtn = page.getByRole('button', { name: 'Mark this manual mission as completed' });
    await expect(completeBtn).toBeVisible();
    await completeBtn.click();

    // Verify completion badge appears
    await expect(page.getByText('✓ Complete')).toBeVisible();
  });

  test('reset all progress modal flow', async ({ page }) => {
    // Navigate to Lesson 2 and complete it
    await page.getByRole('button', { name: /Normal Mode is Home/ }).click();
    const completeBtn = page.getByRole('button', { name: 'Mark this manual mission as completed' });
    await expect(completeBtn).toBeVisible();
    await completeBtn.click();
    await expect(page.getByText('✓ Complete')).toBeVisible();

    // Click Reset all progress
    await page.getByRole('button', { name: 'Reset all lesson progress' }).click();
    
    // Modal should be visible
    const modal = page.getByRole('alertdialog');
    await expect(modal).toBeVisible();
    await expect(modal.getByText('Reset all progress?')).toBeVisible();

    // Cancel reset
    await page.getByRole('button', { name: 'Keep progress' }).click();
    await expect(modal).not.toBeVisible();
    
    // Progress should still be there (completed badge still visible)
    await expect(page.getByText('✓ Complete')).toBeVisible();

    // Confirm reset
    await page.getByRole('button', { name: 'Reset all lesson progress' }).click();
    await page.getByRole('button', { name: 'Reset progress' }).click();
    
    // Modal should close
    await expect(modal).not.toBeVisible();

    // Progress should be cleared (no complete badge)
    await expect(page.getByText('✓ Complete')).not.toBeVisible();
    
    // And it returns to the first lesson
    await expect(page.getByRole('heading', { name: 'What is a Mode?' })).toBeVisible();
  });

  test('progress persists after page reload', async ({ page }) => {
    // Navigate to Lesson 2 and complete it
    await page.getByRole('button', { name: /Normal Mode is Home/ }).click();
    const completeBtn = page.getByRole('button', { name: 'Mark this manual mission as completed' });
    await expect(completeBtn).toBeVisible();
    await completeBtn.click();
    await expect(page.getByText('✓ Complete')).toBeVisible();

    // Reload page
    await page.reload();

    // Navigate to Lesson 2 (which is manual)
    await page.getByRole('button', { name: /Normal Mode is Home/ }).click();
    await expect(page.getByText('✓ Complete')).toBeVisible();
  });
});
