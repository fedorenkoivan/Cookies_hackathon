import { createContext, useContext } from "react";
import { Quest } from "@/types/quest";

type QuestContextType = {
  // allQuests: Quest[];
  // bestQuests: Quest[];
  questPreview: Quest | null;
  loading: boolean;
  error: string | null;
  fetchQuest: (questId: string) => Promise<void>;
  // fetchAllQuests: () => Promise<void>;
  // fetchBestQuests: () => Promise<void>;
};

export const QuestContext = createContext<QuestContextType | undefined>(
  undefined,
);

export const useQuestContext = () => {
  const context = useContext(QuestContext);
  if (!context) {
    throw new Error("useQuestContext must be used within a QuestProvider");
  }
  return context;
};
