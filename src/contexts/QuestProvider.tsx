import {
  PropsWithChildren,
  useCallback,
  useEffect,
  useState,
  useMemo,
} from "react";
import { Quest } from "@/types/quest";
import { QUESTS_URL as URL } from "@/constants/questConstants";
import { QuestContext } from "./QuestContext";

const useFetchQuests = <T extends unknown[]>(
  errMsg: string,
  getURL: (...params: T) => string,
  onSuccess: (quests: Quest[]) => void,
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
          onSuccess([]);
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

export const QuestProvider = ({ children }: PropsWithChildren) => {
  const [allQuests, setAllQuests] = useState<Quest[]>([]);
  const [bestQuests, setBestQuests] = useState<Quest[]>([]);
  const [quest, setQuest] = useState<Quest | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getToday = useCallback(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today.toISOString();
  }, []);

  const getAllQuestsUrl = useCallback(() => URL, []);

  const getBestQuestsUrl = useCallback(() => {
    return `${URL}?limit=5&sort=rating:desc&createdAt.gte=${getToday()}`;
  }, [getToday]);

  const getQuestByIdUrl = useCallback((questId: string) => {
    return `${URL}?_id=${questId}`;
  }, []);

  const setQuestFromArray = useCallback((quests: Quest[]) => {
    setQuest(quests[0] || null);
  }, []);

  const fetchAllQuests = useFetchQuests(
    "No quests available",
    getAllQuestsUrl,
    setAllQuests,
    setLoading,
    setError
  );

  const fetchBestQuests = useFetchQuests(
    "No quests available",
    getBestQuestsUrl,
    setBestQuests,
    setLoading,
    setError
  );

  const fetchQuest = useFetchQuests(
    "Quest not found",
    getQuestByIdUrl,
    setQuestFromArray,
    setLoading,
    setError
  );

  useEffect(() => {
    fetchAllQuests();
    fetchBestQuests();
  }, [fetchAllQuests, fetchBestQuests]);

  const value = useMemo(
    () => ({
      allQuests,
      bestQuests,
      quest,
      loading,
      error,
      fetchQuest,
      fetchAllQuests,
      fetchBestQuests,
    }),
    [
      allQuests,
      bestQuests,
      quest,
      loading,
      error,
      fetchQuest,
      fetchAllQuests,
      fetchBestQuests,
    ]
  );

  return (
    <QuestContext.Provider value={value}>{children}</QuestContext.Provider>
  );
};
