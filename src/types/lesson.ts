/**
 * Vim editor modes as reported by @replit/codemirror-vim.
 */
export type VimMode =
  | 'normal'
  | 'insert'
  | 'visual'
  | 'visual-line'
  | 'visual-block'
  | 'command';

/**
 * When the validation check function should be called.
 *
 * - `on-change`      — after every editor content change (debounced)
 * - `on-mode-change` — whenever the Vim mode transitions
 * - `manual`         — only when the user explicitly clicks "Check"
 */
export type ValidationTrigger = 'on-change' | 'on-mode-change' | 'manual';

export interface ValidationRule {
  trigger: ValidationTrigger;
  /** Pure function — same inputs always produce the same result. No side effects. */
  check: (content: string, mode: VimMode) => boolean;
}

export interface Lesson {
  /** Unique URL-safe slug, e.g. "modes-intro". */
  id: string;
  /** Human-readable chapter label, e.g. "Chapter 1: Vim Modes". */
  chapter: string;
  /** Zero-based index used to sort chapters. */
  chapterIndex: number;
  /** Zero-based index of this lesson within its chapter. */
  lessonIndex: number;
  title: string;
  /** Each string is rendered as a separate paragraph. */
  description: string[];
  /** Text pre-loaded into the editor buffer when the lesson starts. */
  initialContent: string;
  /** The task the user must complete to pass the lesson. */
  mission: string;
  /** Optional hint revealed on demand. Not shown by default. */
  hint?: string;
  validation: ValidationRule;
}

export interface LessonProgress {
  completed: boolean;
  hintUsed: boolean;
  /** ISO 8601 timestamp set when the lesson is first completed. */
  completedAt?: string;
}

export interface AppProgress {
  currentLessonId: string;
  /** Keyed by Lesson.id. */
  lessons: Record<string, LessonProgress>;
  /** Increment when the schema changes to trigger safe migration. */
  version: number;
}
