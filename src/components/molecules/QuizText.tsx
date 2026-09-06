import React from "react";
import type { QuestionText } from "../../types";
import { MarkdownRenderer } from "./MarkdownRenderer";
import { Input } from "../atoms/Input";

interface Props {
  question: QuestionText;
  userAnswer: string | undefined;
  onAnswerChange: (questionId: string, answer: string) => void;
}

export const QuizText: React.FC<Props> = ({
  question,
  userAnswer = "",
  onAnswerChange,
}) => {
  return (
    <div className="flex flex-col w-full gap-4">
      <MarkdownRenderer content={question.prompt} />
      <div>
        <Input
          value={userAnswer}
          onChange={(value) => onAnswerChange(question.id, value)}
          placeholder="回答を入力してください"
        />
      </div>
    </div>
  );
};
