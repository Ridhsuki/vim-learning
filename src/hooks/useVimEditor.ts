/**
 * useVimEditor.ts
 *
 * A React hook that initialises a CodeMirror 6 editor with real Vim keybindings
 * provided by @replit/codemirror-vim.
 *
 * Responsibilities:
 *   - Create / destroy an EditorView tied to a DOM container ref.
 *   - Attach the vim() extension so all Vim motions, modes and commands work.
 *   - Track the current Vim mode and lift it to React state via onModeChange.
 *   - Notify the consumer whenever editor content changes via onContentChange.
 *   - Expose helpers to reset content, read content, and focus the editor.
 *
 * Out of scope for this hook (intentionally):
 *   - Lesson validation logic
 *   - LocalStorage access
 *   - Any UI rendering
 */

import { useCallback, useEffect, useRef, useState } from 'react';

// ── CodeMirror 6 ────────────────────────────────────────────────────────────
import { EditorView, keymap, lineNumbers, drawSelection } from '@codemirror/view';
import { EditorState } from '@codemirror/state';
import {
  defaultKeymap,
  history,
  historyKeymap,
  indentWithTab,
} from '@codemirror/commands';
import { search, searchKeymap } from '@codemirror/search';
import { oneDark } from '@codemirror/theme-one-dark';

// ── Vim extension ────────────────────────────────────────────────────────────
import { vim, getCM, Vim } from '@replit/codemirror-vim';
import type { CodeMirrorV } from '@replit/codemirror-vim';

// ── Project types ────────────────────────────────────────────────────────────
import type { VimMode } from '../types/lesson';

// ─── Types ────────────────────────────────────────────────────────────────────

interface UseVimEditorOptions {
  initialContent: string;
  onContentChange?: (content: string) => void;
  onModeChange?: (mode: VimMode) => void;
}

/**
 * Payload shape emitted by @replit/codemirror-vim on the 'vim-mode-change'
 * event.  The library's type declarations don't export this type, so we define
 * a narrow local interface based on the documented event shape:
 *
 *   {mode: "visual", subMode: "linewise"}
 *
 * Modes observed in the source:
 *   "normal" | "insert" | "replace" | "visual"
 * with optional subMode:
 *   "linewise" | "blockwise" | ""
 */
