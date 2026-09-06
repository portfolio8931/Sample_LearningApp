import {
  createSlice,
  createAsyncThunk,
  createSelector,
} from "@reduxjs/toolkit";
import type { Curriculum, Question } from "../types";
import type { RootState } from "./index";
import { calcProgressPercentage } from "../utils/calcProgressPercentage";
import { selectAllAttempts } from "./historySlice";

interface CurriculumState {
  items: Curriculum[];
  isLoading: boolean;
  error: string | null;
}

const initialState: CurriculumState = {
  items: [],
  isLoading: true,
  error: null,
};

export const fetchCurriculum = createAsyncThunk(
  "curriculum/fetchCurriculum",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch("/data/curriculum.json");
      if (!response.ok) {
        throw new Error("HTTP error");
      }

      const data = await response.json();
      return data as Curriculum[];
    } catch {
      return rejectWithValue("初期JSONの読み込みに失敗しました");
    }
  },
);

export const curriculumSlice = createSlice({
  name: "curriculum",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCurriculum.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCurriculum.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(fetchCurriculum.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          (action.payload as string) ?? "初期JSONの読み込みに失敗しました";
      });
  },
});

export const selectChapterPageData = (id: string | undefined) =>
  createSelector(
    [
      (state: RootState) => state.curriculum.items,
      (state: RootState) => state.progress.items,
    ],
    (curriculums, progressList) => {
      const curriculum = curriculums.find((c) => c.id === id);
      if (!curriculum) return null;

      const lessonIdsInCurriculum = new Set(
        curriculum.chapters.flatMap((chapter) =>
          chapter.lessons.map((lesson) => lesson.id),
        ),
      );

      const lessonStatus = progressList.reduce<
        Record<string, "not_started" | "in_progress" | "completed">
      >((acc, item) => {
        acc[item.lessonId] = item.status;
        return acc;
      }, {});

      const current = progressList.filter(
        (p) =>
          lessonIdsInCurriculum.has(p.lessonId) && p.status === "completed",
      ).length;
      const total = curriculum.chapters.reduce(
        (acc, chapter) => acc + chapter.lessons.length,
        0,
      );
      const percentage = calcProgressPercentage(current, total);

      const chapterCompletedMap = curriculum.chapters.reduce<
        Record<string, number>
      >((acc, chapter) => {
        acc[chapter.id] = chapter.lessons.filter(
          (lesson) => lessonStatus[lesson.id] === "completed",
        ).length;
        return acc;
      }, {});

      return {
        curriculum,
        lessonStatus,
        current,
        total,
        percentage,
        chapterCompletedMap,
      };
    },
  );

export const selectCurriculumsPageData = createSelector(
  [
    (state: RootState) => state.curriculum.items,
    (state: RootState) => state.progress.items,
  ],
  (curriculums, progressList) => {
    const completedLessonIds = new Set(
      progressList
        .filter((p) => p.status === "completed")
        .map((p) => p.lessonId),
    );
    const curriculumsWithProgress = curriculums.map((curriculum) => {
      const lessonIdsInCurriculum = curriculum.chapters.flatMap((chapter) =>
        chapter.lessons.map((lesson) => lesson.id),
      );
      const total = lessonIdsInCurriculum.length;
      const current = lessonIdsInCurriculum.filter((id) =>
        completedLessonIds.has(id),
      ).length;
      const percentage = calcProgressPercentage(current, total);
      return {
        curriculum,
        current,
        total,
        percentage,
      };
    });
    return curriculumsWithProgress;
  },
);

export const selectLessonsPageData = (id: string | undefined) =>
  createSelector(
    [
      (state: RootState) => state.curriculum.items,
      (state: RootState) => state.progress.items,
    ],
    (curriculums, progressList) => {
      if (!id) return null;

      const allLessons = curriculums
        .flatMap((c) => c.chapters)
        .flatMap((chap) => chap.lessons);
      const lesson = allLessons.find((l) => l.id === id);

      const parentCurriculum = curriculums.find((c) =>
        c.chapters.some((chap) => chap.lessons.some((l) => l.id === id)),
      );

      if (!lesson || !parentCurriculum) return null;

      const currentProgress = progressList.find(
        (p) => p.lessonId === lesson.id,
      );
      const isCompleted = currentProgress?.status === "completed";
      const isNotStarted =
        !currentProgress || currentProgress.status === "not_started";

      return {
        lesson,
        parentCurriculum,
        isCompleted,
        isNotStarted,
      };
    },
  );

