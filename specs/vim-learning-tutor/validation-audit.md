# Validation Audit

| Lesson ID | Mission | Validation Trigger | Current Logic | Type | Risk | Proposed Fix |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `modes-intro` | Press i to enter Insert mode. Then press Escape to return to Normal mode. | `on-mode-change` | `mode === 'normal'` | Mode-based | Low | None. Requires 'insert' -> 'normal' transition which reliably triggers validation. |
| `normal-mode` | Press Escape to make sure you are in Normal mode. | `on-mode-change` | `mode === 'normal'` | Mode-based | **High** | Change to `manual`. If user is already in Normal mode, pressing Escape won't trigger a mode change, causing a false negative. |
| `insert-i` | Use i ... type "brown" | `on-change` | `includes('quick brown fox')` | Content-based | Low | None. |
| `insert-a` | Use a ... make it "VimTutor" | `on-change` | `includes('VimTutor')` | Content-based | Low | None. |
| `insert-o` | ... press o ... Type "Line 2: Second line" | `on-change` | `includes('Second line')` | Content-based | Low | None. |
| `insert-O` | ... press O ... Type "First line: now at the top" | `on-change` | `includes('now at the top')` | Content-based | Low | None. |
| `nav-hjkl` | Move your cursor onto the word "TARGET" | `on-mode-change` | `mode === 'normal'` | Cursor-based (fake) | **High** | Change to `manual`. Navigation does not trigger mode changes or content changes. |
| `nav-words` | Use w to jump ... use b to jump back | `on-mode-change` | `mode === 'normal'` | Cursor-based (fake) | **High** | Change to `manual`. |
| `nav-line` | ... press 0 ... ^ ... $ | `on-mode-change` | `mode === 'normal'` | Cursor-based (fake) | **High** | Change to `manual`. |
| `nav-file` | Press G ... press gg | `on-mode-change` | `mode === 'normal'` | Cursor-based (fake) | **High** | Change to `manual`. |
| `edit-x-dd` | Use x to delete ... dd to delete | `on-change` | `!includes(...)` | Content-based | Low | None. |
| `edit-yank` | ... yy to copy ... p to paste | `on-change` | `matches.length >= 2` | Content-based | Low | None. |
| `change-cw` | ... cw to change ... cc to replace | `on-change` | `includes(...) && !includes(...)` | Content-based | Low | None. |
| `undo-redo` | ... u to undo ... | `on-change` | `includes(...)` | Content-based | Low | None. Undo is a change. |
| `text-objects`| ... ci" to change ... | `on-change` | `includes('"VimTutor"')` | Content-based | Low | None. |
| `visual-mode` | ... V to select ... d to delete | `on-change` | `matches < 2` | Content-based | Low | None. |
| `search` | Press / then type "cherry" ... press n | `on-mode-change` | `mode === 'normal'` | Mode-based | **High** | Change to `manual`. Search commands may not reliably trigger mode change callbacks back to normal mode without a content change. |

## Conclusion
Lessons relying on pure navigation (`nav-hjkl`, `nav-words`, `nav-line`, `nav-file`), search (`search`), and the normal mode check (`normal-mode`) cannot reliably be auto-validated with the current `on-change` or `on-mode-change` triggers because no such events fire when the user correctly completes the mission.

**Safest Minimal Fix:**
Convert these 6 lessons to use the `manual` trigger. We will:
1. Update `validation.trigger` to `'manual'` and `check` to `() => true` for these lessons in `src/data/lessons.ts`.
2. Add a `handleManualValidation` function to `App.tsx` that triggers manual validation.
3. Add a "Mark Complete" button in `LessonPanel.tsx` that appears only for uncompleted lessons with the `manual` trigger. This avoids fake validation while giving the user an explicit way to progress.
