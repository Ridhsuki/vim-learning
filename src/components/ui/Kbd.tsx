/**
 * Kbd.tsx
 *
 * Renders a semantic <kbd> element styled to look like a physical keyboard key.
 * Uses JetBrains Mono via font-mono (loaded from Google Fonts in index.html).
 *
 * Example usage:
 *   <Kbd>Esc</Kbd>
 *   <Kbd>Ctrl</Kbd> + <Kbd>r</Kbd>
 */

import type React from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface KbdProps extends React.HTMLAttributes<HTMLElement> {}

// ─── Component ────────────────────────────────────────────────────────────────

export function Kbd({ className, children, ...rest }: KbdProps) {
  const base =
    'inline-flex items-center justify-center ' +
    'px-1.5 py-0.5 rounded ' +
    'font-mono text-xs font-medium leading-none ' +
    'text-[#e6edf3] bg-[#161b22] ' +
    'border border-b-2 border-[#30363d] ' +
    'shadow-sm select-none';

  const classes = [base, className].filter(Boolean).join(' ');

  return (
    <kbd className={classes} {...rest}>
      {children}
    </kbd>
  );
}
