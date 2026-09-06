import { describe, it, expect, beforeEach } from "vitest";
import {
  getReviewMarks,
  saveReviewMark,
  updateReviewMarksStatus,
  saveStudyTime,
} from "../../utils/storage";
import type { ReviewMark, Progress } from "../../types";

const REVIEW_MARKS_KEY = "lma:review_marks";
const PROGRESS_KEY = "lma:progress";

const mockMark: ReviewMark = {
  id: "m1",
  lessonId: "less-1",
  questionId: "q1",
  resolved: false,
  markedAt: "2026-08-01T00:00:00.000Z",
};

describe("storage utils", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe("getReviewMarks", () => {
    it("localStorageが空の場合", () => {
      expect(getReviewMarks()).toEqual([]);
    });

    it("localStorageに保存されたデータを取得", () => {
      localStorage.setItem(REVIEW_MARKS_KEY, JSON.stringify([mockMark]));
      expect(getReviewMarks()).toEqual([mockMark]);
    });
  });

  describe("saveReviewMark", () => {
    it("新規復習フラグを追加", () => {
      saveReviewMark(mockMark);
      const saved = JSON.parse(localStorage.getItem(REVIEW_MARKS_KEY) || "[]");
      expect(saved).toEqual([mockMark]);
    });

    it("既存の復習フラグを更新", () => {
      saveReviewMark({ ...mockMark, resolved: true });

      const updatedMark: ReviewMark = {
        ...mockMark,
        markedAt: "2026-08-02T00:00:00.000Z",
      };
      saveReviewMark(updatedMark);

      const saved = JSON.parse(localStorage.getItem(REVIEW_MARKS_KEY) || "[]");
      expect(saved).toHaveLength(1);
      expect(saved[0].markedAt).toBe("2026-08-02T00:00:00.000Z");
      expect(saved[0].resolved).toBe(false);
    });
  });

  describe("updateReviewMarksStatus", () => {
    it("lessonIdとquestionIdのresolvedステータス更新", () => {
      localStorage.setItem(REVIEW_MARKS_KEY, JSON.stringify([mockMark]));

      updateReviewMarksStatus("less-1", "q1", true);

      const saved = JSON.parse(localStorage.getItem(REVIEW_MARKS_KEY) || "[]");
      expect(saved[0].resolved).toBe(true);
    });

    it("データのステータスが一致しない場合", () => {
      localStorage.setItem(REVIEW_MARKS_KEY, JSON.stringify([mockMark]));

      updateReviewMarksStatus("less-999", "q999", true);

      const saved = JSON.parse(localStorage.getItem(REVIEW_MARKS_KEY) || "[]");
      expect(saved[0].resolved).toBe(false);
    });
  });

  describe("saveStudyTime", () => {
    it("lessonIdが空、またはsecondsが0以下", () => {
      saveStudyTime("", 100);
      saveStudyTime("less-1", 0);
      saveStudyTime("less-1", -10);

      expect(localStorage.getItem(PROGRESS_KEY)).toBeNull();
    });

    it("新規レッスンに学習時間を記録", () => {
      saveStudyTime("less-1", 120); // 120秒 = 2.0分

      const saved: Progress[] = JSON.parse(
        localStorage.getItem(PROGRESS_KEY) || "[]",
      );
      expect(saved).toHaveLength(1);
      expect(saved[0].lessonId).toBe("less-1");
      expect(saved[0].status).toBe("in_progress");
      expect(saved[0].totalStudyMinutes).toBe(2);
    });

    it("既存レッスンの学習時間を更新", () => {
      const existingProgress: Progress[] = [
        {
          lessonId: "less-1",
          status: "in_progress",
          startedAt: "2026-08-01",
          totalStudyMinutes: 10,
        },
      ];
      localStorage.setItem(PROGRESS_KEY, JSON.stringify(existingProgress));

      saveStudyTime("less-1", 180);

      const saved: Progress[] = JSON.parse(
        localStorage.getItem(PROGRESS_KEY) || "[]",
      );
      expect(saved).toHaveLength(1);
      expect(saved[0].totalStudyMinutes).toBe(13);
      expect(saved[0].startedAt).toBe("2026-08-01");
      expect(saved[0].completedAt).toBeDefined();
    });
  });
});
