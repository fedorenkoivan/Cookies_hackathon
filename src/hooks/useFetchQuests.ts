import { useCallback } from "react";

export const useFetchQuests = <T extends unknown[], R>(
  errMsg: string,
  getURL: (...params: T) => string,
  onSuccess: (quests: R) => void,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setError: React.Dispatch<React.SetStateAction<string | null>>
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
        const quests = data.data;

        if (quests && quests.length > 0) {
          onSuccess(quests);
        } else {
          onSuccess([] as unknown as R);
          setError(errMsg);
        }
      } catch (err) {
        console.error("Error fetching quest:", err);
        setError(errMsg);
      } finally {
        setLoading(false);
      }
    },
    [getURL, onSuccess, errMsg, setLoading, setError]
  );
};