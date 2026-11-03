import { router } from "expo-router";
import { useState } from "react";

import { signOut } from "@/domain/auth";
import { authRepository, sessionStore } from "@/lib/auth";
import { useAuthSession } from "@/stores/auth-session";

type SignOutState = {
  isSigningOut: boolean;
  submitSignOut: () => Promise<void>;
};

export function useSignOut(): SignOutState {
  const { session, clearSession } = useAuthSession();
  const [isSigningOut, setIsSigningOut] = useState(false);

  async function submitSignOut(): Promise<void> {
    if (isSigningOut) return;
    setIsSigningOut(true);
    try {
      if (session) await signOut({ auth: authRepository, store: sessionStore }, session);
      else await sessionStore.clear();
    } catch {
      await sessionStore.clear();
    } finally {
      clearSession();
      setIsSigningOut(false);
      router.replace("/sign-in");
    }
  }

  return { isSigningOut, submitSignOut };
}
