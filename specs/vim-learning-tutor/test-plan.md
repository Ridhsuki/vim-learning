# Test Plan — Vim Learning Tutor

> This document covers all layers of testing: unit, component, interaction, keyboard behavior, Playwright E2E, and manual QA.

---

## 1. Unit Test Plan

**Tool:** Vitest  
**Environment:** `jsdom` (via `vite.config.ts` test config)  
**Coverage target:** ≥ 80% for `src/lib/` and `src/hooks/`

### 1.1 `src/lib/storage.ts`

| Test ID | Description | Expected |
|---|---|---|
| STG-01 | `loadProgress()` when localStorage is empty | Returns `null` |
| STG-02 | `saveProgress(p)` then `loadProgress()` | Returns same object (deep equal) |
| STG-03 | `clearProgress()` then `loadProgress()` | Returns `null` |
| STG-04 | `loadProgress()` when stored JSON is malformed | Returns `null` (no throw) |
| STG-05 | `loadProgress()` when stored version is outdated | Returns `null` |
| STG-06 | `saveProgress()` when localStorage throws (quota exceeded) | Does not throw; fails silently |

### 1.2 `src/lib/lessonValidation.ts`

| Test ID | Description | Expected |
|---|---|---|
| VAL-01 | `validateLesson` with correct content and correct mode | Returns `true` |
| VAL-02 | `validateLesson` with incorrect content | Returns `false` |
| VAL-03 | `validateLesson` with correct content but wrong mode | Returns `false` (if mode matters) |
| VAL-04 | Validation for `on-change` trigger with empty content | Returns `false` |
| VAL-05 | Validation function is pure (same input → same output) | Consistent results |

### 1.3 `src/hooks/useLessonProgress.ts`

| Test ID | Description | Expected |
|---|---|---|
| PGS-01 | Initial state: first lesson with no stored progress | `currentLesson.id === lessons[0].id` |
| PGS-02 | `markComplete(id)` marks lesson as done | `progress.lessons[id].completed === true` |
| PGS-03 | `markComplete` saves to localStorage | `loadProgress()` reflects the change |
| PGS-04 | `navigateTo(id)` changes `currentLesson` | `currentLesson.id === id` |
| PGS-05 | `useHint(id)` marks `hintUsed: true` | `progress.lessons[id].hintUsed === true` |
| PGS-06 | `resetAll()` clears progress and resets to lesson 1 | `progress.lessons` is empty, `currentLesson` is first |
| PGS-07 | Existing stored progress is restored on mount | `currentLesson` matches last stored `currentLessonId` |
| PGS-08 | Navigating to unknown lesson id falls back to first lesson | `currentLesson.id === lessons[0].id` |

---

## 2. Component Test Plan

**Tool:** Vitest + React Testing Library (`@testing-library/react`)  
**Setup file:** `src/test/setup.ts` (imports `@testing-library/jest-dom`)

### 2.1 `Button.tsx`

| Test ID | Description | Expected |
|---|---|---|
| BTN-01 | Renders children | Text content visible |
| BTN-02 | `disabled` prop prevents click | `onClick` not called |
| BTN-03 | Focus ring is present (accessibility) | Element has focus styles |
| BTN-04 | All variants render without errors | No console errors |

### 2.2 `ModeIndicator.tsx`

| Test ID | Description | Expected |
|---|---|---|
| MOD-01 | Renders "NORMAL" in green for `normal` mode | Text "NORMAL" visible |
| MOD-02 | Renders "INSERT" in blue for `insert` mode | Text "INSERT" visible |
| MOD-03 | Renders "VISUAL" in purple for `visual` mode | Text "VISUAL" visible |
| MOD-04 | Has `aria-live="polite"` attribute | Accessible to screen readers |

### 2.3 `LessonPanel.tsx`

| Test ID | Description | Expected |
|---|---|---|
| PNL-01 | Renders lesson title | Title text visible |
| PNL-02 | Renders all description paragraphs | All `description[]` items visible |
| PNL-03 | Mission text is visible | Mission string rendered |
| PNL-04 | Hint is hidden initially | Hint text NOT in the document |
| PNL-05 | Hint shows after clicking hint button | Hint text appears in the document |
| PNL-06 | Clicking hint calls `onHintUsed` callback | Mock called once |
| PNL-07 | Prev button disabled when `isFirst === true` | Button has `disabled` attribute |
| PNL-08 | Next button disabled when `isLast === true` | Button has `disabled` attribute |
| PNL-09 | Clicking Reset calls `onReset` | Mock called once |
| PNL-10 | Completion checkmark shown when `isCompleted === true` | Checkmark icon visible |

