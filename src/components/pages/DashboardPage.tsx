import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "../atoms/Button";
import { Progressbar } from "../atoms/Progressbar";
import { LoadingView } from "../molecules/LoadingView";
import { ErrorView } from "../molecules/ErrorView";
import { AttemptHistoryList } from "../organism/AttemptHistoryList";
import { useAppDispatch, useAppSelector } from "../../store";
import { resetProgress } from "../../store/progressSlice";
import { showToast } from "../../store/uiSlice";
import { fetchQuizAttempts } from "../../store/historySlice";
import { fetchProgress } from "../../store/progressSlice";
import {
  fetchCurriculum,
  selectDashboardPageData,
  selectFormattedAttemptHistory,
} from "../../store/curriculumSlice";

function DashboardPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const dashboadData = useAppSelector(selectDashboardPageData);
  const historyItems = useAppSelector(selectFormattedAttemptHistory);
  const recentItems = historyItems.slice(0, 5);

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

  const {
    allLessons,
    total,
    current,
    percentage,
    recommendedLesson,
    recentAttempts,
  } = dashboadData;

  const handleAllReset = () => {
    if (window.confirm("学習データをリセットしてよろしいですか？")) {
      dispatch(resetProgress());
      dispatch(
        showToast({
          message: "学習データをリセットしました",
          type: "success",
        }),
      );
    }
  };

  return (
    <div>
      <h2 className="text-center text-2xl font-extrabold">ダッシュボード</h2>
      <div className="flex flex-col w-full h-auto mt-6 p-6 gap-2 bg-white rounded-lg border border-gray-200 shadow-md">
        <h3 className="font-bold text-gray-600">全体進捗</h3>
        <div className="flex gap-2 items-end">
          <p>
            <span className="text-4xl font-bold">{percentage}</span>
            <span className="text-3xl font-bold">％</span>
          </p>
          <p>
            ({current} / {total} 単元完了)
          </p>
        </div>
        <Progressbar current={current} total={total} />
      </div>
      <div className="flex flex-col w-full h-auto mt-6 p-6 gap-2 bg-white rounded-lg border border-gray-200 shadow-md">
        <h3 className="font-bold text-gray-600">今日のおすすめ単元</h3>
        <div>
          {allLessons.length === 0 ? (
            <p>学習可能な単元がありません</p>
          ) : !recommendedLesson ? (
            <p>全カリキュラム完了</p>
          ) : (
            <div className="flex items-center gap-16">
              <p>{recommendedLesson.title}</p>
              <Button
                label="学習をはじめる"
                isActive={true}
                variant="normal"
                onClick={() => navigate(`/lessons/${recommendedLesson.id}`)}
              />
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-col w-full h-auto mt-6 p-6 gap-2 bg-white rounded-lg border border-gray-200 shadow-md">
        <div className="flex justify-between">
          <h3 className="mb-3 font-bold text-gray-600">最近の学習</h3>
          <Link to="/history" className="text-sm text-blue-600">
            履歴をすべて見る →
          </Link>
        </div>
        {recentAttempts.length === 0 ? (
          <p className="my-2 text-center">学習履歴がありません</p>
        ) : (
          <AttemptHistoryList items={recentItems} />
        )}
      </div>
      <div className="flex mt-6 justify-end">
        <Button
          label="学習データリセット"
          variant="alert"
          onClick={handleAllReset}
        />
      </div>
    </div>
  );
}

export default DashboardPage;
