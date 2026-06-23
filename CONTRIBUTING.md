# Contributing to Vim Learning

Thank you for your interest in contributing! This document covers everything you need to get started.

---

## 🛠 Setup

```bash
git clone https://github.com/Ridhsuki/vim-learning.git
cd vim-learning
npm install
npm run dev
```

The dev server runs at `http://localhost:5173`.

---

## 🌿 Branch Naming

Use a short, descriptive prefix:

| Type      | Pattern                     | Example                        |
|-----------|-----------------------------|--------------------------------|
| Feature   | `feat/<short-name>`         | `feat/lesson-macros`           |
| Fix       | `fix/<short-name>`          | `fix/insert-mode-validation`   |
| Chore     | `chore/<short-name>`        | `chore/update-deps`            |
| Docs      | `docs/<short-name>`         | `docs/readme-update`           |
| Refactor  | `refactor/<short-name>`     | `refactor/lesson-panel`        |

Always branch from `main`.

---

## ✍️ Commit Message Style

Use the [Conventional Commits](https://www.conventionalcommits.org/) format:

```
<type>(<scope>): <short description>

[optional body]
[optional footer]
```

**Examples:**

```
feat(lessons): add visual block mode lesson
fix(validation): correct delete-word detection regex
chore(deps): update @replit/codemirror-vim to latest
docs: add screenshots to README
```

---

## 🧪 Running Tests

Before opening a PR, make sure all checks pass:

```bash
npm run lint          # ESLint
npm run typecheck     # TypeScript
npm run test:run      # Vitest unit tests (once)
npm run build         # Production build
npm run e2e           # Playwright E2E tests
```

All five must exit with code 0.

---

## 🔀 Opening a Pull Request

1. Fork the repository and create your branch from `main`.
2. Make your changes, add/update tests if needed.
3. Run all checks (see above).
4. Open a PR against `main`.
5. Fill in the PR template — describe what, why, and how you tested it.
6. Wait for a review. Small, focused PRs are reviewed faster.

---

## 🎨 Coding Style

- **TypeScript** everywhere in `src/` — avoid `any`.
- **React functional components** with hooks only.
- **CSS**: Tailwind utility classes via `className`. Keep complex or shared styles in `globals.css`.
- **No new dependencies** without discussion — we keep the bundle lean.
- **No `console.log`** left in committed code.
- Keep components **focused and small** — split when a component grows too large.
- Add or update **unit tests** for logic changes in `src/lib/` and `src/hooks/`.
- Add or update **E2E tests** for visible user-facing changes in `e2e/`.

---

## ❓ Questions?

Open a [GitHub Discussion](https://github.com/Ridhsuki/vim-learning/discussions) or a [GitHub Issue](https://github.com/Ridhsuki/vim-learning/issues) to ask before starting large work.
