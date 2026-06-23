/**
 * CompletionConfetti.tsx
 *
 * Renders a subtle, CSS-animated confetti overlay when all lessons are
 * completed.
 *
 * Design decisions:
 *   - Pure CSS keyframe animation — no canvas, no library.
 *   - Pieces are generated once via useMemo (stable across re-renders).
 *   - Colours reuse existing design-token hex values from globals.css.
 *   - The overlay is position:fixed, pointer-events:none, aria-hidden.
 *   - Returns null when the user has prefers-reduced-motion set.
 */

import { useMemo, useEffect, useState } from 'react';

// ─── Reduced-motion hook ──────────────────────────────────────────────────────

function useReducedMotion(): boolean {
  const mql =
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)')
      : null;

  const [reduced, setReduced] = useState<boolean>(mql?.matches ?? false);

  useEffect(() => {
    if (!mql) return;
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, [mql]);

  return reduced;
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface ConfettiPiece {
  id: number;
  left: number;       // % from left
  delay: number;      // animation-delay in seconds
  duration: number;   // animation-duration in seconds
  color: string;
  size: number;       // px
  isCircle: boolean;
}

// ─── Constants ────────────────────────────────────────────────────────────────

// Reuse design-token accent colours from globals.css — dark, muted variants
// to stay consistent with the dark GitHub-like theme.
const CONFETTI_COLORS: string[] = [
  '#3fb950', // --color-green
  '#58a6ff', // --color-blue
  '#d2a8ff', // --color-purple
  '#ffa657', // --color-orange
];

const PIECE_COUNT = 55;

// Seeded pseudo-random number generator so SSR and hydration stay consistent.
// Simple LCG — good enough for visual variation.
function createSeededRng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

function generatePieces(): ConfettiPiece[] {
  const rng = createSeededRng(42);
  return Array.from({ length: PIECE_COUNT }, (_, i) => ({
    id: i,
    left: rng() * 100,
    delay: rng() * 5,
    duration: 4 + rng() * 4,   // 4–8 s — slow drift
    color: CONFETTI_COLORS[Math.floor(rng() * CONFETTI_COLORS.length)],
    size: 4 + Math.floor(rng() * 4), // 4–7 px — small
    isCircle: rng() > 0.5,
  }));
}

// ─── Component ────────────────────────────────────────────────────────────────

export function CompletionConfetti() {
  const reducedMotion = useReducedMotion();
  const pieces = useMemo(() => generatePieces(), []);

  if (reducedMotion) return null;

  return (
    <div
      className="completion-confetti"
      aria-hidden="true"
      role="presentation"
    >
      {pieces.map((piece) => {
        const pieceClass = [
          'completion-confetti__piece',
          piece.isCircle ? 'completion-confetti__piece--circle' : '',
        ]
          .filter(Boolean)
          .join(' ');

        return (
          <span
            key={piece.id}
            className={pieceClass}
            style={{
              left: `${piece.left}%`,
              top: `-${piece.size}px`,
              width: `${piece.size}px`,
              height: `${piece.size}px`,
              backgroundColor: piece.color,
              animationDelay: `${piece.delay}s`,
              animationDuration: `${piece.duration}s`,
              opacity: 0.75,
            }}
          />
        );
      })}
    </div>
  );
}
