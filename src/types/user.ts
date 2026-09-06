export type Progress = {
  lessonId: string;
  status: "not_started" | "in_progress" | "completed";
  startedAt?: string; // ISO8601 形式
  completedAt?: string; // ISO8601 形式
  totalStudyMinutes: number; // 累計学習時間(分)
  dailyLogs?: Record<string, number>;
};

export type QuizAttempt = {
  id: string; // attempt の一意ID(UUID等)
  lessonId: string;
  attemptedAt: string; // ISO8601 形式
  totalQuestions: number;
  correctCount: number;
  durationSec: number; // 解答にかかった秒数
  mode: "normal" | "review"; // 通常モード or 復習モード
  details: QuizAttemptDetail[];
};

export type QuizAttemptDetail = {
  questionId: string;
  isCorrect: boolean;
  userAnswer: unknown; // 回答内容(タイプによって型が異なる)
};

export type ReviewMark = {
  id: string;
  lessonId: string;
  questionId: string;
  markedAt: string; // ISO8601 形式
  resolved: boolean; // true=復習リスト表示対象外、false=未解決
};
