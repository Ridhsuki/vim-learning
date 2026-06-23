/**
 * MobileDisclaimerModal.tsx
 *
 * Displays a one-time informational modal on mobile screen sizes (< 768 px)
 * to warn users that this Vim learning app is not recommended on mobile
 * because keyboard-based Vim features may be limited or unavailable.
 *
 * Behaviour:
 *   - Only shown on first visit on a mobile viewport.
 *   - Dismissed state is persisted in localStorage so the modal never
 *     reappears after the user clicks "Continue anyway".
 *   - Completely invisible on desktop (≥ 768 px).
 *   - Returns null on initial render to avoid flashing on desktop.
 *
 * Accessibility:
 *   - role="dialog", aria-modal="true", aria-labelledby, aria-describedby.
 *   - Focus moves to the primary button when the modal opens.
 *   - Escape key closes the modal.
 *
 * Safety:
 *   - All window / localStorage access is inside useEffect (no SSR issues).
 */

import { useEffect, useRef, useState, useId } from 'react';
import { Button } from './Button';

// ─── Constants ────────────────────────────────────────────────────────────────

const STORAGE_KEY = 'vim-tutor:mobile-disclaimer-dismissed';
const MOBILE_BREAKPOINT = 768; // px — matches Tailwind's `md` breakpoint

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Determines whether the modal should be shown.
 * Called once as a lazy useState initializer — safe to access window /
 * localStorage here because Vite builds are client-only (no SSR).
 */
function shouldShowModal(): boolean {
  if (typeof window === 'undefined') return false;
  if (window.innerWidth >= MOBILE_BREAKPOINT) return false;
  return !localStorage.getItem(STORAGE_KEY);
}

// ─── Component ────────────────────────────────────────────────────────────────

export function MobileDisclaimerModal() {
  // Lazy initializer runs once at mount — avoids setState-in-effect lint error.
  const [open, setOpen] = useState<boolean>(shouldShowModal);
  // Ref on the dialog element; used to focus the first button inside it,
  // avoiding the need to add forwardRef to the existing Button component.
  const dialogRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const descId = useId();

  // ── Move focus to the primary button when modal opens ────────────────────
  useEffect(() => {
    if (open) {
      // Query the first button inside the dialog after it paints.
      // This avoids needing forwardRef on the existing Button component.
      const id = setTimeout(() => {
        const first = dialogRef.current?.querySelector<HTMLElement>('button');
        first?.focus();
      }, 50);
      return () => clearTimeout(id);
    }
  }, [open]);

  // ── Close on Escape ───────────────────────────────────────────────────────
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        localStorage.setItem(STORAGE_KEY, '1');
        setOpen(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open]);

  // ── Dismiss ───────────────────────────────────────────────────────────────
  function handleDismiss() {
    localStorage.setItem(STORAGE_KEY, '1');
    setOpen(false);
  }

  if (!open) return null;

  return (
    /* ── Backdrop ── */
    <div
      className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center bg-[#0d1117]/80 backdrop-blur-sm"
      aria-hidden="false"
    >
      {/* ── Dialog box ── */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descId}
        ref={dialogRef}
        className="relative w-full max-w-sm bg-[#161b22] border border-[#30363d] rounded-lg shadow-xl p-6 flex flex-col gap-4"
      >
        {/* ── Icon + title ── */}
        <header className="flex items-start gap-3">
          {/* Simple keyboard icon — inline SVG, no extra dependency */}
          <svg
            aria-hidden="true"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="shrink-0 mt-0.5 text-[#ffa657]"
          >
            <rect x="2" y="6" width="20" height="12" rx="2" />
            <path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M8 14h8" />
          </svg>
          <h2
            id={titleId}
            className="text-base font-semibold text-[#e6edf3] m-0 leading-snug"
          >
            Desktop recommended
          </h2>
        </header>

        {/* ── Body ── */}
        <p
          id={descId}
          className="text-sm text-[#8b949e] leading-relaxed m-0"
        >
          Vim Learning is designed for physical keyboards. On mobile, some keys and
          Vim commands (e.g.{' '}
          <code className="font-mono text-[#e6edf3] text-xs">Escape</code>,
          modifier combos) may be limited or unavailable.
          <br />
          <br />
          You can still explore the lessons, but the full experience works best
          on a desktop or laptop.
        </p>

        {/* ── Actions ── */}
        <footer className="flex items-center justify-end gap-3 mt-1">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleDismiss}
          >
            Continue anyway
          </Button>
        </footer>
      </div>
    </div>
  );
}
