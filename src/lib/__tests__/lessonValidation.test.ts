/**
 * lessonValidation.test.ts
 *
 * Unit tests for the pure validation utilities in src/lib/lessonValidation.ts.
 *
 * Both functions are pure — no DOM, no localStorage, no CodeMirror.
 * Tests use minimal local fixtures instead of the full lesson data array.
 */

import { describe, it, expect, vi } from 'vitest';
import { validateLesson, shouldValidate } from '../lessonValidation';
import type { Lesson, VimMode } from '../../types/lesson';

// ─── Fixture helpers ──────────────────────────────────────────────────────────

/**
 * Creates a minimal Lesson object with only the fields required by the
 * validation utilities.  All other fields use safe placeholder values.
 */
function createLesson(
  trigger: Lesson['validation']['trigger'],
  check: Lesson['validation']['check'],
): Lesson {
  return {
    id: 'test-lesson',
    chapter: 'Test Chapter',
    chapterIndex: 0,
    lessonIndex: 0,
    title: 'Test Lesson',
    description: [],
    initialContent: '',
    mission: 'Test mission',
    validation: { trigger, check },
  };
}

// ─── validateLesson ───────────────────────────────────────────────────────────

describe('validateLesson', () => {
  it('returns true when the lesson check returns true', () => {
    const lesson = createLesson('on-change', () => true);
    expect(validateLesson(lesson, 'content', 'normal')).toBe(true);
  });

  it('returns false when the lesson check returns false', () => {
    const lesson = createLesson('on-change', () => false);
    expect(validateLesson(lesson, 'content', 'normal')).toBe(false);
  });

  it('passes content to the check function', () => {
    const check = vi.fn(() => true);
    const lesson = createLesson('on-change', check);
    validateLesson(lesson, 'hello world', 'normal');
    expect(check).toHaveBeenCalledWith('hello world', 'normal');
  });

  it('passes mode to the check function', () => {
    const check = vi.fn(() => false);
    const lesson = createLesson('on-mode-change', check);
    validateLesson(lesson, '', 'insert');
    expect(check).toHaveBeenCalledWith('', 'insert');
  });

  it('returns false when the check function throws', () => {
    const lesson = createLesson('on-change', () => {
      throw new Error('unexpected error in check');
    });
    expect(validateLesson(lesson, 'content', 'normal')).toBe(false);
  });

  it('does not mutate the lesson object', () => {
    const lesson = createLesson('on-change', () => true);
    const lessonBefore = JSON.stringify(lesson);
    validateLesson(lesson, 'content', 'normal');
    expect(JSON.stringify(lesson)).toBe(lessonBefore);
  });

  it('works when mode is "normal"', () => {
    const lesson = createLesson('on-mode-change', (_content, mode) => mode === 'normal');
    expect(validateLesson(lesson, '', 'normal')).toBe(true);
    expect(validateLesson(lesson, '', 'insert')).toBe(false);
  });

  it('works when mode is "insert"', () => {
    const lesson = createLesson('on-mode-change', (_content, mode) => mode === 'insert');
    expect(validateLesson(lesson, '', 'insert')).toBe(true);
    expect(validateLesson(lesson, '', 'normal')).toBe(false);
  });

  it('works when mode is "visual"', () => {
    const lesson = createLesson('on-mode-change', (_content, mode) => mode === 'visual');
    expect(validateLesson(lesson, '', 'visual')).toBe(true);
    expect(validateLesson(lesson, '', 'normal')).toBe(false);
  });

  it('check function receives the exact content string passed in', () => {
    const received: string[] = [];
    const lesson = createLesson('on-change', (content) => {
      received.push(content);
      return true;
    });
    validateLesson(lesson, 'exact content string', 'normal');
    expect(received).toEqual(['exact content string']);
  });
});

// ─── shouldValidate ───────────────────────────────────────────────────────────

describe('shouldValidate', () => {
  it('returns true when lesson trigger is "on-change" and trigger matches', () => {
    const lesson = createLesson('on-change', () => false);
    expect(shouldValidate(lesson, 'on-change')).toBe(true);
  });

  it('returns true when lesson trigger is "on-mode-change" and trigger matches', () => {
    const lesson = createLesson('on-mode-change', () => false);
    expect(shouldValidate(lesson, 'on-mode-change')).toBe(true);
  });

  it('returns true when lesson trigger is "manual" and trigger matches', () => {
    const lesson = createLesson('manual', () => false);
    expect(shouldValidate(lesson, 'manual')).toBe(true);
  });

  it('returns false when the trigger does not match the lesson trigger (on-change vs on-mode-change)', () => {
    const lesson = createLesson('on-change', () => false);
    expect(shouldValidate(lesson, 'on-mode-change')).toBe(false);
  });

  it('returns false when the trigger does not match the lesson trigger (on-mode-change vs on-change)', () => {
    const lesson = createLesson('on-mode-change', () => false);
    expect(shouldValidate(lesson, 'on-change')).toBe(false);
  });

  it('returns false when the trigger does not match the lesson trigger (manual vs on-change)', () => {
    const lesson = createLesson('manual', () => false);
    expect(shouldValidate(lesson, 'on-change')).toBe(false);
  });

  it('does not call the lesson check function', () => {
    const check = vi.fn(() => true);
    const lesson = createLesson('on-change', check);
    shouldValidate(lesson, 'on-change');
    expect(check).not.toHaveBeenCalled();
  });
});

// ─── Combined integration-style check ────────────────────────────────────────

describe('shouldValidate + validateLesson together', () => {
  it('skips validation when trigger does not match and runs it when it does', () => {
    const check = vi.fn((_content: string, mode: VimMode) => mode === 'normal');
    const lesson = createLesson('on-mode-change', check);

    // Wrong trigger — check must not be called.
    const shouldRun = shouldValidate(lesson, 'on-change');
    expect(shouldRun).toBe(false);
    if (shouldRun) validateLesson(lesson, '', 'normal');
    expect(check).not.toHaveBeenCalled();

    // Correct trigger — check should be called.
    const shouldRunNow = shouldValidate(lesson, 'on-mode-change');
    expect(shouldRunNow).toBe(true);
    if (shouldRunNow) validateLesson(lesson, '', 'normal');
    expect(check).toHaveBeenCalledOnce();
  });
});
