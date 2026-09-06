import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../store";
import { hideToast } from "../../store/uiSlice";

const typeStyle: Record<string, string> = {
  success: "bg-blue-100",
  error: "bg-red-100",
};

export function Toast() {
  const dispatch = useAppDispatch();
  const { message, type, isVisible } = useAppSelector(
    (state) => state.ui.toast,
  );

  useEffect(() => {
    if (!isVisible) return;

    const timer = setTimeout(() => {
      dispatch(hideToast());
    }, 3000);

    return () => clearTimeout(timer);
  }, [isVisible, dispatch]);

  if (!isVisible || !message) return null;

  return (
    <div className="fixed top-16.25 right-0 z-50">
      <div
        className={`flex min-w-6 px-4 py-3 rounded-md items-center ${
          typeStyle[type] || typeStyle.success
        }`}
      >
        <p>{message}</p>
      </div>
    </div>
  );
}
