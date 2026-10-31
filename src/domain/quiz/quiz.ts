export type QuizTab = 'Assigned' | 'Practice' | 'Completed';

export type QuizSummary = {
  title: string;
  courseTitle: string;
  questions: number;
  minutes: number;
  tone: 'mint' | 'blue';
  available: boolean;
};

export type QuizAnswer = { key: 'A' | 'B' | 'C' | 'D'; text: string };

export type QuizQuestion = {
  title: string;
  number: number;
  total: number;
  timer: string;
  prompt: string;
  code: string;
  answers: readonly QuizAnswer[];
};

export type QuizReview = {
  number: number;
  title: string;
  correct: boolean;
};

export type QuizResult = {
  percent: number;
  correct: number;
  incorrect: number;
  time: string;
  gainedXp: number;
  comparison: string;
  review: readonly QuizReview[];
};

export type QuizData = {
  xpTotal: number;
  assigned: readonly QuizSummary[];
  question: QuizQuestion;
  result: QuizResult;
};
