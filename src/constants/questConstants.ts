export const CATEGORIES: string[] = [
    "All",
    "Adventure",
    "Puzzle",
    "Educational",
    "Gaming",
    "Team challenges",
    "Mystery",
    "Other",
  ];

export const QUESTS_URL = "http://localhost:5000/quests";

export interface Answer {
  id: number;
  value: string;
  isCorrect: boolean;
}

export interface Question {
  id: number;
  value: string;
  answers: Answer[];
}