import type { AnswerType, Question } from "../../types";
import { QuizSingle } from "../molecules/QuizSingle";
import { QuizMulti } from "../molecules/QuizMulti";
import { QuizText } from "../molecules/QuizText";
import { Button } from "../atoms/Button";

interface QuizAllCardProps {
  questions: Question[];
  userAnswers: Record<string, AnswerType>;
  onAnswerChange: (questionId: string, answer: AnswerType) => void;
  onSubmit: () => void;
}

export const QuizAllCard = ({
  questions,
  userAnswers,
  onAnswerChange,
  onSubmit,
}: QuizAllCardProps) => {
  return (
    <div>
      {questions.map((question, index) => (
        <div key={question.id} className="flex my-6 gap-2">
          <div className="font-bold text-gray-600">{index + 1}</div>
          {question.type === "single" && (
            <QuizSingle
              question={question}
              userAnswer={userAnswers[question.id] as number | undefined}
              onAnswerChange={onAnswerChange}
            />
          )}
          {question.type === "multi" && (
            <QuizMulti
              question={question}
              userAnswer={userAnswers[question.id] as number[] | undefined}
              onAnswerChange={onAnswerChange}
            />
          )}
          {question.type === "text" && (
            <QuizText
              question={question}
              userAnswer={userAnswers[question.id] as string | undefined}
              onAnswerChange={onAnswerChange}
            />
          )}
        </div>
      ))}
      <div className="flex justify-end">
        <Button label="送信する" variant="normal" onClick={onSubmit} />
      </div>
    </div>
  );
};
