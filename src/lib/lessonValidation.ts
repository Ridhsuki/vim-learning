import type { Lesson, VimMode, ValidationTrigger } from '../types/lesson';

/**
 * Returns true if the lesson mission is complete given the current editor
 * content and Vim mode.
 *
 * Catches any unexpected error thrown by lesson.validation.check and returns
 * false — a bad check function must never crash the app.
 *
 * Pure: no DOM, no localStorage, no side effects, no mutations.
 */
export function validateLesson(
  lesson: Lesson,
  content: string,
  mode: VimMode,
): boolean {
  try {
    return lesson.validation.check(content, mode);
  } catch {
    return false;
  }
}

/**
 * Returns true when the lesson's configured trigger matches the trigger that
 * just fired. Used by the editor integration to decide whether to run
 * validation now or wait for a different event.
 *
 * Pure and side-effect free.
 */
export function shouldValidate(
  lesson: Lesson,
  trigger: ValidationTrigger,
): boolean {
  return lesson.validation.trigger === trigger;
}
