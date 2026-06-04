/**
 * VimEditor.tsx
 *
 * A thin React component that mounts a real CodeMirror 6 Vim editor.
 *
 * Responsibilities:
 *   - Delegate all CodeMirror / Vim state to the useVimEditor hook.
 *   - Debounce onContentChange by 300 ms so callers are not flooded on every keystroke.
 *   - Reset editor content (once, without loop) when the initialContent prop changes.
 *   - Provide accessible ARIA attributes for screen-reader compatibility.
 *   - Focus the editor automatically after mount.
 *
 * Intentionally NOT responsible for:
 *   - Lesson validation logic
 *   - localStorage / progress tracking
 *   - Direct CodeMirror API calls (delegated entirely to useVimEditor)
 */

import { useCallback, useEffect, useRef } from 'react';
import { useVimEditor } from '../../hooks/useVimEditor';
import type { VimMode } from '../../types/lesson';

// ─── Props ────────────────────────────────────────────────────────────────────

export interface VimEditorProps {
  /** Initial text content pre-loaded into the editor buffer. */
  initialContent: string;
  /**
   * Called (debounced 300 ms) whenever the document content changes.
   * Debouncing is applied here so the hook itself stays stateless w.r.t. timing.
   */
  onContentChange?: (content: string) => void;
  /** Called immediately (no debounce) whenever the Vim mode transitions. */
  onModeChange?: (mode: VimMode) => void;
  /** Called when the user runs the :w ex command. */
  onWriteCommand?: () => void;
  /** Optional extra CSS class names merged onto the container div. */
  className?: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function VimEditor({
  initialContent,
  onContentChange,
  onModeChange,
  onWriteCommand,
  className,
}: VimEditorProps) {
  // ── Debounce plumbing ──────────────────────────────────────────────────────
  //
  // We debounce onContentChange here at the component level (300 ms) so
  // useVimEditor stays agnostic of timing policy.  The timer ref is only ever
  // read/written from inside useCallback / useEffect bodies — never during
  // render — to satisfy the react-hooks/refs lint rule.

  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Stable ref so the debounced wrapper never goes stale when the parent
  // re-renders with a new callback identity.  Only accessed inside callbacks.
  const onContentChangeRef = useRef(onContentChange);
  useEffect(() => {
    onContentChangeRef.current = onContentChange;
  }, [onContentChange]);

  // useCallback ensures a stable function identity across renders.  All ref
  // accesses happen inside the callback body, which is called from an effect
  // (not during render).
  const debouncedOnContentChange = useCallback((content: string) => {
    if (debounceTimerRef.current !== null) {
      clearTimeout(debounceTimerRef.current);
    }
    debounceTimerRef.current = setTimeout(() => {
      onContentChangeRef.current?.(content);
      debounceTimerRef.current = null;
    }, 300);
  }, []);

  // Clear any pending debounce on unmount.
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current !== null) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  // ── Editor hook ────────────────────────────────────────────────────────────

  const { editorContainerRef, resetContent, focusEditor } =
    useVimEditor({
      initialContent,
      onContentChange: debouncedOnContentChange,
      onModeChange,
      onWriteCommand,
    });

  // ── Focus on mount ─────────────────────────────────────────────────────────
  //
  // Run once after mount so the user can start typing immediately without
  // clicking into the editor first.

  useEffect(() => {
    focusEditor();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Reset on initialContent change ────────────────────────────────────────
  //
  // When the parent swaps to a different lesson, initialContent changes and
  // we must replace the editor buffer.  To avoid an infinite loop and to skip
  // the very first render (where the hook already loaded initialContent into
  // the EditorState), we:
  //   1. Track the *previous* value of initialContent in a ref.
  //   2. Skip the reset on the first effect run (isMounted guard).
  //   3. Only call resetContent when the value has actually changed.

  const prevInitialContentRef = useRef<string>(initialContent);
  const isMountedRef = useRef(false);

  useEffect(() => {
    // Skip on first mount — the hook already initialised with this content.
    if (!isMountedRef.current) {
      isMountedRef.current = true;
      return;
    }

    // Only reset when the content actually differs from what was last set.
    if (initialContent !== prevInitialContentRef.current) {
      prevInitialContentRef.current = initialContent;
      resetContent(initialContent);
      focusEditor();
    }
    // resetContent and focusEditor are stable useCallback refs — safe in deps.
  }, [initialContent, resetContent, focusEditor]);

  // ── Render ─────────────────────────────────────────────────────────────────

  const baseClasses =
    'min-h-[420px] overflow-hidden rounded-xl border border-slate-800 bg-slate-950 text-sm shadow-2xl';

  return (
    <div
      ref={editorContainerRef}
      role="application"
      aria-label="Vim practice editor"
      className={className ? `${baseClasses} ${className}` : baseClasses}
    />
  );
}
