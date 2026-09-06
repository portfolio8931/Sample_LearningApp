import { describe, it, expect } from "vitest";
import quizReducer, {
  setCurrentQuestionIndex,
  setAnswer,
  resetQuizState,
} from "../quizSlice";

describe("quizSlice reducer", () => {
  const initialState = {
    currentQuestionIndex: 0,
    userAnswers: {},
  };

  it("問題のインデックス（currentQuestionIndex）更新", () => {
    const nextState = quizReducer(initialState, setCurrentQuestionIndex(2));
    expect(nextState.currentQuestionIndex).toBe(2);
  });

  it("回答（setAnswer）保存", () => {
    const nextState = quizReducer(
      initialState,
      setAnswer({ questionId: "q1", answer: "option_a" }),
    );
    expect(nextState.userAnswers["q1"]).toEqual("option_a");
  });

  it("クイズを初期化（resetQuizState）", () => {
    const modifiedState = {
      currentQuestionIndex: 3,
      userAnswers: { q1: "option_a" },
    };
    const nextState = quizReducer(modifiedState, resetQuizState());
    expect(nextState).toEqual(initialState);
  });
});
