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
};

export type Author = {
  username: string;
  authorId: string;
  profileImage?: string;
};

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

export type CompletedQuestInfo = {
  questTitle: string;
  questId: string;
  userRating: number;
  userComment: string;
  score: number;
  totalTime: string;
  avgTimePerQuestion: string;
};

export type historyQuest = {
  _id: string;
  userId: string;
  questId: string;
  currentQuestionIndex: number;
  score: number;
  timeRemaining: number;
  isFinished: boolean;
  lastActivityDate: Date;
};
