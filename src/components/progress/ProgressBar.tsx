/**
 * ProgressBar.tsx
 *
 * Displays overall lesson completion progress as a horizontal bar with
 * readable text labels.
 *
 * Purely controlled by props — no hooks, no storage access, no lesson imports.
 */

// ─── Props ────────────────────────────────────────────────────────────────────

export interface ProgressBarProps {
  completed: number;
  total: number;
  className?: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Calculates a clamped [0, 100] integer percentage, safe when total <= 0. */
function calcPercentage(completed: number, total: number): number {
  if (total <= 0) return 0;
  const raw = (completed / total) * 100;
  return Math.round(Math.min(100, Math.max(0, raw)));
}

// ─── Component ────────────────────────────────────────────────────────────────

export function ProgressBar({ completed, total, className }: ProgressBarProps) {
  const percentage = calcPercentage(completed, total);

  const base = 'flex flex-col gap-1.5';
  const containerClass = className ? `${base} ${className}` : base;

  return (
    <div className={containerClass}>
      {/* Text labels */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-[#8b949e] font-mono">
          {completed}/{total} lessons
        </span>
        <span
          className={[
            'text-xs font-semibold font-mono',
            percentage === 100 ? 'text-[#3fb950]' : 'text-[#58a6ff]',
          ].join(' ')}
        >
          {percentage}%
        </span>
      </div>

      {/* Track + fill */}
      <div
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percentage}
        aria-label="Lesson completion progress"
        className="relative h-1.5 w-full overflow-hidden rounded-full bg-[#30363d]"
      >
        <div
          className={[
            'absolute inset-y-0 left-0 rounded-full transition-[width] duration-500 ease-out',
            percentage === 100 ? 'bg-[#3fb950]' : 'bg-[#58a6ff]',
          ].join(' ')}
          // Dynamic width via inline style — Tailwind cannot generate arbitrary
          // w-[N%] classes at runtime, so style is the correct approach here.
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
