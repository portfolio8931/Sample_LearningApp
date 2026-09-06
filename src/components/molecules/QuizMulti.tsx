import React from "react";
import type { QuestionMulti } from "../../types";
import { MarkdownRenderer } from "./MarkdownRenderer";

interface Props {
  question: QuestionMulti;
  userAnswer: number[] | undefined;
  onAnswerChange: (questionId: string, answer: number[]) => void;
}

export const QuizMulti: React.FC<Props> = ({
  question,
  userAnswer = [],
  onAnswerChange,
}) => {
  const handleToggle = (index: number) => {
    if (userAnswer.includes(index)) {
      onAnswerChange(
        question.id,
        userAnswer.filter((i) => i !== index),
      );
    } else {
      onAnswerChange(question.id, [...userAnswer, index]);
    }
  };

  return (
    <div>
      <MarkdownRenderer content={question.prompt} />
      <div className="flex flex-col mt-3 gap-1">
        {question.choices.map((choice, idx) => (
          <label key={idx} className="flex gap-1">
            <input
              type="checkbox"
              name={`question-${question.id}`}
              checked={userAnswer.includes(idx)}
              onChange={() => handleToggle(idx)}
            />
            <span>{choice}</span>
          </label>
        ))}
      </div>
    </div>
  );
};
