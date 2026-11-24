import type { LearningPage, LearningRequestResult } from '@/domain/learning';
import type {
  ProblemData,
  ProblemFilter,
  ProblemSummary,
  PublishedProblem,
  PublishedProblemDetail,
} from '@/domain/problems';
import { filterProblems } from '@/domain/problems';
import { useHomeData } from '@/hooks/auth/use-home-data';
import { useLearningRequest } from '@/hooks/learning';
import { DEMO_PROBLEM_DATA } from '@/lib/problems/demo-problems';
import { problemRepository } from '@/lib/problems';

export function usePublishedProblems(
  page: number,
  filter: ProblemFilter,
): LearningRequestResult<LearningPage<PublishedProblem>> {
  return useLearningRequest(`problems:${page}:${filter}`, (token) =>
    problemRepository.list(token, page, filter),
  );
}

export function usePublishedProblem(
  idOrSlug: string,
): LearningRequestResult<PublishedProblemDetail> {
  return useLearningRequest(`problem:${idOrSlug}`, (token) =>
    problemRepository.get(token, idOrSlug),
  );
}

export function useProblemData(): ProblemData | null {
  return useHomeData() ? DEMO_PROBLEM_DATA : null;
}

export function useFilteredProblems(filter: ProblemFilter): ProblemSummary[] | null {
  const data = useProblemData();
  return data ? filterProblems(data.problems, filter) : null;
}
