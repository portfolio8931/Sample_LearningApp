import { useEffect, useMemo } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Button } from "../atoms/Button";
import { LoadingView } from "../molecules/LoadingView";
import { ErrorView } from "../molecules/ErrorView";
import { MarkdownRenderer } from "../molecules/MarkdownRenderer";
import { useAppDispatch, useAppSelector } from "../../store";
import {
  completeLesson,
  startLesson,
  fetchProgress,
} from "../../store/progressSlice";
import { useLearningTimer } from "../../hooks/useLearningTimer";
import {
  fetchCurriculum,
  selectLessonsPageData,
} from "../../store/curriculumSlice";
import { showToast } from "../../store/uiSlice";

function LessonsPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { id } = useParams<{ id: string }>();

  const selectPageData = useMemo(() => selectLessonsPageData(id), [id]);
  const pageData = useAppSelector(selectPageData);

  const {
    items: progressList,
    isLoading: isProgressLoading,
    error: progressError,
  } = useAppSelector((state) => state.progress);
  const {
    items: curriculums,
    isLoading: isCurriculumLoading,
    error: curriculumError,
  } = useAppSelector((state) => state.curriculum);

  useEffect(() => {
    if (curriculums.length === 0 && !isCurriculumLoading) {
      dispatch(fetchCurriculum());
    }
    if (progressList.length === 0 && !isProgressLoading) {
      dispatch(fetchProgress());
    }

    if (!pageData || isProgressLoading || isCurriculumLoading) return;

    if (pageData.isNotStarted) {
      dispatch(startLesson({ lessonId: pageData.lesson.id }));
    }
  }, [
    pageData,
    isProgressLoading,
    isCurriculumLoading,
    curriculums.length,
    progressList.length,
    dispatch,
  ]);

  useLearningTimer({ lessonId: pageData?.lesson.id });

  if (isProgressLoading || isCurriculumLoading) return <LoadingView />;
  if (progressError || curriculumError) {
    return (
      <ErrorView message={progressError || curriculumError || undefined} />
    );
  }

  if (!pageData) {
    return (
      <div>
        <p>【ID:NotFound】該当単元が見つかりません</p>
        <Link to="/curriculums/">カリキュラム一覧へ戻る</Link>
      </div>
    );
  }

  const { lesson, parentCurriculum, isCompleted } = pageData;

  const handleComplete = () => {
    if (isCompleted) return;
    dispatch(completeLesson({ lessonId: lesson.id }));
    dispatch(
      showToast({
        message: "単元を完了にしました",
        type: "success",
      }),
    );
  };

  return (
    <div>
      <Link
        to={`/curriculums/${parentCurriculum.id}`}
        className="text-sm text-blue-600"
      >
        ←カリキュラム詳細へ戻る
      </Link>
      <h3 className="my-2 text-2xl font-bold text-gray-600">{lesson.title}</h3>
      <p className="text-gray-600">{`目安学習時間: 約${lesson.estimatedMinutes}分`}</p>
      <div className="flex flex-col w-full h-auto mt-6 p-6 gap-5 bg-white rounded-lg border border-gray-200 shadow-md">
        <div>
          <MarkdownRenderer content={lesson.contentMarkdown} />
        </div>
        <div className="flex justify-around">
          <Button
            label={isCompleted ? "完了済み" : "完了にする"}
            variant="mono"
            disabled={isCompleted}
            isActive={!isCompleted}
            onClick={handleComplete}
          />
          <Button
            label="確認問題へ →"
            variant="normal"
            onClick={() => navigate(`/lessons/${lesson.id}/quiz`)}
          />
        </div>
      </div>
    </div>
  );
}

export default LessonsPage;
