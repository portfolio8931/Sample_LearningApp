import React from "react";
import type { AnswerType, Question } from "../../types";
import { QuizSingle } from "../molecules/QuizSingle";
import { QuizMulti } from "../molecules/QuizMulti";
import { QuizText } from "../molecules/QuizText";
import { Button } from "../atoms/Button";

interface QuizSingleCardProps {
  question: Question;
  currentIndex: number;
  totalQuestions: number;
  userAnswers: Record<string, AnswerType>;
  onAnswerChange: (questionId: string, answer: AnswerType) => void;
  onNext: () => void;
  onPrev: () => void;
  onSubmit: () => void;
}

export const QuizSingleCard: React.FC<QuizSingleCardProps> = ({
  question,
  currentIndex,
  totalQuestions,
  userAnswers,
  onAnswerChange,
  onNext,
  onPrev,
  onSubmit,
}: QuizSingleCardProps) => {
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === totalQuestions - 1;
  const currentAnswer = userAnswers[question.id];

  return (
    <div>
      <div>
        {question.type === "single" && (
          <QuizSingle
            question={question}
            userAnswer={currentAnswer as number | undefined}
            onAnswerChange={onAnswerChange}
          />
        )}
        {question.type === "multi" && (
          <QuizMulti
            question={question}
            userAnswer={currentAnswer as number[] | undefined}
            onAnswerChange={onAnswerChange}
          />
        )}
        {question.type === "text" && (
          <QuizText
            question={question}
            userAnswer={currentAnswer as string | undefined}
            onAnswerChange={onAnswerChange}
          />
        )}
      </div>
      <div className="flex mt-8 justify-around">
        <Button
          label="← 前の問題"
          variant="mono"
          onClick={onPrev}
          disabled={isFirst}
          isActive={!isFirst}
        />
        {isLast ? (
          <Button label="送信する" variant="normal" onClick={onSubmit} />
        ) : (
          <Button label="次の問題 →" variant="normal" onClick={onNext} />
        )}
      </div>
    </div>
  );
};
