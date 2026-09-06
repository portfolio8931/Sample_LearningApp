import type { ReviewMark, Progress } from "../types";

const REVIEW_MARKS_KEY = "lma:review_marks";
const PROGRESS_KEY = "lma:progress";

/* 復習マーク */
export const getReviewMarks = (): ReviewMark[] => {
  const data = localStorage.getItem(REVIEW_MARKS_KEY);
  return data ? (JSON.parse(data) as ReviewMark[]) : [];
};

export const saveReviewMark = (newMark: ReviewMark): void => {
  const currentMarks = getReviewMarks();
  const existingIndex = currentMarks.findIndex(
    (m) =>
      m.lessonId === newMark.lessonId && m.questionId === newMark.questionId,
  );

  if (existingIndex >= 0) {
    currentMarks[existingIndex] = {
      ...currentMarks[existingIndex],
      markedAt: newMark.markedAt,
      resolved: false,
    };
  } else {
    currentMarks.push(newMark);
  }
  localStorage.setItem(REVIEW_MARKS_KEY, JSON.stringify(currentMarks));
};

export const updateReviewMarksStatus = (
  lessonId: string,
  questionId: string,
  resolved: boolean,
): void => {
  const currentMarks = getReviewMarks();
  const updatedMarks = currentMarks.map((mark) => {
    if (mark.lessonId === lessonId && mark.questionId === questionId) {
      return { ...mark, resolved };
    }
    return mark;
  });
  localStorage.setItem(REVIEW_MARKS_KEY, JSON.stringify(updatedMarks));
};

/* 学習時間記録 */
export const saveStudyTime = (lessonId: string, seconds: number): void => {
  if (!lessonId || seconds <= 0) return;

  const data = localStorage.getItem(PROGRESS_KEY);
  const progressList: Progress[] = data ? JSON.parse(data) : [];

  const addedMinutes = Math.round((seconds / 60) * 10) / 10;
  const todayStr = new Date().toISOString().split("T")[0];

  const targetIndex = progressList.findIndex((p) => p.lessonId === lessonId);

  if (targetIndex >= 0) {
    const target = progressList[targetIndex];
    progressList[targetIndex] = {
      ...target,
      totalStudyMinutes:
        Math.round(((target.totalStudyMinutes || 0) + addedMinutes) * 10) / 10,
      startedAt: target.startedAt || todayStr,
      completedAt: todayStr,
    };
  } else {
    progressList.push({
      lessonId,
      status: "in_progress",
      startedAt: todayStr,
      totalStudyMinutes: addedMinutes,
    });
  }

  localStorage.setItem(PROGRESS_KEY, JSON.stringify(progressList));
};
