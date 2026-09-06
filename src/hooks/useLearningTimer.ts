import { useEffect, useRef } from "react";
import { useAppDispatch } from "../store";
import { addStudyTime } from "../store/progressSlice";

interface UseLearningTimerOptions {
  lessonId?: string;
  inactivityTimeoutMs?: number;
}

export function useLearningTimer({
  lessonId,
  inactivityTimeoutMs = 10 * 60 * 1000,
}: UseLearningTimerOptions) {
  const dispatch = useAppDispatch();
  const secondsRef = useRef<number>(0);
  const inactivityTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!lessonId) return;

    const isActiveWindow = () => !document.hidden && document.hasFocus();

    const timerId = setInterval(() => {
      if (isActiveWindow()) {
        secondsRef.current += 1;
      }
    }, 1000);

    const resetInactivityTimer = () => {
      if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);

      inactivityTimerRef.current = setTimeout(() => {}, inactivityTimeoutMs);
    };

    const handleUserActivity = () => {
      if (isActiveWindow()) {
        resetInactivityTimer();
      }
    };

    document.addEventListener("visibilitychange", handleUserActivity);
    window.addEventListener("focus", handleUserActivity);
    window.addEventListener("blur", handleUserActivity);
    window.addEventListener("mousemove", handleUserActivity);
    window.addEventListener("keydown", handleUserActivity);

    resetInactivityTimer();

    return () => {
      clearInterval(timerId);
      if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);

      document.removeEventListener("visibilitychange", handleUserActivity);
      window.removeEventListener("focus", handleUserActivity);
      window.removeEventListener("blur", handleUserActivity);
      window.removeEventListener("mousemove", handleUserActivity);
      window.removeEventListener("keydown", handleUserActivity);

      if (secondsRef.current > 0) {
        const elapsedSeconds = secondsRef.current;
        secondsRef.current = 0;
        console.log("保存時間（秒）:", elapsedSeconds);
        dispatch(addStudyTime({ lessonId, seconds: elapsedSeconds }));
      }
    };
  }, [lessonId, inactivityTimeoutMs, dispatch]);
}
