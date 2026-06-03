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
**Status:** `TODO`
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
- [ ] All lessons conform to `Lesson` type
- [ ] Each lesson has a working `validation.check` function
- [ ] Content is accurate (correct casing: `h j k l`, not `H J K L`)
- [ ] `initialContent` strings are appropriate for each mission

---

## Phase 2: Storage & Hooks

### T-06: Create Safe localStorage Wrapper
**Status:** `TODO`
**Dependencies:** T-04
**Reviewable by:** unit test

**File:** `src/lib/storage.ts`
- [ ] `loadProgress(): AppProgress | null` — reads and parses from localStorage
- [ ] `saveProgress(p: AppProgress): void` — stringifies and writes
- [ ] `clearProgress(): void` — removes the key
- [ ] All functions wrapped in try/catch
- [ ] Version check: if stored `version !== CURRENT_VERSION`, return `null`

---

### T-07: Create Lesson Validation Library
**Status:** `TODO`
**Dependencies:** T-04
**Reviewable by:** unit test

**File:** `src/lib/lessonValidation.ts`
- [ ] `validateLesson(lesson: Lesson, content: string, mode: VimMode): boolean`
- [ ] Pure function, no side effects
- [ ] Handles all three `ValidationTrigger` types gracefully

---

### T-08: Create `useLessonProgress` Hook
**Status:** `TODO`
**Dependencies:** T-06, T-05
**Reviewable by:** unit test + component test

**File:** `src/hooks/useLessonProgress.ts`
- [ ] Loads progress from storage on mount
- [ ] Exposes `currentLesson: Lesson`
- [ ] Exposes `progress: AppProgress`
- [ ] Exposes `navigateTo(id: string): void`
- [ ] Exposes `markComplete(id: string): void`
- [ ] Exposes `useHint(id: string): void`
- [ ] Exposes `resetAll(): void`
- [ ] Saves to storage on every state change

---

## Phase 3: Editor Integration

### T-09: Create `useVimEditor` Hook
**Status:** `TODO`
**Dependencies:** T-01, T-04
**Reviewable by:** visual test in browser (editor renders and Vim bindings work)

**File:** `src/hooks/useVimEditor.ts`
- [ ] Creates CodeMirror `EditorView` on mount using a `useRef` for the DOM element
- [ ] Attaches `vim()` extension from `@replit/codemirror-vim`
- [ ] Applies dark theme (`@codemirror/theme-one-dark`)
- [ ] Attaches line numbers, search, and base keymaps
- [ ] Subscribes to Vim mode change events and lifts mode to React state
- [ ] Exposes `editorContainerRef` for DOM mounting
- [ ] Exposes `currentMode: VimMode`
- [ ] Exposes `resetContent(content: string): void`
- [ ] Exposes `getContent(): string`
- [ ] Cleans up `EditorView` on unmount

---

### T-10: Create `VimEditor` Component
**Status:** `TODO`
**Dependencies:** T-09
**Reviewable by:** visual test — editor renders, Vim modes work, reset works

**File:** `src/components/editor/VimEditor.tsx`
- [ ] Mounts the CodeMirror container div
- [ ] Passes `initialContent` as prop; resets editor on prop change
- [ ] Calls `onModeChange` callback when mode changes
- [ ] Calls `onContentChange` callback (debounced, 300ms) when content changes
- [ ] Does NOT contain any validation or business logic

---

### T-11: Create `ModeIndicator` Component
**Status:** `TODO`
**Dependencies:** T-09
**Reviewable by:** visual test — badge color/text changes with mode

**File:** `src/components/editor/ModeIndicator.tsx`
- [ ] Accepts `mode: VimMode` prop
- [ ] Renders colored badge: green=Normal, blue=Insert, purple=Visual, orange=Command
- [ ] Uses `aria-live="polite"` for accessibility
- [ ] Text label is always visible (not icon-only)

---

## Phase 4: UI Components

### T-12: Create Base UI Components
**Status:** `TODO`
**Dependencies:** T-02
**Reviewable by:** visual inspection + accessibility check

**Files:**
- [ ] `src/components/ui/Button.tsx` — variant: `primary | secondary | ghost | danger`, size: `sm | md`
- [ ] `src/components/ui/Badge.tsx` — color variants matching mode colors
- [ ] `src/components/ui/Kbd.tsx` — keyboard key display (`<kbd>` styled element)
- [ ] `src/components/ui/Tooltip.tsx` — simple tooltip on hover/focus

