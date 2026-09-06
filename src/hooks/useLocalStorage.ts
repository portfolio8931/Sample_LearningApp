import { useState } from "react";

export const useLocalStorage = (key: string) => {
  const [data] = useState<string | null>(() => {
    try {
      return localStorage.getItem(key);
    } catch (err) {
      console.error(`localStorageの読み込みに失敗しました(${key})`, err);
      return null;
    }
  });

  const [isLoading] = useState<boolean>(false);

  const [error] = useState<Error | null>(() => {
    try {
      localStorage.getItem(key);
      return null;
    } catch (err) {
      return err instanceof Error
        ? err
        : new Error("データの読み込みに失敗しました");
    }
  });

  return { data, isLoading, error };
};
