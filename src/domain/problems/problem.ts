import type { LearningPage } from "@/domain/learning";

export type ProblemDifficulty = 'Easy' | 'Medium' | 'Hard';
export type ProblemFilter = 'All' | ProblemDifficulty;
export type ProblemState = 'Accepted' | 'In Progress' | 'Not Attempted';

export type PublishedProblem = {
  id: string;
  slug: string;
  title: string;
  difficulty: ProblemDifficulty;
  topics: readonly string[];
  solved: boolean;
};

export type PublishedProblemDetail = PublishedProblem & {
  statement: string;
  examples: readonly ProblemExample[];
  constraints: string | null;
  timeLimitMs: number;
  memoryLimitMb: number;
};

export type ProblemRepository = {
  list(
    token: string,
    page: number,
    filter: ProblemFilter,
  ): Promise<LearningPage<PublishedProblem>>;
  get(token: string, idOrSlug: string): Promise<PublishedProblemDetail>;
};

export type ProblemSummary = {
  number: number;
  title: string;
  difficulty: ProblemDifficulty;
  acceptancePercent: number;
  topic: string;
  state: ProblemState;
};

export type ProblemExample = { input: string; output: string };

export type ProblemDetail = {
  problem: ProblemSummary;
  timeLimit: string;
  memoryLimit: string;
  statement: string;
  examples: readonly ProblemExample[];
  constraints: readonly string[];
};

export type SubmissionCase = { label: string; runtime: string; status: 'Passed' };

export type SubmissionResult = {
  id: string;
  submittedAt: string;
  status: 'Accepted';
  language: string;
  runtime: string;
  memory: string;
  passedTests: number;
  totalTests: number;
  cases: readonly SubmissionCase[];
  filename: string;
  codePreview: string;
};

export type ProblemData = {
  courseCode: string;
  acceptedProblems: number;
  totalProblems: number;
  problems: readonly ProblemSummary[];
  detail: ProblemDetail;
  result: SubmissionResult;
};

export function filterProblems(problems: readonly ProblemSummary[], filter: ProblemFilter): ProblemSummary[] {
  return problems.filter((problem) => filter === 'All' || problem.difficulty === filter);
}
