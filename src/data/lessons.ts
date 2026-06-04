import type { Lesson } from '../types/lesson';

// ─────────────────────────────────────────────────────────────────────────────
// Chapter 1: Vim Modes
// ─────────────────────────────────────────────────────────────────────────────

const modesIntro: Lesson = {
  id: 'modes-intro',
  chapter: 'Chapter 1: Vim Modes',
  chapterIndex: 0,
  lessonIndex: 0,
  title: 'What is a Mode?',
  description: [
    'Vim is a modal editor — it has different modes for different tasks. Each mode changes what your keyboard does.',
    'The four core modes are: Normal (navigate and edit), Insert (type text), Visual (select text), and Command-line (run commands like :w to save).',
    'When you open Vim, you always start in Normal mode. Most beginners get stuck because they try to type right away. Vim needs you to enter Insert mode first.',
  ],
  initialContent: `Welcome to VimTutor!

You are currently in Normal mode.
Your keyboard is for navigation, not typing.

Press 'i' to enter Insert mode and start typing.
Press 'Escape' to return to Normal mode.
`,
  mission: 'Press i to enter Insert mode. Then press Escape to return to Normal mode.',
  hint: 'Press i on your keyboard. The status bar at the bottom will show -- INSERT --. Then press Escape.',
  validation: {
    trigger: 'on-mode-change',
    // Passes once the user has visited Insert mode and returned to Normal.
    // We track this by checking that mode is 'normal' after a content change —
    // the user must have gone through Insert to trigger on-mode-change at all.
    check: (_content, mode) => mode === 'normal',
  },
};

