import { PropsWithChildren, useCallback, useEffect, useState, useMemo } from "react";
import { Quest } from "@/types/quest";
import { QUESTS_URL as URL } from "@/constants/questConstants";
import { QuestContext } from "./QuestContext";

export const QuestProvider = ({ children }: PropsWithChildren) => {
  const [allQuests, setAllQuests] = useState<Quest[]>([]);
  const [quest, setQuest] = useState<Quest | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchQuest = useCallback(
    async (questId: string) => {
      if (!questId) return;
      if (quest && quest._id === questId) return;

      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`${URL}?_id=${questId}`);

        if (!res.ok) {
          throw new Error(`API error: ${res.status}`);
        }

        const data = await res.json();
        const quests = data.data;

        if (quests && quests.length > 0) {
          setQuest(quests[0]);
        } else {
          setError("Quest not found");
        }
      } catch (err) {
        console.error("Error fetching quest:", err);
        setError("Failed to load quest");
      } finally {
        setLoading(false);
      }
    },
    [quest]
  );

  const fetchAllQuests = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(URL);

      if (!res.ok) {
        throw new Error(`API error: ${res.status}`);
      }

      const data = await res.json();
      const quests = data.data;

      if (quests && quests.length > 0) {
        setAllQuests(quests);
      } else {
        setAllQuests([]);
        setError("No quests available");
      }
    } catch (err) {
      console.error("Error fetching quest:", err);
      setError("Failed to load quest");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllQuests();
  }, [fetchAllQuests]);

  const value = useMemo(
    () => ({
      allQuests,
      quest,
      loading,
      error,
      fetchQuest,
      fetchAllQuests,
    }),
    [allQuests, quest, loading, error, fetchQuest, fetchAllQuests]
  );

  return (
    <QuestContext.Provider value={value}>
      {children}
    </QuestContext.Provider>
  );
};
