# Tasks — Vim Learning Tutor

> **Status labels:** `TODO` | `DOING` | `DONE`
> Each task is independently reviewable. Complete tasks in order unless noted otherwise.

---

## Phase 0: Foundation & Configuration

### T-00: Project Audit & Cleanup
**Status:** `DONE` (completed during spec phase)
- [x] Inspect all existing files
- [x] Document what is kept, refactored, and not touched
- [x] Create `specs/vim-learning-tutor/` directory with all spec files

---

### T-01: Install Required Dependencies
**Status:** `DONE`
**Dependencies:** none
**Reviewable by:** running `npm install` and verifying `package.json`

```bash
npm install @codemirror/view @codemirror/state @codemirror/commands \
  @codemirror/language @codemirror/search @codemirror/theme-one-dark \
  @replit/codemirror-vim
```

New devDependencies:
```bash
npm install -D typescript @typescript-eslint/parser @typescript-eslint/eslint-plugin \
  vitest @vitest/coverage-v8 @testing-library/react @testing-library/jest-dom \
  @testing-library/user-event jsdom
```

**Checklist:**
- [x] All packages install without peer dependency errors
- [x] `package.json` updated with new deps
- [x] `npm run build` still passes

---

### T-02: TypeScript Configuration
**Status:** `DONE`
**Dependencies:** T-01
**Reviewable by:** `tsc --noEmit` passing

**Files to create/modify:**
- [x] Create `tsconfig.json` with `"allowJs": true` for gradual migration
- [x] Create `tsconfig.node.json` for Vite config
- [x] Update `vite.config.js` → `vite.config.ts`
- [x] Update `eslint.config.js` to include TypeScript parser for `.ts`/`.tsx` files

---

### T-03: Update `index.html`
**Status:** `DONE`
**Dependencies:** T-02
**Reviewable by:** visual check in browser

**Changes:**
- [x] Update `<title>` to `VimTutor — Learn Vim in Your Browser`
- [x] Add `<meta name="description">` tag
- [x] Add Google Fonts link: `JetBrains Mono` + `Inter`
- [x] Add `lang="en"` (already present, verified)
- [x] Update favicon reference if needed (already correct, preserved)

---

## Phase 1: Types & Data

### T-04: Create TypeScript Types
**Status:** `DONE`
**Dependencies:** T-02
**Reviewable by:** `tsc --noEmit` with no errors

**File:** `src/types/lesson.ts`
- [x] Define `VimMode` union type
- [x] Define `ValidationTrigger` union type
- [x] Define `ValidationRule` interface
- [x] Define `Lesson` interface
- [x] Define `LessonProgress` interface
- [x] Define `AppProgress` interface

---

### T-05: Create Lesson Data File
**Status:** `DONE`
**Dependencies:** T-04
**Reviewable by:** TypeScript type-check + manual review of content

**File:** `src/data/lessons.ts`

Create all lessons based on curriculum. Minimum 15 lessons:

| ID | Title | Chapter |
|---|---|---|
| `modes-intro` | What is a Mode? | Ch.1: Vim Modes |
| `normal-mode` | Normal Mode | Ch.1: Vim Modes |
| `insert-i` | Insert Before Cursor (`i`) | Ch.2: Insert Mode |
| `insert-a` | Insert After Cursor (`a`) | Ch.2: Insert Mode |
| `insert-o` | Open Line Below (`o`) | Ch.2: Insert Mode |
| `insert-O` | Open Line Above (`O`) | Ch.2: Insert Mode |
| `nav-hjkl` | Moving Around (`h j k l`) | Ch.3: Navigation |
| `nav-words` | Word Navigation (`w b e ge`) | Ch.4: Word Navigation |
| `nav-line` | Line Navigation (`0 ^ $`) | Ch.5: Line Navigation |
| `nav-file` | File Navigation (`gg G`) | Ch.6: File Navigation |
| `edit-x-dd` | Delete Char & Line (`x dd`) | Ch.7: Editing |
| `edit-yank` | Copy & Paste (`yy p P`) | Ch.7: Editing |
| `change-cw` | Change Word (`cw cc`) | Ch.8: Change |
| `undo-redo` | Undo & Redo (`u Ctrl+r`) | Ch.9: Undo |
| `text-objects` | Text Objects (`ci( da(`) | Ch.10: Text Objects |
| `visual-mode` | Visual Mode (`v V Ctrl+v`) | Ch.11: Visual |
| `search` | Search (`/ n N * #`) | Ch.12: Search |