interface VimModeChangeEvent {
  mode: string;
  subMode?: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Maps a raw mode string (from the library) + optional subMode to a VimMode
 * union value.  Unmapped modes fall back to 'normal'.
 *
 * Library strings → our VimMode:
 *   "normal"  → "normal"
 *   "insert"  → "insert"
 *   "replace" → "insert"  (Vim replace is a sub-mode of insert for our purposes)
 *   "visual"  → depends on subMode:
 *     ""           → "visual"
 *     "linewise"   → "visual-line"
 *     "blockwise"  → "visual-block"
 */
function toVimMode(rawMode: string, subMode?: string): VimMode {
  switch (rawMode) {
    case 'normal':
      return 'normal';
    case 'insert':
    case 'replace':
      return 'insert';
    case 'visual':
      if (subMode === 'linewise') return 'visual-line';
      if (subMode === 'blockwise') return 'visual-block';
      return 'visual';
    default:
      return 'normal';
  }
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useVimEditor(options: UseVimEditorOptions) {
  const { initialContent, onContentChange, onModeChange } = options;

  // Stable refs for the callbacks so they never cause the effect to re-run.
  const onContentChangeRef = useRef(onContentChange);
  const onModeChangeRef = useRef(onModeChange);
  useEffect(() => {
    onContentChangeRef.current = onContentChange;
  }, [onContentChange]);
  useEffect(() => {
    onModeChangeRef.current = onModeChange;
  }, [onModeChange]);

  // DOM ref that the consumer attaches to a container <div>.
  const editorContainerRef = useRef<HTMLDivElement>(null);

  // Stable ref to the live EditorView instance.
  const viewRef = useRef<EditorView | null>(null);

  // Vim mode lifted to React state so consumers can re-render on change.
  const [currentMode, setCurrentMode] = useState<VimMode>('normal');

  // ── Mount / unmount ────────────────────────────────────────────────────────

  useEffect(() => {
    const container = editorContainerRef.current;
    if (!container) return;

    // Build the initial EditorState with all required extensions.
    const startState = EditorState.create({
      doc: initialContent,
      extensions: [
        // Vim keybindings — must be first so Vim intercepts keys before CM defaults.
        vim(),

        // Dark theme (one-dark from @codemirror/theme-one-dark).
        oneDark,

        // Line numbers in the gutter.
        lineNumbers(),

        // Draw CodeMirror's selection using CSS so it works correctly in all browsers.
        drawSelection(),

        // Undo/redo history.
        history(),

        // In-editor search panel (Ctrl-f / / in Vim normal mode).
        search(),

        // Keymaps: default CM keybindings + history shortcuts + search shortcuts.
        // Vim extension overrides most of these, but they remain available outside
        // Vim key handling (e.g. when the ex-command input is focused).
        keymap.of([
          indentWithTab,
          ...defaultKeymap,
          ...historyKeymap,
          ...searchKeymap,
        ]),

        // Content-change listener: notify consumer on every document update.
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            const content = update.state.doc.toString();
            onContentChangeRef.current?.(content);
          }
        }),
      ],
    });

    const view = new EditorView({
      state: startState,
      parent: container,
    });

    viewRef.current = view;

    // ── Mode tracking via vim-mode-change ──────────────────────────────────
    //
    // @replit/codemirror-vim emits 'vim-mode-change' on the internal CM5
    // adapter instance whenever the Vim mode transitions.  getCM() retrieves
    // that adapter from the EditorView.
    //
    // The CM5 adapter's `on` method accepts a string event name and a callback.
    // The library's type declarations type the second argument as `Function` (via
    // the `on(type: string, f: Function): void` signature).  We use a narrow
    // local cast rather than a broad `any` to keep things auditable.
    //
    // TODO (T-10): if this listener proves insufficient (e.g. mode not reported
    // on certain commands), augment tracking using a ViewPlugin that reads
    // `view.state.field(vimStateField)` if the field becomes publicly exported
    // in a future library release.

    const cm = getCM(view);
    if (cm !== null) {
      const handleModeChange = (event: VimModeChangeEvent) => {
        const mode = toVimMode(event.mode, event.subMode);
        setCurrentMode(mode);
        onModeChangeRef.current?.(mode);
      };
      // The library uses `Function` for the handler type; we pass a typed
      // function and the runtime call will receive the right payload.
      cm.on('vim-mode-change', handleModeChange as unknown as () => void);

      // Cleanup: remove listener before destroying the view.
      return () => {
        cm.off('vim-mode-change', handleModeChange as unknown as () => void);
        view.destroy();
        viewRef.current = null;
      };
    }

    // Fallback cleanup if getCM returned null (should not happen in practice).
    return () => {
      view.destroy();
      viewRef.current = null;
    };
    // initialContent is intentionally excluded from deps — we only initialise
    // the editor once.  Content changes after mount go through resetContent().
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Exposed actions ────────────────────────────────────────────────────────

  /**
   * Replace the entire document content and reset the Vim mode to normal.
   *
   * Mode reset strategy:
   *   - If the editor is in insert mode, call Vim.exitInsertMode(cm).
   *   - If the editor is in visual mode, call Vim.exitVisualMode(cm).
   *   - Then synchronise React state to 'normal' unconditionally.
   *
   * Safe to call while the editor is mounted; no-ops if not yet mounted.
   */
  const resetContent = useCallback((content: string) => {
    const view = viewRef.current;
    if (!view) return;

    view.dispatch({
      changes: {
        from: 0,
        to: view.state.doc.length,
        insert: content,
      },
    });

    // Exit any active non-normal Vim mode via the public Vim API.
    // getCM() returns the internal CM5 adapter; the adapter's state.vim is
    // always present after the vim() extension initialises (CodeMirrorV).
    const cm = getCM(view);
    if (cm !== null) {
      // Narrow cast to CodeMirrorV — safe because getCM() only returns non-null
      // after the vim() extension has called maybeInitVimState_ on the view.
      const cmv = cm as CodeMirrorV;
      const vimState = cmv.state.vim;
      if (vimState.insertMode) {
        Vim.exitInsertMode(cmv, /* keepCursor */ false);
      } else if (vimState.visualMode) {
        Vim.exitVisualMode(cmv, /* moveHead */ false);
      }
    }

    // Always synchronise React mode state to 'normal' after a reset.
    setCurrentMode('normal');
    onModeChangeRef.current?.('normal');
  }, []);

  /**
   * Return the current editor document as a string.
   */
  const getContent = useCallback((): string => {
    const view = viewRef.current;
    if (!view) return '';
    return view.state.doc.toString();
  }, []);

  /**
   * Focus the editor so keyboard input is captured.
   */
  const focusEditor = useCallback(() => {
    viewRef.current?.focus();
  }, []);

  // ── Return ─────────────────────────────────────────────────────────────────

  return {
    editorContainerRef,
    currentMode,
    resetContent,
    getContent,
    focusEditor,
  };
}
