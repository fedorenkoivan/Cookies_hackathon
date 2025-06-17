import { useCallback } from "react";

export const useFetchQuests = <T extends unknown[], R>(
  errMsg: string,
  getURL: (...params: T) => string,
  onSuccess: (quests: R) => void,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setError: React.Dispatch<React.SetStateAction<string | null>>,
) => {
  return useCallback(
    async (...params: T) => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(getURL(...params));

        if (!res.ok) {
          throw new Error(`API error: ${res.status}`);
        }

        const data = await res.json();
        const quests = data.data || [];

        onSuccess(quests);

        if (data.data === null || data.data === undefined) {
          setError(errMsg);
        }
      } catch (err) {
        console.error("Error fetching quest:", err);
        setError(errMsg);
      } finally {
        setLoading(false);
      }
    },
    [getURL, onSuccess, errMsg, setLoading, setError],
  );
};
