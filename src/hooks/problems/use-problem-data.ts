import type { ProblemData, ProblemFilter, ProblemSummary } from '@/domain/problems';
import { filterProblems } from '@/domain/problems';
import { useHomeData } from '@/hooks/auth/use-home-data';
import { DEMO_PROBLEM_DATA } from '@/lib/problems/demo-problems';

export function useProblemData(): ProblemData | null {
  return useHomeData() ? DEMO_PROBLEM_DATA : null;
}

export function useFilteredProblems(filter: ProblemFilter): ProblemSummary[] | null {
  const data = useProblemData();
  return data ? filterProblems(data.problems, filter) : null;
}
