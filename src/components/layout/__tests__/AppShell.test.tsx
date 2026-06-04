import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
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

  it('does not render the dialog initially', () => {
    renderAppShell();
    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
  });

  it('opens the custom dialog when reset button is clicked', async () => {
    renderAppShell();
    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: 'Reset all lesson progress' }));

    expect(screen.getByRole('alertdialog')).toBeInTheDocument();
    expect(screen.getByText('Reset all progress?')).toBeInTheDocument();
  });

  it('calls onResetAllProgress when Reset progress is clicked', async () => {
    const onResetAllProgress = vi.fn();
    renderAppShell(onResetAllProgress);

    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: 'Reset all lesson progress' }));
    await user.click(screen.getByRole('button', { name: 'Reset progress' }));

    expect(onResetAllProgress).toHaveBeenCalledOnce();
    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
  });

  it('does not call onResetAllProgress when Keep progress is clicked', async () => {
    const onResetAllProgress = vi.fn();
    renderAppShell(onResetAllProgress);

    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: 'Reset all lesson progress' }));
    await user.click(screen.getByRole('button', { name: 'Keep progress' }));

    expect(onResetAllProgress).not.toHaveBeenCalled();
    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
  });

  it('closes the dialog when Escape is pressed', async () => {
    const onResetAllProgress = vi.fn();
    renderAppShell(onResetAllProgress);

    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: 'Reset all lesson progress' }));
    
    expect(screen.getByRole('alertdialog')).toBeInTheDocument();
    
    await user.keyboard('{Escape}');
    
    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
    expect(onResetAllProgress).not.toHaveBeenCalled();
  });
});
