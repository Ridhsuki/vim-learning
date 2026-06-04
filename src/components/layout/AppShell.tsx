/**
 * AppShell.tsx
 *
 * Main layout component that assembles the full Vim learning tutor interface.
 *
 * Layout (desktop):
 *   ┌──────────────────────────────────────────────────────┐
 *   │ header: VimTutor · subtitle · ProgressBar            │
 *   ├──────────────────┬───────────────────────────────────┤
 *   │ aside: LessonList│ main: LessonPanel | VimEditor     │
 *   ├──────────────────┴───────────────────────────────────┤
 *   │ footer: StatusBar                                     │
 *   └──────────────────────────────────────────────────────┘
 *
 * Purely controlled by props — no hooks, no localStorage, no CodeMirror
 * APIs, no lesson data imports, no validation logic.
 */

import type { Lesson, LessonProgress, VimMode } from '../../types/lesson';
import { VimEditor } from '../editor/VimEditor';
import { LessonPanel } from '../lessons/LessonPanel';
import { LessonList } from '../lessons/LessonList';
import { ProgressBar } from '../progress/ProgressBar';
import { StatusBar } from './StatusBar';
import { Button } from '../ui/Button';

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
  className,
}: AppShellProps) {
  const base =
    'flex flex-col h-svh min-h-0 overflow-hidden bg-[#0d1117] text-[#e6edf3]';
  const containerClass = className ? `${base} ${className}` : base;

  const handleResetAllClick = () => {
    if (window.confirm('Are you sure you want to reset all your lesson progress? This cannot be undone.')) {
      onResetAllProgress();
    }
  };

  return (
    <div className={containerClass}>

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <header className="shrink-0 flex items-center gap-4 px-4 py-2.5 border-b border-[#30363d] bg-[#161b22]">
        {/* Brand */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-base font-bold font-mono text-[#e6edf3] tracking-tight">
            VimTutor
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

      {/* ── Body (sidebar + main) ────────────────────────────────────────── */}
      <div className="flex flex-1 min-h-0 overflow-hidden">

        {/* ── Sidebar: lesson roadmap ───────────────────────────────────── */}
        <aside
          aria-label="Lesson roadmap"
          className={[
            // On mobile, sidebar sits above main as a horizontal strip.
            // On large screens, it becomes a fixed-width vertical sidebar.
            'shrink-0 border-r border-[#30363d]',
            'w-full lg:w-56 xl:w-64',
            'max-h-40 lg:max-h-none',
            'overflow-y-auto',
          ].join(' ')}
        >
          <LessonList
            lessons={lessons}
            currentLessonId={currentLesson.id}
            progress={progress}
            onSelectLesson={onSelectLesson}
            className="h-full"
          />
        </aside>

        {/* ── Main content: LessonPanel + VimEditor ────────────────────── */}
        <main
          aria-label="Lesson content and editor"
          className="flex flex-1 min-w-0 min-h-0 flex-col lg:flex-row overflow-hidden"
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
            className="shrink-0 lg:w-80 xl:w-96 lg:border-r lg:border-[#30363d] overflow-y-auto"
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
            className="flex-1 min-h-0 rounded-none border-0 shadow-none"
          />
        </main>
      </div>

      {/* ── Status bar ─────────────────────────────────────────────────────── */}
      <StatusBar
        mode={currentMode}
        lessonTitle={currentLesson.title}
        lessonIndex={currentLessonIndex}
        totalLessons={totalLessons}
      />
    </div>
  );
}
