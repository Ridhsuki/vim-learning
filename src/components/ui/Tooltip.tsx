/**
 * Tooltip.tsx
 *
 * A CSS-only hover and focus-within tooltip using Tailwind classes.
 * No floating UI libraries, no timers, no direct DOM manipulation.
 *
 * Accessibility:
 *   - Uses useId() to generate a stable aria-describedby / id pair.
 *   - Tooltip content has role="tooltip" so assistive technologies can
 *     announce it when the trigger element receives focus.
 *   - The tooltip text is always in the DOM but visually hidden until the
 *     wrapper is hovered or focused (via Tailwind peer/group utilities).
 *
 * Visibility mechanism:
 *   The outer wrapper uses `group`. The tooltip panel carries:
 *     - `invisible opacity-0` — hidden by default
 *     - `group-hover:visible group-hover:opacity-100` — shown on hover
 *     - `group-focus-within:visible group-focus-within:opacity-100` — shown on focus
 *   This is pure CSS — no JS event handlers needed.
 */

import { useId } from 'react';
import type React from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface TooltipProps {
  /** The text or node shown inside the tooltip bubble. */
  content: React.ReactNode;
  /** The trigger element — must be focusable for keyboard accessibility. */
  children: React.ReactNode;
  /** Extra classes for the outer wrapper. */
  className?: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function Tooltip({ content, children, className }: TooltipProps) {
  const tooltipId = useId();

  const wrapperClasses = ['relative inline-flex group', className]
    .filter(Boolean)
    .join(' ');

  return (
    <span className={wrapperClasses}>
      {/* Trigger — passes aria-describedby so screen readers link the tooltip */}
      <span aria-describedby={tooltipId}>{children}</span>

      {/* Tooltip bubble */}
      <span
        id={tooltipId}
        role="tooltip"
        className={[
          // Positioning — appear above the trigger by default
          'absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50',
          // Sizing and layout
          'w-max max-w-[220px] px-2.5 py-1.5 rounded',
          // Dark terminal surface
          'bg-[#161b22] border border-[#30363d]',
          // Typography
          'text-[#e6edf3] text-xs leading-snug whitespace-normal',
          // Subtle shadow
          'shadow-lg',
          // Visibility — hidden until group is hovered or focus-within
          'invisible opacity-0 pointer-events-none',
          'transition-opacity duration-150',
          'group-hover:visible group-hover:opacity-100',
          'group-focus-within:visible group-focus-within:opacity-100',
        ].join(' ')}
      >
        {content}
      </span>
    </span>
  );
}
