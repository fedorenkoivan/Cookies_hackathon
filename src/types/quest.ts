export type Answer = {
  order: number;
  value: string;
  isCorrect: boolean;
};

export type Question = {
  order: number;
  value: string;
  image: string;
  points: number;
  answers: Answer[];
};

export type ExtendedQuestion = Question & {
  _id: string;
}

export type Author = {
  username: string,
  authorId: string,
}

export type Quest = {
  author: Author;
  _id: string;
  title: string;
  description: string;
  category: string;
  time: number;
  image: string;
  rating: number;
  reviews: number;
  questions: ExtendedQuestion[];
};

export type SavedFormData = {
  image: string;
  title: string;
  description: string;
  category: string;
  time: number;
  showTimeControls: boolean;
  questions: Question[];
};

export type historyQuest = {
  _id: string;
  userId: string;
  questId: string;
  score: number;
  timeRemaining: number;
  lastActivityDate: Date;
};
