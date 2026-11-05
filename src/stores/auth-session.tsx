import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import type { AuthSession } from "@/domain/auth";

export type AuthSessionStatus = "loading" | "signedIn" | "signedOut";

type AuthSessionState = {
  session: AuthSession | null;
  status: AuthSessionStatus;
  setSession: (session: AuthSession) => void;
  clearSession: () => void;
  finishRestore: (session: AuthSession | null) => void;
};

const AuthSessionContext = createContext<AuthSessionState | null>(null);

export function AuthSessionProvider({ children }: { children: ReactNode }) {
  const [session, setSessionState] = useState<AuthSession | null>(null);
  const [status, setStatus] = useState<AuthSessionStatus>("loading");

  const setSession = useCallback((next: AuthSession) => {
    setSessionState(next);
    setStatus("signedIn");
  }, []);

  const clearSession = useCallback(() => {
    setSessionState(null);
    setStatus("signedOut");
  }, []);

  const finishRestore = useCallback((next: AuthSession | null) => {
    setSessionState(next);
    setStatus(next ? "signedIn" : "signedOut");
  }, []);

  const value = useMemo(
    () => ({ session, status, setSession, clearSession, finishRestore }),
    [session, status, setSession, clearSession, finishRestore],
  );

  return (
    <AuthSessionContext.Provider value={value}>
      {children}
    </AuthSessionContext.Provider>
  );
}

export function useAuthSession(): AuthSessionState {
  const context = useContext(AuthSessionContext);
  if (!context) throw new Error("AuthSessionProvider is missing");
  return context;
}
