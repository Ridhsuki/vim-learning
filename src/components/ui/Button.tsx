/**
 * Button.tsx
 *
 * Reusable, accessible button with four visual variants and two sizes.
 * Extends the native <button> element so all standard button attributes
 * (disabled, type, onClick, aria-*, etc.) work without any extra wiring.
 */

import type React from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function variantClasses(variant: ButtonVariant): string {
  switch (variant) {
    case 'primary':
      return [
        'bg-[#3fb950] text-[#0d1117] border-transparent',
        'hover:bg-[#3fb950]/90',
        'focus-visible:ring-[#3fb950]/60',
        'disabled:bg-[#3fb950]/30 disabled:text-[#3fb950]/50',
      ].join(' ');
    case 'secondary':
      return [
        'bg-[#161b22] text-[#e6edf3] border-[#30363d]',
        'hover:bg-[#30363d] hover:border-[#8b949e]',
        'focus-visible:ring-[#58a6ff]/40',
        'disabled:opacity-40',
      ].join(' ');
    case 'ghost':
      return [
        'bg-transparent text-[#8b949e] border-transparent',
        'hover:bg-[#30363d]/60 hover:text-[#e6edf3]',
        'focus-visible:ring-[#58a6ff]/40',
        'disabled:opacity-40',
      ].join(' ');
    case 'danger':
      return [
        'bg-[#f85149]/15 text-[#f85149] border-[#f85149]/40',
        'hover:bg-[#f85149]/25 hover:border-[#f85149]/70',
        'focus-visible:ring-[#f85149]/50',
        'disabled:opacity-40',
      ].join(' ');
  }
}

function sizeClasses(size: ButtonSize): string {
  switch (size) {
    case 'sm':
      return 'px-2.5 py-1 text-xs gap-1.5';
    case 'md':
      return 'px-4 py-1.5 text-sm gap-2';
  }
}

// ─── Component ────────────────────────────────────────────────────────────────

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  disabled,
  ...rest
}: ButtonProps) {
  const base =
    'inline-flex items-center justify-center rounded border font-medium ' +
    'transition-colors duration-150 cursor-pointer select-none ' +
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-offset-[#0d1117] ' +
    'disabled:cursor-not-allowed';

  const classes = [base, variantClasses(variant), sizeClasses(size), className]
    .filter(Boolean)
    .join(' ');

  return (
    <button className={classes} disabled={disabled} {...rest}>
      {children}
    </button>
  );
}
