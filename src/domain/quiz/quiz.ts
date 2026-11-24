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

export type PublishedQuiz = {
  id: string;
  title: string;
  description: string | null;
  questionCount: number;
};

export type QuizOption = { id: string; content: string };

export type QuizAnswerFeedback = {
  questionId: string;
  selectedOptionId: string;
  isCorrect: boolean;
  correctOptionId: string;
  explanation: string;
};

export type QuizAttemptQuestion = {
  id: string;
  content: string;
  options: readonly QuizOption[];
  feedback: QuizAnswerFeedback | null;
};

export type QuizAttemptSummary = {
  correctCount: number;
  wrongCount: number;
  totalQuestions: number;
  percentage: number;
  passed: boolean;
  startedAt: string;
  finishedAt: string;
};

export type QuizAttempt = {
  id: string;
  quizId: string;
  status: "IN_PROGRESS" | "FINISHED";
  totalQuestions: number;
  answeredCount: number;
  questions: readonly QuizAttemptQuestion[];
  summary: QuizAttemptSummary | null;
};

export type QuizAttemptData = {
  quiz: PublishedQuiz;
  attempt: QuizAttempt;
};

export type QuizProgressAttempt = {
  id: string;
  status: "IN_PROGRESS" | "FINISHED";
  answeredCount: number;
  totalQuestions: number;
};

export type QuizProgress = {
  quizId: string;
  completed: boolean;
  bestPercentage: number;
  attemptCount: number;
  latestAttempt: QuizProgressAttempt | null;
};

export type QuizProgressCollection = {
  progressByQuizId: ReadonlyMap<string, QuizProgress>;
  unavailableQuizIds: ReadonlySet<string>;
  retryableQuizIds: ReadonlySet<string>;
};

export type InProgressQuiz = {
  id: string;
  quizId: string;
  title: string;
  answeredCount: number;
  totalQuestions: number;
};

export type QuizRepository = {
  listInProgress(token: string): Promise<readonly InProgressQuiz[]>;
  resume(token: string, quizId: string, attemptId: string): Promise<QuizAttemptData>;
  getProgress(token: string, quizId: string): Promise<QuizProgress>;
  start(token: string, quizId: string): Promise<QuizAttemptData>;
  answer(
    token: string,
    attemptId: string,
    questionId: string,
    selectedOptionId: string,
  ): Promise<QuizAnswerFeedback>;
  finish(token: string, attemptId: string): Promise<QuizAttemptSummary>;
  getResult(token: string, attemptId: string): Promise<QuizAttempt>;
};
