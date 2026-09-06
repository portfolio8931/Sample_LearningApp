import {
  createSlice,
  createEntityAdapter,
  createSelector,
  createAsyncThunk,
} from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { ReviewMark } from "../types";
import type { RootState } from "./index";

const STORAGE_KEY = "lma:review_marks";

export const reviewAdapter = createEntityAdapter<ReviewMark, string>({
  selectId: (item) => item.id,
});

export const fetchReviewMarks = createAsyncThunk(
  "review/fetchReviewMarks",
  async () => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? (JSON.parse(saved) as ReviewMark[]) : [];
  },
);

export const reviewSlice = createSlice({
  name: "review",
  initialState: reviewAdapter.getInitialState(),
  reducers: {
    addReviewMark: (state, action: PayloadAction<ReviewMark>) => {
      reviewAdapter.addOne(state, action.payload);
      const all = Object.values(state.entities).filter(
        (item): item is ReviewMark => item !== undefined,
      );
      localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
    },
    removeReviewMark: (state, action: PayloadAction<string>) => {
      reviewAdapter.removeOne(state, action.payload);
      const all = Object.values(state.entities).filter(
        (item): item is ReviewMark => item !== undefined,
      );
      localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
    },
    resetReview: (state) => {
      reviewAdapter.removeAll(state);
      localStorage.removeItem(STORAGE_KEY);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchReviewMarks.fulfilled, (state, action) => {
      reviewAdapter.setAll(state, action.payload);
    });
  },
});

export const { addReviewMark, removeReviewMark, resetReview } =
  reviewSlice.actions;

export const { selectAll: selectAllReviewMarks } = reviewAdapter.getSelectors(
  (state: RootState) => state.review,
);

export const selectReviewPageData = createSelector(
  [selectAllReviewMarks, (state: RootState) => state.curriculum.items],
  (reviewMarks, curriculums) => {
    const allLessons = curriculums
      .flatMap((c) => c.chapters)
      .flatMap((chap) => chap.lessons);

    const allQuestions = allLessons.flatMap((l) => l.quiz.questions);

    const activeMarks = reviewMarks.filter((mark) => !mark.resolved);

    const marksByLesson = allLessons
      .map((lesson) => ({
        lesson,
        marks: activeMarks.filter((mark) => mark.lessonId === lesson.id),
      }))
      .filter((group) => group.marks.length > 0);
    return {
      questions: allQuestions,
      marksByLesson,
      totalCount: activeMarks.length,
    };
  },
);

export default reviewSlice.reducer;
