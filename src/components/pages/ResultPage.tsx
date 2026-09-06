import { useEffect, useMemo } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import type { Question, QuizAttempt } from "../../types";
import { saveReviewMark } from "../../utils/storage";
import { Button } from "../atoms/Button";
import { ResultCard } from "../molecules/ResultCard";
import { LoadingView } from "../molecules/LoadingView";
import { ErrorView } from "../molecules/ErrorView";
import { useAppDispatch, useAppSelector } from "../../store";
import { fetchQuizAttempts } from "../../store/historySlice";
import {
  fetchCurriculum,
  selectResultPageData,
} from "../../store/curriculumSlice";

interface ResultPageProps {
  questions?: Question[];
  attempt?: QuizAttempt;
  lessonTitle?: string;
  onAddReview?: (questionId: string) => void;
}

const EMPTY_QUESTIONS: Question[] = [];

function ResultPage(props: ResultPageProps) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams<{ id: string }>();

  const stateAttemptId = location.state?.attemptId;
  const selectPageData = useMemo(
    () => selectResultPageData(id, stateAttemptId),
    [id, stateAttemptId],
  );
  const pageData = useAppSelector(selectPageData);

  const { isLoading: isQuizLoading, error: quizError } = useAppSelector(
    (state) => state.history,
  );
  const { isLoading: isCurriculumLoading, error: curriculumError } =
    useAppSelector((state) => state.curriculum);

  useEffect(() => {
    dispatch(fetchQuizAttempts());
    dispatch(fetchCurriculum());
  }, [dispatch]);

  if (isQuizLoading || isCurriculumLoading) return <LoadingView />;
  if (quizError || curriculumError) {
    return <ErrorView message={quizError || curriculumError || undefined} />;
  }

  const isReviewMode = location.state?.isReviewMode ?? false;
  const currentCurriculum = pageData?.currentCurriculum;
  const currentLesson = pageData?.currentLesson;
  const latestAttempt = pageData?.latestAttempt;
  const detailMap = pageData?.detailMap;

  const questions =
    props.questions ?? currentLesson?.quiz.questions ?? EMPTY_QUESTIONS;
  const attempt = props.attempt ?? latestAttempt;

  const handleAddReview =
    props.onAddReview ??
    ((questionId: string) => {
      if (!id) return;
      saveReviewMark({
        id: crypto.randomUUID(),
        lessonId: id,
        questionId,
        markedAt: new Date().toISOString(),
        resolved: false,
      });
    });

  const handleBackToCurriculum = () => {
    if (isReviewMode) {
      navigate("/review");
    } else if (currentCurriculum) {
      navigate(`/curriculums/${currentCurriculum.id}`);
    } else {
      navigate("/curriculums");
    }
  };

  const correctCount = attempt?.correctCount ?? 0;
  const totalCount = questions.length;
  const scorePercentage =
    totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0;

  const durationSec = attempt?.durationSec ?? 0;
  const minutes = Math.floor(durationSec / 60);
  const seconds = durationSec % 60;

  return (
    <div className="flex flex-col w-full h-auto mt-6 p-6 gap-2 bg-white rounded-lg border border-gray-200 shadow-md">
      <div>
        <div>
          <span>結果：</span>
          <span className="text-xl text-blue-700 font-bold">{`${correctCount} / ${totalCount} `}</span>
          <span>問正解</span>
          <span className="ml-1">{`(${scorePercentage}%)`}</span>
        </div>
        <p>{`所要時間: ${minutes}分${seconds}秒`}</p>
        <div className="flex  w-[85%] my-6 items-center justify-center gap-4 mx-auto">
          <div className="flex-1 border-t border-gray-600" />
          <span className="my-4 text-center font-bold text-gray-600">
            問題ごとの結果
          </span>
          <div className="flex-1 border-t border-gray-600" />
        </div>
      </div>
      <div className="flex flex-col gap-6">
        {questions.map((question) => (
          <ResultCard
            key={question.id}
            question={question}
            detail={detailMap?.get(question.id)}
            onAddReview={handleAddReview}
          />
        ))}
      </div>
      <div className="flex mt-8 justify-around">
        <Button
          label="もう一度挑戦"
          variant="normal"
          onClick={() => navigate(`/lessons/${id}/quiz`)}
        />
        <Button
          label="カリキュラムに戻る"
          variant="normal"
          onClick={handleBackToCurriculum}
        />
      </div>
    </div>
  );
}

export default ResultPage;
