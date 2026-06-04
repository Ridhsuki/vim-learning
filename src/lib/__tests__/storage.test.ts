/**
 * storage.test.ts
 *
 * Unit tests for the safe localStorage wrapper in src/lib/storage.ts.
 *
 * jsdom provides a real in-memory localStorage implementation, so most tests
 * use it directly.  Failure simulations mock individual Storage prototype
 * methods to confirm silent error handling.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  loadProgress,
  saveProgress,
  clearProgress,
  STORAGE_KEY,
  CURRENT_PROGRESS_VERSION,
} from '../storage';
import type { AppProgress } from '../../types/lesson';

// ─── Fixture ──────────────────────────────────────────────────────────────────

const validProgress: AppProgress = {
  currentLessonId: 'modes-intro',
  lessons: {
    'modes-intro': {
      completed: true,
      hintUsed: false,
      completedAt: '2026-01-01T00:00:00.000Z',
    },
  },
  version: CURRENT_PROGRESS_VERSION,
};

// ─── Test suite ───────────────────────────────────────────────────────────────

describe('storage', () => {
  // Clear jsdom's localStorage before every test so tests are independent.
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  // ── loadProgress ────────────────────────────────────────────────────────────

  describe('loadProgress', () => {
    it('returns null when nothing is stored', () => {
      expect(loadProgress()).toBeNull();
    });

    it('returns the saved progress after saveProgress', () => {
      saveProgress(validProgress);
      expect(loadProgress()).toEqual(validProgress);
    });

    it('returns null when stored JSON is invalid', () => {
      localStorage.setItem(STORAGE_KEY, 'not valid json{{');
      expect(loadProgress()).toBeNull();
    });

    it('returns null when stored version does not match CURRENT_PROGRESS_VERSION', () => {
      const outdated = { ...validProgress, version: CURRENT_PROGRESS_VERSION + 1 };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(outdated));
      expect(loadProgress()).toBeNull();
    });

    it('returns null when stored object is missing currentLessonId', () => {
      const malformed = { lessons: {}, version: CURRENT_PROGRESS_VERSION };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(malformed));
      expect(loadProgress()).toBeNull();
    });

    it('returns null when stored object is missing lessons', () => {
      const malformed = {
        currentLessonId: 'modes-intro',
        version: CURRENT_PROGRESS_VERSION,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(malformed));
      expect(loadProgress()).toBeNull();
    });

    it('returns null when stored object is missing version', () => {
      const malformed = { currentLessonId: 'modes-intro', lessons: {} };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(malformed));
      expect(loadProgress()).toBeNull();
    });

    it('returns null when stored value is a primitive (not an object)', () => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(42));
      expect(loadProgress()).toBeNull();
    });

    it('does not throw when localStorage.getItem throws', () => {
      vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
        throw new Error('storage unavailable');
      });
      expect(() => loadProgress()).not.toThrow();
      expect(loadProgress()).toBeNull();
    });
  });

  // ── saveProgress ────────────────────────────────────────────────────────────

  describe('saveProgress', () => {
    it('writes progress to localStorage under STORAGE_KEY', () => {
      saveProgress(validProgress);
      const raw = localStorage.getItem(STORAGE_KEY);
      expect(raw).not.toBeNull();
      expect(JSON.parse(raw!)).toEqual(validProgress);
    });

    it('does not throw when localStorage.setItem throws', () => {
      vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new DOMException('QuotaExceededError');
      });
      expect(() => saveProgress(validProgress)).not.toThrow();
    });
  });

  // ── clearProgress ───────────────────────────────────────────────────────────

  describe('clearProgress', () => {
    it('removes stored progress so loadProgress returns null', () => {
      saveProgress(validProgress);
      clearProgress();
      expect(loadProgress()).toBeNull();
    });

    it('does not throw when localStorage.removeItem throws', () => {
      vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(() => {
        throw new Error('storage unavailable');
      });
      expect(() => clearProgress()).not.toThrow();
    });
  });
});
