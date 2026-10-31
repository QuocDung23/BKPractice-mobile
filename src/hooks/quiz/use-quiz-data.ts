import type { QuizData } from '@/domain/quiz';
import { useHomeData } from '@/hooks/auth/use-home-data';
import { DEMO_QUIZ_DATA } from '@/lib/quiz';

export function useQuizData(): QuizData | null {
  return useHomeData() ? DEMO_QUIZ_DATA : null;
}
