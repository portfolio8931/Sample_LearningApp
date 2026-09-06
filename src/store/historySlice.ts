import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
} from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { QuizAttempt, AnswerType, Question } from "../types";
import type { RootState } from "../store";
import { checkAnswer } from "../utils/checkAnswer";
import { updateReviewMarksStatus } from "../utils/storage";

const STORAGE_KEY = "lma:quiz_attempts";

export const attemptsAdapter = createEntityAdapter<QuizAttempt, string>({
  selectId: (attempt) => attempt.id,
});

export const fetchQuizAttempts = createAsyncThunk(
  "history/fetchQuizAttempts",
  async () => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? (JSON.parse(saved) as QuizAttempt[]) : [];
  },
);

export const historySlice = createSlice({
  name: "history",
  initialState: attemptsAdapter.getInitialState({
    isLoading: false,
    error: null as string | null,
  }),
  reducers: {
    addAttempt: (state, action: PayloadAction<QuizAttempt>) => {
      attemptsAdapter.addOne(state, action.payload);
      const allAttempts = Object.values(state.entities).filter(
        (item): item is QuizAttempt => item !== undefined,
      );
      localStorage.setItem(STORAGE_KEY, JSON.stringify(allAttempts));
    },
    resetAttempts: (state) => {
      attemptsAdapter.removeAll(state);
      localStorage.removeItem(STORAGE_KEY);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchQuizAttempts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchQuizAttempts.fulfilled, (state, action) => {
        state.isLoading = false;
        attemptsAdapter.setAll(state, action.payload);
      })
      .addCase(fetchQuizAttempts.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.error.message ?? "クイズ履歴の読み込みに失敗しました";
      });
  },
});

export const { addAttempt, resetAttempts } = historySlice.actions;

export const { selectAll: selectAllAttempts, selectById: selectAttemptById } =
  attemptsAdapter.getSelectors(
    (state: { history: ReturnType<typeof historySlice.reducer> }) =>
      state.history,
  );

export const buildQuizAttempt = (
  lessonId: string,
  questions: Question[],
  userAnswers: Record<string, AnswerType>,
  durationSec: number,
): QuizAttempt => {
  const details = questions.map((q) => {
    const isCorrect = checkAnswer(q, userAnswers[q.id]);
    if (lessonId) {
      updateReviewMarksStatus(lessonId, q.id, isCorrect);
    }
    return {
      questionId: q.id,
      isCorrect,
      userAnswer: userAnswers[q.id] ?? null,
    };
  });

  const correctCount = details.filter((d) => d.isCorrect).length;

  return {
    id: crypto.randomUUID(),
    lessonId,
    attemptedAt: new Date().toISOString(),
    totalQuestions: questions.length,
    correctCount,
    durationSec,
    mode: "normal",
    details,
  };
};

const getLocalDateString = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const selectDailyStudyTimeChartData = createSelector(
  [selectAllAttempts, (state: RootState) => state.progress.items],
  (attempts, progressList) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const targetWeek = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(today);
      d.setDate(today.getDate() - (6 - i));
      return getLocalDateString(d);
    });

    return targetWeek.map((dateStr) => {
      const quizSec = attempts
        .filter((att) => {
          if (!att.attemptedAt) return false;
          const attDateStr = getLocalDateString(new Date(att.attemptedAt));
          return attDateStr === dateStr;
        })
        .reduce((sum, att) => sum + (att.durationSec ?? 0), 0);
      const quizMin = quizSec / 60;

      const lessonMin = progressList.reduce((sum, p) => {
        const dayMinutes = p.dailyLogs?.[dateStr] ?? 0;
        return sum + dayMinutes;
      }, 0);

      const totalMinutes = quizMin + lessonMin;

      const [, month, day] = dateStr.split("-").map(Number);
      const label = `${month}/${day}`;

      return {
        label,
        minutes: Math.round(totalMinutes),
      };
    });
  },
);

export const selectAccuracyChartData = createSelector(
  [selectAllAttempts],
  (attempts) => {
    const sortedAttempts = [...attempts]
      .sort(
        (a, b) =>
          new Date(a.attemptedAt).getTime() - new Date(b.attemptedAt).getTime(),
      )
      .slice(-10);

    return sortedAttempts.map((att, idx) => {
      const accuracy =
        att.totalQuestions > 0
          ? Math.round((att.correctCount / att.totalQuestions) * 100)
          : 0;
      return {
        name: `${idx + 1}`,
        accuracy,
        date: new Date(att.attemptedAt).toLocaleDateString(),
      };
    });
  },
);

export default historySlice.reducer;
