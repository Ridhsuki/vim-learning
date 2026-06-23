/**
 * AppShell.tsx
 *
 * Main layout component that assembles the full Vim learning tutor interface.
 *
 * Layout (desktop):
 *   ┌──────────────────────────────────────────────────────┐
 *   │ header: Vim Learning · subtitle · ProgressBar         │
 *   ├──────────────────┬───────────────────────────────────┤
 *   │ aside: LessonList│ main: LessonPanel | VimEditor     │
 *   ├──────────────────┴───────────────────────────────────┤
 *   │ footer: StatusBar                                     │
 *   └──────────────────────────────────────────────────────┘
 *
 * Purely controlled by props — no hooks, no localStorage, no CodeMirror
 * APIs, no lesson data imports, no validation logic.
 */

import { useState } from 'react';
import type { TouchEvent } from 'react';
import type { Lesson, LessonProgress, VimMode } from '../../types/lesson';
import { VimEditor } from '../editor/VimEditor';
import { LessonPanel } from '../lessons/LessonPanel';
import { LessonList } from '../lessons/LessonList';
import { ProgressBar } from '../progress/ProgressBar';
import { StatusBar } from './StatusBar';
import { Button } from '../ui/Button';
import { ConfirmDialog } from '../ui/ConfirmDialog';

// ─── Props ────────────────────────────────────────────────────────────────────

export interface AppShellProps {
  lessons: Lesson[];
  currentLesson: Lesson;
  currentLessonIndex: number;
  progress: Record<string, LessonProgress>;
  completedCount: number;
  totalLessons: number;
  currentMode: VimMode;
  isCurrentLessonCompleted: boolean;
  isFirstLesson: boolean;
  isLastLesson: boolean;
  editorResetKey?: string | number;
  onSelectLesson: (lessonId: string) => void;
  onPreviousLesson: () => void;
  onNextLesson: () => void;
  onResetLesson: () => void;
  onUseHint: (lessonId: string) => void;
  onResetAllProgress: () => void;
  onCheckMission?: () => void;
  onEditorContentChange: (content: string) => void;
  onEditorModeChange: (mode: VimMode) => void;
  onWriteCommand?: () => void;
  lastCommand?: string | null;
  commandStatus?: string | null;
  className?: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function AppShell({
  lessons,
  currentLesson,
  currentLessonIndex,
  progress,
  completedCount,
  totalLessons,
  currentMode,
  isCurrentLessonCompleted,
  isFirstLesson,
  isLastLesson,
  editorResetKey,
  onSelectLesson,
  onPreviousLesson,
  onNextLesson,
  onResetLesson,
  onUseHint,
  onResetAllProgress,
  onCheckMission,
  onEditorContentChange,
  onEditorModeChange,
  onWriteCommand,
  lastCommand,
  commandStatus,
  className,
}: AppShellProps) {
  const base =
    'flex flex-col h-svh min-h-0 overflow-hidden bg-[#0d1117] text-[#e6edf3]';
  const containerClass = className ? `${base} ${className}` : base;

  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);
  const [mobileView, setMobileView] = useState<'lessons' | 'lesson' | 'editor'>('lesson');
  const [touchStart, setTouchStart] = useState<number | null>(null);

  const handleSelectLesson = (lessonId: string) => {
    onSelectLesson(lessonId);
    setMobileView('lesson'); // switch to lesson view when a lesson is picked
  };

  const handleTouchStart = (e: TouchEvent) => {
    // Don't intercept swipe inside the CodeMirror editor to prevent breaking its native scrolling/selection
    if ((e.target as Element).closest('.cm-editor')) return;
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (e: TouchEvent) => {
    if (touchStart === null) return;
    if ((e.target as Element).closest('.cm-editor')) {
      setTouchStart(null);
      return;
    }
    const touchEnd = e.changedTouches[0].clientX;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      if (mobileView === 'lessons') setMobileView('lesson');
      else if (mobileView === 'lesson') setMobileView('editor');
    } else if (isRightSwipe) {
      if (mobileView === 'editor') setMobileView('lesson');
      else if (mobileView === 'lesson') setMobileView('lessons');
    }
    setTouchStart(null);
  };

  const handleResetAllClick = () => {
    setIsResetDialogOpen(true);
  };

  const handleConfirmReset = () => {
    onResetAllProgress();
    setIsResetDialogOpen(false);
  };

  const handleCancelReset = () => {
    setIsResetDialogOpen(false);
  };

