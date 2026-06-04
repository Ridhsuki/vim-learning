/**
 * LessonCard.tsx
 *
 * A clickable card representing a single lesson in the lesson roadmap.
 * Rendered as a <button> so it is keyboard navigable without any extra wiring.
 *
 * Purely controlled by props — no storage access, no CodeMirror references,
 * no direct lesson data imports, no validation logic.
 */

import type { Lesson } from '../../types/lesson';
import { Badge } from '../ui/Badge';

// ─── Props ────────────────────────────────────────────────────────────────────

export interface LessonCardProps {
  lesson: Lesson;
  isActive: boolean;
  isCompleted: boolean;
  hintUsed?: boolean;
  onSelect: (lessonId: string) => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function LessonCard({
  lesson,
  isActive,
  isCompleted,
  hintUsed = false,
  onSelect,
}: LessonCardProps) {
  // Build a descriptive aria-label so screen readers convey all relevant state.
  const statusText = isCompleted ? ', completed' : ', not yet completed';
  const activeText = isActive ? ', currently active' : '';
  const ariaLabel = `Lesson ${lesson.lessonIndex + 1}: ${lesson.title}${statusText}${activeText}`;

  return (
    <button
      type="button"
      onClick={() => onSelect(lesson.id)}
      aria-current={isActive ? 'step' : undefined}
      aria-label={ariaLabel}
      className={[
        // Base layout
        'w-full text-left px-3 py-2.5 rounded-lg border transition-colors duration-150',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#58a6ff]/60',
        // Active state — highlighted border + surface tint
        isActive
          ? 'border-[#58a6ff]/60 bg-[#58a6ff]/8 text-[#e6edf3]'
          : isCompleted
            ? 'border-[#3fb950]/20 bg-[#3fb950]/3 text-[#8b949e] hover:bg-[#30363d]/40 hover:text-[#e6edf3] hover:border-[#3fb950]/40'
            : 'border-[#30363d]/60 bg-transparent text-[#8b949e] hover:bg-[#30363d]/40 hover:text-[#e6edf3] hover:border-[#30363d]',
      ].join(' ')}
    >
      <div className="flex items-start gap-2">
        {/* Lesson number — compact ordinal within its chapter */}
        <span
          className={[
            'shrink-0 mt-0.5 w-5 h-5 rounded text-[10px] font-mono font-semibold',
            'inline-flex items-center justify-center',
            isActive
              ? 'bg-[#58a6ff] text-[#0d1117]'
              : isCompleted
                ? 'bg-[#3fb950]/20 text-[#3fb950]'
                : 'bg-[#30363d] text-[#8b949e]',
          ].join(' ')}
          aria-hidden="true"
        >
          {lesson.lessonIndex + 1}
        </span>

        {/* Title + badges row */}
        <div className="flex flex-col gap-1 min-w-0 flex-1">
          <span
            className={[
              'text-xs font-medium leading-snug truncate',
              isActive ? 'text-[#e6edf3]' : '',
            ].join(' ')}
          >
            {lesson.title}
          </span>

          {/* Status badges — text always present, color supplemental */}
          <div className="flex items-center gap-1 flex-wrap">
            {isCompleted && (
              <Badge variant="success" className="text-[10px] px-1.5 py-0">
                ✓ Done
              </Badge>
            )}
            {hintUsed && (
              <Badge variant="warning" className="text-[10px] px-1.5 py-0">
                hint used
              </Badge>
            )}
          </div>
        </div>
      </div>
    </button>
  );
}
