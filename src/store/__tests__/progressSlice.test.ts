import { describe, it, expect, beforeEach } from "vitest";
import progressReducer, {
  startLesson,
  completeLesson,
  addStudyTime,
  resetProgress,
  fetchProgress,
} from "../progressSlice";
import type { Progress } from "../../types";

interface ProgressState {
  items: Progress[];
  isLoading: boolean;
  error: string | null;
}

describe("progressSlice reducer", () => {
  const initialState: ProgressState = {
    items: [],
    isLoading: false,
    error: null,
  };

  beforeEach(() => {
    localStorage.clear();
  });

  it("startLesson", () => {
    let state: ProgressState = progressReducer(
      initialState,
      startLesson({ lessonId: "l1" }),
    );
    expect(state.items[0].status).toBe("in_progress");

    state = {
      items: [{ lessonId: "l2", status: "not_started", totalStudyMinutes: 0 }],
      isLoading: false,
      error: null,
    };
    state = progressReducer(state, startLesson({ lessonId: "l2" }));
    expect(state.items[0].status).toBe("in_progress");
  });

  it("completeLesson", () => {
    let state: ProgressState = {
      items: [{ lessonId: "l1", status: "in_progress", totalStudyMinutes: 10 }],
      isLoading: false,
      error: null,
    };
    state = progressReducer(state, completeLesson({ lessonId: "l1" }));
    expect(state.items[0].status).toBe("completed");

    state = progressReducer(initialState, completeLesson({ lessonId: "l2" }));
    expect(state.items[0].status).toBe("completed");
  });

  it("addStudyTime", () => {
    let state: ProgressState = progressReducer(
      initialState,
      addStudyTime({ lessonId: "l1", seconds: 120 }),
    );
    expect(state.items[0].totalStudyMinutes).toBe(2);

    state = {
      items: [{ lessonId: "l1", status: "in_progress", totalStudyMinutes: 5 }],
      isLoading: false,
      error: null,
    };
    state = progressReducer(
      state,
      addStudyTime({ lessonId: "l1", seconds: 180 }),
    );
    expect(state.items[0].totalStudyMinutes).toBe(8);

    state = progressReducer(
      state,
      addStudyTime({ lessonId: "l1", seconds: 60 }),
    );
    expect(state.items[0].totalStudyMinutes).toBe(9);
  });

  it("resetProgress", () => {
    const state: ProgressState = {
      items: [{ lessonId: "l1", status: "completed", totalStudyMinutes: 10 }],
      isLoading: false,
      error: null,
    };
    const nextState = progressReducer(state, resetProgress());
    expect(nextState.items).toEqual([]);
  });

  it("fetchProgress extraReducers: pending, fulfilled, rejected", () => {
    let state: ProgressState = progressReducer(
      initialState,
      fetchProgress.pending("", undefined),
    );
    expect(state.isLoading).toBe(true);

    // fulfilled
    state = progressReducer(
      state,
      fetchProgress.fulfilled(
        [{ lessonId: "l1", status: "completed", totalStudyMinutes: 0 }],
        "",
        undefined,
      ),
    );
    expect(state.isLoading).toBe(false);

    // payloadあり (rejectWithValue)
    state = progressReducer(
      state,
      fetchProgress.rejected(
        new Error("Error"),
        "",
        undefined,
        "エラーメッセージ",
      ),
    );
    expect(state.error).toBe("エラーメッセージ");

    // payloadなし、error.messageあり
    state = progressReducer(
      state,
      fetchProgress.rejected(new Error("Network Error"), "", undefined),
    );
    expect(state.error).toBe("Network Error");
  });
});
