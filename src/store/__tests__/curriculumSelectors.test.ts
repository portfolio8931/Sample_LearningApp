import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import curriculumReducer, {
  fetchCurriculum,
  selectChapterPageData,
  selectCurriculumsPageData,
  selectLessonsPageData,
  selectQuizPageData,
  selectResultPageData,
  selectHistoryPageData,
  selectDashboardPageData,
  selectFormattedAttemptHistory,
} from "../curriculumSlice";
import type { RootState } from "../index";
import type { Curriculum } from "../../types";

const mockCurriculum: Curriculum[] = [
  {
    id: "curr-001",
    title: "React 入門",
    description: "React の基本を学ぶ",
    chapters: [
      {
        id: "chap-001",
        curriculumId: "curr-001",
        order: 1,
        title: "JSX の基本",
        lessons: [
          {
            id: "less-001",
            chapterId: "chap-001",
            order: 1,
            title: "JSX とは",
            contentMarkdown: "Markdownコンテンツ",
            estimatedMinutes: 15,
            quiz: {
              questions: [
                {
                  id: "q1",
                  type: "single",
                  prompt: "JSXとは何ですか？",
                  choices: ["拡張構文", "HTML"],
                  answerIndex: 0,
                  explanation: "解説",
                },
              ],
            },
          },
          {
            id: "less-002",
            chapterId: "chap-001",
            order: 2,
            title: "コンポーネント作成",
            contentMarkdown: "Markdown",
            estimatedMinutes: 15,
            quiz: {
              questions: [],
            },
          },
        ],
      },
    ],
  },
];

const mockAttempt1 = {
  id: "att1",
  lessonId: "less-001",
  attemptedAt: "2026-08-01T10:00:00.000Z",
  correctCount: 1,
  totalQuestions: 1,
  details: [{ questionId: "q1", selectedOptionIndex: 0, isCorrect: true }],
};

const mockAttempt2 = {
  id: "att2",
  lessonId: "less-999",
  attemptedAt: "2026-08-02T10:00:00.000Z",
  correctCount: 0,
  totalQuestions: 1,
  details: [],
};

const mockState: RootState = {
  curriculum: {
    items: mockCurriculum,
    isLoading: false,
    error: null,
  },
  progress: {
    items: [
      { lessonId: "less-001", status: "completed", totalStudyMinutes: 10 },
      { lessonId: "less-002", status: "in_progress", totalStudyMinutes: 5 },
    ],
    isLoading: false,
    error: null,
  },
  history: {
    ids: ["att1", "att2"],
    entities: {
      att1: mockAttempt1,
      att2: mockAttempt2,
    },
    attempts: [mockAttempt1, mockAttempt2],
  },
} as unknown as RootState;

describe("curriculumSlice reducer & extraReducers", () => {
  it("extraReducers: pending, fulfilled, rejected", () => {
    let state = curriculumReducer(
      undefined,
      fetchCurriculum.pending("", undefined),
    );
    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();

    state = curriculumReducer(
      state,
      fetchCurriculum.fulfilled(mockCurriculum, "", undefined),
    );
    expect(state.isLoading).toBe(false);
    expect(state.items).toEqual(mockCurriculum);

    // payloadあり rejected
    state = curriculumReducer(
      state,
      fetchCurriculum.rejected(
        new Error("Error"),
        "",
        undefined,
        "読み込みエラー",
      ),
    );
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe("読み込みエラー");

    // payloadなし rejected
    state = curriculumReducer(
      state,
      fetchCurriculum.rejected(new Error("Error"), "", undefined),
    );
    expect(state.error).toBe("初期JSONの読み込みに失敗しました");
  });
});

describe("fetchCurriculum asyncThunk", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("fetch 成功時", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => mockCurriculum,
    } as Response);

    const dispatch = vi.fn();
    const thunk = fetchCurriculum();
    await thunk(dispatch, () => ({}), undefined);

    const calls = dispatch.mock.calls;
    expect(calls[0][0].type).toBe(fetchCurriculum.pending.type);
    expect(calls[1][0].type).toBe(fetchCurriculum.fulfilled.type);
    expect(calls[1][0].payload).toEqual(mockCurriculum);
  });

  it("fetch 失敗時 (HTTPエラー)", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
    } as Response);

    const dispatch = vi.fn();
    const thunk = fetchCurriculum();
    await thunk(dispatch, () => ({}), undefined);

    const calls = dispatch.mock.calls;
    expect(calls[1][0].type).toBe(fetchCurriculum.rejected.type);
    expect(calls[1][0].payload).toBe("初期JSONの読み込みに失敗しました");
  });
});

describe("curriculum selectors", () => {
  it("selectChapterPageData", () => {
    const selector = selectChapterPageData("curr-001");
    const data = selector(mockState);
    expect(data?.curriculum.id).toBe("curr-001");
    expect(data?.current).toBe(1);
    expect(data?.total).toBe(2);

    expect(selectChapterPageData("invalid")(mockState)).toBeNull();
  });

  it("selectCurriculumsPageData", () => {
    const data = selectCurriculumsPageData(mockState);
    expect(data.length).toBe(1);
    expect(data[0].current).toBe(1);
  });

  it("selectLessonsPageData", () => {
    const selector = selectLessonsPageData("less-001");
    const data = selector(mockState);
    expect(data?.lesson.id).toBe("less-001");
    expect(data?.isCompleted).toBe(true);

    expect(selectLessonsPageData(undefined)(mockState)).toBeNull();
    expect(selectLessonsPageData("invalid")(mockState)).toBeNull();
  });

  it("selectQuizPageData", () => {
    const selector = selectQuizPageData("less-001");
    const data = selector(mockState);
    expect(data?.questions.length).toBe(1);

    const noQuizData = selectQuizPageData("less-002")(mockState);
    expect(noQuizData?.questions).toEqual([]);

    expect(selectQuizPageData(undefined)(mockState)).toBeNull();
  });

  it("selectResultPageData", () => {
    const selector = selectResultPageData("less-001", "att1");
    const data = selector(mockState);
    expect(data?.currentLesson?.id).toBe("less-001");

    expect(selectResultPageData(undefined, undefined)(mockState)).toBeNull();
  });

  it("selectHistoryPageData", () => {
    const data = selectHistoryPageData(mockState);
    expect(data.allLessons.length).toBe(2);
  });

  it("selectDashboardPageData", () => {
    const data = selectDashboardPageData(mockState);
    expect(data.total).toBe(2);
    expect(data.current).toBe(1);
    expect(data.recommendedLesson?.id).toBe("less-002");
  });

  it("selectFormattedAttemptHistory", () => {
    const formatted = selectFormattedAttemptHistory(mockState);
    expect(formatted.length).toBeGreaterThan(0);
  });
});
