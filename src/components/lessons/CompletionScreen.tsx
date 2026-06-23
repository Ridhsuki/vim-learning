/**
 * CompletionScreen.tsx
 *
 * Shown when all lessons have been completed.
 * Displays a congratulatory message, summary stats, and a "Start Over" button.
 *
 * Purely controlled by props — no hooks, no storage access, no lesson imports.
 */

import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { CompletionConfetti } from '../effects/CompletionConfetti';

// ─── Props ────────────────────────────────────────────────────────────────────

export interface CompletionScreenProps {
  completedCount: number;
  totalLessons: number;
  onStartOver: () => void;
  className?: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function calcPercentage(completed: number, total: number): number {
  if (total <= 0) return 0;
  return Math.round(Math.min(100, Math.max(0, (completed / total) * 100)));
}

// ─── Component ────────────────────────────────────────────────────────────────

export function CompletionScreen({
  completedCount,
  totalLessons,
  onStartOver,
  className,
}: CompletionScreenProps) {
  const percentage = calcPercentage(completedCount, totalLessons);

  const base =
    'flex flex-col items-center justify-center gap-8 px-6 py-12 ' +
    'bg-[#0d1117] text-[#e6edf3] text-center';
  const containerClass = className ? `${base} ${className}` : base;

  return (
    <section
      className={containerClass}
      aria-label="Course completion screen"
    >
      {/* ── Confetti overlay (non-interactive, respects reduced-motion) ── */}
      <CompletionConfetti />

      {/* ── Decorative top line ── */}
      <div className="font-mono text-[#3fb950] text-sm tracking-widest select-none">
        ──────────────── ✓ ────────────────
      </div>

      {/* ── Completion badge ── */}
      <Badge variant="success" className="text-sm px-4 py-1 font-mono">
        ✓ Course Complete
      </Badge>

      {/* ── Heading ── */}
      <div className="flex flex-col gap-3">
        <h1 className="text-3xl font-bold tracking-tight text-[#e6edf3] m-0">
          You've mastered the basics of Vim!
        </h1>
        <p className="text-[#8b949e] text-base max-w-md leading-relaxed m-0">
          You worked through every lesson in the VimTutor course. The motions,
          modes, and commands you've practised here will stay with you in any
          real Vim session.
        </p>
      </div>

      {/* ── Stats ── */}
      <div className="flex flex-col items-center gap-1">
        <span className="font-mono text-4xl font-bold text-[#3fb950]">
          {percentage}%
        </span>
        <span className="text-sm text-[#8b949e] font-mono">
          {completedCount}/{totalLessons} lessons completed
        </span>
      </div>

      {/* ── Call to action ── */}
      <div className="flex flex-col items-center gap-3">
        <Button
          variant="secondary"
          size="md"
          onClick={onStartOver}
          aria-label="Start the course over from the first lesson"
        >
          Start Over
        </Button>
        <p className="text-xs text-[#8b949e] font-mono m-0">
          Your progress will be reset to the first lesson.
        </p>
      </div>

      {/* ── Bottom divider ── */}
      <div className="font-mono text-[#30363d] text-sm tracking-widest select-none">
        ──────────────────────────────────
      </div>
    </section>
  );
}
