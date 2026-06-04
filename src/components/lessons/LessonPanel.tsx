/**
 * LessonPanel.tsx
 *
 * Displays the active lesson: chapter, title, description paragraphs, mission
 * box, optional hint, navigation buttons, and a reset button.
 *
 * Purely controlled by props — contains no validation logic, no storage
 * access, no CodeMirror references, and no direct lesson data imports.
 */

import { useState } from 'react';
import type { Lesson } from '../../types/lesson';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Kbd } from '../ui/Kbd';
import { Tooltip } from '../ui/Tooltip';

// ─── Props ────────────────────────────────────────────────────────────────────

export interface LessonPanelProps {
  lesson: Lesson;
  isCompleted: boolean;
  isFirstLesson: boolean;
  isLastLesson: boolean;
  hintUsed?: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onReset: () => void;
  onUseHint: (lessonId: string) => void;
  onCheckMission?: () => void;
  className?: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function LessonPanel({
  lesson,
  isCompleted,
  isFirstLesson,
  isLastLesson,
  hintUsed = false,
  onPrevious,
  onNext,
  onReset,
  onUseHint,
  onCheckMission,
  className,
}: LessonPanelProps) {
  // ── Hint visibility ─────────────────────────────────────────────────────────
  //
  // Track the lesson id we last synchronised so we can reset hint visibility
  // during render when the lesson changes — the React-recommended alternative
  // to calling setState inside a useEffect body (which triggers cascading renders).

  const [hintVisible, setHintVisible] = useState(hintUsed);
  const [syncedLessonId, setSyncedLessonId] = useState(lesson.id);

  // If lesson.id has changed since last render, reset during this render pass.
  if (lesson.id !== syncedLessonId) {
    setSyncedLessonId(lesson.id);
    setHintVisible(hintUsed);
  }

  function handleHintClick() {
    setHintVisible(true);
    onUseHint(lesson.id);
  }

  // ── Layout ──────────────────────────────────────────────────────────────────

  const base =
    'flex flex-col gap-6 p-6 text-[#e6edf3] bg-[#0d1117] overflow-y-auto';
  const containerClass = className ? `${base} ${className}` : base;

  return (
    <article className={containerClass} aria-label={`Lesson: ${lesson.title}`}>

      {/* ── Header: chapter badge + title + completion ── */}
      <header className="flex flex-col gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="neutral" className="font-mono text-[10px] tracking-widest uppercase">
            {lesson.chapter}
          </Badge>

          {/* Completion badge — visible, not color-only */}
          {isCompleted && (
            <Badge
              variant="success"
              aria-live="polite"
              aria-label="Lesson complete"
            >
              ✓ Complete
            </Badge>
          )}
        </div>

        <h2 className="text-xl font-semibold text-[#e6edf3] leading-tight m-0">
          {lesson.title}
        </h2>
      </header>

      {/* ── Description paragraphs ── */}
      <section aria-label="Lesson description" className="flex flex-col gap-3">
        {lesson.description.map((para, i) => (
          <p key={i} className="text-sm text-[#8b949e] leading-relaxed m-0">
            {para}
          </p>
        ))}
      </section>

      {/* ── Mission box ── */}
      <section
        aria-label="Mission"
        className={[
          'rounded-lg border p-4 flex flex-col gap-2',
          isCompleted
            ? 'border-[#3fb950]/40 bg-[#3fb950]/5'
            : 'border-[#58a6ff]/30 bg-[#58a6ff]/5',
        ].join(' ')}
      >
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold font-mono tracking-widest uppercase text-[#8b949e]">
            Mission
          </span>
          {isCompleted && (
            <span className="text-[#3fb950] text-xs" aria-hidden="true">✓</span>
          )}
        </div>
        <p className="text-sm text-[#e6edf3] leading-relaxed m-0 font-medium">
          {lesson.mission}
        </p>
      </section>

      {/* ── Hint section ── */}
      {lesson.hint !== undefined && (
        <section aria-label="Hint" className="flex flex-col gap-2">
          {hintVisible ? (
            <div className="rounded border border-[#ffa657]/30 bg-[#ffa657]/5 p-3">
              <p className="text-xs font-semibold font-mono tracking-widest uppercase text-[#ffa657] mb-1">
                Hint
              </p>
              <p className="text-sm text-[#e6edf3] leading-relaxed m-0">
                {lesson.hint}
              </p>
            </div>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleHintClick}
              aria-label="Reveal hint for this lesson"
            >
              <span aria-hidden="true">💡</span>
              Show Hint
            </Button>
          )}
        </section>
      )}

      {/* ── Key reminder ── */}
      <section aria-label="Key reminders" className="flex items-center gap-1.5 flex-wrap">
        <span className="text-xs text-[#8b949e]">Useful keys:</span>
        <Kbd>Esc</Kbd>
        <span className="text-xs text-[#8b949e]">normal mode</span>
        <span className="text-xs text-[#30363d] select-none mx-1">·</span>
        <Kbd>i</Kbd>
        <span className="text-xs text-[#8b949e]">insert</span>
        <span className="text-xs text-[#30363d] select-none mx-1">·</span>
        <Kbd>:</Kbd>
        <span className="text-xs text-[#8b949e]">command</span>
      </section>

      {/* ── Navigation + Reset ── */}
      <footer className="flex items-center gap-2 flex-wrap mt-auto pt-2 border-t border-[#30363d]">
        {/* Previous */}
        <Tooltip
          content={isFirstLesson ? 'Already at the first lesson' : 'Go to previous lesson'}
        >
          <Button
            variant="secondary"
            size="sm"
            onClick={onPrevious}
            disabled={isFirstLesson}
            aria-label="Previous lesson"
          >
            ← Prev
          </Button>
        </Tooltip>

        {/* Next */}
        <Tooltip
          content={isLastLesson ? 'Already at the last lesson' : 'Go to next lesson'}
        >
          <Button
            variant={isCompleted ? 'primary' : 'secondary'}
            size="sm"
            onClick={onNext}
            disabled={isLastLesson}
            aria-label="Next lesson"
          >
            Next →
          </Button>
        </Tooltip>

        {/* Check Mission (for manual triggers only) */}
        {lesson.validation.trigger === 'manual' && !isCompleted && onCheckMission && (
          <Button
            variant="primary"
            size="sm"
            onClick={onCheckMission}
            aria-label="Mark this manual mission as completed"
          >
            I completed this mission
          </Button>
        )}

        {/* Spacer */}
        <span className="flex-1" />

        {/* Reset — danger variant makes the destructive nature clear */}
        <Tooltip content="Reset this lesson's editor content to the starting text">
          <Button
            variant="danger"
            size="sm"
            onClick={onReset}
            aria-label="Reset lesson editor content"
          >
            Reset lesson
          </Button>
        </Tooltip>
      </footer>
    </article>
  );
}