**Checklist:**
- [x] All lessons conform to `Lesson` type
- [x] Each lesson has a working `validation.check` function
- [x] Content is accurate (correct casing: `h j k l`, not `H J K L`)
- [x] `initialContent` strings are appropriate for each mission

---

## Phase 2: Storage & Hooks

### T-06: Create Safe localStorage Wrapper
**Status:** `DONE`
**Dependencies:** T-04
**Reviewable by:** unit test

**File:** `src/lib/storage.ts`
- [x] `loadProgress(): AppProgress | null` — reads and parses from localStorage
- [x] `saveProgress(p: AppProgress): void` — stringifies and writes
- [x] `clearProgress(): void` — removes the key
- [x] All functions wrapped in try/catch
- [x] Version check: if stored `version !== CURRENT_VERSION`, return `null`

---

### T-07: Create Lesson Validation Library
**Status:** `DONE`
**Dependencies:** T-04
**Reviewable by:** unit test

**File:** `src/lib/lessonValidation.ts`
- [x] `validateLesson(lesson: Lesson, content: string, mode: VimMode): boolean`
- [x] Pure function, no side effects
- [x] Handles all three `ValidationTrigger` types gracefully

---

### T-08: Create `useLessonProgress` Hook
**Status:** `DONE`
**Dependencies:** T-06, T-05
**Reviewable by:** unit test + component test

**File:** `src/hooks/useLessonProgress.ts`
- [x] Loads progress from storage on mount
- [x] Exposes `currentLesson: Lesson`
- [x] Exposes `progress: AppProgress`
- [x] Exposes `navigateTo(id: string): void`
- [x] Exposes `markComplete(id: string): void`
- [x] Exposes `useHint(id: string): void`
- [x] Exposes `resetAll(): void`
- [x] Saves to storage on every state change

---

## Phase 3: Editor Integration

### T-09: Create `useVimEditor` Hook
**Status:** `DONE`
**Dependencies:** T-01, T-04
**Reviewable by:** visual test in browser (editor renders and Vim bindings work)

**File:** `src/hooks/useVimEditor.ts`
- [x] Creates CodeMirror `EditorView` on mount using a `useRef` for the DOM element
- [x] Attaches `vim()` extension from `@replit/codemirror-vim`
- [x] Applies dark theme (`@codemirror/theme-one-dark`)
- [x] Attaches line numbers, search, and base keymaps
- [x] Subscribes to Vim mode change events and lifts mode to React state
- [x] Exposes `editorContainerRef` for DOM mounting
- [x] Exposes `currentMode: VimMode`
- [x] Exposes `resetContent(content: string): void`
- [x] Exposes `getContent(): string`
- [x] Cleans up `EditorView` on unmount

---

### T-10: Create `VimEditor` Component
**Status:** `DONE`
**Dependencies:** T-09
**Reviewable by:** visual test — editor renders, Vim modes work, reset works

**File:** `src/components/editor/VimEditor.tsx`
- [x] Mounts the CodeMirror container div
- [x] Passes `initialContent` as prop; resets editor on prop change
- [x] Calls `onModeChange` callback when mode changes
- [x] Calls `onContentChange` callback (debounced, 300ms) when content changes
- [x] Does NOT contain any validation or business logic

---

### T-11: Create `ModeIndicator` Component
**Status:** `DONE`
**Dependencies:** T-09
**Reviewable by:** visual test — badge color/text changes with mode

**File:** `src/components/editor/ModeIndicator.tsx`
- [x] Accepts `mode: VimMode` prop
- [x] Renders colored badge: green=Normal, blue=Insert, purple=Visual, orange=Command
- [x] Uses `aria-live="polite"` for accessibility
- [x] Text label is always visible (not icon-only)

---

## Phase 4: UI Components

### T-12: Create Base UI Components
**Status:** `DONE`
**Dependencies:** T-02
**Reviewable by:** visual inspection + accessibility check

**Files:**
- [x] `src/components/ui/Button.tsx` — variant: `primary | secondary | ghost | danger`, size: `sm | md`
- [x] `src/components/ui/Badge.tsx` — color variants matching mode colors
- [x] `src/components/ui/Kbd.tsx` — keyboard key display (`<kbd>` styled element)
- [x] `src/components/ui/Tooltip.tsx` — simple tooltip on hover/focus

---

### T-13: Create `LessonPanel` Component
**Status:** `DONE`
**Dependencies:** T-12, T-08
**Reviewable by:** visual test — content renders, hint reveals on click, buttons work

