import { Quest } from "@/types/quest";
import { createContext } from "react";
import { useContext } from "react";

type AppContextType = {
  allQuests: Quest[];
  bestQuests: Quest[];
  error: string | null;
  loading: boolean;
  fetchAllQuests: () => Promise<void>;
  fetchBestQuests: () => Promise<void>;
  deleteQuest: (questId: string) => Promise<void>;
};

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};