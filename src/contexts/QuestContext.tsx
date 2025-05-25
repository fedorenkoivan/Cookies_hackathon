import { createContext, useContext } from 'react';
import { Quest } from '@/types/quest';

interface QuestContextType {
  allQuests: Quest[];
  bestQuests: Quest[];
  quest: Quest | null;
  loading: boolean;
  error: string | null;
  fetchQuest: (questId: string) => Promise<void>;
  fetchAllQuests: () => Promise<void>;
  fetchBestQuests: () => Promise<void>;
}

export const QuestContext = createContext<QuestContextType>({
  allQuests: [],
  bestQuests: [],
  quest: null,
  loading: false,
  error: null,
  fetchQuest: async () => {},
  fetchAllQuests: async () => {},
  fetchBestQuests: async () => {},
});

export const useQuestContext = () => useContext(QuestContext);