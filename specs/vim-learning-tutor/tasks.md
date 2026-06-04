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
**Status:** `DONE`
**Dependencies:** T-01, T-02
**Reviewable by:** `npm test` runs without error (even with no test files)

**Changes:**
- [x] Added `test`, `test:run`, and `coverage` scripts to `package.json`
- [x] Switched `vite.config.ts` import to `vitest/config` and added `test: { environment: 'jsdom', setupFiles, globals: true }`
- [x] Created `src/test/setup.ts` importing `@testing-library/jest-dom/vitest`
- [x] Added `"types": ["vitest/globals"]` to `tsconfig.json` (jest-dom types excluded — requires @types/jest)

---

### T-22: Write Unit Tests — `storage.ts`
**Status:** `DONE`
**Dependencies:** T-06, T-21

**File:** `src/lib/__tests__/storage.test.ts` — 13 tests, 13 passing
- [x] `loadProgress` returns `null` when nothing stored
- [x] `saveProgress` then `loadProgress` returns same data
- [x] `clearProgress` makes `loadProgress` return `null`
- [x] `loadProgress` returns `null` when stored version mismatches
- [x] `loadProgress` handles JSON parse errors gracefully
- [x] `loadProgress` returns `null` for all three missing-field shapes
- [x] `loadProgress` returns `null` for stored primitive (non-object)
- [x] All three functions handle localStorage throwing without propagating the error
- [x] Also fixed: added `coverage` to `eslint.config.js` globalIgnores

---

### T-23: Write Unit Tests — `lessonValidation.ts`
**Status:** `DONE`
**Dependencies:** T-07, T-21

**File:** `src/lib/__tests__/lessonValidation.test.ts` — 18 tests, 18 passing
- [x] `validateLesson` returns `true`/`false` based on check result
- [x] `validateLesson` passes `content` and `mode` correctly to the check function
- [x] `validateLesson` returns `false` when check throws (does not propagate)
- [x] `validateLesson` does not mutate the lesson object
- [x] `validateLesson` works with modes: `normal`, `insert`, `visual`
- [x] `shouldValidate` returns `true` for each trigger type: `on-change`, `on-mode-change`, `manual`
- [x] `shouldValidate` returns `false` when trigger does not match lesson trigger
- [x] `shouldValidate` does not call the check function
- [x] Combined integration test verifies the guard → validate flow

---

### T-24: Write Component Tests — `LessonPanel`
**Status:** `DONE`
**Dependencies:** T-13, T-21

**File:** `src/components/lessons/__tests__/LessonPanel.test.tsx` — 21 tests, 21 passing
- [x] Renders lesson title and all description paragraphs
- [x] Renders mission text and chapter badge
- [x] Hint is hidden initially when `hintUsed` is false
- [x] Hint text appears after clicking the hint button
- [x] `onUseHint(lesson.id)` called when hint button clicked
- [x] Hint shown immediately and button hidden when `hintUsed` is true
- [x] No hint button or text when lesson has no hint
- [x] Previous button disabled when `isFirstLesson` is true, enabled otherwise
- [x] Next button disabled when `isLastLesson` is true, enabled otherwise
- [x] `onPrevious` called on click, not called when disabled
- [x] `onNext` called on click, not called when disabled
- [x] Reset button calls `onReset` callback
- [x] Completion badge shown when `isCompleted` is true, hidden otherwise

---

### T-25: Write Component Tests — `useLessonProgress`
**Status:** `DONE`
**Dependencies:** T-08, T-21

**File:** `src/hooks/__tests__/useLessonProgress.test.ts` — 31 tests, 31 passing
- [x] Starts at first lesson with empty progress; correct initial counts and flags
- [x] `navigateTo(id)` changes lesson for valid id; ignores unknown ids
- [x] `navigateNext()` / `navigatePrevious()` move through lessons; clamp at boundaries
- [x] `isFirstLesson` / `isLastLesson` update correctly after navigation
- [x] `markComplete(id)` sets `completed: true`, increments `completedCount`
- [x] `markComplete(id)` persists to localStorage (verified via `loadProgress()`)
- [x] `markComplete(id)` preserves existing `completedAt` on re-completion
- [x] `useHint(id)` sets `hintUsed: true`; persists; preserves completed state
- [x] `resetAll()` clears completedCount, resets to first lesson, clears localStorage
- [x] Restores current lesson and completedCount from localStorage on mount
- [x] Falls back to first lesson when stored `currentLessonId` does not exist in lessons

---

## Phase 7: Deployment & Quality Gate

### T-26: Final Lint & Build Verification
**Status:** `DONE`
**Dependencies:** All prior tasks

