import { describe, it, expect } from "vitest";
import { configureStore } from "@reduxjs/toolkit";
import quizReducer, { setAnswer, resetQuizState } from "../quizSlice";
import progressReducer, { completeLesson } from "../progressSlice";
import reviewReducer from "../reviewSlice";

describe("統合テスト: クイズ回答→結果→復習追加", () => {
  it("回答入力→進捗完了→クイズリセット", () => {
    // テスト用Store
    const store = configureStore({
      reducer: {
        quiz: quizReducer,
        progress: progressReducer,
        review: reviewReducer,
      },
    });

    // クイズ回答 (setAnswer)
    store.dispatch(setAnswer({ questionId: "q1", answer: "option_a" }));
    expect(store.getState().quiz.userAnswers["q1"]).toBe("option_a");

    // レッスン完了 (completeLesson)
    store.dispatch(completeLesson({ lessonId: "l1" }));
    const progressItem = store
      .getState()
      .progress.items.find((item) => item.lessonId === "l1");
    expect(progressItem?.status).toBe("completed");

    // クイズ初期化 (resetQuizState)
    store.dispatch(resetQuizState());
    expect(store.getState().quiz.userAnswers).toEqual({});
  });
});
