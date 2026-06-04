import type { AppProgress } from '../types/lesson';

export const CURRENT_PROGRESS_VERSION = 1;
export const STORAGE_KEY = 'vim-tutor:progress';

// ─── Type guard ───────────────────────────────────────────────────────────────

/**
 * Checks that a parsed JSON value has the shape of AppProgress.
 * Does not validate every nested field — just enough to catch corrupt data.
 */
function isAppProgress(value: unknown): value is AppProgress {
  if (typeof value !== 'object' || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v['currentLessonId'] === 'string' &&
    typeof v['lessons'] === 'object' &&
    v['lessons'] !== null &&
    typeof v['version'] === 'number'
  );
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Loads saved progress from localStorage.
 *
 * Returns null when:
 * - localStorage is unavailable (private browsing mode, quota errors)
 * - No progress has been saved yet
 * - The stored JSON is malformed
 * - The stored version does not match CURRENT_PROGRESS_VERSION
 * - The parsed value does not look like a valid AppProgress object
 *
 * Never throws.
 */
export function loadProgress(): AppProgress | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === null) return null;

    const parsed: unknown = JSON.parse(raw);
    if (!isAppProgress(parsed)) return null;
    if (parsed.version !== CURRENT_PROGRESS_VERSION) return null;

    return parsed;
  } catch {
    return null;
  }
}

/**
 * Persists progress to localStorage.
 * Fails silently if storage is unavailable or the write throws.
 * Never throws.
 */
export function saveProgress(progress: AppProgress): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // Storage unavailable (private mode, quota exceeded) — continue in-memory.
  }
}

/**
 * Removes the saved progress entry from localStorage.
 * Fails silently if storage is unavailable or the remove throws.
 * Never throws.
 */
export function clearProgress(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Storage unavailable — nothing to clear.
  }
}
