import { createContext, useContext } from 'react';
import { Quest } from '@/types/quest';

interface QuestContextType {
  allQuests: Quest[]
  quest: Quest | null;
  loading: boolean;
  error: string | null;
  fetchQuest: (questId: string) => Promise<void>;
  fetchAllQuests: () => Promise<void>;
}

export const QuestContext = createContext<QuestContextType>({
  allQuests: [],
  quest: null,
  loading: false,
  error: null,
  fetchQuest: async () => {},
  fetchAllQuests: async () => {},
});

export const useQuestContext = () => useContext(QuestContext);