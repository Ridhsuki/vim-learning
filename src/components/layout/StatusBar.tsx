/**
 * StatusBar.tsx
 *
 * Vim-inspired bottom status bar showing the current mode, lesson info,
 * and optional cursor position.
 *
 * Purely controlled by props — no hooks, no storage access, no CodeMirror
 * references, no direct lesson data imports.
 */

import type { VimMode } from '../../types/lesson';
import { ModeIndicator } from '../editor/ModeIndicator';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CursorPosition {
  line: number;
  column: number;
}

export interface StatusBarProps {
  mode: VimMode;
  lessonTitle: string;
  lessonIndex: number;
  totalLessons: number;
  cursorPosition?: CursorPosition;
  lastCommand?: string | null;
  commandStatus?: string | null;
  className?: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Maps a VimMode to the canonical Vim status-line label.
 * All six VimMode values are handled explicitly.
 */
function formatModeLabel(mode: VimMode): string {
  switch (mode) {
    case 'normal':
      return '-- NORMAL --';
    case 'insert':
      return '-- INSERT --';
    case 'visual':
      return '-- VISUAL --';
    case 'visual-line':
      return '-- VISUAL LINE --';
    case 'visual-block':
      return '-- VISUAL BLOCK --';
    case 'command':
      return '-- COMMAND --';
  }
}

// ─── Component ────────────────────────────────────────────────────────────────

export function StatusBar({
  mode,
  lessonTitle,
  lessonIndex,
  totalLessons,
  cursorPosition,
  lastCommand,
  commandStatus,
  className,
}: StatusBarProps) {
  const base =
    'flex items-center justify-between flex-wrap gap-x-4 gap-y-1 ' +
    'px-3 py-1.5 border-t border-[#30363d] bg-[#161b22] ' +
    'font-mono text-xs text-[#8b949e] select-none';

  const containerClass = className ? `${base} ${className}` : base;

  return (
    <footer
      className={containerClass}
      aria-label="Editor status bar"
      aria-live="polite"
    >
      {/* ── Left: mode badge + Vim mode label ── */}
      <div className="flex items-center gap-2 min-w-0">
        <ModeIndicator mode={mode} />
        <span className="hidden sm:inline text-[#8b949e]">
          {formatModeLabel(mode)}
        </span>
      </div>

      {/* ── Center: Command Feedback ── */}
      <div className="flex-1 flex justify-center items-center gap-3 min-w-0 overflow-hidden">
        {lastCommand && (
          <span className="truncate text-[#8b949e]">
            Last command: {lastCommand}
          </span>
        )}
        {commandStatus && (
          <span className="truncate font-semibold text-[#56d364]">
            {commandStatus}
          </span>
        )}
      </div>

      {/* ── Right: lesson progress + title + cursor ── */}
      <div className="flex items-center gap-3 min-w-0">
        {/* Lesson count */}
        <span className="shrink-0 text-[#8b949e]">
          Lesson {lessonIndex + 1}/{totalLessons}
        </span>

        {/* Lesson title — truncated on overflow */}
        <span
          className="hidden md:inline truncate max-w-[200px] text-[#e6edf3]"
          title={lessonTitle}
        >
          {lessonTitle}
        </span>

        {/* Cursor position — only rendered when data is available */}
        {cursorPosition !== undefined && (
          <span className="shrink-0 text-[#8b949e]">
            Ln {cursorPosition.line}, Col {cursorPosition.column}
          </span>
        )}
      </div>
    </footer>
  );
}
