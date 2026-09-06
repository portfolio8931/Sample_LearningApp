import React from "react";
import { useNavigate } from "react-router-dom";
import type { Question, ReviewMark, Lesson } from "../../types";
import { Button } from "../atoms/Button";

interface ReviewCardProps {
  questions: Question[];
  marks: ReviewMark[];
  lesson: Lesson;
}

export const ReviewCard: React.FC<ReviewCardProps> = ({
  questions,
  marks,
  lesson,
}) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col w-full h-auto mt-6 p-6 gap-6 bg-white rounded-lg border border-gray-200 shadow-md">
      <div className="flex justify-between mb-3">
        <p className="my-2 text-lg font-bold text-gray-600">{lesson.title}</p>
        <Button
          label="再挑戦"
          variant="normal"
          onClick={() =>
            navigate(`/lessons/${lesson.id}/quiz`, {
              state: { isReviewMode: true },
            })
          }
        />
      </div>
      <div className="flex flex-col gap-4">
        {marks.map((mark) => {
          const question = questions.find((q) => q.id === mark.questionId);
          if (!question) return null;

          const formattedDate = new Date(mark.markedAt).toLocaleDateString(
            "ja-JP",
          );

          const shortPrompt =
            question.prompt.length > 30
              ? `${question.prompt.slice(0, 30)}...`
              : question.prompt;

          return (
            <div
              key={mark.id}
              className="flex justify-between p-4 border rounded-lg"
            >
              <p>{shortPrompt}</p>
              <p className="text-sm text-gray-600">{formattedDate}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
