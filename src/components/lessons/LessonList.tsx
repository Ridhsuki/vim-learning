/**
 * LessonList.tsx
 *
 * Scrollable, chapter-grouped roadmap of all lessons.
 * Entirely controlled by props — does not import lesson data or call any hook.
 */

import type { Lesson, LessonProgress } from '../../types/lesson';
import { LessonCard } from './LessonCard';

// ─── Props ────────────────────────────────────────────────────────────────────

export interface LessonListProps {
  lessons: Lesson[];
  currentLessonId: string;
  progress: Record<string, LessonProgress>;
  onSelectLesson: (lessonId: string) => void;
  className?: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

interface ChapterGroup {
  chapter: string;
  chapterIndex: number;
  lessons: Lesson[];
}

/**
 * Groups the lesson array by chapter, preserving insertion order.
 * Does not sort or mutate the source array.
 */
function groupLessonsByChapter(lessons: Lesson[]): ChapterGroup[] {
  const map = new Map<string, ChapterGroup>();

  for (const lesson of lessons) {
    const existing = map.get(lesson.chapter);
    if (existing) {
      existing.lessons.push(lesson);
    } else {
      map.set(lesson.chapter, {
        chapter: lesson.chapter,
        chapterIndex: lesson.chapterIndex,
        lessons: [lesson],
      });
    }
  }

  // Map preserves insertion order, so the result is already in chapter order.
  return Array.from(map.values());
}

// ─── Component ────────────────────────────────────────────────────────────────

export function LessonList({
  lessons,
  currentLessonId,
  progress,
  onSelectLesson,
  className,
}: LessonListProps) {
  const groups = groupLessonsByChapter(lessons);

  const base =
    'flex flex-col overflow-y-auto bg-[#0d1117] text-[#e6edf3]';
  const containerClass = className ? `${base} ${className}` : base;

  return (
    <nav aria-label="Lesson roadmap" className={containerClass}>
      {groups.map((group) => {
        // Count completed lessons in this chapter for the chapter header.
        const completedCount = group.lessons.filter(
          (l) => progress[l.id]?.completed ?? false,
        ).length;
        const totalCount = group.lessons.length;
        const chapterDone = completedCount === totalCount;

        return (
          <section key={group.chapter} aria-label={group.chapter}>
            {/* Chapter heading */}
            <div className="flex items-center gap-2 px-3 pt-4 pb-1.5 sticky top-0 bg-[#0d1117] z-10 border-b border-[#30363d]/50">
              <h3 className="text-[10px] font-semibold font-mono tracking-widest uppercase text-[#8b949e] m-0 flex-1 truncate">
                {group.chapter}
              </h3>
              <span
                className={[
                  'text-[10px] font-mono shrink-0',
                  chapterDone ? 'text-[#3fb950]' : 'text-[#30363d]',
                ].join(' ')}
                aria-label={`${completedCount} of ${totalCount} lessons completed`}
              >
                {completedCount}/{totalCount}
              </span>
            </div>

            {/* Lesson cards */}
            <ul className="flex flex-col gap-1 px-2 py-2 list-none m-0 p-2">
              {group.lessons.map((lesson) => (
                <li key={lesson.id}>
                  <LessonCard
                    lesson={lesson}
                    isActive={lesson.id === currentLessonId}
                    isCompleted={progress[lesson.id]?.completed ?? false}
                    hintUsed={progress[lesson.id]?.hintUsed ?? false}
                    onSelect={onSelectLesson}
                  />
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </nav>
  );
}
