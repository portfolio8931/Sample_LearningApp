import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Progress } from "../types";

const STORAGE_KEY = "lma:progress";

const getTodayString = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

interface ProgressState {
  items: Progress[];
  isLoading: boolean;
  error: string | null;
}

const initialState: ProgressState = {
  items: [],
  isLoading: true,
  error: null,
};

export const fetchProgress = createAsyncThunk(
  "progress/fetchProgress",
  async (_, { rejectWithValue }) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 200));

      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? (JSON.parse(saved) as Progress[]) : [];
    } catch {
      return rejectWithValue("初期データの読み込みに失敗しました");
    }
  },
);

export const progressSlice = createSlice({
  name: "progress",
  initialState,
  reducers: {
    startLesson: (state, action: PayloadAction<{ lessonId: string }>) => {
      const existing = state.items.find(
        (p) => p.lessonId === action.payload.lessonId,
      );

      if (!existing) {
        state.items.push({
          lessonId: action.payload.lessonId,
          status: "in_progress",
          totalStudyMinutes: 0,
        });
      } else if (existing.status === "not_started") {
        existing.status = "in_progress";
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
    },

    completeLesson: (state, action: PayloadAction<{ lessonId: string }>) => {
      const existing = state.items.find(
        (p) => p.lessonId === action.payload.lessonId,
      );

      if (existing) {
        existing.status = "completed";
      } else {
        state.items.push({
          lessonId: action.payload.lessonId,
          status: "completed",
          totalStudyMinutes: 0,
        });
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
    },

    addStudyTime: (
      state,
      action: PayloadAction<{ lessonId: string; seconds: number }>,
    ) => {
      const { lessonId, seconds } = action.payload;
      const minutes = seconds / 60;
      const todayStr = getTodayString();

      const existing = state.items.find((p) => p.lessonId === lessonId);

      if (existing) {
        existing.totalStudyMinutes =
          (existing.totalStudyMinutes ?? 0) + minutes;
        if (!existing.dailyLogs) {
          existing.dailyLogs = {};
        }
        const currentTodayMinetes = existing.dailyLogs[todayStr] ?? 0;
        existing.dailyLogs[todayStr] = currentTodayMinetes + minutes;
      } else {
        state.items.push({
          lessonId,
          status: "in_progress",
          totalStudyMinutes: minutes,
          dailyLogs: {
            [todayStr]: minutes,
          },
        });
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
    },

    resetProgress: (state) => {
      state.items = [];
      localStorage.removeItem(STORAGE_KEY);
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchProgress.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProgress.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(fetchProgress.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          (action.payload as string) ??
          action.error.message ??
          "データの読み込みに失敗しました";
      });
  },
});

export const { startLesson, completeLesson, resetProgress, addStudyTime } =
  progressSlice.actions;
export default progressSlice.reducer;