**File:** `src/components/lessons/LessonPanel.tsx`
- [x] Renders chapter badge, lesson title
- [x] Renders description paragraphs
- [x] Renders mission box (sticky/prominent)
- [x] Renders hint toggle button; hint text hidden until clicked
- [x] Renders Prev / Next navigation buttons (disabled when at boundaries)
- [x] Renders Reset button
- [x] Shows completion checkmark when lesson is complete

---

### T-14: Create `LessonList` + `LessonCard` Components
**Status:** `DONE`
**Dependencies:** T-12, T-08
**Reviewable by:** visual test — list renders grouped lessons, active lesson is highlighted

**Files:**
- [x] `src/components/lessons/LessonCard.tsx` — button per lesson with active/completed/hint-used states
- [x] `src/components/lessons/LessonList.tsx` — scrollable nav grouped by chapter, entirely prop-driven

---

### T-15: Create `ProgressBar` Component
**Status:** `DONE`
**Dependencies:** T-08
**Reviewable by:** visual test — bar fills proportionally, percentage text correct

**File:** `src/components/progress/ProgressBar.tsx`
- [x] Accepts `completed` and `total` props
- [x] Renders horizontal fill bar with smooth transition
- [x] Renders `{completed}/{total} lessons` and `{percentage}%` text labels
- [x] Uses `role="progressbar"` with `aria-valuenow/min/max`
- [x] Clamps percentage safely when `total <= 0`

---

### T-16: Create `StatusBar` Component
**Status:** `DONE`
**Dependencies:** T-11
**Reviewable by:** visual test — shows mode + lesson info

**File:** `src/components/layout/StatusBar.tsx`
- [x] Renders `ModeIndicator` + Vim mode label text on the left
- [x] Renders `Lesson {n}/{total}`, lesson title, and optional cursor position on the right
- [x] Uses semantic `<footer>` with `aria-label` and `aria-live="polite"`
- [x] `cursorPosition` is optional — no fake data shown when absent
- [x] All six `VimMode` values handled in `formatModeLabel`

---

### T-17: Create `AppShell` Layout Component
**Status:** `DONE`
**Dependencies:** T-13, T-14, T-15, T-16
**Reviewable by:** full visual integration test

**File:** `src/components/layout/AppShell.tsx`
- [x] Renders header with logo + `ProgressBar`
- [x] Renders sidebar (`LessonList`) — stacks on mobile, fixed-width on desktop
- [x] Renders main content area: `LessonPanel` + `VimEditor`
- [x] Renders `StatusBar` at the bottom
- [x] Handles responsive layout via Tailwind breakpoints
- [x] Editor keyed on `currentLesson.id + editorResetKey` for forced remount

---

### T-18: Create `CompletionScreen` Component
**Status:** `DONE`
**Dependencies:** T-12
**Reviewable by:** visual test — appears after last lesson, has reset option

**File:** `src/components/lessons/CompletionScreen.tsx`
- [x] Renders congratulatory heading and description
- [x] Shows `{completedCount}/{totalLessons}` and `{percentage}%` stats
- [x] Renders `Badge variant="success"` completion badge
- [x] Renders `Button` "Start Over" calling `onStartOver`
- [x] Safe percentage calculation with `total <= 0` guard and `[0, 100]` clamp

---

## Phase 5: Assembly

### T-19: Update `App.tsx`
**Status:** `DONE`
**Dependencies:** T-08, T-17, T-18
**Reviewable by:** full app works end-to-end in browser

**File:** `src/app/App.tsx` (migrated from `src/App.jsx`)
- [x] Uses `useLessonProgress` to manage current lesson and progress
- [x] Passes all required props to `AppShell`
- [x] Handles validation via `onEditorContentChange` / `onEditorModeChange` → `runValidation`
- [x] Calls `markComplete` when validation passes (guarded against double-call)
- [x] Shows `CompletionScreen` when all lessons are done (`isCourseComplete`)
- [x] Deleted old `src/App.jsx` after migration confirmed successful

---

### T-20: Update Global Styles
**Status:** `DONE`
**Dependencies:** T-02
**Reviewable by:** visual check — dark terminal theme applied

**File:** `src/styles/globals.css` (replaces `src/index.css`)
- [x] Imports Google Fonts (Inter + JetBrains Mono) before Tailwind v4 `@import "tailwindcss"`
- [x] Defines CSS custom properties for the full dark terminal color palette
- [x] Sets base font to Inter on `:root` and `body`
- [x] Sets JetBrains Mono for `code`, `kbd`, `pre`, `.cm-editor`, `.cm-scroller`, `.cm-content`, `.font-mono`
- [x] Removes all old Vite boilerplate — no `.logo`, `.card`, no light-theme variables
- [x] Updates `src/main.jsx` import from `./index.css` → `./styles/globals.css`
- [x] Deleted `src/index.css` and `src/App.css` (no remaining references)

