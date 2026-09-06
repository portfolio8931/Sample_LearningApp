import { describe, it, expect, beforeEach, vi } from "vitest";
import historyReducer, {
  addAttempt,
  resetAttempts,
  fetchQuizAttempts,
  buildQuizAttempt,
  selectDailyStudyTimeChartData,
  selectAccuracyChartData,
  selectAllAttempts,
  selectAttemptById,
} from "../historySlice";
import type { QuizAttempt, Question } from "../../types";
import type { RootState } from "../index";

const mockAttempt: QuizAttempt = {
  id: "att-1",
  lessonId: "less-1",
  attemptedAt: new Date().toISOString(),
  totalQuestions: 2,
  correctCount: 2,
  durationSec: 120,
  mode: "normal",
  details: [
    { questionId: "q1", isCorrect: true, userAnswer: 0 },
    { questionId: "q2", isCorrect: true, userAnswer: 1 },
  ],
};

describe("historySlice reducers & extraReducers", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("addAttempt", () => {
    const initialState = historyReducer(undefined, { type: "unknown" });
    const nextState = historyReducer(initialState, addAttempt(mockAttempt));

    expect(nextState.ids).toContain("att-1");
    expect(nextState.entities["att-1"]).toEqual(mockAttempt);
    expect(localStorage.getItem("lma:quiz_attempts")).not.toBeNull();
  });

  it("resetAttempts", () => {
    const initialState = historyReducer(undefined, addAttempt(mockAttempt));
    const nextState = historyReducer(initialState, resetAttempts());

    expect(nextState.ids).toHaveLength(0);
    expect(localStorage.getItem("lma:quiz_attempts")).toBeNull();
  });

  it("extraReducers: fetchQuizAttempts (pending, fulfilled, rejected)", () => {
    let state = historyReducer(
      undefined,
      fetchQuizAttempts.pending("", undefined),
    );
    expect(state.isLoading).toBe(true);

    state = historyReducer(
      state,
      fetchQuizAttempts.fulfilled([mockAttempt], "", undefined),
    );
    expect(state.isLoading).toBe(false);
    expect(state.ids).toContain("att-1");

    state = historyReducer(
      state,
      fetchQuizAttempts.rejected(
        { name: "Error", message: "Error msg" },
        "",
        undefined,
      ),
    );
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe("Error msg");
  });
});

describe("fetchQuizAttempts asyncThunk", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("localStorageからデータ読み込み", async () => {
    localStorage.setItem("lma:quiz_attempts", JSON.stringify([mockAttempt]));
    const dispatch = vi.fn();

    const thunk = fetchQuizAttempts();
    await thunk(dispatch, () => ({}), undefined);

    const calls = dispatch.mock.calls;
    expect(calls[1][0].payload).toEqual([mockAttempt]);
  });

  it("localStorageが空の場合", async () => {
    const dispatch = vi.fn();

    const thunk = fetchQuizAttempts();
    await thunk(dispatch, () => ({}), undefined);

    const calls = dispatch.mock.calls;
    expect(calls[1][0].payload).toEqual([]);
  });
});

describe("buildQuizAttempt", () => {
  it("回答結果からQuizAttemptを作成", () => {
    const questions: Question[] = [
      {
        id: "q1",
        type: "single",
        prompt: "問1",
        choices: ["A", "B"],
        answerIndex: 0,
        explanation: "解説",
      },
    ];

    const userAnswers = { q1: 0 };
    const attempt = buildQuizAttempt("less-1", questions, userAnswers, 60);

    expect(attempt.lessonId).toBe("less-1");
    expect(attempt.totalQuestions).toBe(1);
    expect(attempt.correctCount).toBe(1);
    expect(attempt.durationSec).toBe(60);
    expect(attempt.details[0].isCorrect).toBe(true);
  });
});

describe("history selectors", () => {
  const todayStr = new Date().toISOString();
  const mockState = {
    history: {
      ids: ["att-1"],
      entities: {
        "att-1": { ...mockAttempt, attemptedAt: todayStr },
      },
      isLoading: false,
      error: null,
    },
    progress: {
      items: [
        {
          lessonId: "less-1",
          status: "completed",
          totalStudyMinutes: 10,
          dailyLogs: {
            [todayStr.split("T")[0]]: 15,
          },
        },
      ],
      isLoading: false,
      error: null,
    },
  } as unknown as RootState;

  it("selectAllAttempts & selectAttemptById", () => {
    const attempts = selectAllAttempts(mockState);
    expect(attempts).toHaveLength(1);

    const attempt = selectAttemptById(mockState, "att-1");
    expect(attempt?.id).toBe("att-1");
  });

  it("selectDailyStudyTimeChartData", () => {
    const chartData = selectDailyStudyTimeChartData(mockState);
    expect(chartData).toHaveLength(7);
  });

  it("selectAccuracyChartData", () => {
    const accuracyData = selectAccuracyChartData(mockState);
    expect(accuracyData).toHaveLength(1);
    expect(accuracyData[0].accuracy).toBe(100);
  });
});
