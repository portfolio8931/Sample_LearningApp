import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export type ToastType = "success" | "error";

interface UiState {
  toast: {
    message: string | null;
    type: ToastType;
    isVisible: boolean;
  };
}

const initialState: UiState = {
  toast: {
    message: null,
    type: "success",
    isVisible: false,
  },
};

export const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    showToast: (
      state,
      action: PayloadAction<{ message: string; type?: ToastType }>,
    ) => {
      state.toast.message = action.payload.message;
      state.toast.type = action.payload.type ?? "success";
      state.toast.isVisible = true;
    },
    hideToast: (state) => {
      state.toast.isVisible = false;
      state.toast.message = null;
    },
  },
});

export const { showToast, hideToast } = uiSlice.actions;
export default uiSlice.reducer;