---

## Phase 6: Testing

### T-21: Configure Vitest
**Status:** `TODO`
**Dependencies:** T-01, T-02
**Reviewable by:** `npm test` runs without error (even with no test files)

**Changes:**
- [ ] Add `test` script to `package.json`: `"test": "vitest"`
- [ ] Add `coverage` script: `"coverage": "vitest run --coverage"`
- [ ] Configure `vite.config.ts` with `test: { environment: 'jsdom', setupFiles: [...] }`
- [ ] Create `src/test/setup.ts` with `@testing-library/jest-dom` import

---

### T-22: Write Unit Tests — `storage.ts`
**Status:** `TODO`
**Dependencies:** T-06, T-21

**File:** `src/lib/__tests__/storage.test.ts`
- [ ] `loadProgress` returns `null` when nothing stored
- [ ] `saveProgress` then `loadProgress` returns same data
- [ ] `clearProgress` makes `loadProgress` return `null`
- [ ] `loadProgress` returns `null` when stored version mismatches
- [ ] `loadProgress` handles JSON parse errors gracefully

---

### T-23: Write Unit Tests — `lessonValidation.ts`
**Status:** `TODO`
**Dependencies:** T-07, T-21

**File:** `src/lib/__tests__/lessonValidation.test.ts`
- [ ] Returns `true` when content matches expected state
- [ ] Returns `false` when content does not match
- [ ] Works for each validation trigger type

---

### T-24: Write Component Tests — `LessonPanel`
**Status:** `TODO`
**Dependencies:** T-13, T-21

**File:** `src/components/lessons/__tests__/LessonPanel.test.tsx`
- [ ] Renders lesson title and description
- [ ] Mission text is visible
- [ ] Hint is hidden initially; visible after clicking hint button
- [ ] Next button is disabled on last lesson
- [ ] Prev button is disabled on first lesson
- [ ] Reset button calls `onReset` callback

---

### T-25: Write Component Tests — `useLessonProgress`
**Status:** `TODO`
**Dependencies:** T-08, T-21

**File:** `src/hooks/__tests__/useLessonProgress.test.ts`
- [ ] Starts at first lesson with empty progress
- [ ] `markComplete` updates progress and persists to storage
- [ ] `navigateTo` changes current lesson
- [ ] `resetAll` clears progress and returns to lesson 1

---

## Phase 7: Deployment & Quality Gate

### T-26: Final Lint & Build Verification
**Status:** `TODO`
**Dependencies:** All prior tasks

**Checklist:**
- [ ] `npm run lint` passes with zero errors
- [ ] `npm run build` succeeds
- [ ] `dist/` output is correct (check `index.html` asset paths have `/vim-learning/` prefix)

---

### T-27: Deploy to GitHub Pages
**Status:** `TODO`
**Dependencies:** T-26

**Checklist:**
- [ ] `npm run deploy` pushes to `gh-pages` branch successfully
- [ ] App is accessible at `https://<username>.github.io/vim-learning/`
- [ ] No 404 errors on asset loading
- [ ] All lessons load and validate in the deployed environment

---

## Phase 8: Stretch Goals (Post v1)

> These are not required for v1. Do not start until v1 is shipped.

### T-28: Playwright End-to-End Tests
**Status:** `TODO`
- [ ] Install Playwright
- [ ] Write E2E test: complete Lesson 1 using real keyboard input
- [ ] Write E2E test: progress persists after page reload
- [ ] Write E2E test: all lessons are accessible via sidebar

---

### T-29: URL-Based Deep Linking
**Status:** `TODO`
- [ ] Add URL hash routing (`#lesson-id`) for direct lesson links
- [ ] Update `vite.config.ts` if needed

---

### T-30: Command History / Ex Commands
**Status:** `TODO`
- [ ] Display last Vim ex command in status bar
- [ ] Teach `:w` as a "save" metaphor for lesson completion

---

### T-31: Mobile Responsive Layout
**Status:** `TODO`
- [ ] Single-column layout for viewports < 768px
- [ ] Swipe to navigate between lesson panel and editor

---

### T-32: Keyboard Sound Effects (Optional)
**Status:** `TODO`
- [ ] Subtle typewriter click sounds on keypress (with mute toggle)