### 2.4 `LessonCard.tsx`

| Test ID | Description | Expected |
|---|---|---|
| CRD-01 | Renders lesson title | Title visible |
| CRD-02 | Completed icon shown when `progress.completed === true` | ✓ icon or similar visible |
| CRD-03 | Active state when `isActive === true` | Active class or highlighted style |
| CRD-04 | Click calls `onSelect` | Mock called with lesson id |

### 2.5 `ProgressBar.tsx`

| Test ID | Description | Expected |
|---|---|---|
| PRG-01 | Renders correct percentage text | `"3 / 17"` or `"18%"` visible |
| PRG-02 | `aria-valuenow` is set correctly | Accessible progress value |
| PRG-03 | Bar width matches `completed / total` ratio | Inline width style matches |

### 2.6 `LessonList.tsx`

| Test ID | Description | Expected |
|---|---|---|
| LST-01 | Renders all lessons | Correct number of `LessonCard` elements |
| LST-02 | Groups lessons by chapter | Chapter headings visible |
| LST-03 | Active lesson is highlighted | Current lesson has active style |

---

## 3. Interaction Test Plan

**Tool:** React Testing Library with `@testing-library/user-event`

### 3.1 Lesson Navigation Flow

| Test ID | Description | Steps | Expected |
|---|---|---|---|
| INT-01 | Navigate to next lesson | Click "Next →" | `currentLesson` advances |
| INT-02 | Navigate to prev lesson | Click "← Prev" | `currentLesson` goes back |
| INT-03 | Navigate via sidebar | Click `LessonCard` | `currentLesson` changes to clicked |
| INT-04 | Hint interaction | Click "Show Hint" | Hint text appears; button text changes |
| INT-05 | Reset lesson | Click "Reset" | Editor content resets to `initialContent` |
| INT-06 | Complete lesson triggers feedback | Validate correct content | Success state shown |

### 3.2 Progress Persistence

| Test ID | Description | Steps | Expected |
|---|---|---|---|
| PER-01 | Progress survives re-mount | Mark lesson complete; remount `App` | Lesson still marked complete |
| PER-02 | Reset all works | Click "Reset All Progress" | All progress cleared; back to lesson 1 |

---

## 4. Keyboard Behavior Test Plan

**Tool:** React Testing Library + `userEvent.keyboard()`

> These tests verify that the Vim editor keybindings work correctly inside the browser.
> Note: Full Vim emulation testing is best covered in Playwright E2E tests (see Section 5).

| Test ID | Description | Keys | Expected |
|---|---|---|---|
| KB-01 | `i` enters Insert mode | `userEvent.keyboard('i')` in editor | Mode changes to `insert` |
| KB-02 | `Escape` returns to Normal mode | `userEvent.keyboard('{Escape}')` | Mode changes to `normal` |
| KB-03 | `v` enters Visual mode | `userEvent.keyboard('v')` | Mode changes to `visual` |
| KB-04 | `h` moves cursor left in Normal | `userEvent.keyboard('h')` | Cursor position decreases |
| KB-05 | `l` moves cursor right in Normal | `userEvent.keyboard('l')` | Cursor position increases |
| KB-06 | Tab moves focus through UI elements | `userEvent.tab()` | Focus cycles through buttons |
| KB-07 | Enter activates focused button | `userEvent.keyboard('{Enter}')` | Button callback fires |

---

## 5. Playwright End-to-End Test Plan

> **Phase:** Post-v1 (Stretch Goal — Task T-28)  
> **Tool:** Playwright  
> **Browser targets:** Chromium, Firefox, WebKit

### 5.1 Setup

```bash
npx playwright install
npm run build
npx playwright test
```

Playwright tests run against the built `dist/` served locally via `vite preview`.

### 5.2 E2E Test Cases

