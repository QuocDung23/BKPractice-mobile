import { router } from "expo-router";
import { useState } from "react";

import { AuthFailure, signOut } from "@/domain/auth";
import { authRepository, scopeSessionStore, sessionStore } from "@/lib/auth";
import { useAuthSession } from "@/stores/auth-session";

type SignOutState = {
  isSigningOut: boolean;
  submitSignOut: () => Promise<void>;
};

export function useSignOut(): SignOutState {
  const { session, clearSession, beginOperation } = useAuthSession();
  const [isSigningOut, setIsSigningOut] = useState(false);

  async function submitSignOut(): Promise<void> {
    if (isSigningOut) return;
    setIsSigningOut(true);
    clearSession(null);
    router.replace("/sign-in");
    const isCurrent = beginOperation();
    const store = scopeSessionStore(sessionStore, isCurrent);
    try {
      if (session) await signOut({ auth: authRepository, store }, session);
      else await store.clear();
    } catch (cause) {
      if (isCurrent() && cause instanceof AuthFailure && cause.code === "storage")
        clearSession(cause);
    } finally {
      setIsSigningOut(false);
    }
  }

  return { isSigningOut, submitSignOut };
}
