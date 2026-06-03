# Design — Vim Learning Tutor

## Architecture Overview

The app is a single-page application (SPA) built with React 19 + Vite 8. It has no backend. All lesson content is bundled as static TypeScript data, and progress is persisted in `localStorage`. CodeMirror 6 provides the editor engine with real Vim keybindings via `@replit/codemirror-vim`.

```
Browser
  └── React SPA (GitHub Pages static hosting)
        ├── Static lesson data (bundled TypeScript)
        ├── CodeMirror 6 editor (client-side only)
        └── localStorage (progress persistence)
```

TypeScript is adopted **incrementally** — new files are `.ts`/`.tsx`, existing `.jsx` files are migrated one task at a time to avoid large disruptive diffs.

---

## Component Structure

```
src/
├── app/
│   └── App.tsx                   # Root component, routing-like lesson switching
├── components/
│   ├── layout/
│   │   ├── AppShell.tsx          # Full-page layout: sidebar + main area
│   │   └── StatusBar.tsx         # Bottom Vim-style status bar
│   ├── editor/
│   │   ├── VimEditor.tsx         # CodeMirror 6 + vim keybinding wrapper
│   │   └── ModeIndicator.tsx     # Current mode badge (NORMAL / INSERT / VISUAL)
│   ├── lessons/
│   │   ├── LessonPanel.tsx       # Left panel: title, description, mission, hint
│   │   ├── LessonList.tsx        # Sidebar: scrollable list of all lessons
│   │   ├── LessonCard.tsx        # Single lesson row in the sidebar
│   │   └── CompletionScreen.tsx  # Shown after all lessons are complete
│   ├── progress/
│   │   └── ProgressBar.tsx       # Visual overall progress indicator
│   └── ui/
│       ├── Button.tsx            # Reusable accessible button
│       ├── Badge.tsx             # Mode / status badge
│       ├── Kbd.tsx               # Keyboard shortcut display element
│       └── Tooltip.tsx           # Generic tooltip wrapper
├── data/
│   └── lessons.ts                # All lesson definitions (static, typed)
├── hooks/
│   ├── useLessonProgress.ts      # Read/write progress from localStorage
│   └── useVimEditor.ts           # CodeMirror instance setup + mode tracking
├── lib/
│   ├── storage.ts                # Safe localStorage wrapper with try/catch
│   └── lessonValidation.ts       # Lesson validation logic (pure functions)
├── types/
│   └── lesson.ts                 # TypeScript types: Lesson, Chapter, Progress
└── styles/
    └── globals.css               # Global styles (Tailwind v4 @import)
```

**Component responsibilities (strict rules):**
- Components only render UI and wire up hooks — no business logic.
- Validation logic lives exclusively in `lib/lessonValidation.ts`.
- Storage access lives exclusively in `lib/storage.ts`.
- Hooks compose lib functions and expose clean state to components.

---

## Data Model for Lessons

```typescript
// types/lesson.ts

export type VimMode = 'normal' | 'insert' | 'visual' | 'visual-line' | 'visual-block' | 'command';

export type ValidationTrigger = 'on-change' | 'on-mode-change' | 'manual';

export interface ValidationRule {
  trigger: ValidationTrigger;
  /**
   * Pure function: receives current buffer content and current mode,
   * returns true if mission is complete.
   */
  check: (content: string, mode: VimMode) => boolean;
}

export interface Lesson {
  id: string;                  // Unique slug, e.g. "modes-intro"
  chapter: string;             // Chapter name, e.g. "Chapter 1: Modes"
  chapterIndex: number;        // Used for ordering chapters
  lessonIndex: number;         // Position within chapter
  title: string;               // Short display title
  description: string[];       // Array of paragraphs (rendered as <p> tags)
  initialContent: string;      // Pre-loaded text for the editor buffer
  mission: string;             // The task the user must complete
  hint?: string;               // Optional hint text, hidden by default
  validation: ValidationRule;
}

export interface LessonProgress {
  completed: boolean;
  hintUsed: boolean;
  completedAt?: string;        // ISO timestamp
}

export interface AppProgress {
  currentLessonId: string;
  lessons: Record<string, LessonProgress>;  // keyed by Lesson.id
  version: number;             // For future schema migrations
}
```

