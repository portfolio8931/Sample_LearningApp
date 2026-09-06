import { describe, it, expect, beforeEach, vi } from "vitest";
import reviewReducer, {
  addReviewMark,
  removeReviewMark,
  resetReview,
  fetchReviewMarks,
  selectAllReviewMarks,
  selectReviewPageData,
} from "../reviewSlice";
import type { ReviewMark, Curriculum } from "../../types";
import type { RootState } from "../index";

const mockMark1: ReviewMark = {
  id: "mark-1",
  lessonId: "less-1",
  questionId: "q1",
  resolved: false,
  markedAt: "2026-08-01T00:00:00.000Z",
};

const mockMark2: ReviewMark = {
  id: "mark-2",
  lessonId: "less-1",
  questionId: "q2",
  resolved: true,
  markedAt: "2026-08-01T00:00:00.000Z",
};

const mockCurriculum: Curriculum[] = [
  {
    id: "curr-1",
    title: "テストカリキュラム",
    description: "説明",
    chapters: [
      {
        id: "chap-1",
        curriculumId: "curr-1",
        order: 1,
        title: "章1",
        lessons: [
          {
            id: "less-1",
            chapterId: "chap-1",
            order: 1,
            title: "レッスン1",
            contentMarkdown: "",
            estimatedMinutes: 10,
            quiz: {
              questions: [
                {
                  id: "q1",
                  type: "single",
                  prompt: "問題1",
                  choices: ["A", "B"],
                  answerIndex: 0,
                  explanation: "",
                },
                {
                  id: "q2",
                  type: "single",
                  prompt: "問題2",
                  choices: ["C", "D"],
                  answerIndex: 1,
                  explanation: "",
                },
              ],
            },
          },
        ],
      },
    ],
  },
];

describe("reviewSlice reducers & extraReducers", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("addReviewMark", () => {
    const initialState = reviewReducer(undefined, { type: "unknown" });
    const nextState = reviewReducer(initialState, addReviewMark(mockMark1));

    expect(nextState.ids).toContain("mark-1");
    expect(nextState.entities["mark-1"]).toEqual(mockMark1);
    expect(localStorage.getItem("lma:review_marks")).not.toBeNull();
  });

  it("removeReviewMark", () => {
    let state = reviewReducer(undefined, addReviewMark(mockMark1));
    state = reviewReducer(state, removeReviewMark("mark-1"));

    expect(state.ids).not.toContain("mark-1");
    expect(
      JSON.parse(localStorage.getItem("lma:review_marks") || "[]"),
    ).toHaveLength(0);
  });

  it("resetReview", () => {
    let state = reviewReducer(undefined, addReviewMark(mockMark1));
    state = reviewReducer(state, resetReview());

    expect(state.ids).toHaveLength(0);
    expect(localStorage.getItem("lma:review_marks")).toBeNull();
  });

  it("extraReducers: fetchReviewMarks.fulfilled", () => {
    const state = reviewReducer(
      undefined,
      fetchReviewMarks.fulfilled([mockMark1], "", undefined),
    );
    expect(state.ids).toContain("mark-1");
  });
});

describe("fetchReviewMarks asyncThunk", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("localStorageから復習フラグ取得", async () => {
    localStorage.setItem("lma:review_marks", JSON.stringify([mockMark1]));
    const dispatch = vi.fn();

    const thunk = fetchReviewMarks();
    await thunk(dispatch, () => ({}), undefined);

    const calls = dispatch.mock.calls;
    expect(calls[1][0].payload).toEqual([mockMark1]);
  });

  it("localStorageが空の場合", async () => {
    const dispatch = vi.fn();

    const thunk = fetchReviewMarks();
    await thunk(dispatch, () => ({}), undefined);

    const calls = dispatch.mock.calls;
    expect(calls[1][0].payload).toEqual([]);
  });
});

describe("review selectors", () => {
  const mockState = {
    review: {
      ids: ["mark-1", "mark-2"],
      entities: {
        "mark-1": mockMark1,
        "mark-2": mockMark2,
      },
    },
    curriculum: {
      items: mockCurriculum,
    },
  } as unknown as RootState;

  it("selectAllReviewMarks", () => {
    const marks = selectAllReviewMarks(mockState);
    expect(marks).toHaveLength(2);
  });

  it("selectReviewPageData", () => {
    const data = selectReviewPageData(mockState);

    // 全問題数
    expect(data.questions).toHaveLength(2);
    // 未解決（resolved: false）のみカウント
    expect(data.totalCount).toBe(1);
    // グループ化
    expect(data.marksByLesson).toHaveLength(1);
    expect(data.marksByLesson[0].lesson.id).toBe("less-1");
    expect(data.marksByLesson[0].marks).toEqual([mockMark1]);
  });
});
