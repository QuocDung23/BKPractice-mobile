import { useEffect } from "react";

import { refreshSession, restoreSession } from "@/domain/auth";
import { authRepository, sessionStore, setTokenRefresher } from "@/lib/auth";
import { useAuthSession } from "@/stores/auth-session";

export function useSessionRestore(): void {
  const { session, setSession, clearSession, finishRestore } = useAuthSession();

  useEffect(() => {
    let active = true;
    restoreSession({ auth: authRepository, store: sessionStore })
      .then((restored) => {
        if (active) finishRestore(restored);
      })
      .catch(() => {
        if (active) finishRestore(null);
      });
    return () => {
      active = false;
    };
  }, [finishRestore]);

  useEffect(() => {
    setTokenRefresher(async () => {
      if (!session) return null;
      try {
        const next = await refreshSession(
          { auth: authRepository, store: sessionStore },
          session.tokens.refreshToken,
          session.user,
        );
        setSession(next);
        return next.tokens;
      } catch {
        await sessionStore.clear().catch(() => undefined);
        clearSession();
        return null;
      }
    });
    return () => setTokenRefresher(null);
  }, [session, setSession, clearSession]);
}
