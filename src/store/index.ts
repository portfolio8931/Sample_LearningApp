import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import type { TypedUseSelectorHook } from "react-redux";
import progressReducer from "./progressSlice";
import quizReducer from "./quizSlice";
import curriculumReducer from "./curriculumSlice";
import historyReducer from "./historySlice";
import reviewReducer from "./reviewSlice";
import uiReducer from "./uiSlice";

export const store = configureStore({
  reducer: {
    progress: progressReducer,
    quiz: quizReducer,
    curriculum: curriculumReducer,
    history: historyReducer,
    review: reviewReducer,
    ui: uiReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
