import React from "react";
import type { QuestionSingle } from "../../types";
import { MarkdownRenderer } from "./MarkdownRenderer";

interface Props {
  question: QuestionSingle;
  userAnswer: number | undefined;
  onAnswerChange: (questionId: string, answer: number) => void;
}

export const QuizSingle: React.FC<Props> = ({
  question,
  userAnswer,
  onAnswerChange,
}) => {
  return (
    <div>
      <MarkdownRenderer content={question.prompt} />
      <div className="flex flex-col mt-3 gap-1">
        {question.choices.map((choice, idx) => (
          <label key={idx} className="flex gap-1">
            <input
              type="radio"
              name={`question-${question.id}`}
              checked={userAnswer === idx}
              onChange={() => onAnswerChange(question.id, idx)}
            />
            <span>{choice}</span>
          </label>
        ))}
      </div>
    </div>
  );
};
