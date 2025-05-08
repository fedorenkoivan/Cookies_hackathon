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