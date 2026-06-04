/**
 * useLessonProgress.test.ts
 *
 * Tests for the useLessonProgress hook using @testing-library/react.
 *
 * Uses real jsdom localStorage — no mocks unless strictly required.
 * All state updates are wrapped in act().
 */

import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { useLessonProgress } from '../useLessonProgress';
import { lessons, firstLesson } from '../../data/lessons';
import { loadProgress, saveProgress, CURRENT_PROGRESS_VERSION } from '../../lib/storage';
import type { AppProgress } from '../../types/lesson';

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** The second lesson in the array — used for navigation tests. */
const secondLesson = lessons[1];

/** A fully valid stored progress fixture pointing at the second lesson. */
function storedProgressAt(lessonId: string): AppProgress {
  return {
    currentLessonId: lessonId,
    lessons: {},
    version: CURRENT_PROGRESS_VERSION,
  };
}

// ─── Setup ────────────────────────────────────────────────────────────────────

beforeEach(() => {
  localStorage.clear();
  window.location.hash = '';
});

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('useLessonProgress', () => {

  // ── Initial state ────────────────────────────────────────────────────────────

  describe('initial state', () => {
    it('starts at the first lesson when localStorage is empty', () => {
      const { result } = renderHook(() => useLessonProgress());
      expect(result.current.currentLesson.id).toBe(firstLesson.id);
    });

    it('exposes the full lesson array', () => {
      const { result } = renderHook(() => useLessonProgress());
      expect(result.current.lessons).toHaveLength(lessons.length);
      expect(result.current.lessons[0].id).toBe(firstLesson.id);
    });

    it('exposes the correct totalLessons count', () => {
      const { result } = renderHook(() => useLessonProgress());
      expect(result.current.totalLessons).toBe(lessons.length);
    });

    it('starts with completedCount of 0', () => {
      const { result } = renderHook(() => useLessonProgress());
      expect(result.current.completedCount).toBe(0);
    });

    it('isFirstLesson is true at start', () => {
      const { result } = renderHook(() => useLessonProgress());
      expect(result.current.isFirstLesson).toBe(true);
    });

    it('isLastLesson is false at start', () => {
      const { result } = renderHook(() => useLessonProgress());
      expect(result.current.isLastLesson).toBe(false);
    });

    it('isCurrentLessonCompleted is false at start', () => {
      const { result } = renderHook(() => useLessonProgress());
      expect(result.current.isCurrentLessonCompleted).toBe(false);
    });
  });

  // ── Navigation ───────────────────────────────────────────────────────────────

  describe('navigation', () => {
    it('navigateTo(id) changes the current lesson when id is valid', () => {
      const { result } = renderHook(() => useLessonProgress());
      act(() => { result.current.navigateTo(secondLesson.id); });
      expect(result.current.currentLesson.id).toBe(secondLesson.id);
    });

    it('navigateTo(id) ignores an unknown lesson id', () => {
      const { result } = renderHook(() => useLessonProgress());
      act(() => { result.current.navigateTo('does-not-exist'); });
      expect(result.current.currentLesson.id).toBe(firstLesson.id);
    });

    it('navigateNext() advances to the second lesson', () => {
      const { result } = renderHook(() => useLessonProgress());
      act(() => { result.current.navigateNext(); });
      expect(result.current.currentLesson.id).toBe(secondLesson.id);
    });

    it('navigatePrevious() moves back to the first lesson from the second', () => {
      const { result } = renderHook(() => useLessonProgress());
      act(() => { result.current.navigateTo(secondLesson.id); });
      act(() => { result.current.navigatePrevious(); });
      expect(result.current.currentLesson.id).toBe(firstLesson.id);
    });

    it('navigatePrevious() does nothing when already on the first lesson', () => {
      const { result } = renderHook(() => useLessonProgress());
      act(() => { result.current.navigatePrevious(); });
      expect(result.current.currentLesson.id).toBe(firstLesson.id);
    });

    it('navigateNext() does nothing when already on the last lesson', () => {
      const { result } = renderHook(() => useLessonProgress());
      const lastLesson = lessons[lessons.length - 1];
      act(() => { result.current.navigateTo(lastLesson.id); });
      act(() => { result.current.navigateNext(); });
      expect(result.current.currentLesson.id).toBe(lastLesson.id);
    });

    it('isFirstLesson becomes false after navigating to the second lesson', () => {
      const { result } = renderHook(() => useLessonProgress());
      act(() => { result.current.navigateNext(); });
      expect(result.current.isFirstLesson).toBe(false);
    });

    it('isLastLesson becomes true after navigating to the last lesson', () => {
      const { result } = renderHook(() => useLessonProgress());
      const lastLesson = lessons[lessons.length - 1];
      act(() => { result.current.navigateTo(lastLesson.id); });
      expect(result.current.isLastLesson).toBe(true);
    });
  });

  // ── Completion ────────────────────────────────────────────────────────────────

  describe('markComplete', () => {
    it('marks the lesson as completed', () => {
      const { result } = renderHook(() => useLessonProgress());
      act(() => { result.current.markComplete(firstLesson.id); });
      expect(result.current.progress.lessons[firstLesson.id]?.completed).toBe(true);
    });

    it('increments completedCount', () => {
      const { result } = renderHook(() => useLessonProgress());
      act(() => { result.current.markComplete(firstLesson.id); });
      expect(result.current.completedCount).toBe(1);
    });

    it('sets isCurrentLessonCompleted to true', () => {
      const { result } = renderHook(() => useLessonProgress());
      act(() => { result.current.markComplete(firstLesson.id); });
      expect(result.current.isCurrentLessonCompleted).toBe(true);
    });

    it('persists completed state to localStorage', () => {
      const { result } = renderHook(() => useLessonProgress());
      act(() => { result.current.markComplete(firstLesson.id); });
      const stored = loadProgress();
      expect(stored?.lessons[firstLesson.id]?.completed).toBe(true);
    });

    it('sets completedAt to a non-empty string', () => {
      const { result } = renderHook(() => useLessonProgress());
      act(() => { result.current.markComplete(firstLesson.id); });
      expect(result.current.progress.lessons[firstLesson.id]?.completedAt).toBeTruthy();
    });

    it('preserves an existing completedAt timestamp on re-completion', () => {
      const fixedTimestamp = '2026-01-01T00:00:00.000Z';
      // Pre-seed localStorage with an already-completed lesson.
      const preCompleted: AppProgress = {
        currentLessonId: firstLesson.id,
        lessons: {
          [firstLesson.id]: {
            completed: true,
            hintUsed: false,
            completedAt: fixedTimestamp,
          },
        },
        version: CURRENT_PROGRESS_VERSION,
      };
      saveProgress(preCompleted);

      const { result } = renderHook(() => useLessonProgress());
      // Calling markComplete again must not overwrite the original timestamp.
      act(() => { result.current.markComplete(firstLesson.id); });
      expect(result.current.progress.lessons[firstLesson.id]?.completedAt).toBe(fixedTimestamp);
    });
  });

  // ── Hint usage ────────────────────────────────────────────────────────────────

  describe('useHint', () => {
    it('marks hintUsed as true', () => {
      const { result } = renderHook(() => useLessonProgress());
      act(() => { result.current.useHint(firstLesson.id); });
      expect(result.current.progress.lessons[firstLesson.id]?.hintUsed).toBe(true);
    });

    it('persists hintUsed to localStorage', () => {
      const { result } = renderHook(() => useLessonProgress());
      act(() => { result.current.useHint(firstLesson.id); });
      expect(loadProgress()?.lessons[firstLesson.id]?.hintUsed).toBe(true);
    });

    it('preserves completed state when hint is used on a completed lesson', () => {
      const { result } = renderHook(() => useLessonProgress());
      act(() => { result.current.markComplete(firstLesson.id); });
      act(() => { result.current.useHint(firstLesson.id); });
      expect(result.current.progress.lessons[firstLesson.id]?.completed).toBe(true);
      expect(result.current.progress.lessons[firstLesson.id]?.hintUsed).toBe(true);
    });
  });

  // ── Reset ─────────────────────────────────────────────────────────────────────

  describe('resetAll', () => {
    it('resets completedCount to 0', () => {
      const { result } = renderHook(() => useLessonProgress());
      act(() => { result.current.markComplete(firstLesson.id); });
      act(() => { result.current.resetAll(); });
      expect(result.current.completedCount).toBe(0);
    });

    it('resets currentLesson to the first lesson', () => {
      const { result } = renderHook(() => useLessonProgress());
      act(() => { result.current.navigateTo(secondLesson.id); });
      act(() => { result.current.resetAll(); });
      expect(result.current.currentLesson.id).toBe(firstLesson.id);
    });

    it('clears progress from localStorage', () => {
      const { result } = renderHook(() => useLessonProgress());
      act(() => { result.current.markComplete(firstLesson.id); });
      act(() => { result.current.resetAll(); });
      expect(loadProgress()).toBeNull();
    });

    it('clears lesson progress records', () => {
      const { result } = renderHook(() => useLessonProgress());
      act(() => { result.current.markComplete(firstLesson.id); });
      act(() => { result.current.resetAll(); });
      expect(result.current.progress.lessons[firstLesson.id]).toBeUndefined();
    });
  });

  // ── Stored progress loading ───────────────────────────────────────────────────

  describe('loading stored progress', () => {
    it('restores the current lesson from localStorage on mount', () => {
      saveProgress(storedProgressAt(secondLesson.id));
      const { result } = renderHook(() => useLessonProgress());
      expect(result.current.currentLesson.id).toBe(secondLesson.id);
    });

    it('restores completed lessons from localStorage', () => {
      const stored: AppProgress = {
        currentLessonId: firstLesson.id,
        lessons: {
          [firstLesson.id]: { completed: true, hintUsed: false },
        },
        version: CURRENT_PROGRESS_VERSION,
      };
      saveProgress(stored);
      const { result } = renderHook(() => useLessonProgress());
      expect(result.current.completedCount).toBe(1);
      expect(result.current.isCurrentLessonCompleted).toBe(true);
    });

    it('falls back to the first lesson when stored currentLessonId does not exist', () => {
      const corrupted: AppProgress = {
        currentLessonId: 'lesson-that-was-deleted',
        lessons: {},
        version: CURRENT_PROGRESS_VERSION,
      };
      saveProgress(corrupted);
      const { result } = renderHook(() => useLessonProgress());
      expect(result.current.currentLesson.id).toBe(firstLesson.id);
    });
  });
});
