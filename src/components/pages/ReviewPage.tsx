import { useEffect } from "react";
import { ReviewCard } from "../molecules/ReviewCard";
import { LoadingView } from "../molecules/LoadingView";
import { ErrorView } from "../molecules/ErrorView";
import { useAppDispatch, useAppSelector } from "../../store";
import { fetchCurriculum } from "../../store/curriculumSlice";
import {
  selectReviewPageData,
  fetchReviewMarks,
} from "../../store/reviewSlice";

function ReviewPage() {
  const dispatch = useAppDispatch();
  const { isLoading: isCurriculumLoading, error: curriculumError } =
    useAppSelector((state) => state.curriculum);
  const { questions, marksByLesson, totalCount } =
    useAppSelector(selectReviewPageData);

  useEffect(() => {
    dispatch(fetchCurriculum());
    dispatch(fetchReviewMarks());
  }, [dispatch]);

  if (isCurriculumLoading) return <LoadingView />;
  if (curriculumError) {
    return <ErrorView message={curriculumError || undefined} />;
  }

  return (
    <div>
      <h2 className="text-center text-2xl font-extrabold">
        復習リスト ({totalCount}件)
      </h2>
      {marksByLesson.length === 0 ? (
        <p className="mt-6 text-center">復習が必要な問題はありません。</p>
      ) : (
        marksByLesson.map(({ lesson, marks }) => (
          <ReviewCard
            key={lesson.id}
            lesson={lesson}
            marks={marks}
            questions={questions}
          />
        ))
      )}
    </div>
  );
}

export default ReviewPage;
