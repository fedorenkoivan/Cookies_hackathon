import {
  PropsWithChildren,
  useCallback,
  useState,
  useMemo,
} from "react";
import { Quest } from "@/types/quest";
import { QUESTS_URL } from "@/constants/questConstants";
import { QuestContext } from "./QuestContext";
import { useFetchQuests } from "@/hooks/useFetchQuests";

export const QuestProvider = ({ children }: PropsWithChildren) => {
  const [questPreview, setQuest] = useState<Quest | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getQuestByIdUrl = useCallback((questId: string) => {
    return `${QUESTS_URL}?_id=${questId}`;
  }, []);

  const setQuestFromArray = useCallback((quests: Quest[]) => {
    setQuest(quests[0] || null);
  }, []);

  const fetchQuest = useFetchQuests(
    "Quest not found",
    getQuestByIdUrl,
    setQuestFromArray,
    setLoading,
    setError
  );

  const value = useMemo(
    () => ({
      questPreview,
      loading,
      error,
      fetchQuest,
    }),
    [
      questPreview,
      loading,
      error,
      fetchQuest
    ]
  );

  return (
    <QuestContext.Provider value={value}>{children}</QuestContext.Provider>
  );
};
