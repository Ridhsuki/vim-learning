/**
 * ModeIndicator.tsx
 *
 * A compact, accessible badge that displays the current Vim mode.
 *
 * Design constraints (from design.md):
 *   Normal  → green  #3fb950
 *   Insert  → blue   #58a6ff
 *   Visual  → purple #d2a8ff
 *   Command → orange #ffa657
 *
 * Accessibility:
 *   - aria-live="polite" so screen readers announce mode transitions.
 *   - aria-label carries a human-readable description of the current mode.
 *   - Text label is always visible — color is supplementary, not the sole signal.
 */

import type { VimMode } from '../../types/lesson';

// ─── Props ────────────────────────────────────────────────────────────────────

export interface ModeIndicatorProps {
  mode: VimMode;
  /** Optional extra classes merged onto the outer element. */
  className?: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

interface ModeMeta {
  /** Text shown inside the badge, e.g. "INSERT". */
  label: string;
  /**
   * Tailwind classes that set the badge's foreground color, background tint,
   * and border.  Uses Tailwind v4 arbitrary-value syntax so the exact hex
   * colors from design.md are encoded directly without modifying CSS files.
   *
   * Color palette:
   *   Normal  → #3fb950 (green)
   *   Insert  → #58a6ff (blue)
   *   Visual* → #d2a8ff (purple)
   *   Command → #ffa657 (orange)
   */
  colorClasses: string;
}

function getModeMeta(mode: VimMode): ModeMeta {
  switch (mode) {
    case 'normal':
      return {
        label: 'NORMAL',
        colorClasses:
          'text-[#3fb950] bg-[#3fb950]/10 border-[#3fb950]/40',
      };
    case 'insert':
      return {
        label: 'INSERT',
        colorClasses:
          'text-[#58a6ff] bg-[#58a6ff]/10 border-[#58a6ff]/40',
      };
    case 'visual':
      return {
        label: 'VISUAL',
        colorClasses:
          'text-[#d2a8ff] bg-[#d2a8ff]/10 border-[#d2a8ff]/40',
      };
    case 'visual-line':
      return {
        label: 'VISUAL LINE',
        colorClasses:
          'text-[#d2a8ff] bg-[#d2a8ff]/10 border-[#d2a8ff]/40',
      };
    case 'visual-block':
      return {
        label: 'VISUAL BLOCK',
        colorClasses:
          'text-[#d2a8ff] bg-[#d2a8ff]/10 border-[#d2a8ff]/40',
      };
    case 'command':
      return {
        label: 'COMMAND',
        colorClasses:
          'text-[#ffa657] bg-[#ffa657]/10 border-[#ffa657]/40',
      };
  }
}

// ─── Component ────────────────────────────────────────────────────────────────

export function ModeIndicator({ mode, className }: ModeIndicatorProps) {
  const { label, colorClasses } = getModeMeta(mode);

  const baseClasses =
    'inline-flex items-center px-2.5 py-0.5 rounded border font-mono text-xs font-semibold tracking-widest uppercase select-none transition-colors duration-150';

  return (
    <span
      aria-live="polite"
      aria-label={`Current Vim mode: ${label}`}
      className={
        className
          ? `${baseClasses} ${colorClasses} ${className}`
          : `${baseClasses} ${colorClasses}`
      }
    >
      {label}
    </span>
  );
}
