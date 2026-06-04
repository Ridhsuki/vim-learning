# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.7] — 2026-06-05

### Added
- `README.md` with full project documentation, installation guide, scripts table, project structure, and roadmap
- `LICENSE` (MIT)
- `CHANGELOG.md`
- `CONTRIBUTING.md` with setup, branch naming, commit style, and PR guide
- `CODE_OF_CONDUCT.md` (Contributor Covenant summary)
- `SECURITY.md` with lightweight vulnerability reporting policy
- GitHub issue templates: bug report, feature request, and config
- GitHub pull request template
- `.github/dependabot.yml` for weekly npm dependency updates

---

## [1.0.6] — 2026-06-05

### Added
- Rich SEO metadata in `index.html`: canonical URL, Open Graph, Twitter cards, `robots`, `application-name`, `theme-color`
- JSON-LD structured data for `WebApplication`
- PWA manifest (`public/site.webmanifest`) with icons and GitHub Pages base path
- PWA icons (`public/icons/icon-192.png`, `icon-512.png`, `maskable-icon-512.png`) generated from `favicon.svg`
- Apple/iOS PWA meta tags
- `public/robots.txt` and `public/sitemap.xml`
- Lightweight service worker (`public/sw.js`) with stale-while-revalidate caching, ignoring cross-origin and non-GET requests
- Service worker registration in `src/main.jsx` (production only, with `import.meta.env.PROD` guard)

---

## [1.0.5] — 2026-06-04

### Changed
- Desktop layout rebalanced: editor capped at ~50vw via CSS Grid
- `LessonPanel` horizontal overflow removed (`overflow-x-hidden`)
- Lesson roadmap sidebar and lesson content area now feel more spacious

---

## [1.0.4] — 2026-06-04

### Added
- Custom `ConfirmDialog` component for resetting all progress
- Replaced native `window.confirm` with accessible modal dialog
- Escape key closes the dialog; keyboard navigation preserved

---

## [1.0.3] — 2026-06-04

### Changed
- Improved responsive stacking layout for narrow viewports
- Custom scrollbar styling via `globals.css`
- Fixed scrollbar layout bleed on `LessonPanel` and `LessonList`

---

## [1.0.2] — 2026-06-04

### Added
- "Reset all progress" button in the app header
- Uses `resetAll()` from `useLessonProgress` hook
- Confirmation guard prevents accidental data loss
- "Start Over" button on the completion screen

---

## [1.0.1] — 2026-06-04

### Fixed
- Audited all lesson completion validators for false-negative risk
- Converted 6 lessons to `validation.trigger: 'manual'` where automated detection was unreliable
- Added "I completed this mission" manual completion button in `LessonPanel`
- `onCheckMission` prop wired from `App.tsx` → `AppShell` → `LessonPanel`

---

## [1.0.0] — 2026-06-03

### Added
- Initial release of VimTutor web app
- 20+ guided Vim lessons covering modes, navigation, editing, visual mode, search, and ex commands
- CodeMirror 6 editor with full Vim keybindings via `@replit/codemirror-vim`
- Lesson progress persistence via `localStorage`
- Lesson list sidebar with completion status badges
- Hint reveal system (one hint per lesson)
- Navigation between lessons (Previous / Next)
- Per-lesson editor reset
- Status bar showing current Vim mode and lesson info
- Deployed to GitHub Pages at `/vim-learning/`
