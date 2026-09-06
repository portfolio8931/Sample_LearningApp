import React from "react";
import type { Question, QuizAttemptDetail } from "../../types";
import { Button } from "../atoms/Button";
import { MarkdownRenderer } from "./MarkdownRenderer";
import { useAppDispatch } from "../../store";
import { showToast } from "../../store/uiSlice";

interface ResultCardProps {
  question: Question;
  detail?: QuizAttemptDetail;
  onAddReview: (questionId: string) => void;
}

const formatUserAnser = (
  question: Question,
  detail?: QuizAttemptDetail,
): string => {
  if (
    !detail ||
    detail.userAnswer === null ||
    detail.userAnswer === undefined
  ) {
    return "未回答";
  }
  if (question.type === "single") {
    const idx = detail.userAnswer as number;
    return question.choices[idx] ?? "未回答";
  }
  if (question.type === "multi") {
    const indices = detail.userAnswer as number[];
    if (!Array.isArray(indices) || indices.length === 0) return "未回答";
    return indices.map((i) => question.choices[i]).join(" / ");
  }
  return String(detail.userAnswer);
};

const formatCorrectAnswer = (question: Question): string => {
  if (question.type === "single") {
    return question.choices[question.answerIndex];
  }
  if (question.type === "multi") {
    return question.answerIndices.map((i) => question.choices[i]).join(" / ");
  }
  return question.expected;
};

export const ResultCard: React.FC<ResultCardProps> = ({
  question,
  detail,
  onAddReview,
}) => {
  const dispatch = useAppDispatch();
  const isCorrect = detail?.isCorrect ?? false;
  const userAnswerText = formatUserAnser(question, detail);
  const correctAnswerText = formatCorrectAnswer(question);

  const handleAddReview = () => {
    onAddReview(question.id);
    dispatch(
      showToast({
        message: "復習リストに追加しました",
        type: "success",
      }),
    );
  };

  return (
    <div className="p-5 border-2 rounded-lg">
      <div className="flex flex-col gap-3">
        <div className="flex gap-2">
          <span className="text-red-700 font-bold">
            {isCorrect ? "✓" : "×"}
          </span>
          <MarkdownRenderer content={question.prompt} />
          <span className="shrink-0 text-red-700">
            {isCorrect ? "(正解)" : "(不正解)"}
          </span>
        </div>
        <p className="font-bold underline">{`あなたの回答：${userAnswerText}`}</p>
        {!isCorrect && (
          <p className="text-blue-700 font-bold">{`正解：${correctAnswerText}`}</p>
        )}
        <div className="flex">
          <span className="shrink-0">解説：</span>
          <MarkdownRenderer content={question.explanation} />
        </div>
      </div>
      <div className="flex justify-end mt-3">
        <Button label="復習に追加" variant="mono" onClick={handleAddReview} />
      </div>
    </div>
  );
};
