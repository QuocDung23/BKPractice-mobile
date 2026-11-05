import type { HomeData } from "@/domain/home";
import { createDemoHomeData } from "@/lib/home";
import { useAuthSession } from "@/stores/auth-session";

export function useHomeData(): HomeData | null {
  const { session } = useAuthSession();
  if (!session) return null;
  return createDemoHomeData();
}
