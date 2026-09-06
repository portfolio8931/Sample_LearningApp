import { useEffect } from "react";
import { LoadingView } from "../molecules/LoadingView";
import { ErrorView } from "../molecules/ErrorView";
import { DailyStudyTimeChart } from "../organism/DailySutudyTimeChart";
import { AccuracyChart } from "../organism/AccuracyChart";
import { AttemptHistoryList } from "../organism/AttemptHistoryList";
import { useAppDispatch, useAppSelector } from "../../store";
import { fetchQuizAttempts, selectAllAttempts } from "../../store/historySlice";
import { fetchProgress } from "../../store/progressSlice";
import {
  fetchCurriculum,
  selectFormattedAttemptHistory,
} from "../../store/curriculumSlice";

function HistoryPage() {
  const dispatch = useAppDispatch();

  const attempts = useAppSelector(selectAllAttempts);
  const historyItems = useAppSelector(selectFormattedAttemptHistory);
  const { isLoading: isQuizLoading, error: quizError } = useAppSelector(
    (state) => state.history,
  );
  const { isLoading: isProgressLoading, error: progressError } = useAppSelector(
    (state) => state.progress,
  );
  const { isLoading: isCurriculumLoading, error: curriculumError } =
    useAppSelector((state) => state.curriculum);

  useEffect(() => {
    dispatch(fetchQuizAttempts());
    dispatch(fetchProgress());
    dispatch(fetchCurriculum());
  }, [dispatch]);

  if (isQuizLoading || isProgressLoading || isCurriculumLoading)
    return <LoadingView />;
  if (quizError || progressError || curriculumError) {
    return (
      <ErrorView
        message={quizError || progressError || curriculumError || undefined}
      />
    );
  }

  return (
    <div>
      <h2 className="mb-6 text-center text-2xl font-extrabold">学習履歴</h2>
      <div className="flex flex-col gap-6">
        <section>
          <h3 className="font-bold text-gray-600">▼ 日別学習時間 (直近7日)</h3>
          <DailyStudyTimeChart />
        </section>
        <section>
          <h3 className="font-bold text-gray-600">▼ 正答率の推移 (直近10回)</h3>
          <AccuracyChart />
        </section>
        <section>
          <h3 className="font-bold text-gray-600">▼ 回答履歴 (一覧)</h3>
          {attempts.length === 0 ? (
            <p className="my-2 text-center text-sm text-gray-500">
              学習履歴がありません
            </p>
          ) : (
            <AttemptHistoryList items={historyItems} />
          )}
        </section>
      </div>
    </div>
  );
}

export default HistoryPage;
