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
    };
  }, [allQuests, bestQuests, fetchAllQuests, fetchBestQuests, error, loading]);
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
