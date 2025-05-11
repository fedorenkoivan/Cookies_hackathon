import { createContext, useContext } from 'react';
import { Quest } from '@/types/quest';

interface QuestContextType {
  quest: Quest | null;
  loading: boolean;
  error: string | null;
  fetchQuest: (questId: string) => Promise<void>;
}

export const QuestContext = createContext<QuestContextType>({
  quest: null,
  loading: false,
  error: null,
  fetchQuest: async () => {},
});

export const useQuestContext = () => useContext(QuestContext);