const EMPTY_QUESTIONS: Question[] = [];

export const selectQuizPageData = (id: string | undefined) =>
  createSelector(
    [(state: RootState) => state.curriculum.items],
    (curriculums) => {
      if (!id) return null;

      const allLessons = curriculums
        .flatMap((c) => c.chapters)
        .flatMap((chap) => chap.lessons);
      const lesson = allLessons.find((l) => l.id === id);

      const parentCurriculum = curriculums.find((c) =>
        c.chapters.some((chap) => chap.lessons.some((l) => l.id === id)),
      );

      if (!lesson || !parentCurriculum) return null;

      const questions = lesson.quiz?.questions ?? EMPTY_QUESTIONS;

      return {
        lesson,
        parentCurriculum,
        questions,
      };
    },
  );

export const selectResultPageData = (
  id: string | undefined,
  stateAttemptId: string | undefined,
) =>
  createSelector(
    [(state: RootState) => state.curriculum.items, selectAllAttempts],
    (curriculums, attempts) => {
      if (!id) return null;

      const currentCurriculum = curriculums.find((c) =>
        c.chapters.some((chap) => chap.lessons.some((l) => l.id === id)),
      );

      const allLessons = curriculums
        .flatMap((c) => c.chapters)
        .flatMap((chap) => chap.lessons);
      const currentLesson = allLessons.find((l) => l.id === id);

      const latestAttempt =
        attempts.find((a) => a.id === stateAttemptId) ?? attempts[0];

      const detailMap = new Map(
        latestAttempt?.details.map((d) => [d.questionId, d]) ?? [],
      );

      return {
        currentCurriculum,
        currentLesson,
        latestAttempt,
        detailMap,
      };
    },
  );

export const selectHistoryPageData = createSelector(
  [(state: RootState) => state.curriculum.items],
  (curriculums) => {
    const allLessons = curriculums
      .flatMap((c) => c.chapters)
      .flatMap((chap) => chap.lessons);

    return {
      allLessons,
    };
  },
);

export const selectDashboardPageData = createSelector(
  [
    (state: RootState) => state.curriculum.items,
    (state: RootState) => state.progress.items,
    selectAllAttempts,
  ],
  (curriculums, progressList, attempts) => {
    const allLessons = curriculums
      .flatMap((c) => c.chapters)
      .flatMap((chap) => chap.lessons);

    const total = allLessons.length;
    const current = progressList.filter((p) => p.status === "completed").length;
    const percentage = calcProgressPercentage(current, total);

    const inProgressIds = new Set(
      progressList
        .filter((p) => p.status === "in_progress")
        .map((p) => p.lessonId),
    );
    const completedIds = new Set(
      progressList
        .filter((p) => p.status === "completed")
        .map((p) => p.lessonId),
    );

    const recommendedLesson =
      allLessons.find((l) => inProgressIds.has(l.id)) ??
      allLessons.find((l) => !completedIds.has(l.id)) ??
      null;

    const recentAttempts = [...attempts]
      .sort(
        (a, b) =>
          new Date(b.attemptedAt).getTime() - new Date(a.attemptedAt).getTime(),
      )
      .slice(0, 5);

    return {
      allLessons,
      total,
      current,
      percentage,
      recommendedLesson,
      recentAttempts,
    };
  },
);

export const selectFormattedAttemptHistory = createSelector(
  [selectAllAttempts, (state: RootState) => state.curriculum.items],
  (attempts, curriculums) => {
    const allLessons = curriculums
      .flatMap((c) => c.chapters)
      .flatMap((chap) => chap.lessons);

    const sorted = [...attempts].sort(
      (a, b) =>
        new Date(b.attemptedAt).getTime() - new Date(a.attemptedAt).getTime(),
    );

    return sorted.map((attempt) => {
      const lesson = allLessons.find((l) => l.id === attempt.lessonId);
      const lessonTitle = lesson?.title ?? "不明な単元";

      const dateObj = new Date(attempt.attemptedAt);
      const formattedDate = `${dateObj.getMonth() + 1}/${dateObj.getDate()} ${String(
        dateObj.getHours(),
      ).padStart(2, "0")}:${String(dateObj.getMinutes()).padStart(2, "0")}`;

      return {
        id: attempt.id,
        lessonId: attempt.lessonId,
        lessonTitle,
        formattedDate,
        correctCount: attempt.correctCount,
        totalQuestions: attempt.totalQuestions,
      };
    });
  },
);

export default curriculumSlice.reducer;