| Test ID | Scenario | Steps | Expected |
|---|---|---|---|
| E2E-01 | App loads successfully | Navigate to `/vim-learning/` | Page title is "VimTutor", first lesson visible |
| E2E-02 | Complete Lesson 1 (Modes Intro) | Follow lesson mission using keyboard | Success state shown; lesson marked complete |
| E2E-03 | Progress persists after reload | Complete a lesson; reload page | Progress maintained, correct lesson active |
| E2E-04 | Navigate via sidebar | Click lesson in sidebar | Correct lesson content shown |
| E2E-05 | Hint reveals on click | Click "Show Hint" button | Hint text becomes visible |
| E2E-06 | Reset lesson restores content | Edit editor; click Reset | Editor content matches `initialContent` |
| E2E-07 | All lessons accessible | Click through all lessons | No crashes, all lessons render |
| E2E-08 | Reset all progress | Complete 3 lessons; click "Reset All" | Progress cleared; back to lesson 1 |
| E2E-09 | `i` key enters insert mode | Focus editor; press `i` | Status bar shows `-- INSERT --` |
| E2E-10 | `Esc` returns to normal mode | Enter insert mode; press `Esc` | Status bar shows `-- NORMAL --` |
| E2E-11 | `dd` deletes a line | Normal mode; press `dd` | Current line removed from editor |
| E2E-12 | `/` search highlights | Normal mode; press `/word{Enter}` | Search match highlighted |
| E2E-13 | Completion screen after last lesson | Complete all lessons | Completion screen shown |
| E2E-14 | No console errors during use | Full walkthrough | Browser console has 0 errors |

---

## 6. Manual QA Checklist

> Run before every major release. Go through each item manually in Chrome and Firefox.

### 6.1 First Run Experience

- [ ] App loads without errors in the browser console
- [ ] First lesson is displayed correctly
- [ ] Mode indicator shows "NORMAL"
- [ ] Editor has focus on load
- [ ] Pressing `i` enters Insert mode
- [ ] Pressing `Escape` returns to Normal mode
- [ ] Status bar updates correctly

### 6.2 Lesson Content

- [ ] All lesson titles are correct
- [ ] All lesson descriptions are accurate and readable
- [ ] No lesson uses incorrect Vim command casing (e.g., no `H J K L` for movement)
- [ ] All missions are achievable within 30 seconds by someone who just read the lesson
- [ ] All hints are helpful and accurate

### 6.3 Navigation

- [ ] "Next" button advances to next lesson
- [ ] "Prev" button goes back to previous lesson
- [ ] "Prev" is disabled on the first lesson
- [ ] "Next" is disabled on the last lesson
- [ ] Clicking a lesson in the sidebar loads it
- [ ] Sidebar shows correct completed/active/incomplete states

### 6.4 Progress

- [ ] Completing a lesson marks it as done in the sidebar
- [ ] Progress bar updates when a lesson is completed
- [ ] Refreshing the page preserves progress
- [ ] "Reset All Progress" clears all data and returns to lesson 1

### 6.5 Accessibility

- [ ] All buttons are reachable by Tab key
- [ ] Mode indicator is announced by screen reader (test with VoiceOver or NVDA)
- [ ] Color is NOT the only indicator of status (icons also used)
- [ ] Focus ring is visible on all interactive elements
- [ ] Text contrast meets WCAG AA standards

### 6.6 Responsiveness

- [ ] Layout is correct at 1440px wide
- [ ] Layout is correct at 1024px wide (breakpoint)
- [ ] Sidebar collapses at 768px (tablet breakpoint)
- [ ] No horizontal overflow at any tested width

### 6.7 Editor Behavior

- [ ] CodeMirror renders correctly
- [ ] Line numbers are visible
- [ ] `h j k l` navigate in Normal mode
- [ ] `w b e` navigate by word
- [ ] `0 ^ $` navigate lines
- [ ] `gg G` navigate to top/bottom
- [ ] `i a o O` enter Insert mode correctly
- [ ] `x` deletes a character
- [ ] `dd` deletes a line
- [ ] `yy` then `p` copies and pastes a line
- [ ] `cw` changes a word and enters Insert
- [ ] `u` undoes; `Ctrl+r` redoes
- [ ] `ci(` changes inside parentheses
- [ ] `v V Ctrl+v` enter correct Visual modes
- [ ] `/` search works and highlights matches
- [ ] `n N` navigate between search matches
- [ ] `*` searches for word under cursor

### 6.8 Build & Deploy

- [ ] `npm run lint` passes with zero errors
- [ ] `npm run build` succeeds without warnings
- [ ] `npm test` passes all unit and component tests
- [ ] `npm run deploy` deploys successfully to GitHub Pages
- [ ] Deployed site at `https://<user>.github.io/vim-learning/` loads correctly
- [ ] No 404 errors on asset paths in deployed site
