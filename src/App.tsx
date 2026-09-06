import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { MainLayout } from "./components/layout/MainLauout";
import DashboardPage from "./components/pages/DashboardPage";
import CurriculumsPage from "./components/pages/CurriculumsPage";
import ChaptersPage from "./components/pages/ChaptersPage";
import LessonsPage from "./components/pages/LessonsPage";
import ReviewPage from "./components/pages/ReviewPage";
import HistoryPage from "./components/pages/HistoryPage";
import QuizPage from "./components/pages/QuizPage";
import ResultPage from "./components/pages/ResultPage";
import NotFoundPage from "./components/pages/NotFoundPage";
import { useAppDispatch } from "./store";
import { useEffect } from "react";
import { fetchProgress } from "./store/progressSlice";
import { fetchQuizAttempts } from "./store/historySlice";
import { fetchCurriculum } from "./store/curriculumSlice";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: "/curriculums", element: <CurriculumsPage /> },
      { path: "/curriculums/:id", element: <ChaptersPage /> },
      { path: "/lessons/:id", element: <LessonsPage /> },
      { path: "/lessons/:id/quiz", element: <QuizPage /> },
      { path: "/lessons/:id/quiz/result", element: <ResultPage /> },
      { path: "/review", element: <ReviewPage /> },
      { path: "/history", element: <HistoryPage /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);

export function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchProgress());
    dispatch(fetchQuizAttempts());
    dispatch(fetchCurriculum());
  }, [dispatch]);

  return <RouterProvider router={router} />;
}

export default App;
