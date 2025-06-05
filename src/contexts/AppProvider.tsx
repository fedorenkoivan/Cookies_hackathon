import { PropsWithChildren, useMemo, useState, useCallback, useEffect } from "react";
import { AppContext } from "./AppContext";
import { Quest } from "@/types/quest";
import { QUESTS_URL } from "@/constants/questConstants";
import { useFetchQuests } from "@/hooks/useFetchQuests";

export const AppProvider = ({ children }: PropsWithChildren) => {
  const [allQuests, setAllQuests] = useState<Quest[]>([]);
  const [bestQuests, setBestQuests] = useState<Quest[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const getToday = useCallback(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today.toISOString();
  }, []);

  const getAllQuestsUrl = useCallback(() => QUESTS_URL, []);

  const getBestQuestsUrl = useCallback(() => {
    return `${QUESTS_URL}?limit=5&sort=rating:desc&createdAt.gte=${getToday()}`;
  }, [getToday]);

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

  const deleteQuest = useCallback( async (questId: string) => {
    setLoading(true);
    try {
      await fetch(`${QUESTS_URL}/${questId}`, {
        method: "DELETE",
      });
      setAllQuests((prev) => prev.filter((quest) => quest._id !== questId));
      setBestQuests((prev) => prev.filter((quest) => quest._id !== questId));
    } catch (error) {
      setError("Failed to delete quest: " + error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllQuests();
    fetchBestQuests();
  }, [fetchAllQuests, fetchBestQuests]);

  const value = useMemo(() => {
    return {
      allQuests,
      bestQuests,
      error,
      loading,
      fetchAllQuests,
      fetchBestQuests,
      deleteQuest,
    };
  }, [allQuests, bestQuests, fetchAllQuests, fetchBestQuests, deleteQuest, error, loading]);
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