---

## Lesson Data Structure (lessons.ts)

Lessons are organized into chapters. Each lesson is a plain object conforming to the `Lesson` type. Initial data is derived from and improves `vim-practice.md`.

**Planned Chapters & Lessons:**

| # | Chapter | Lessons |
|---|---|---|
| 1 | Vim Modes | What is a mode? Normal mode, Insert mode (`i`), back to Normal (`Esc`) |
| 2 | Insert Mode | `i`, `a`, `o`, `O` |
| 3 | Normal Navigation | `h`, `j`, `k`, `l` |
| 4 | Word Navigation | `w`, `b`, `e`, `ge` |
| 5 | Line Navigation | `0`, `^`, `$` |
| 6 | File Navigation | `gg`, `G` |
| 7 | Editing | `x`, `dd`, `yy`, `p`, `P` |
| 8 | Change Commands | `cw`, `cc` |
| 9 | Undo & Redo | `u`, `Ctrl+r` |
| 10 | Text Objects | `ci(`, `da(` |
| 11 | Visual Mode | `v`, `V`, `Ctrl+v` |
| 12 | Search | `/`, `n`, `N`, `*`, `#` |

**Minimum 15 lessons** spread across these chapters for v1.

---

## State Management Strategy

**No global state library.** React's built-in `useState` and `useReducer` are sufficient for this scope.

| State | Location | Type |
|---|---|---|
| Current lesson index | `App.tsx` via `useLessonProgress` | `string` (lesson id) |
| Vim editor mode | `useVimEditor` hook | `VimMode` |
| Editor content | `useVimEditor` hook (CodeMirror state) | internal to CM |
| Lesson completion | `useLessonProgress` hook | `AppProgress` |
| Hint visibility | `LessonPanel.tsx` local state | `boolean` |
| Sidebar open (mobile) | `AppShell.tsx` local state | `boolean` |

**Data flow:**
```
App.tsx
  ├── useLessonProgress() → currentLesson, progress, navigate, markComplete
  └── renders AppShell
        ├── LessonPanel ← receives currentLesson, progress callbacks
        └── VimEditor ← receives initialContent, onContentChange, onModeChange
```

---

## Editor Integration Strategy

**Library:** CodeMirror 6 (`@codemirror/...`) + `@replit/codemirror-vim`

**Why CodeMirror 6:**
- Actively maintained, modular, tree-shaking friendly.
- `@replit/codemirror-vim` provides near-complete Vim emulation (modes, motions, text objects, search).
- First-class React integration via `useEffect` / `useRef`.

**Integration approach:**

```typescript
// hooks/useVimEditor.ts

// 1. Create a CodeMirror EditorView inside a useEffect on mount.
// 2. Attach the vim() extension from @replit/codemirror-vim.
// 3. Listen for Vim mode changes via the Vim event system:
//    Vim.defineAction / Vim.mapCommand + custom listener.
// 4. Expose: editorRef (for DOM mounting), currentMode, resetContent().
// 5. On lesson change: dispatch a transaction to replace the full document.
```

**Mode detection:** The `@replit/codemirror-vim` package emits mode information. We subscribe to mode changes and lift them to React state via a callback, which drives the `ModeIndicator` and `StatusBar` components.

**Reset:** Dispatching a `EditorView.setState` or a full document-replace transaction resets the editor to `initialContent`.

---

## Progress Tracking Strategy

```typescript
// lib/storage.ts

const STORAGE_KEY = 'vim-tutor:progress';

export function loadProgress(): AppProgress | null { /* try/catch */ }
export function saveProgress(progress: AppProgress): void { /* try/catch */ }
export function clearProgress(): void { /* try/catch */ }
```

```typescript
// hooks/useLessonProgress.ts

// Initializes from loadProgress() or creates a fresh AppProgress.
// Exposes:
//   - currentLesson: Lesson
//   - progress: AppProgress
//   - navigateTo(id: string): void
//   - markComplete(id: string): void
//   - useHint(id: string): void
//   - resetAll(): void
```

