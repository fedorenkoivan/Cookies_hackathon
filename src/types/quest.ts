export interface Answer {
  id: number;
  value: string;
  isCorrect: boolean;
}

export interface Question {
  id: number;
  value: string;
  image: string;
  points: number;
  answers: Answer[];
}

export interface Quest {
  author: string;
  _id: number;
  title: string;
  description: string;
  category: string;
  time: number;
  image: string;
  rating: number;
  reviews: number;
  questions: Question[];
}
