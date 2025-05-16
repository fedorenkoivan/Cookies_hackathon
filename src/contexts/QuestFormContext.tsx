import { createContext, useContext } from "react";
import { Question, Answer } from "@/types/quest";

type QuestFormContextType = {
  questions: Question[];
  totalPoints: number;
  
  // Question operations
  addQuestion: () => void;
  removeQuestion: (order: number) => void;
  updateQuestion: (
    order: number, 
    value: string, 
    image: string, 
    points: number, 
    answers: Answer[]
  ) => void;
  updateQuestionValue: (questionOrder: number, value: string) => void;
  updateQuestionImage: (questionOrder: number, image: string) => void;
  updateQuestionPoints: (questionOrder: number, points: number) => void;
  
  // Answer operations
  updateAnswer: (
    questionOrder: number,
    order: number,
    value: string,
    isCorrect: boolean
  ) => void;
  addAnswer: (questionOrder: number) => void;
  deleteAnswer: (questionOrder: number, answerOrder: number) => void;

  findQuestion: (questionOrder: number) => Question | undefined;
};

export const QuestFormContext = createContext<QuestFormContextType | undefined>(undefined);

export const useQuestFormContext = () => {
  const context = useContext(QuestFormContext);
  if (!context) {
    throw new Error("useQuestFormContext must be used within a QuestFormProvider");
  }
  return context;
};