**Schema version**: `AppProgress.version = 1`. If a stored version is lower, progress is cleared and restarted (safe migration strategy for v1).

---

## Routing Strategy

**No React Router.** The app uses a single page; lessons are switched by updating state. This keeps the bundle small and avoids hash/path routing issues with GitHub Pages.

- The current lesson is identified by `lesson.id` stored in both React state and `localStorage`.
- Deep linking (URL-based navigation to a specific lesson) is a **stretch goal** for v2.

---

## UI/UX Layout

### Desktop (≥ 1024px): Three-column feel

```
┌────────────────────────────────────────────────────────────┐
│  Header: "VimTutor" logo + overall progress bar            │
├──────────────┬───────────────────────┬─────────────────────┤
│  Sidebar     │  Lesson Panel         │  Editor             │
│  (lesson     │  - Chapter badge      │  - CodeMirror 6     │
│   list)      │  - Title              │  - Vim keybindings  │
│              │  - Description        │  - Line numbers     │
│  ✓ Done      │  - Mission box        │                     │
│  ▶ Current   │  - Hint (hidden)      │                     │
│  ○ Locked    │                       │                     │
│              │  [← Prev] [Next →]    │                     │
│              │  [Reset]  [Hint]      │                     │
├──────────────┴───────────────────────┴─────────────────────┤
│  Status Bar: -- NORMAL --         lesson-id.txt  3:10      │
└────────────────────────────────────────────────────────────┘
```

### Tablet (768px – 1023px): Two-column

- Sidebar collapses to a drawer (hamburger button).
- Lesson panel and editor stack vertically.

### Color Theme: Dark Terminal

| Token | Value |
|---|---|
| Background | `#0d1117` (near-black, GitHub dark) |
| Surface | `#161b22` |
| Border | `#30363d` |
| Primary text | `#e6edf3` |
| Muted text | `#8b949e` |
| Accent (green) | `#3fb950` |
| Accent (blue) | `#58a6ff` |
| Warning (yellow)| `#d29922` |
| Error (red) | `#f85149` |
| Mode: Normal | `#3fb950` (green) |
| Mode: Insert | `#58a6ff` (blue) |
| Mode: Visual | `#d2a8ff` (purple) |
| Mode: Command | `#ffa657` (orange) |

**Typography:** `JetBrains Mono` for editor + code elements, `Inter` for UI text (both loaded from Google Fonts via `<link>` in `index.html`).

### Key UX Decisions

1. **Mission box is always visible** — sticky at the bottom of the lesson panel.
2. **Hint is a single click** — no confirmation needed; hint usage is tracked silently.
3. **Success feedback** — a subtle green flash / checkmark overlay on the editor when a mission is validated as complete.
4. **Mode indicator uses color + text label** — never color alone (accessibility).
5. **Lesson navigation is also keyboard-driven** — `Tab` to cycle focus between UI elements.

---

## Error Handling

| Scenario | Handling |
|---|---|
| `localStorage` unavailable | Catch error in `storage.ts`; use in-memory fallback |
| Corrupted progress data | Check `version` field; reset on mismatch |
| Lesson data load failure | TypeScript compilation prevents this (static data) |
| CodeMirror init failure | `try/catch` in `useVimEditor`; show fallback `<textarea>` |
| Unknown lesson id in storage | Fall back to first lesson |

---

## GitHub Pages Deployment Notes

- `vite.config.js` already has `base: '/vim-learning/'` — **preserve this**.
- `package.json` already has `predeploy` and `deploy` scripts — **preserve these**.
- `gh-pages` package is already installed — **do not remove it**.
- The `dist/` directory is gitignored but `gh-pages` pushes it to the `gh-pages` branch automatically.
- **Action required**: Add a `homepage` field to `package.json` pointing to the GitHub Pages URL for documentation purposes.
- All asset paths must be relative (Vite handles this via the `base` config).
- The `public/` directory content is copied as-is — `favicon.svg` will be preserved.
