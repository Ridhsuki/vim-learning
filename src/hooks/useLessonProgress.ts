import { useCallback, useMemo, useState } from 'react';
import { lessons, firstLesson, totalLessons } from '../data/lessons';
import type { AppProgress, Lesson, LessonProgress } from '../types/lesson';
import {
  CURRENT_PROGRESS_VERSION,
  clearProgress,
  loadProgress,
  saveProgress,
} from '../lib/storage';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function createInitialProgress(): AppProgress {
  return {
    currentLessonId: firstLesson.id,
    lessons: {},
    version: CURRENT_PROGRESS_VERSION,
  };
}

function findLessonById(id: string): Lesson {
  return lessons.find((l) => l.id === id) ?? firstLesson;
}

/** Resolve stored progress: validate it, fall back to fresh if needed. */
function resolveInitialProgress(): AppProgress {
  const stored = loadProgress();
  if (!stored) return createInitialProgress();
  // If the stored currentLessonId doesn't match any lesson, reset it.
  const lessonExists = lessons.some((l) => l.id === stored.currentLessonId);
  if (!lessonExists) {
    return { ...stored, currentLessonId: firstLesson.id };
  }
  return stored;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useLessonProgress() {
  const [progress, setProgress] = useState<AppProgress>(resolveInitialProgress);

  /** Update state and persist in one step. */
  const commit = useCallback((next: AppProgress) => {
    setProgress(next);
    saveProgress(next);
  }, []);

  // ── Derived values ──────────────────────────────────────────────────────────

  const currentLesson = useMemo(
    () => findLessonById(progress.currentLessonId),
    [progress.currentLessonId],
  );

  const currentLessonIndex = useMemo(
    () => lessons.findIndex((l) => l.id === progress.currentLessonId),
    [progress.currentLessonId],
  );

  const completedCount = useMemo(
    () => Object.values(progress.lessons).filter((lp) => lp.completed).length,
    [progress.lessons],
  );

  const isFirstLesson = currentLessonIndex === 0;
  const isLastLesson = currentLessonIndex === totalLessons - 1;

  const isCurrentLessonCompleted =
    progress.lessons[progress.currentLessonId]?.completed ?? false;

  // ── Actions ─────────────────────────────────────────────────────────────────

  const navigateTo = useCallback(
    (id: string) => {
      const exists = lessons.some((l) => l.id === id);
      if (!exists) return;
      commit({ ...progress, currentLessonId: id });
    },
    [progress, commit],
  );

  const navigateNext = useCallback(() => {
    if (currentLessonIndex >= totalLessons - 1) return;
    const nextId = lessons[currentLessonIndex + 1].id;
    commit({ ...progress, currentLessonId: nextId });
  }, [progress, commit, currentLessonIndex]);

  const navigatePrevious = useCallback(() => {
    if (currentLessonIndex <= 0) return;
    const prevId = lessons[currentLessonIndex - 1].id;
    commit({ ...progress, currentLessonId: prevId });
  }, [progress, commit, currentLessonIndex]);

  const markComplete = useCallback(
    (id: string) => {
      const existing: LessonProgress = progress.lessons[id] ?? {
        completed: false,
        hintUsed: false,
      };
      // Never overwrite a completedAt that already exists.
      const completedAt = existing.completedAt ?? new Date().toISOString();
      const updated: LessonProgress = {
        ...existing,
        completed: true,
        completedAt,
      };
      commit({
        ...progress,
        lessons: { ...progress.lessons, [id]: updated },
      });
    },
    [progress, commit],
  );

  const useHint = useCallback(
    (id: string) => {
      const existing: LessonProgress = progress.lessons[id] ?? {
        completed: false,
        hintUsed: false,
      };
      if (existing.hintUsed) return; // already marked — skip unnecessary write
      commit({
        ...progress,
        lessons: {
          ...progress.lessons,
          [id]: { ...existing, hintUsed: true },
        },
      });
    },
    [progress, commit],
  );

  const resetAll = useCallback(() => {
    clearProgress();
    setProgress(createInitialProgress());
  }, []);

  // ── Return ──────────────────────────────────────────────────────────────────

  return {
    lessons,
    currentLesson,
    currentLessonIndex,
    progress,
    completedCount,
    totalLessons,
    isFirstLesson,
    isLastLesson,
    isCurrentLessonCompleted,
    navigateTo,
    navigateNext,
    navigatePrevious,
    markComplete,
    useHint,
    resetAll,
  };
}
