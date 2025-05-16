import { createContext, useContext, Dispatch, SetStateAction } from "react";
import { Question, Answer } from "@/types/quest";

type QuestFormContextType = {
  //Questions state and methods
  questions: Question[];
  totalPoints: number;
  addQuestion: () => void;
  removeQuestion: (order: number) => void;
  updateQuestion: (order: number, value: string, image: string, points: number, answers: Answer[]) => void;
  updateQuestionValue: (questionOrder: number, value: string) => void;
  updateQuestionImage: (questionOrder: number, image: string) => void;
  updateQuestionPoints: (questionOrder: number, points: number) => void;
  updateAnswer: (questionOrder: number, order: number, value: string, isCorrect: boolean) => void;
  addAnswer: (questionOrder: number) => void;
  deleteAnswer: (questionOrder: number, answerOrder: number) => void;
  findQuestion: (questionOrder: number) => Question | undefined;

  //Form useStates and methods
  image: string;
  setImage: Dispatch<SetStateAction<string>>;
  title: string;
  setTitle: Dispatch<SetStateAction<string>>;
  description: string;
  setDescription: Dispatch<SetStateAction<string>>;
  category: string;
  setCategory: Dispatch<SetStateAction<string>>;
  time: number;
  setTime: Dispatch<SetStateAction<number>>;
  showTimeControls: boolean;
  setShowTimeControls: Dispatch<SetStateAction<boolean>>;

  clearSavedData: () => void;
};

export const QuestFormContext = createContext<QuestFormContextType | undefined>(undefined);

export const useQuestFormContext = () => {
  const context = useContext(QuestFormContext);
  if (!context) {
    throw new Error("useQuestFormContext must be used within a QuestFormProvider");
  }
  return context;
};