**Checklist:**
- [x] `npm run lint` passes with zero errors and zero warnings
- [x] `npm run typecheck` passes with zero errors
- [x] `npm run test:run` passes — 83 tests in 4 files, all passing
- [x] `npm run build` succeeds — 47 modules, 660 kB JS / 24.74 kB CSS
- [x] `dist/index.html` exists with correct `/vim-learning/` asset prefix on both JS and CSS
- [x] No `src/` references in `dist/index.html`
- [x] `node_modules/`, `dist/`, and `coverage/` are all gitignored (not tracked)

---

### T-27: Deploy to GitHub Pages
**Status:** `DONE`
**Dependencies:** T-26

**Checklist:**
- [x] Run `npm run deploy` to push to `gh-pages` branch
- [x] Verify GitHub Pages URL resolves correctly (`/vim-learning/`)
- [x] Application loads without 404s
- [x] Core lesson content and editor visible and functional the deployed environment

---

### HOTFIX v1.0.1: Audit and Fix Lesson Completion Validation
**Status:** `DONE`
**Dependencies:** T-27

**Checklist:**
- [x] Audit all lessons and create `specs/vim-learning-tutor/validation-audit.md`
- [x] Identify lessons at high risk of false-negative validation (`normal-mode`, `nav-hjkl`, `nav-words`, `nav-line`, `nav-file`, `search`)
- [x] Update these 6 lessons to use the `manual` trigger
- [x] Add `onCheckMission` manual validation handler to `App.tsx`
- [x] Conditionally render "Check mission" button in `LessonPanel.tsx`
- [x] Ensure all 83 tests pass and build succeeds

---

### POST v1.0.2: Add Reset All Progress Button
**Status:** `DONE`
**Dependencies:** T-27

**Checklist:**
- [x] Add `handleResetAllProgress` handler to `App.tsx` calling `resetAll()`
- [x] Pass `onResetAllProgress` down to `AppShell.tsx`
- [x] Render `Button` (variant `danger`, size `sm`) in header next to `ProgressBar`
- [x] Require user confirmation via `window.confirm` before resetting
- [x] Add component tests for button and confirm step
- [x] Ensure all 90 tests pass and build succeeds

---

### POST v1.0.3: Improve Responsive Layout and Scrollbar Polish
**Status:** `DONE`
**Dependencies:** T-27

**Checklist:**
- [x] Add custom scrollbar styling to `globals.css`
- [x] Allow header content to wrap gracefully on small screens (`flex-wrap`)
- [x] Ensure AppShell `main` and container body correctly stack `flex-col` on mobile, but switch to `lg:flex-row` on larger screens
- [x] Set sensible max-height on `LessonPanel` on mobile (`max-h-[40vh]`) so it doesn't push the VimEditor out of view
- [x] Maintain independent scroll boundaries (`overflow-y-auto`, `overflow-hidden`) for all panels
- [x] Ensure all 90 tests pass and build succeeds

---

### POST v1.0.4: Replace Native Reset Confirmation with Custom Modal
**Status:** `DONE`
**Dependencies:** POST v1.0.3

**Checklist:**
- [x] Create reusable `src/components/ui/ConfirmDialog.tsx`
- [x] Integrate custom modal into `AppShell.tsx`
- [x] Remove native `window.confirm` calls
- [x] Support canceling and Escape key to close the dialog
- [x] Support confirm action to reset all progress
- [x] Keep layout clean, strictly tailwind CSS
- [x] Update `AppShell.test.tsx` to reflect new modal interactions
- [x] Run lint, typecheck, test:run, and build successfully

---

### POST v1.0.5: Refine Desktop Column Balance and Fix LessonPanel Horizontal Overflow
**Status:** `DONE`
**Dependencies:** POST v1.0.4

**Checklist:**
- [x] Change `AppShell.tsx` main content layout to use a CSS Grid on desktop (`lg:grid lg:grid-cols-[minmax(22rem,1fr)_minmax(0,50vw)]`)
- [x] Remove fixed width constraint from `LessonPanel` component call
- [x] Add safe horizontal overflow control classes to `LessonPanel` (`min-w-0 max-w-full overflow-x-hidden`)
- [x] Force text wrapping on title, description, mission, and hint elements (`break-words whitespace-normal`)
- [x] Maintain independent vertical scrolling
- [x] Verify no regressions in mobile stacking layout
- [x] Run lint, typecheck, test:run, and build successfully

---

## Phase 8: Stretch Goals (Post v1)

> These are not required for v1. Do not start until v1 is shipped.

### T-28: Playwright End-to-End Tests
**Status:** `DONE`
- [x] Install Playwright
- [x] Write E2E test: complete Lesson 1 using real keyboard input
- [x] Write E2E test: progress persists after page reload
- [x] Write E2E test: all lessons are accessible via sidebar

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
