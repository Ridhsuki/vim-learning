# Requirements — Vim Learning Tutor

## Product Goal

Transform the existing Vim Learning project into a fully interactive, browser-based Vim learning playground. The site should help complete beginners understand and practice Vim through short structured lessons, a real Vim-keybinding editor, mission prompts, progress tracking, and instant feedback — all without requiring any backend, authentication, or paid services.

---

## Target Users

| Persona | Description |
|---|---|
| Absolute Beginner | Has never opened Vim. Confused by modes. Needs hand-holding. |
| Intermediate Learner | Knows `i`, `Esc`, and a few motions. Wants to learn text objects and search. |
| Self-studying Developer | Works through vimtutor but finds it boring. Wants an engaging browser alternative. |

---

## User Stories

### Core Learning

- **US-01** — As a user, I want to read a short lesson introduction so I understand the concept before practicing.
- **US-02** — As a user, I want to practice Vim commands directly in the browser without leaving the page.
- **US-03** — As a user, I want to see which Vim mode I am currently in (NORMAL, INSERT, VISUAL, COMMAND) at all times.
- **US-04** — As a user, I want a clear mission prompt telling me exactly what to do in each exercise.
- **US-05** — As a user, I want to receive immediate feedback when I successfully complete a mission.
- **US-06** — As a user, I want to reset a lesson if I get stuck without losing all progress.
- **US-07** — As a user, I want to move to the next lesson after completing the current one.
- **US-08** — As a user, I want a hint system to reveal the answer if I'm completely stuck.
- **US-09** — As a user, I want to navigate backwards to a previously completed lesson to review it.

### Progress

- **US-10** — As a user, I want my progress to be saved automatically so I can continue where I left off.
- **US-11** — As a user, I want to see a visual progress indicator showing how many lessons I've completed.
- **US-12** — As a user, I want to reset all progress if I want to start fresh.

### Navigation & Discoverability

- **US-13** — As a user, I want a sidebar or overview panel listing all lessons with their completion status.
- **US-14** — As a user, I want to jump to any lesson directly from the overview, including ones I haven't reached yet.

---

## Functional Requirements

### FR-01: Editor

- The editor must use real Vim keybindings powered by CodeMirror 6 + `@replit/codemirror-vim`.
- The editor must support all major Vim modes: Normal, Insert, Visual, Visual Line, Visual Block, Command-Line.
- The editor must display the current mode in a status bar (Vim-style) at all times.
- The editor must support pre-loaded text per lesson (initial buffer content).
- The editor must be resettable to the initial lesson content.
- The editor must be read-only for the lesson description panel — only the editor buffer is interactive.

### FR-02: Lessons

- Each lesson must have: `id`, `title`, `chapter`, `description`, `initialContent`, `mission`, `hint`, `validation` rule.
- Lessons must be organized into chapters (e.g., Modes, Navigation, Editing).
- At least 15 lessons must be present in the initial release.
- Lessons must be loaded from a static TypeScript data file (no API).

### FR-03: Validation

- Each lesson must define a programmatic validation function that checks if the user has completed the mission.
- Validation triggers must be configurable: on buffer change, on mode change, or on explicit "check" button press.
- Validation must not run on every keystroke to avoid excessive re-renders; debounce or event-based triggers must be used.

### FR-04: Progress

- Progress is stored in `localStorage` under the key `vim-tutor:progress`.
- Progress data must store: which lessons are completed, current lesson index, hints used per lesson.
- Progress must survive page refreshes.
- A "Reset All Progress" action must wipe the localStorage entry.

### FR-05: Navigation

- Users must be able to move to the next/previous lesson via UI buttons.
- Users must be able to jump to any lesson via a sidebar/lesson list.
- After completing all lessons, a completion screen must be shown.

### FR-06: Hints

- Each lesson may optionally have a hint text.
- The hint is hidden by default and revealed on explicit user request.
- Hint usage per lesson is tracked in progress data.

### FR-07: Keyboard Shortcuts (App-Level)

- `]` / `[` or dedicated buttons to navigate lessons (only when not in editor focus).
- The hint button must be keyboard-accessible.

---

## Non-Functional Requirements

### NFR-01: Performance

- First Contentful Paint (FCP) must be < 2s on a 4G connection.
- CodeMirror must initialize within 500ms.
- No layout shift after initial render (CLS < 0.1).
- Bundle size must remain under 500 KB gzipped.

### NFR-02: Compatibility

- Must work in Chrome, Firefox, and Safari (latest 2 versions).
- Must work on desktop and tablet viewports (min-width: 768px).
- Mobile is a stretch goal, not a hard requirement for v1.

### NFR-03: Deployability

- Must deploy to GitHub Pages via `npm run deploy`.
- `vite.config.js` must retain `base: '/vim-learning/'`.
- Must have a working `predeploy` + `deploy` script in `package.json`.
- No server-side rendering or dynamic routes requiring a backend.

### NFR-04: Maintainability

- Components must be small and single-responsibility.
- Business logic (lesson validation, storage) must be separated from UI components.
- TypeScript must be used for new files. Existing `.jsx` files may be migrated incrementally.
- ESLint must pass with no errors on `npm run lint`.

### NFR-05: Reliability

- `localStorage` access must be wrapped in try/catch to handle private browsing mode.
- The app must not crash if `localStorage` is unavailable — it must fall back to in-memory state.

---

## Accessibility Requirements

- **AX-01**: All interactive elements (buttons, links) must have visible focus indicators.
- **AX-02**: The mode indicator must use `aria-live="polite"` so screen readers announce mode changes.
- **AX-03**: Lesson navigation buttons must have descriptive `aria-label` attributes.
- **AX-04**: Color must not be the only means of conveying information (e.g., completed vs. not completed lessons must use icons in addition to color).
- **AX-05**: The application must be keyboard-navigable for all non-editor UI elements.
- **AX-06**: Text contrast ratios must meet WCAG 2.1 AA standards.

---

## Performance Requirements

| Metric | Target |
|---|---|
| First Contentful Paint | < 2s (4G) |
| Time to Interactive | < 3s (4G) |
| Bundle size (gzipped) | < 500 KB |
| CLS (Cumulative Layout Shift) | < 0.1 |
| CodeMirror init | < 500ms |

---

## Security Requirements

- **SEC-01**: No external API calls or data exfiltration.
- **SEC-02**: No use of `dangerouslySetInnerHTML` anywhere in the codebase.
- **SEC-03**: No authentication, user accounts, or PII collected.
- **SEC-04**: All lesson content is static and author-controlled.
- **SEC-05**: `localStorage` keys must be namespaced (`vim-tutor:`) to avoid collisions.

---

## Success Criteria

| Criterion | Measure |
|---|---|
| A new user can complete Lesson 1 without external help | Manual QA pass |
| All 15+ lessons load and validate correctly | Automated test pass |
| Progress persists across page refreshes | Automated test pass |
| `npm run lint` passes with zero errors | CI check |
| `npm run build` succeeds and produces a working `dist/` | CI check |
| Site is accessible at `https://<username>.github.io/vim-learning/` | Deployment check |
| No JavaScript errors in the browser console during normal use | Manual QA pass |
