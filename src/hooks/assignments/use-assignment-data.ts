import type { AssignmentData } from '@/domain/assignments';
import { useHomeData } from '@/hooks/auth/use-home-data';
import { DEMO_ASSIGNMENT_DATA } from '@/lib/assignments';

export function useAssignmentData(): AssignmentData | null {
  return useHomeData() ? DEMO_ASSIGNMENT_DATA : null;
}