  return (
    <div 
      className={containerClass}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <header className="shrink-0 flex flex-wrap items-center gap-4 px-4 py-2.5 border-b border-[#30363d] bg-[#161b22]">
        {/* Brand */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-base font-bold font-mono text-[#e6edf3] tracking-tight">
            Vim Learning
          </span>
          <span className="hidden sm:inline text-xs text-[#8b949e] font-mono">
            — Learn Vim in your browser
          </span>
        </div>

        {/* Progress bar — grows to fill remaining header space */}
        <div className="flex-1 min-w-0 max-w-xs ml-auto">
          <ProgressBar completed={completedCount} total={totalLessons} />
        </div>

        <Button
          variant="danger"
          size="sm"
          onClick={handleResetAllClick}
          aria-label="Reset all lesson progress"
          className="shrink-0"
        >
          Reset all progress
        </Button>
      </header>

      {/* ── Mobile View Switcher ─────────────────────────────────────────── */}
      <nav className="lg:hidden flex shrink-0 border-b border-[#30363d] bg-[#161b22]" aria-label="Mobile view switcher">
        <button
          onClick={() => setMobileView('lessons')}
          aria-pressed={mobileView === 'lessons'}
          className={`flex-1 py-2.5 text-sm font-medium border-b-2 transition-colors ${
            mobileView === 'lessons' ? 'border-[#58a6ff] text-[#58a6ff]' : 'border-transparent text-[#8b949e] hover:text-[#e6edf3]'
          }`}
        >
          Lessons
        </button>
        <button
          onClick={() => setMobileView('lesson')}
          aria-pressed={mobileView === 'lesson'}
          className={`flex-1 py-2.5 text-sm font-medium border-b-2 transition-colors ${
            mobileView === 'lesson' ? 'border-[#58a6ff] text-[#58a6ff]' : 'border-transparent text-[#8b949e] hover:text-[#e6edf3]'
          }`}
        >
          Lesson
        </button>
        <button
          onClick={() => setMobileView('editor')}
          aria-pressed={mobileView === 'editor'}
          className={`flex-1 py-2.5 text-sm font-medium border-b-2 transition-colors ${
            mobileView === 'editor' ? 'border-[#58a6ff] text-[#58a6ff]' : 'border-transparent text-[#8b949e] hover:text-[#e6edf3]'
          }`}
        >
          Editor
        </button>
      </nav>

      {/* ── Body (sidebar + main) ────────────────────────────────────────── */}
      <div className="flex flex-col lg:flex-row flex-1 min-h-0 overflow-hidden">

        {/* ── Sidebar: lesson roadmap ───────────────────────────────────── */}
        <aside
          aria-label="Lesson roadmap"
          className={[
            'shrink-0 lg:border-r border-[#30363d]',
            mobileView === 'lessons' ? 'block flex-1' : 'hidden lg:block',
            'w-full lg:w-56 xl:w-64',
            'overflow-y-auto',
          ].join(' ')}
        >
          <LessonList
            lessons={lessons}
            currentLessonId={currentLesson.id}
            progress={progress}
            onSelectLesson={handleSelectLesson}
            className="h-full"
          />
        </aside>

        {/* ── Main content: LessonPanel + VimEditor ────────────────────── */}
        <main
          aria-label="Lesson content and editor"
          className={[
            'flex-1 min-w-0 min-h-0',
            mobileView !== 'lessons' ? 'flex flex-col lg:grid' : 'hidden lg:grid',
            'lg:grid-cols-[minmax(22rem,1fr)_minmax(0,50vw)] overflow-hidden'
          ].join(' ')}
        >
          {/* Lesson panel */}
          <LessonPanel
            lesson={currentLesson}
            isCompleted={isCurrentLessonCompleted}
            isFirstLesson={isFirstLesson}
            isLastLesson={isLastLesson}
            hintUsed={progress[currentLesson.id]?.hintUsed ?? false}
            onPrevious={onPreviousLesson}
            onNext={onNextLesson}
            onReset={onResetLesson}
            onUseHint={onUseHint}
            onCheckMission={onCheckMission}
            className={[
              'min-w-0 lg:border-r lg:border-[#30363d]',
              mobileView === 'lesson' ? 'flex-1 overflow-y-auto' : 'hidden lg:block',
              'overflow-x-hidden lg:max-h-none'
            ].join(' ')}
          />

          {/* Vim editor — takes remaining space */}
          {/*
           * The key combines lesson id + editorResetKey so the parent can
           * force a full editor remount (resetting content and Vim state)
           * by incrementing editorResetKey, without touching VimEditor's API.
           */}
          <VimEditor
            key={`${currentLesson.id}-${editorResetKey ?? 0}`}
            initialContent={currentLesson.initialContent}
            onContentChange={onEditorContentChange}
            onModeChange={onEditorModeChange}
            onWriteCommand={onWriteCommand}
            className={[
              'min-w-0 min-h-0 rounded-none border-0 shadow-none',
              mobileView === 'editor' ? 'flex-1' : 'hidden lg:block lg:flex-1'
            ].join(' ')}
          />
        </main>
      </div>

      {/* ── Status bar ─────────────────────────────────────────────────────── */}
      <StatusBar
        mode={currentMode}
        lessonTitle={currentLesson.title}
        lessonIndex={currentLessonIndex}
        totalLessons={totalLessons}
        lastCommand={lastCommand}
        commandStatus={commandStatus}
      />

      {/* ── Modals ─────────────────────────────────────────────────────────── */}
      <ConfirmDialog
        open={isResetDialogOpen}
        title="Reset all progress?"
        description="This will clear all completed lessons, hints, and saved progress. You will return to the first lesson. This action cannot be undone."
        confirmLabel="Reset progress"
        cancelLabel="Keep progress"
        variant="danger"
        onConfirm={handleConfirmReset}
        onCancel={handleCancelReset}
      />
    </div>
  );
}
