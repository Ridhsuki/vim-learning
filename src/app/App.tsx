/**
 * App.tsx
 *
 * Root application component for the Vim learning tutor.
 *
 * Responsibilities:
 *   - Own the Vim editor's local state (mode, content, reset key).
 *   - Subscribe to editor content/mode changes and run lesson validation.
 *   - Call markComplete when a lesson's validation passes.
 *   - Delegate all lesson navigation and progress persistence to useLessonProgress.
 *   - Render AppShell for the normal learning flow.
 *   - Render CompletionScreen when all lessons have been completed.
 *
 * Intentionally NOT responsible for:
 *   - localStorage access (delegated to useLessonProgress → storage.ts)
 *   - CodeMirror API (delegated to useVimEditor → VimEditor)
 *   - Lesson data (provided by useLessonProgress from data/lessons.ts)
 *   - UI layout details (delegated to AppShell)
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import type { VimMode, ValidationTrigger, Lesson } from '../types/lesson';
import { useLessonProgress } from '../hooks/useLessonProgress';
import { shouldValidate, validateLesson } from '../lib/lessonValidation';
import { AppShell } from '../components/layout/AppShell';
import { CompletionScreen } from '../components/lessons/CompletionScreen';

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  // ── Lesson progress (navigation + persistence) ─────────────────────────────

  const {
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
  } = useLessonProgress();

  // ── Editor local state ─────────────────────────────────────────────────────
  //
  // Transient UI state — not persisted, not part of lesson progress.

  const [currentMode, setCurrentMode] = useState<VimMode>('normal');
  const [editorResetKey, setEditorResetKey] = useState(0);
  const [lastCommand, setLastCommand] = useState<string | null>(null);
  const [commandStatus, setCommandStatus] = useState<string | null>(null);
  
  const statusTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Clear timeout on unmount
  useEffect(() => {
    return () => {
      if (statusTimeoutRef.current) {
        clearTimeout(statusTimeoutRef.current);
      }
    };
  }, []);

  // ── Stable refs for use inside callbacks ───────────────────────────────────
  //
  // Storing the latest lesson, content, and mode in refs lets validation
  // callbacks always read current values without needing to be re-created on
  // every render (which would cause VimEditor's debounce hook to rebuild).
  //
  // Refs are synced inside useEffect bodies — never written during render —
  // to satisfy the react-hooks/refs ESLint rule.

  const currentLessonRef = useRef<Lesson>(currentLesson);
  const currentModeRef = useRef<VimMode>('normal');
  const editorContentRef = useRef<string>(currentLesson.initialContent);

  // Sync currentLessonRef after every render where currentLesson changes.
  useEffect(() => {
    currentLessonRef.current = currentLesson;
    // When the active lesson changes, reset tracked content so stale content
    // from the previous lesson is not used in validation for the new lesson.
    editorContentRef.current = currentLesson.initialContent;
  }, [currentLesson]);

  // ── Validation ─────────────────────────────────────────────────────────────

  /**
   * Run lesson validation for the given trigger and call markComplete if the
   * mission is satisfied.  Guards against re-marking an already-complete lesson.
   * Pure in the sense that it never throws — validateLesson catches internally.
   */
  const runValidation = useCallback(
    (
      lesson: Lesson,
      content: string,
      mode: VimMode,
      trigger: ValidationTrigger,
    ) => {
      if (!shouldValidate(lesson, trigger)) return;
      if (progress.lessons[lesson.id]?.completed) return;
      if (validateLesson(lesson, content, mode)) {
        markComplete(lesson.id);
      }
    },
    [progress.lessons, markComplete],
  );

  // ── Editor callbacks ───────────────────────────────────────────────────────
  //
  // Writing to refs inside these callbacks is correct — callbacks are called
  // from event handlers / effect cleanups, not during render.

  const handleEditorContentChange = useCallback(
    (content: string) => {
      editorContentRef.current = content;
      runValidation(
        currentLessonRef.current,
        content,
        currentModeRef.current,
        'on-change',
      );
    },
    [runValidation],
  );

  const handleEditorModeChange = useCallback(
    (mode: VimMode) => {
      setCurrentMode(mode);
      currentModeRef.current = mode;
      runValidation(
        currentLessonRef.current,
        editorContentRef.current,
        mode,
        'on-mode-change',
      );
    },
    [runValidation],
  );

  const handleManualValidation = useCallback(() => {
    runValidation(
      currentLessonRef.current,
      editorContentRef.current,
      currentModeRef.current,
      'manual',
    );
  }, [runValidation]);

  const handleWriteCommand = useCallback(() => {
    setLastCommand(':w');

    if (statusTimeoutRef.current) {
      clearTimeout(statusTimeoutRef.current);
    }

    const lesson = currentLessonRef.current;
    const isCompleted = progress.lessons[lesson.id]?.completed;

    if (isCompleted) {
      setCommandStatus('Already saved');
    } else if (lesson.validation.trigger === 'manual') {
      handleManualValidation();
      setCommandStatus('Saved lesson');
    } else {
      setCommandStatus('Command recorded');
    }

    statusTimeoutRef.current = setTimeout(() => {
      setCommandStatus(null);
      statusTimeoutRef.current = null;
    }, 3000);
  }, [handleManualValidation, progress.lessons]);

  // ── Lesson reset (current lesson only) ────────────────────────────────────
  //
  // Increments editorResetKey so AppShell passes a new key to VimEditor,
  // forcing a full editor remount with fresh initialContent.
  // Does NOT clear progress.

  const handleResetLesson = useCallback(() => {
    setCurrentMode('normal');
    currentModeRef.current = 'normal';
    editorContentRef.current = currentLessonRef.current.initialContent;
    setEditorResetKey((k) => k + 1);
  }, []);

  // ── Start Over (all progress reset) ───────────────────────────────────────

  const handleStartOver = useCallback(() => {
    resetAll();
    setCurrentMode('normal');
    currentModeRef.current = 'normal';
    setEditorResetKey((k) => k + 1);
  }, [resetAll]);

  const handleResetAllProgress = useCallback(() => {
    resetAll();
    setCurrentMode('normal');
    currentModeRef.current = 'normal';
    setEditorResetKey((k) => k + 1);
  }, [resetAll]);

  // ── Course completion guard ────────────────────────────────────────────────

  const isCourseComplete = totalLessons > 0 && completedCount >= totalLessons;

  if (isCourseComplete) {
    return (
      <CompletionScreen
        completedCount={completedCount}
        totalLessons={totalLessons}
        onStartOver={handleStartOver}
        className="min-h-svh"
      />
    );
  }

  // ── Normal app ─────────────────────────────────────────────────────────────

  return (
    <AppShell
      lessons={lessons}
      currentLesson={currentLesson}
      currentLessonIndex={currentLessonIndex}
      progress={progress.lessons}
      completedCount={completedCount}
      totalLessons={totalLessons}
      currentMode={currentMode}
      isCurrentLessonCompleted={isCurrentLessonCompleted}
      isFirstLesson={isFirstLesson}
      isLastLesson={isLastLesson}
      editorResetKey={editorResetKey}
      onSelectLesson={navigateTo}
      onPreviousLesson={navigatePrevious}
      onNextLesson={navigateNext}
      onResetLesson={handleResetLesson}
      onResetAllProgress={handleResetAllProgress}
      onUseHint={useHint}
      onCheckMission={handleManualValidation}
      onEditorContentChange={handleEditorContentChange}
      onEditorModeChange={handleEditorModeChange}
      onWriteCommand={handleWriteCommand}
      lastCommand={lastCommand}
      commandStatus={commandStatus}
      className="min-h-svh"
    />
  );
}
