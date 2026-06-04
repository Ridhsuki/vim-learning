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

  test('hash routing: opening deep link loads specific lesson', async ({ page }) => {
    await page.goto('/#normal-mode');
    await expect(page.getByRole('heading', { name: 'Normal Mode is Home Base' })).toBeVisible();
  });

  test('hash routing: clicking a lesson updates the URL hash', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /Normal Mode is Home/ }).click();
    await expect(page).toHaveURL(/.*#normal-mode/);
  });

  test('hash routing: browser back navigates to previous lesson', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'What is a Mode?' })).toBeVisible();

    await page.getByRole('button', { name: /Normal Mode is Home/ }).click();
    await expect(page.getByRole('heading', { name: 'Normal Mode is Home Base' })).toBeVisible();

    await page.goBack();
    await expect(page.getByRole('heading', { name: 'What is a Mode?' })).toBeVisible();
  });

  test('hash routing: invalid hash safely falls back to first lesson', async ({ page }) => {
    await page.goto('/#invalid-lesson-id-12345');
    await expect(page.getByRole('heading', { name: 'What is a Mode?' })).toBeVisible();
  });

  test('command history: :w saves lesson', async ({ page }) => {
    await page.goto('/#normal-mode');
    
    // Ensure we are at Normal Mode lesson
    await expect(page.getByRole('heading', { name: 'Normal Mode is Home Base' })).toBeVisible();

    // Focus editor
    await page.locator('.cm-content').click();

    // Type the Vim command
    await page.keyboard.press('Escape');
    await page.keyboard.type(':w');
    await page.keyboard.press('Enter');

    // Verify status bar shows the command
    await expect(page.getByText('Last command: :w')).toBeVisible();

    // Verify lesson is marked complete
    await expect(page.getByText('Saved lesson')).toBeVisible();
    await expect(page.getByText('✓ Complete')).toBeVisible();
  });

  test('command history: :w shows Command recorded for non-manual lessons', async ({ page }) => {
    await page.goto('/#modes-intro');
    
    // Ensure we are at the first lesson
    await expect(page.getByRole('heading', { name: 'What is a Mode?' })).toBeVisible();

    // Focus editor
    await page.locator('.cm-content').click();

    // Type the Vim command
    await page.keyboard.press('Escape');
    await page.keyboard.type(':w');
    await page.keyboard.press('Enter');

    // Verify status bar shows the command
    await expect(page.getByText('Last command: :w')).toBeVisible();

    // Verify status indicates recorded but not necessarily saved/completed
    await expect(page.getByText('Command recorded')).toBeVisible();
    
    // It should not mark the lesson complete just because of :w
    await expect(page.getByText('✓ Complete')).not.toBeVisible();
  });
});

test.describe('VimTutor Mobile E2E', () => {
  test.use({ viewport: { width: 375, height: 667 } }); // iPhone SE viewport

  test('mobile layout provides navigation tabs and switches views', async ({ page }) => {
    await page.goto('/');

    // Check if the navigation tabs appear
    const nav = page.getByRole('navigation', { name: 'Mobile view switcher' });
    await expect(nav).toBeVisible();

    const btnLessons = page.getByRole('button', { name: 'Lessons', exact: true });
    const btnLesson = page.getByRole('button', { name: 'Lesson', exact: true });
    const btnEditor = page.getByRole('button', { name: 'Editor', exact: true });

    // Ensure they are all visible
    await expect(btnLessons).toBeVisible();
    await expect(btnLesson).toBeVisible();
    await expect(btnEditor).toBeVisible();

    // Default view is Lesson, so Editor and Lessons lists should be hidden
    await expect(page.getByRole('complementary', { name: 'Lesson roadmap' })).toBeHidden();
    
    // Switch to Lessons
    await btnLessons.click();
    await expect(page.getByRole('complementary', { name: 'Lesson roadmap' })).toBeVisible();
    
    // Select a lesson from the list
    const modesIntroBtn = page.getByRole('button', { name: /What is a Mode\?/ });
    await modesIntroBtn.click();
    
    // After selection, it should automatically switch to Lesson view
    await expect(page.getByRole('complementary', { name: 'Lesson roadmap' })).toBeHidden();
    await expect(page.getByRole('heading', { name: 'What is a Mode?' })).toBeVisible();

    // Switch to Editor
    await btnEditor.click();
    // In Editor view, the code mirror container should be visible and take up space
    await expect(page.locator('.cm-editor')).toBeVisible();
  });
});
