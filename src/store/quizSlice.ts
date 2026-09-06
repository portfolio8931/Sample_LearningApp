import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface QuizState {
  currentQuestionIndex: number;
  userAnswers: Record<string, string | string[]>;
}

const initialState: QuizState = {
  currentQuestionIndex: 0,
  userAnswers: {},
};

export const quizSlice = createSlice({
  name: "quiz",
  initialState,
  reducers: {
    setCurrentQuestionIndex: (state, action: PayloadAction<number>) => {
      state.currentQuestionIndex = action.payload;
    },
    setAnswer: (
      state,
      action: PayloadAction<{ questionId: string; answer: string | string[] }>,
    ) => {
      state.userAnswers[action.payload.questionId] = action.payload.answer;
    },
    resetQuizState: (state) => {
      state.currentQuestionIndex = 0;
      state.userAnswers = {};
    },
  },
});

export const { setCurrentQuestionIndex, setAnswer, resetQuizState } =
  quizSlice.actions;
export default quizSlice.reducer;
