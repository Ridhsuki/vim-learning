import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { AppShell } from '../AppShell';
import type { Lesson } from '../../../types/lesson';

const mockLesson: Lesson = {
  id: 'test-lesson',
  chapter: 'Ch.1',
  chapterIndex: 0,
  lessonIndex: 0,
  title: 'Test Lesson',
  description: ['Desc'],
  initialContent: 'Content',
  mission: 'Mission',
  validation: { trigger: 'on-change', check: () => true },
};

describe('AppShell', () => {
  let confirmSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    confirmSpy = vi.spyOn(window, 'confirm');
  });

  afterEach(() => {
    confirmSpy.mockRestore();
  });

  function renderAppShell(onResetAllProgress = vi.fn()) {
    render(
      <AppShell
        lessons={[mockLesson]}
        currentLesson={mockLesson}
        currentLessonIndex={0}
        progress={{}}
        completedCount={0}
        totalLessons={1}
        currentMode="normal"
        isCurrentLessonCompleted={false}
        isFirstLesson={true}
        isLastLesson={true}
        onSelectLesson={vi.fn()}
        onPreviousLesson={vi.fn()}
        onNextLesson={vi.fn()}
        onResetLesson={vi.fn()}
        onUseHint={vi.fn()}
        onResetAllProgress={onResetAllProgress}
        onEditorContentChange={vi.fn()}
        onEditorModeChange={vi.fn()}
      />
    );
  }

  it('renders the Reset all progress button', () => {
    renderAppShell();
    expect(screen.getByRole('button', { name: 'Reset all lesson progress' })).toBeInTheDocument();
  });

  it('calls onResetAllProgress when window.confirm returns true', async () => {
    confirmSpy.mockReturnValue(true);
    const onResetAllProgress = vi.fn();
    renderAppShell(onResetAllProgress);

    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: 'Reset all lesson progress' }));

    expect(confirmSpy).toHaveBeenCalledWith('Are you sure you want to reset all your lesson progress? This cannot be undone.');
    expect(onResetAllProgress).toHaveBeenCalledOnce();
  });

  it('does not call onResetAllProgress when window.confirm returns false', async () => {
    confirmSpy.mockReturnValue(false);
    const onResetAllProgress = vi.fn();
    renderAppShell(onResetAllProgress);

    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: 'Reset all lesson progress' }));

    expect(confirmSpy).toHaveBeenCalledWith('Are you sure you want to reset all your lesson progress? This cannot be undone.');
    expect(onResetAllProgress).not.toHaveBeenCalled();
  });
});
