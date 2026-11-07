import { useEffect } from "react";

import { AuthFailure, refreshSession, restoreSession } from "@/domain/auth";
import { authRepository, scopeSessionStore, sessionStore } from "@/lib/auth";
import { setTokenRefresher } from "@/lib/http";
import { useAuthSession } from "@/stores/auth-session";

export function useSessionRestore(): void {
  const {
    session, setSession, clearSession, finishRestore, beginOperation, captureOperation,
  } = useAuthSession();

  useEffect(() => {
    let active = true;
    const ownsOperation = beginOperation();
    const isCurrent = () => active && ownsOperation();
    const store = scopeSessionStore(sessionStore, isCurrent);
    restoreSession({ auth: authRepository, store })
      .then((restored) => {
        if (isCurrent()) finishRestore(restored);
      })
      .catch((cause: unknown) => {
        if (isCurrent()) clearSession(cause instanceof AuthFailure ? cause : null);
      });
    return () => { active = false; };
  }, [beginOperation, clearSession, finishRestore]);

  useEffect(() => {
    let active = true;
    const ownsOperation = captureOperation();
    const isCurrent = () => active && ownsOperation();
    const store = scopeSessionStore(sessionStore, isCurrent);
    setTokenRefresher(async () => {
      if (!session || !isCurrent()) return null;
      try {
        const next = await refreshSession(
          { auth: authRepository, store },
          session.tokens.refreshToken,
          session.user,
        );
        if (!isCurrent()) return null;
        setSession(next);
        return next.tokens;
      } catch (cause) {
        if (!isCurrent()) return null;
        let reason = cause instanceof AuthFailure ? cause : null;
        if (reason?.code !== "mobile_access_denied" && reason?.code !== "storage") {
          try {
            await store.clear();
          } catch (error) {
            reason = error instanceof AuthFailure ? error : reason;
          }
        }
        if (isCurrent()) clearSession(reason, session);
        return null;
      }
    });
    return () => {
      active = false;
      setTokenRefresher(null);
    };
  }, [session, setSession, clearSession, captureOperation]);
}
