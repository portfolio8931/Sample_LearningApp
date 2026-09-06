import type { QuizAttempt, ReviewMark } from "../types";

const subDays = (days: number): string => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString();
};

export const DUMMY_ATTEMPTS: QuizAttempt[] = [
  {
    id: "attempt-1",
    lessonId: "less-001",
    attemptedAt: subDays(6),
    totalQuestions: 3,
    correctCount: 2,
    durationSec: 120,
    mode: "normal",
    details: [
      { questionId: "q1", isCorrect: true, userAnswer: 0 },
      { questionId: "q2", isCorrect: true, userAnswer: [0, 1] },
      { questionId: "q3", isCorrect: false, userAnswer: "wrong" },
    ],
  },
  {
    id: "attempt-2",
    lessonId: "less-002",
    attemptedAt: subDays(4),
    totalQuestions: 2,
    correctCount: 2,
    durationSec: 90,
    mode: "normal",
    details: [
      { questionId: "q1", isCorrect: true, userAnswer: 1 },
      { questionId: "q2", isCorrect: true, userAnswer: [1] },
    ],
  },
  {
    id: "attempt-3",
    lessonId: "less-003",
    attemptedAt: subDays(1),
    totalQuestions: 2,
    correctCount: 0,
    durationSec: 150,
    mode: "review",
    details: [
      { questionId: "q1", isCorrect: false, userAnswer: 2 },
      { questionId: "q2", isCorrect: false, userAnswer: [0] },
    ],
  },
];

export const DUMMY_REVIEWS: ReviewMark[] = [
  {
    id: "rev-1",
    lessonId: "less-001",
    questionId: "q-curr001-chap001-less001-003",
    markedAt: subDays(3),
    resolved: false,
  },
  {
    id: "rev-2",
    lessonId: "less-002",
    questionId: "q-curr001-chap001-less002-001",
    markedAt: subDays(5),
    resolved: true,
  },
];

export const DUMMY_PROGRESS = [
  {
    lessonId: "less-001",
    status: "completed",
    totalStudyMinutes: 15,
    updatedAt: subDays(6),
  },
  {
    lessonId: "less-002",
    status: "completed",
    totalStudyMinutes: 10,
    updatedAt: subDays(4),
  },
  {
    lessonId: "less-003",
    status: "in_progress",
    totalStudyMinutes: 5,
    updatedAt: subDays(1),
  },
];

export const initDummyDataIfEmpty = () => {
  if (!import.meta.env.DEV) return;

  const STORAGE_KEYS = {
    ATTEMPTS: "lma:quiz_attempts",
    REVIEWS: "lma:review_marks",
    PROGRESS: "lma:progress",
  };

  if (!localStorage.getItem(STORAGE_KEYS.ATTEMPTS)) {
    localStorage.setItem(STORAGE_KEYS.ATTEMPTS, JSON.stringify(DUMMY_ATTEMPTS));
    console.log("開発用ダミーデータ(解答履歴)を自動投入しました");
  }

  if (!localStorage.getItem(STORAGE_KEYS.REVIEWS)) {
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(DUMMY_REVIEWS));
    console.log("開発用ダミーデータ(復習マーク)を自動投入しました");
  }

  if (!localStorage.getItem(STORAGE_KEYS.PROGRESS)) {
    localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(DUMMY_PROGRESS));
    console.log("開発用ダミーデータ(進捗)を自動投入しました");
  }
};
