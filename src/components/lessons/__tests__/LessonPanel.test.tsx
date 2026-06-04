/**
 * LessonPanel.test.tsx
 *
 * Component tests for LessonPanel using React Testing Library + user-event.
 * Tests focus on rendered content, accessibility, and interactive behavior.
 * No Tailwind class assertions — we test behavior, not style.
 */

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import type { ComponentProps } from 'react';
import { LessonPanel } from '../LessonPanel';
import type { Lesson } from '../../../types/lesson';

// ─── Fixture ──────────────────────────────────────────────────────────────────

const lesson: Lesson = {
  id: 'test-lesson',
  chapter: 'Ch.1: Vim Modes',
  chapterIndex: 0,
  lessonIndex: 0,
  title: 'Test Lesson Title',
  description: [
    'First description paragraph.',
    'Second description paragraph.',
  ],
  initialContent: 'Hello Vim',
  mission: 'Complete this test mission.',
  hint: 'This is the test hint.',
  validation: {
    trigger: 'on-change',
    check: () => true,
  },
};

// ─── Render helper ────────────────────────────────────────────────────────────

function renderLessonPanel(
  overrides?: Partial<ComponentProps<typeof LessonPanel>>,
) {
  const onPrevious = vi.fn();
  const onNext = vi.fn();
  const onReset = vi.fn();
  const onUseHint = vi.fn();

  render(
    <LessonPanel
      lesson={lesson}
      isCompleted={false}
      isFirstLesson={false}
      isLastLesson={false}
      hintUsed={false}
      onPrevious={onPrevious}
      onNext={onNext}
      onReset={onReset}
      onUseHint={onUseHint}
      {...overrides}
    />,
  );

  return { onPrevious, onNext, onReset, onUseHint };
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('LessonPanel', () => {

  // ── Content rendering ────────────────────────────────────────────────────────

  describe('content rendering', () => {
    it('renders the lesson title', () => {
      renderLessonPanel();
      expect(screen.getByRole('heading', { name: 'Test Lesson Title' })).toBeInTheDocument();
    });

    it('renders all description paragraphs', () => {
      renderLessonPanel();
      expect(screen.getByText('First description paragraph.')).toBeInTheDocument();
      expect(screen.getByText('Second description paragraph.')).toBeInTheDocument();
    });

    it('renders the mission text', () => {
      renderLessonPanel();
      expect(screen.getByText('Complete this test mission.')).toBeInTheDocument();
    });

    it('renders the chapter badge', () => {
      renderLessonPanel();
      expect(screen.getByText('Ch.1: Vim Modes')).toBeInTheDocument();
    });
  });

  // ── Hint behavior ────────────────────────────────────────────────────────────

  describe('hint behavior', () => {
    it('hides the hint text initially when hintUsed is false', () => {
      renderLessonPanel({ hintUsed: false });
      expect(screen.queryByText('This is the test hint.')).not.toBeInTheDocument();
    });

    it('shows the hint text after clicking the hint button', async () => {
      const user = userEvent.setup();
      renderLessonPanel({ hintUsed: false });

      const hintButton = screen.getByRole('button', { name: /reveal hint/i });
      await user.click(hintButton);

      expect(screen.getByText('This is the test hint.')).toBeInTheDocument();
    });

    it('calls onUseHint with the lesson id when hint button is clicked', async () => {
      const user = userEvent.setup();
      const { onUseHint } = renderLessonPanel({ hintUsed: false });

      await user.click(screen.getByRole('button', { name: /reveal hint/i }));

      expect(onUseHint).toHaveBeenCalledOnce();
      expect(onUseHint).toHaveBeenCalledWith('test-lesson');
    });

    it('hides the hint button and shows hint text immediately when hintUsed is true', () => {
      renderLessonPanel({ hintUsed: true });
      expect(screen.queryByRole('button', { name: /reveal hint/i })).not.toBeInTheDocument();
      expect(screen.getByText('This is the test hint.')).toBeInTheDocument();
    });

    it('does not render a hint button when the lesson has no hint', () => {
      const lessonWithoutHint: Lesson = { ...lesson, hint: undefined };
      renderLessonPanel({ lesson: lessonWithoutHint });
      expect(screen.queryByRole('button', { name: /reveal hint/i })).not.toBeInTheDocument();
    });

    it('does not show hint text when the lesson has no hint', () => {
      const lessonWithoutHint: Lesson = { ...lesson, hint: undefined };
      renderLessonPanel({ lesson: lessonWithoutHint });
      expect(screen.queryByText('This is the test hint.')).not.toBeInTheDocument();
    });
  });

  // ── Navigation buttons ───────────────────────────────────────────────────────

  describe('navigation buttons', () => {
    it('disables the Previous button when isFirstLesson is true', () => {
      renderLessonPanel({ isFirstLesson: true });
      expect(screen.getByRole('button', { name: 'Previous lesson' })).toBeDisabled();
    });

    it('enables the Previous button when isFirstLesson is false', () => {
      renderLessonPanel({ isFirstLesson: false });
      expect(screen.getByRole('button', { name: 'Previous lesson' })).toBeEnabled();
    });

    it('disables the Next button when isLastLesson is true', () => {
      renderLessonPanel({ isLastLesson: true });
      expect(screen.getByRole('button', { name: 'Next lesson' })).toBeDisabled();
    });

    it('enables the Next button when isLastLesson is false', () => {
      renderLessonPanel({ isLastLesson: false });
      expect(screen.getByRole('button', { name: 'Next lesson' })).toBeEnabled();
    });

    it('calls onPrevious when Previous button is clicked', async () => {
      const user = userEvent.setup();
      const { onPrevious } = renderLessonPanel({ isFirstLesson: false });

      await user.click(screen.getByRole('button', { name: 'Previous lesson' }));

      expect(onPrevious).toHaveBeenCalledOnce();
    });

    it('calls onNext when Next button is clicked', async () => {
      const user = userEvent.setup();
      const { onNext } = renderLessonPanel({ isLastLesson: false });

      await user.click(screen.getByRole('button', { name: 'Next lesson' }));

      expect(onNext).toHaveBeenCalledOnce();
    });

    it('does not call onPrevious when Previous button is disabled', async () => {
      const user = userEvent.setup();
      const { onPrevious } = renderLessonPanel({ isFirstLesson: true });

      await user.click(screen.getByRole('button', { name: 'Previous lesson' }));

      expect(onPrevious).not.toHaveBeenCalled();
    });

    it('does not call onNext when Next button is disabled', async () => {
      const user = userEvent.setup();
      const { onNext } = renderLessonPanel({ isLastLesson: true });

      await user.click(screen.getByRole('button', { name: 'Next lesson' }));

      expect(onNext).not.toHaveBeenCalled();
    });
  });

  // ── Reset button ─────────────────────────────────────────────────────────────

  describe('reset button', () => {
    it('calls onReset when Reset lesson button is clicked', async () => {
      const user = userEvent.setup();
      const { onReset } = renderLessonPanel();

      await user.click(screen.getByRole('button', { name: 'Reset lesson editor content' }));

      expect(onReset).toHaveBeenCalledOnce();
    });
  });

  // ── Completion state ─────────────────────────────────────────────────────────

  describe('completion state', () => {
    it('shows the completion badge when isCompleted is true', () => {
      renderLessonPanel({ isCompleted: true });
      expect(screen.getByLabelText('Lesson complete')).toBeInTheDocument();
    });

    it('does not show the completion badge when isCompleted is false', () => {
      renderLessonPanel({ isCompleted: false });
      expect(screen.queryByLabelText('Lesson complete')).not.toBeInTheDocument();
    });
  });

  // ── Manual completion ────────────────────────────────────────────────────────

  describe('manual completion', () => {
    it('renders the manual completion button when trigger is manual and isCompleted is false', () => {
      const manualLesson: Lesson = { ...lesson, validation: { trigger: 'manual', check: () => true } };
      renderLessonPanel({ lesson: manualLesson, isCompleted: false, onCheckMission: vi.fn() });
      expect(screen.getByRole('button', { name: /mark this manual mission as completed/i })).toBeInTheDocument();
    });

    it('calls onCheckMission when the manual completion button is clicked', async () => {
      const manualLesson: Lesson = { ...lesson, validation: { trigger: 'manual', check: () => true } };
      const onCheckMission = vi.fn();
      const user = userEvent.setup();
      renderLessonPanel({ lesson: manualLesson, isCompleted: false, onCheckMission });
      
      await user.click(screen.getByRole('button', { name: /mark this manual mission as completed/i }));
      expect(onCheckMission).toHaveBeenCalledOnce();
    });

    it('does not render the manual completion button when trigger is not manual', () => {
      const autoLesson: Lesson = { ...lesson, validation: { trigger: 'on-change', check: () => true } };
      renderLessonPanel({ lesson: autoLesson, isCompleted: false, onCheckMission: vi.fn() });
      expect(screen.queryByRole('button', { name: /mark this manual mission as completed/i })).not.toBeInTheDocument();
    });

    it('does not render the manual completion button when the lesson is already completed', () => {
      const manualLesson: Lesson = { ...lesson, validation: { trigger: 'manual', check: () => true } };
      renderLessonPanel({ lesson: manualLesson, isCompleted: true, onCheckMission: vi.fn() });
      expect(screen.queryByRole('button', { name: /mark this manual mission as completed/i })).not.toBeInTheDocument();
    });
  });
});
