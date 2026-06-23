# Vim Learning 🖮

> **Learn Vim in your browser** — guided lessons, real Vim keybindings, and local progress tracking.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-GitHub%20Pages-blue?style=flat-square)](https://ridhsuki.github.io/vim-learning/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](./LICENSE)

## 🚀 Live Demo

**[ridhsuki.github.io/vim-learning](https://ridhsuki.github.io/vim-learning/)**

---

## 📸 Screenshots

> _Screenshots coming soon._

---

## ✨ Key Features

- **Real Vim keybindings** — powered by CodeMirror + `@replit/codemirror-vim`
- **Guided lessons** — structured lessons covering modes, navigation, editing, and more
- **Practice missions** — hands-on tasks with hints and completion tracking
- **Manual completion** — "I completed this mission" button for open-ended exercises
- **Progress persistence** — progress saved to `localStorage`, survives page reload
- **URL-based deep linking** — share or bookmark lessons via `/#lesson-id` hash routes
- **Ex-command feedback** — `:w` acts as a "save" metaphor with status bar feedback
- **Mobile-first UX** — responsive view switcher (Lessons / Lesson / Editor) on small screens
- **PWA-ready** — installable, service worker caching, offline support after first visit
- **Reset controls** — per-lesson reset and global "Reset all progress" with confirmation dialog

---

## 🛠 Tech Stack

| Layer       | Technology                               |
|-------------|------------------------------------------|
| Framework   | React 18 + Vite                          |
| Language    | TypeScript                               |
| Styling     | Tailwind CSS (JIT)                       |
| Editor      | CodeMirror 6 + `@replit/codemirror-vim`  |
| State       | React hooks + `localStorage`             |
| Routing     | URL hash routing (no external library)   |
| Testing     | Vitest + Playwright                      |
| Deployment  | GitHub Pages via `gh-pages`              |

---

## 📦 Local Installation

```bash
# 1. Clone the repository
git clone https://github.com/Ridhsuki/vim-learning.git
cd vim-learning

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## 📜 Available Scripts

| Command               | Description                                          |
|-----------------------|------------------------------------------------------|
| `npm run dev`         | Start local dev server with hot reload               |
| `npm run build`       | Build production bundle to `dist/`                   |
| `npm run preview`     | Preview production build locally                     |
| `npm run lint`        | Run ESLint                                           |
| `npm run typecheck`   | Run TypeScript type checker                          |
| `npm run test`        | Run unit tests in watch mode                         |
| `npm run test:run`    | Run unit tests once (CI mode)                        |
| `npm run e2e`         | Run Playwright end-to-end tests                      |
| `npm run deploy`      | Build and deploy to GitHub Pages                     |

---

## 🧪 Testing

```bash
# Unit tests (Vitest)
npm run test:run

# End-to-end tests (Playwright)
npm run e2e

# Type checking
npm run typecheck

# Linting
npm run lint
```

---

## 🚀 Deployment

The app is deployed to GitHub Pages using the `gh-pages` package.

```bash
npm run deploy
```

> The deploy script runs `vite build` first (`predeploy`), then pushes `dist/` to the `gh-pages` branch.
>
> Ensure `vite.config.ts` has `base: '/vim-learning/'` set correctly for GitHub Pages.

---

## 📁 Project Structure

```
vim-learning/
├── e2e/                    # Playwright E2E tests
├── public/                 # Static assets (favicons, icons, sw.js, manifest)
├── specs/                  # Project specs and task tracking
│   └── vim-learning-tutor/
│       ├── tasks.md        # Sprint task tracker
│       └── validation-audit.md
├── src/
│   ├── app/                # App root (App.tsx)
│   ├── components/
│   │   ├── editor/         # VimEditor component
│   │   ├── layout/         # AppShell, StatusBar
│   │   ├── lessons/        # LessonPanel, LessonList, LessonCard, CompletionScreen
│   │   ├── progress/       # ProgressBar
│   │   └── ui/             # Button, Tooltip, ConfirmDialog
│   ├── data/               # Lesson data (lessons.ts)
│   ├── hooks/              # useLessonProgress, useVimEditor
│   ├── lib/                # lessonValidation
│   ├── styles/             # globals.css
│   └── types/              # lesson.ts
├── index.html
├── vite.config.ts
├── playwright.config.ts
└── package.json
```

---

## 🗺 Roadmap

See [`specs/vim-learning-tutor/tasks.md`](./specs/vim-learning-tutor/tasks.md) for the full sprint history.

**Completed milestones:**
- [x] v1.0.0 — Initial release with 20+ guided Vim lessons
- [x] v1.0.1 — Manual lesson completion validation hotfix
- [x] v1.0.2 — Reset all progress button
- [x] v1.0.3 — Responsive layout and scrollbar polish
- [x] v1.0.4 — Custom confirmation modal
- [x] v1.0.5 — Desktop column balance and overflow fix
- [x] v1.0.6 — SEO, PWA, and service worker
- [x] v1.0.7 — Repository documentation

**Future ideas:**
- [ ] More lesson modules (macros, registers, visual block, etc.)
- [ ] Configurable themes
- [ ] Keyboard sound effects (optional)

---

## 🤝 Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](./CONTRIBUTING.md) before opening a PR.

---

## 📄 License

This project is licensed under the [MIT License](./LICENSE).
