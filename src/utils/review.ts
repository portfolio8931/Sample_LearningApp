import type { ReviewMark } from "../types";

export const updateReviewMarks = (
  prevMarks: ReviewMark[],
  questionId: string,
  lessonId: string,
): ReviewMark[] => {
  const now = new Date().toISOString();
  const existingMark = prevMarks.find((m) => m.questionId === questionId);

  if (!existingMark) {
    return [
      ...prevMarks,
      {
        id: crypto.randomUUID(),
        lessonId,
        questionId,
        resolved: false,
        markedAt: now,
      },
    ];
  }

  if (!existingMark.resolved) {
    return prevMarks;
  }

  return prevMarks.map((mark) =>
    mark.questionId === questionId
      ? { ...mark, resolved: false, markedAt: now }
      : mark,
  );
};