const normalMode: Lesson = {
  id: 'normal-mode',
  chapter: 'Chapter 1: Vim Modes',
  chapterIndex: 0,
  lessonIndex: 1,
  title: 'Normal Mode is Home Base',
  description: [
    'Normal mode is where you spend most of your time in Vim. From here you can move the cursor, delete text, copy lines, and much more — all without typing characters into the buffer.',
    'Always return to Normal mode by pressing Escape. If you are not sure what mode you are in, press Escape once or twice.',
    "The status bar shows nothing (or NORMAL) when you're in Normal mode, and shows -- INSERT -- when you're in Insert mode.",
  ],
  initialContent: `Normal mode is powerful.

You can move, delete, copy, and paste
without ever entering Insert mode.

Press Escape now if you're not in Normal mode.
The status bar below will confirm your mode.
`,
  mission: 'Press Escape to make sure you are in Normal mode. The status bar should show NORMAL.',
  hint: 'Press the Escape key. Look at the status bar at the bottom of the editor.',
  validation: {
    trigger: 'on-mode-change',
    check: (_content, mode) => mode === 'normal',
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Chapter 2: Insert Mode
// ─────────────────────────────────────────────────────────────────────────────

const insertI: Lesson = {
  id: 'insert-i',
  chapter: 'Chapter 2: Insert Mode',
  chapterIndex: 1,
  lessonIndex: 0,
  title: 'Insert Before Cursor (i)',
  description: [
    'Press i in Normal mode to enter Insert mode. The cursor stays in its current position, and new characters are inserted before it.',
    'This is the most common way to enter Insert mode. After typing, press Escape to return to Normal mode.',
  ],
  initialContent: `Fix this line by inserting the missing word:

The quick  fox jumps over the lazy dog.

Place your cursor on the gap and press i to insert.
`,
  mission: 'Use i to enter Insert mode and type the word "brown" to complete the sentence.',
  hint: 'Move your cursor to the space between "quick" and "fox", press i, then type "brown ".',
  validation: {
    trigger: 'on-change',
    check: (content) => content.includes('quick brown fox'),
  },
};

const insertA: Lesson = {
  id: 'insert-a',
  chapter: 'Chapter 2: Insert Mode',
  chapterIndex: 1,
  lessonIndex: 1,
  title: 'Insert After Cursor (a)',
  description: [
    'Press a (append) to enter Insert mode after the current character. This is useful when the cursor is on the last character of a word and you want to add something immediately after it.',
    'The difference from i: i inserts before the cursor, a inserts after it.',
  ],
  initialContent: `Complete this word by appending to it:

The word is: Vim

Place your cursor on the 'm' and press 'a' to append.
Then type 'Tutor' to make it 'VimTutor'.
`,
  mission: "Use a to append to the word \"Vim\" and make it \"VimTutor\".",
  hint: "Move your cursor onto the 'm' in 'Vim', press a, then type 'Tutor'.",
  validation: {
    trigger: 'on-change',
    check: (content) => content.includes('VimTutor'),
  },
};

const insertO: Lesson = {
  id: 'insert-o',
  chapter: 'Chapter 2: Insert Mode',
  chapterIndex: 1,
  lessonIndex: 2,
  title: 'Open Line Below (o)',
  description: [
    'Press o (lowercase) in Normal mode to open a new line below the current line and immediately enter Insert mode. The cursor moves to the new line.',
    'This saves you from pressing End, Enter, and then i. It is one of the most useful Insert mode shortcuts.',
  ],
  initialContent: `Line 1: First line
Line 2: Third line

There is a missing line between Line 1 and Line 2.
Place your cursor on Line 1 and press 'o' to add it.
`,
  mission: "Place your cursor on \"Line 1\" and press o to open a new line below it. Type \"Line 2: Second line\".",
  hint: "Put your cursor anywhere on the first line, press o, then type \"Line 2: Second line\".",
  validation: {
    trigger: 'on-change',
    check: (content) => content.includes('Second line'),
  },
};

const insertOUpper: Lesson = {
  id: 'insert-O',
  chapter: 'Chapter 2: Insert Mode',
  chapterIndex: 1,
  lessonIndex: 3,
  title: 'Open Line Above (O)',
  description: [
    'Press O (uppercase) in Normal mode to open a new line above the current line and immediately enter Insert mode.',
    'This is the opposite of o. Use it when you need to insert a line before the current one without moving your cursor first.',
  ],
  initialContent: `Second line: comes after the first
First line: should be at the top

The first line is in the wrong place.
Place your cursor on "Second line" and press O (shift+o)
to open a new line above it.
`,
  mission: 'Place your cursor on "Second line" and press O (Shift+o) to open a new line above it. Type "First line: now at the top".',
  hint: 'Put your cursor on the "Second line" row, press Shift+o (capital O), then type your text.',
  validation: {
    trigger: 'on-change',
    check: (content) => content.includes('now at the top'),
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Chapter 3: Normal Mode Navigation
// ─────────────────────────────────────────────────────────────────────────────

const navHjkl: Lesson = {
  id: 'nav-hjkl',
  chapter: 'Chapter 3: Navigation',
  chapterIndex: 2,
  lessonIndex: 0,
  title: 'Move with h j k l',
  description: [
    'In Normal mode, use h j k l to move the cursor — no arrow keys needed. This keeps your hands on the home row.',
    'h = left, j = down, k = up, l = right.',
    'Think of j as a down-arrow (the letter j has a downward stroke). Practice until it becomes muscle memory — it is the foundation of fast Vim navigation.',
  ],
  initialContent: `Navigate to find the hidden word.
Use h j k l to move your cursor.

Line 1: ......
Line 2: .....TARGET.....
Line 3: ......

The word TARGET is your destination.
Move your cursor onto it using only h j k l.
`,
  mission: 'Move your cursor onto the word "TARGET" using only h, j, k, and l.',
  hint: 'j moves down, k moves up, h moves left, l moves right. Reach the word TARGET.',
  // Validate that the user has navigated — simple check: mode stays normal and file unchanged.
  // Full cursor-position validation requires CodeMirror state (added in T-09).
  // For now we accept any navigation attempt (mode remains normal).
  validation: {
    trigger: 'on-mode-change',
    check: (_content, mode) => mode === 'normal',
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Chapter 4: Word Navigation
// ─────────────────────────────────────────────────────────────────────────────

const navWords: Lesson = {
  id: 'nav-words',
  chapter: 'Chapter 4: Word Navigation',
  chapterIndex: 3,
  lessonIndex: 0,
  title: 'Jump by Words (w b e ge)',
  description: [
    'Character-by-character navigation with h and l is slow for longer distances. Vim lets you jump by whole words:',
    'w = jump to the start of the next word. b = jump back to the start of the previous word. e = jump to the end of the current/next word. ge = jump to the end of the previous word.',
    'These four motions let you move across a line very quickly.',
  ],
  initialContent: `Practice word navigation on this sentence:

The quick brown fox jumps over the lazy dog.

Use w to move forward word by word.
Use b to move backward word by word.
Use e to land on the last character of each word.
`,
  mission: 'Use w to jump forward three words, then use b to jump back one word. Stay in Normal mode throughout.',
  hint: 'Press w three times, then press b once. You should land on "brown".',
  validation: {
    trigger: 'on-mode-change',
    check: (_content, mode) => mode === 'normal',
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Chapter 5: Line Navigation
// ─────────────────────────────────────────────────────────────────────────────

const navLine: Lesson = {
  id: 'nav-line',
  chapter: 'Chapter 5: Line Navigation',
  chapterIndex: 4,
  lessonIndex: 0,
  title: 'Navigate Within a Line (0 ^ $)',
  description: [
    '0 (zero) moves the cursor to the very beginning of the line, including any leading spaces.',
    '^ moves the cursor to the first non-whitespace character of the line.',
    '$ moves the cursor to the end of the line.',
    'These three motions are the fastest way to jump to line boundaries.',
  ],
  initialContent: `    The indented line starts with spaces.
The cursor is somewhere in the middle of this line.

Practice:
- Press 0 to go to the absolute start (column 1).
- Press ^ to go to the first real character.
- Press $ to jump to the end of the line.
`,
  mission: 'On the first indented line, press 0 to go to column 1, then ^ to jump to the first real character, then $ to jump to the end.',
  hint: '0 goes to column 1 (before the spaces). ^ skips whitespace and lands on "T". $ goes to the period at the end.',
  validation: {
    trigger: 'on-mode-change',
    check: (_content, mode) => mode === 'normal',
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Chapter 6: File Navigation
// ─────────────────────────────────────────────────────────────────────────────

const navFile: Lesson = {
  id: 'nav-file',
  chapter: 'Chapter 6: File Navigation',
  chapterIndex: 5,
  lessonIndex: 0,
  title: 'Jump to Top and Bottom (gg G)',
  description: [
    'gg (two lowercase g keystrokes) moves the cursor to the very first line of the file.',
    'G (uppercase) moves the cursor to the very last line of the file.',
    'These are instant jumps — no matter how large the file is, gg and G take you there immediately.',
  ],
  initialContent: `Line 1: This is the top of the file. ← gg lands here.
Line 2: ...
Line 3: ...
Line 4: ...
Line 5: ...
Line 6: ...
Line 7: ...
Line 8: ...
Line 9: ...
Line 10: This is the bottom of the file. ← G lands here.
`,
  mission: 'Press G to jump to the last line, then press gg to jump back to the first line.',
  hint: 'Press G (Shift+g) to go to the bottom, then press g g (two lowercase g keys) to go back to the top.',
  validation: {
    trigger: 'on-mode-change',
    check: (_content, mode) => mode === 'normal',
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Chapter 7: Editing
// ─────────────────────────────────────────────────────────────────────────────

const editXDd: Lesson = {
  id: 'edit-x-dd',
  chapter: 'Chapter 7: Editing',
  chapterIndex: 6,
  lessonIndex: 0,
  title: 'Delete Characters and Lines (x dd)',
  description: [
    'x deletes the single character under the cursor in Normal mode. Think of it as the Delete key.',
    'dd deletes the entire current line. The line is removed and the lines below move up.',
    'Both x and dd also copy the deleted content to Vim\'s register, so you can paste it with p.',
  ],
  initialContent: `This line has an exxtra letter that needs removing.
This line is correct.
DELETE THIS ENTIRE LINE.
This line is also correct.
`,
  mission: 'Use x to delete the extra "x" in "exxtra", then use dd to delete the line that says "DELETE THIS ENTIRE LINE".',
  hint: 'Move to the second "x" in "exxtra" and press x. Then move to the "DELETE" line and press d d.',
  validation: {
    trigger: 'on-change',
    check: (content) =>
      !content.includes('exxtra') &&
      !content.includes('DELETE THIS ENTIRE LINE'),
  },
};

const editYank: Lesson = {
  id: 'edit-yank',
  chapter: 'Chapter 7: Editing',
  chapterIndex: 6,
  lessonIndex: 1,
  title: 'Copy and Paste (yy p P)',
  description: [
    'yy (yank yank) copies the entire current line into Vim\'s clipboard (called a register).',
    'p pastes the copied line below the current line.',
    'P (uppercase) pastes the copied line above the current line.',
    'Unlike system clipboard shortcuts, yank and paste work entirely within Vim.',
  ],
  initialContent: `Original line: Copy me!
Paste destination is below this line.

`,
  mission: 'Move to "Original line: Copy me!", press yy to copy it, then move one line down and press p to paste it below.',
  hint: 'Go to the "Copy me!" line, press y y, then press j to move down, then press p.',
  validation: {
    trigger: 'on-change',
    // Two or more occurrences of the phrase means it was copied and pasted.
    check: (content) => {
      const matches = content.match(/Copy me!/g);
      return matches !== null && matches.length >= 2;
    },
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Chapter 8: Change Commands
// ─────────────────────────────────────────────────────────────────────────────

const changeCw: Lesson = {
  id: 'change-cw',
  chapter: 'Chapter 8: Change Commands',
  chapterIndex: 7,
  lessonIndex: 0,
  title: 'Change Word and Line (cw cc)',
  description: [
    'cw (change word) deletes from the cursor to the end of the current word and immediately enters Insert mode. It combines deletion and insertion in one motion.',
    'cc (change line) deletes the entire line and enters Insert mode, leaving the cursor on a blank indented line.',
    'Change commands are faster than dd + i because they do both steps at once.',
  ],
  initialContent: `The weather is terrible today.
Replace "terrible" with "wonderful".

This whole sentence is wrong.
Use cc to replace the entire line.
`,
  mission: 'Move your cursor to the word "terrible" and use cw to change it to "wonderful". Then use cc to replace the "This whole sentence is wrong." line.',
  hint: 'Place cursor on "terrible", press c w, type "wonderful", press Escape. Then go to the wrong line, press c c, and type a replacement.',
  validation: {
    trigger: 'on-change',
    check: (content) =>
      content.includes('wonderful') && !content.includes('terrible'),
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Chapter 9: Undo & Redo
// ─────────────────────────────────────────────────────────────────────────────

const undoRedo: Lesson = {
  id: 'undo-redo',
  chapter: 'Chapter 9: Undo & Redo',
  chapterIndex: 8,
  lessonIndex: 0,
  title: 'Undo and Redo (u Ctrl+r)',
  description: [
    'u in Normal mode undoes the last change. Press it multiple times to undo further.',
    'Ctrl+r redoes the last undone change. Together, u and Ctrl+r give you a full undo/redo history.',
    'Vim\'s undo history is persistent and powerful — each insertion, deletion, or change is a separate undo step.',
  ],
  initialContent: `This text is correct.
Make a change below, then undo it.

Change this line, then press u to undo.
`,
  mission: 'Edit the last line (add or delete something), press Escape to return to Normal mode, then press u to undo your change and restore the original text.',
  hint: 'Press i to enter Insert mode, type something, press Escape, then press u. The text should revert.',
  validation: {
    trigger: 'on-change',
    // We check that the fourth line matches the original after undo.
    check: (content) =>
      content.includes('Change this line, then press u to undo.'),
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Chapter 10: Text Objects
// ─────────────────────────────────────────────────────────────────────────────

const textObjects: Lesson = {
  id: 'text-objects',
  chapter: 'Chapter 10: Text Objects',
  chapterIndex: 9,
  lessonIndex: 0,
  title: 'Inner and Around Text Objects (ci( da()',
  description: [
    'Text objects let you operate on logical chunks of text, not just characters. The two most common modifiers are i (inner) and a (around).',
    'ci( means "change inner parentheses" — deletes everything inside () and enters Insert mode. The parentheses themselves remain.',
    'da( means "delete around parentheses" — deletes the content AND the parentheses themselves.',
    'You can replace ( with ", \', {, [, or any delimiter. These are some of the most powerful commands in Vim.',
  ],
  initialContent: `Edit the content inside the parentheses:

greet("world")
greet("wrong value")

Use ci" to change "world" to "VimTutor".
Use da( to delete the entire argument including parentheses from the second line.
`,
  mission: 'Move inside the quotes on the first greet line and use ci" to change "world" to "VimTutor".',
  hint: 'Place your cursor anywhere inside the quotes "world", then press c i " and type VimTutor.',
  validation: {
    trigger: 'on-change',
    check: (content) => content.includes('"VimTutor"'),
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Chapter 11: Visual Mode
// ─────────────────────────────────────────────────────────────────────────────

const visualMode: Lesson = {
  id: 'visual-mode',
  chapter: 'Chapter 11: Visual Mode',
  chapterIndex: 10,
  lessonIndex: 0,
  title: 'Select Text (v V Ctrl+v)',
  description: [
    'v enters character-wise Visual mode. Move the cursor to extend the selection one character at a time.',
    'V (uppercase) enters line-wise Visual mode. Entire lines are selected as you move up or down.',
    'Ctrl+v enters block-wise Visual mode. You can select a rectangular block across multiple lines.',
    'After selecting, press d to delete, y to copy, or type a command to act on the selection.',
  ],
  initialContent: `Select and delete this unwanted line.
Keep this line.
Select and delete this unwanted line too.
Keep this line as well.

Use V to select a whole line, then press d to delete it.
`,
  mission: 'Press V to enter Visual Line mode, select one of the "unwanted" lines, then press d to delete it.',
  hint: 'Move your cursor to an unwanted line, press Shift+v (V), then press d to delete it.',
  validation: {
    trigger: 'on-change',
    check: (content) => {
      const matches = content.match(/Select and delete this unwanted line/g);
      return matches === null || matches.length < 2;
    },
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Chapter 12: Search
// ─────────────────────────────────────────────────────────────────────────────

const search: Lesson = {
  id: 'search',
  chapter: 'Chapter 12: Search',
  chapterIndex: 11,
  lessonIndex: 0,
  title: 'Search Forward and Backward (/ n N * #)',
  description: [
    'In Normal mode, press / followed by a search term and Enter to search forward through the file.',
    'n jumps to the next match. N jumps to the previous match.',
    'Place your cursor on any word and press * to search for the next occurrence of that exact word. # searches backward.',
    'Search is one of the fastest ways to navigate in Vim for large files.',
  ],
  initialContent: `Find all occurrences of the target word:

apple banana cherry apple mango
cherry apple banana apple cherry
mango cherry apple banana mango

Press / then type "apple" and press Enter.
Press n to jump to each next occurrence.
Press N to jump backward.
Press * while on "cherry" to search for it directly.
`,
  mission: 'Press / then type "cherry" and press Enter to search for it. Then press n to jump to the next occurrence.',
  hint: 'Press / on your keyboard, type cherry, press Enter, then press n to jump to the next match.',
  validation: {
    trigger: 'on-mode-change',
    // Search lands back in normal mode after pressing Enter or n.
    check: (_content, mode) => mode === 'normal',
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Export
// ─────────────────────────────────────────────────────────────────────────────

export const lessons: Lesson[] = [
  // Ch. 1 — Modes
  modesIntro,
  normalMode,
  // Ch. 2 — Insert Mode
  insertI,
  insertA,
  insertO,
  insertOUpper,
  // Ch. 3 — Navigation
  navHjkl,
  // Ch. 4 — Word Navigation
  navWords,
  // Ch. 5 — Line Navigation
  navLine,
  // Ch. 6 — File Navigation
  navFile,
  // Ch. 7 — Editing
  editXDd,
  editYank,
  // Ch. 8 — Change Commands
  changeCw,
  // Ch. 9 — Undo & Redo
  undoRedo,
  // Ch. 10 — Text Objects
  textObjects,
  // Ch. 11 — Visual Mode
  visualMode,
  // Ch. 12 — Search
  search,
];

export const firstLesson = lessons[0];
export const totalLessons = lessons.length;
