/**
 * Badge.tsx
 *
 * Compact status badge with semantic color variants.
 * Includes Vim-mode specific variants (normal, insert, visual, command)
 * that mirror the ModeIndicator palette so Badge can be reused in
 * lesson lists and progress displays.
 *
 * Extends <span> so all standard HTML attributes are available.
 */

import type React from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

export type BadgeVariant =
  | 'neutral'
  | 'success'
  | 'info'
  | 'warning'
  | 'danger'
  // Vim-mode aliases
  | 'normal'    // green — same as success/normal mode
  | 'insert'    // blue  — insert mode
  | 'visual'    // purple — visual mode (all sub-types)
  | 'command';  // orange — command mode

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function badgeColorClasses(variant: BadgeVariant): string {
  switch (variant) {
    case 'neutral':
      return 'text-[#8b949e] bg-[#30363d]/60 border-[#30363d]';
    case 'success':
    case 'normal':
      // Green — design.md accent green
      return 'text-[#3fb950] bg-[#3fb950]/10 border-[#3fb950]/40';
    case 'info':
    case 'insert':
      // Blue — design.md accent blue
      return 'text-[#58a6ff] bg-[#58a6ff]/10 border-[#58a6ff]/40';
    case 'warning':
    case 'command':
      // Orange — design.md mode command
      return 'text-[#ffa657] bg-[#ffa657]/10 border-[#ffa657]/40';
    case 'danger':
      // Red — design.md error red
      return 'text-[#f85149] bg-[#f85149]/10 border-[#f85149]/40';
    case 'visual':
      // Purple — design.md mode visual
      return 'text-[#d2a8ff] bg-[#d2a8ff]/10 border-[#d2a8ff]/40';
  }
}

// ─── Component ────────────────────────────────────────────────────────────────

export function Badge({
  variant = 'neutral',
  className,
  children,
  ...rest
}: BadgeProps) {
  const base =
    'inline-flex items-center px-2 py-0.5 rounded border text-xs font-medium select-none';

  const classes = [base, badgeColorClasses(variant), className]
    .filter(Boolean)
    .join(' ');

  return (
    <span className={classes} {...rest}>
      {children}
    </span>
  );
}
