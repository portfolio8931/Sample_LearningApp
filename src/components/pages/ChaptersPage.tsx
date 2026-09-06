import { useEffect, useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { Progressbar } from "../atoms/Progressbar";
import { ChapterCard } from "../molecules/ChapterCard";
import { LoadingView } from "../molecules/LoadingView";
import { ErrorView } from "../molecules/ErrorView";
import { useAppDispatch, useAppSelector } from "../../store";
import { fetchProgress } from "../../store/progressSlice";
import {
  fetchCurriculum,
  selectChapterPageData,
} from "../../store/curriculumSlice";

function ChaptersPage() {
  const dispatch = useAppDispatch();
  const { id } = useParams<{ id: string }>();
  const selectPageData = useMemo(() => selectChapterPageData(id), [id]);
  const pageData = useAppSelector(selectPageData);

  const { isLoading: isProgressLoading, error: progressError } = useAppSelector(
    (state) => state.progress,
  );
  const { isLoading: isCurriculumLoading, error: curriculumError } =
    useAppSelector((state) => state.curriculum);

  useEffect(() => {
    dispatch(fetchCurriculum());
    dispatch(fetchProgress());
  }, [dispatch]);

  if (isProgressLoading || isCurriculumLoading) return <LoadingView />;
  if (progressError || curriculumError) {
    return (
      <ErrorView message={progressError || curriculumError || undefined} />
    );
  }

  if (!pageData || !pageData.curriculum) {
    return (
      <div className="text-center mt-10">
        <p className="mb-6">
          【ID:NotFound】該当するカリキュラムが見つかりませんでした
        </p>
        <Link to="/curriculums" className="text-sm text-blue-600 underline">
          カリキュラム一覧へ戻る
        </Link>
      </div>
    );
  }

  const {
    curriculum,
    lessonStatus,
    current,
    total,
    percentage,
    chapterCompletedMap,
  } = pageData;

  return (
    <div>
      <Link to="/curriculums" className="text-sm text-blue-600">
        ← カリキュラム一覧へ戻る
      </Link>
      <h2 className="my-2 text-center text-2xl font-extrabold">
        {curriculum.title}
      </h2>
      <p>{curriculum.description}</p>
      <div className="flex flex-col mt-2 gap-1">
        <p>{`進捗: ${current} / ${total} (${percentage}％)`}</p>
        <Progressbar current={current} total={total} />
      </div>
      <div>
        {curriculum.chapters.map((chapter) => (
          <ChapterCard
            key={chapter.id}
            chapter={chapter}
            lessonStatus={lessonStatus}
            completedCount={chapterCompletedMap[chapter.id] || 0}
            totalCount={chapter.lessons.length}
          />
        ))}
      </div>
    </div>
  );
}

export default ChaptersPage;
