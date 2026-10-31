import type { DemoSession } from '@/domain/auth/demo-session';
import { useAuthSession } from '@/stores/auth-session';

export function useHomeData(): DemoSession | null {
  return useAuthSession().session;
}
