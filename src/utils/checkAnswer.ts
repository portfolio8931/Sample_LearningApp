import type { Question, AnswerType } from "../types";

export const checkAnswer = (
  question: Question,
  userAnswer: AnswerType | undefined,
): boolean => {
  if (userAnswer === undefined || userAnswer === null) {
    return false;
  }

  const normalize = (str: string): string =>
    str.replace(/\s+/g, "").toLowerCase();

  switch (question.type) {
    case "single": {
      if (typeof userAnswer !== "number") return false;
      return userAnswer === question.answerIndex;
    }

    case "multi": {
      if (!Array.isArray(userAnswer)) return false;
      const expectedIndices = question.answerIndices ?? [];
      if (userAnswer.length !== expectedIndices.length) return false;

      const sortedUser = [...userAnswer].sort((a, b) => a - b);
      const sortedExpected = [...expectedIndices].sort((a, b) => a - b);
      return sortedUser.every((val, idx) => val === sortedExpected[idx]);
    }

    case "text": {
      if (typeof userAnswer !== "string") return false;

      const normalizedUser = normalize(userAnswer);
      const normalizeExpected = normalize(question.expected ?? "");
      return normalizedUser === normalizeExpected;
    }

    default:
      return false;
  }
};
