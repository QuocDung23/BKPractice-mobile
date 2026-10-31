export type AssignmentStatus = 'In Progress' | 'Not Started' | 'Overdue' | 'Completed';
export type AssignmentGroup = 'DUE SOON' | 'OVERDUE' | 'COMPLETED';
export type AssignmentDifficulty = 'Easy' | 'Medium' | 'Hard';

export type AssignmentSummary = {
  code: string;
  label: string;
  title: string;
  timing: string;
  status: AssignmentStatus;
  group: AssignmentGroup;
  acceptedProblems: number;
  totalProblems: number;
  available: boolean;
};

export type AssignmentProblem = {
  title: string;
  difficulty: AssignmentDifficulty;
  accepted: boolean;
};

export type AssignmentDetail = {
  summary: AssignmentSummary;
  courseTitle: string;
  dueInDays: number;
  opens: string;
  closes: string;
  instructions: { before: string; compilerFlag: string; after: string };
  problems: readonly AssignmentProblem[];
};

export type AssignmentData = {
  dueSoonCount: number;
  overdueCount: number;
  completedCount: number;
  assignments: readonly AssignmentSummary[];
  detail: AssignmentDetail;
};
