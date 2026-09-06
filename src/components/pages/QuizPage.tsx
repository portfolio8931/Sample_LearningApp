import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams, useNavigate, useLocation } from "react-router-dom";
import type { AnswerType, Question } from "../../types";
import { Button } from "../atoms/Button";
import { LoadingView } from "../molecules/LoadingView";
import { ErrorView } from "../molecules/ErrorView";
import { QuizSingleCard } from "../organism/QuizSingleCard";
import { QuizAllCard } from "../organism/QuizAllCard";
import { useAppDispatch, useAppSelector } from "../../store";
import {
  addAttempt,
  fetchQuizAttempts,
  buildQuizAttempt,
} from "../../store/historySlice";
import {
  fetchCurriculum,
  selectQuizPageData,
} from "../../store/curriculumSlice";

type DisplayMode = "single" | "all";
const EMPTY_ARRAY: Question[] = [];

function QuizPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const startTimeRef = useRef<number>(0);
  const { id } = useParams<{ id: string }>();

  const selectPageData = useMemo(() => selectQuizPageData(id), [id]);
  const pageData = useAppSelector(selectPageData);

  const { isLoading: isQuizLoading, error: quizError } = useAppSelector(
    (state) => state.history,
  );
  const { isLoading: isCurriculumLoading, error: curriculumError } =
    useAppSelector((state) => state.curriculum);

  const [displayMode, setDisplayMode] = useState<DisplayMode>("single");
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, AnswerType>>(
    {},
  );

  const lesson = pageData?.lesson;
  const parentCurriculum = pageData?.parentCurriculum;
  const questions = lesson?.quiz.questions ?? EMPTY_ARRAY;

  useEffect(() => {
    startTimeRef.current = Date.now();
    dispatch(fetchQuizAttempts());
    dispatch(fetchCurriculum());
  }, [dispatch]);

  const handleAnswerChange = (questionId: string, answer: AnswerType) => {
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  /* エラーメッセージ */
  const unAnswerErrorMessage = (
    question: Question,
    userAnswer: AnswerType,
  ): string | null => {
    if (question.type === "single") {
      if (userAnswer === undefined || userAnswer === null) {
        return "選択肢を選んでください";
      }
    }
    if (question.type === "multi") {
      if (!Array.isArray(userAnswer) || userAnswer.length === 0) {
        return "選択肢を1つ以上選んでください";
      }
    }
    if (question.type === "text") {
      if (typeof userAnswer !== "string" || userAnswer.trim() === "") {
        return "回答を記入してください";
      }
    }
    return null;
  };

  /* 問題切り替え、解答送信 */
  const handleNext = () => {
    const currentQ = questions[currentIndex];
    const errMsg = unAnswerErrorMessage(currentQ, userAnswers[currentQ.id]);

    if (errMsg) {
      alert(errMsg);
      return;
    }
    setCurrentIndex((prev) => Math.min(prev + 1, questions.length - 1));
  };

  const handleSubmit = useCallback(() => {
    const errorMessages: string[] = [];
    let firstUnAnswerIndex: number | null = null;

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      const errMsg = unAnswerErrorMessage(q, userAnswers[q.id]);
      if (errMsg) {
        errorMessages.push(`【問題${i + 1}】 ${errMsg}`);
        if (firstUnAnswerIndex === null) {
          firstUnAnswerIndex = i;
        }
      }
    }

    if (errorMessages.length > 0) {
      alert(errorMessages.join("\n"));
      if (displayMode === "single" && firstUnAnswerIndex !== null) {
        setCurrentIndex(firstUnAnswerIndex);
      }
      return;
    }

    const endTime = Date.now();
    const durationSec = Math.floor((endTime - startTimeRef.current) / 1000);

    const newAttempt = buildQuizAttempt(
      id ?? "",
      questions,
      userAnswers,
      durationSec,
    );

    dispatch(addAttempt(newAttempt));
    const isReviewMode = location.state?.isReviewMode ?? false;

    navigate(`/lessons/${id}/quiz/result`, {
      state: { attemptId: newAttempt.id, isReviewMode },
    });
  }, [
    questions,
    userAnswers,
    id,
    navigate,
    dispatch,
    displayMode,
    location.state,
  ]);

  /* ショートカット */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (document.hidden || !document.hasFocus()) return;
      if (e.isComposing) return;

      const target = e.target as HTMLElement | null;
      const isTextInput =
        target &&
        (target.tagName === "TEXTAREA" ||
          (target.tagName === "INPUT" &&
            (target as HTMLInputElement).type === "text") ||
          target.isContentEditable);
      if (isTextInput) return;

      if (displayMode === "single") {
        if (e.key === "j" || e.key === "J") {
          e.preventDefault();
          const currentQ = questions[currentIndex];
          const errMsg = unAnswerErrorMessage(
            currentQ,
            userAnswers[currentQ.id],
          );

          if (errMsg) {
            alert(errMsg);
            return;
          }

          setCurrentIndex((prev) => Math.min(prev + 1, questions.length - 1));
        } else if (e.key === "k" || e.key === "K") {
          e.preventDefault();
          setCurrentIndex((prev) => Math.max(prev - 1, 0));
        } else if (e.key === "Enter") {
          e.preventDefault();
          const currentQ = questions[currentIndex];
          const errMsg = unAnswerErrorMessage(
            currentQ,
            userAnswers[currentQ.id],
          );

          if (errMsg) {
            alert(errMsg);
            return;
          }

          if (currentIndex === questions.length - 1) {
            handleSubmit();
          } else {
            setCurrentIndex((prev) => prev + 1);
          }
        }
      } else if (displayMode === "all") {
        if (e.key === "Enter") {
          e.preventDefault();
          handleSubmit();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [displayMode, currentIndex, questions, userAnswers, handleSubmit]);

  if (isQuizLoading || isCurriculumLoading) return <LoadingView />;
  if (quizError || curriculumError) {
    return <ErrorView message={quizError || curriculumError || undefined} />;
  }

  if (!lesson || !parentCurriculum) {
    return (
      <div>
        <p>【ID:NouFound】該当する単元の問題が見つかりませんでした</p>
        <Link to="/curriculums">カリキュラム一覧へ戻る</Link>
      </div>
    );
  }

  return (
    <div>
      <h2 className="mb-3 text-center text-2xl font-extrabold">{`${lesson.title} -確認問題`}</h2>
      <div className="flex items-end justify-between">
        {displayMode === "single" ? (
          <p className="font-bold text-gray-600">{`問題 ${currentIndex + 1} / ${questions.length}`}</p>
        ) : (
          <p className="font-bold text-gray-600">{`全${questions.length}問`}</p>
        )}
        <div className="flex gap-4">
          <Button
            label="1問ずつ"
            variant="normal"
            isActive={displayMode !== "single"}
            onClick={() => setDisplayMode("single")}
          />
          <Button
            label="一括"
            variant="normal"
            isActive={displayMode !== "all"}
            onClick={() => setDisplayMode("all")}
          />
        </div>
      </div>
      <div className="flex flex-col w-full h-auto mt-6 p-6 gap-6 bg-white rounded-lg border border-gray-200 shadow-md">
        {displayMode === "single" ? (
          <QuizSingleCard
            question={questions[currentIndex]}
            currentIndex={currentIndex}
            totalQuestions={questions.length}
            userAnswers={userAnswers}
            onAnswerChange={handleAnswerChange}
            onNext={handleNext}
            onPrev={() => setCurrentIndex((prev) => Math.max(prev - 1, 0))}
            onSubmit={handleSubmit}
          />
        ) : (
          <QuizAllCard
            questions={questions}
            userAnswers={userAnswers}
            onAnswerChange={handleAnswerChange}
            onSubmit={handleSubmit}
          />
        )}
        {displayMode === "single" ? (
          <p className="text-xs text-gray-500">
            キーボードショートカット：J＝次 / K=前 / Enter＝次または送信
          </p>
        ) : (
          <p className="text-xs text-gray-500">
            キーボードショートカット：Enter＝送信
          </p>
        )}
      </div>
    </div>
  );
}

export default QuizPage;