---

### T-13: Create `LessonPanel` Component
**Status:** `TODO`
**Dependencies:** T-12, T-08
**Reviewable by:** visual test — content renders, hint reveals on click, buttons work

**File:** `src/components/lessons/LessonPanel.tsx`
- [ ] Renders chapter badge, lesson title
- [ ] Renders description paragraphs
- [ ] Renders mission box (sticky/prominent)
- [ ] Renders hint toggle button; hint text hidden until clicked
- [ ] Renders Prev / Next navigation buttons (disabled when at boundaries)
- [ ] Renders Reset button
- [ ] Shows completion checkmark when lesson is complete

---

### T-14: Create `LessonList` + `LessonCard` Components
**Status:** `TODO`
**Dependencies:** T-12, T-08
**Reviewable by:** visual test — all lessons listed, completed state shown, click navigates

**Files:**
- [ ] `src/components/lessons/LessonCard.tsx` — single lesson row with title, status icon, chapter label
- [ ] `src/components/lessons/LessonList.tsx` — scrollable list of `LessonCard`s grouped by chapter

---

### T-15: Create `ProgressBar` Component
**Status:** `TODO`
**Dependencies:** T-08
**Reviewable by:** visual test — updates as lessons are completed

**File:** `src/components/progress/ProgressBar.tsx`
- [ ] Accepts `completed: number` and `total: number`
- [ ] Renders a horizontal progress bar with percentage label
- [ ] Smooth CSS transition on value change

---

### T-16: Create `StatusBar` Component
**Status:** `TODO`
**Dependencies:** T-11
**Reviewable by:** visual test — shows mode + lesson info

**File:** `src/components/layout/StatusBar.tsx`
- [ ] Vim-style bottom bar
- [ ] Left side: mode indicator (e.g., `-- INSERT --`)
- [ ] Right side: current lesson filename + cursor position (if available)

---

### T-17: Create `AppShell` Layout Component
**Status:** `TODO`
**Dependencies:** T-13, T-14, T-15, T-16
**Reviewable by:** full visual integration test

**File:** `src/components/layout/AppShell.tsx`
- [ ] Renders header with logo + `ProgressBar`
- [ ] Renders sidebar (`LessonList`) — collapsible on tablet
- [ ] Renders main content area: `LessonPanel` + `VimEditor`
- [ ] Renders `StatusBar` at the bottom
- [ ] Handles responsive layout via Tailwind breakpoints

---

### T-18: Create `CompletionScreen` Component
**Status:** `TODO`
**Dependencies:** T-12
**Reviewable by:** visual test — appears after last lesson, has reset option

**File:** `src/components/lessons/CompletionScreen.tsx`
- [ ] Shown when all lessons are completed
- [ ] Congratulatory message + summary stats
- [ ] "Start Over" button that calls `resetAll()`

---

## Phase 5: Assembly

### T-19: Update `App.tsx`
**Status:** `TODO`
**Dependencies:** T-08, T-17, T-18
**Reviewable by:** full app works end-to-end in browser

**File:** `src/app/App.tsx` (migrate from `src/App.jsx`)
- [ ] Use `useLessonProgress` to manage current lesson and progress
- [ ] Pass all required props to `AppShell`
- [ ] Handle validation: subscribe to `onContentChange` / `onModeChange` and call `validateLesson`
- [ ] Call `markComplete` when validation passes
- [ ] Show `CompletionScreen` when all lessons are done
- [ ] Delete old `src/App.jsx` after migration

---

### T-20: Update Global Styles
**Status:** `TODO`
**Dependencies:** T-02
**Reviewable by:** visual check — dark terminal theme applied

**File:** `src/styles/globals.css` (replaces `src/index.css`)
- [ ] Import Tailwind v4 (`@import "tailwindcss"`)
- [ ] Define CSS custom properties for the dark terminal color palette
- [ ] Set base font to `Inter`
- [ ] Set `font-family: 'JetBrains Mono'` for `code`, `kbd`, `.editor` elements
- [ ] Remove old boilerplate variables from the original `index.css`
- [ ] Update `src/main.jsx` (or `.tsx`) import to point to new file

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
