import { useEffect } from "react";
import { CurriculumCard } from "../molecules/CurriculumCard";
import { LoadingView } from "../molecules/LoadingView";
import { ErrorView } from "../molecules/ErrorView";
import { useAppDispatch, useAppSelector } from "../../store";
import { fetchProgress } from "../../store/progressSlice";
import {
  fetchCurriculum,
  selectCurriculumsPageData,
} from "../../store/curriculumSlice";

function CurriculumsPage() {
  const dispatch = useAppDispatch();
  const curriculumsWithProgress = useAppSelector(selectCurriculumsPageData);

  const { isLoading: isProgressLoading, error: progressError } = useAppSelector(
    (state) => state.progress,
  );
  const { isLoading: isCurriculumLoading, error: curriculumError } =
    useAppSelector((state) => state.curriculum);

  useEffect(() => {
    dispatch(fetchProgress());
    dispatch(fetchCurriculum());
  }, [dispatch]);

  if (isProgressLoading || isCurriculumLoading) return <LoadingView />;
  if (progressError || curriculumError) {
    return (
      <ErrorView message={progressError || curriculumError || undefined} />
    );
  }

  return (
    <div>
      <h2 className="text-center text-2xl font-extrabold">カリキュラム一覧</h2>
      <div>
        {curriculumsWithProgress.map(
          ({ curriculum, current, total, percentage }) => (
            <CurriculumCard
              key={curriculum.id}
              curriculum={curriculum}
              current={current}
              total={total}
              percentage={percentage}
            />
          ),
        )}
      </div>
    </div>
  );
}

export default CurriculumsPage;
