import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactElement,
  type ReactNode,
} from "react";

import type { AuthFailure, AuthSession } from "@/domain/auth";

export type AuthSessionStatus = "loading" | "signedIn" | "signedOut";

type AuthSessionState = {
  session: AuthSession | null;
  status: AuthSessionStatus;
  notice: AuthFailure | null;
  clearNotice: () => void;
  beginOperation: () => () => boolean;
  captureOperation: () => () => boolean;
  setSession: (session: AuthSession) => void;
  clearSession: (notice?: AuthFailure | null, expected?: AuthSession) => void;
  finishRestore: (session: AuthSession | null) => void;
};

const AuthSessionContext = createContext<AuthSessionState | null>(null);

export function AuthSessionProvider({ children }: { children: ReactNode }): ReactElement {
  const [session, setSessionState] = useState<AuthSession | null>(null);
  const [status, setStatus] = useState<AuthSessionStatus>("loading");
  const [notice, setNotice] = useState<AuthFailure | null>(null);
  const operationVersion = useRef(0);
  const currentSession = useRef<AuthSession | null>(null);

  const captureOperation = useCallback((): (() => boolean) => {
    const version = operationVersion.current;
    return () => version === operationVersion.current;
  }, []);

  const beginOperation = useCallback((): (() => boolean) => {
    operationVersion.current += 1;
    return captureOperation();
  }, [captureOperation]);

  const clearNotice = useCallback((): void => {
    setNotice((current) => (current?.code === "storage" ? current : null));
  }, []);

  const setSession = useCallback((next: AuthSession) => {
    operationVersion.current += 1;
    currentSession.current = next;
    setNotice(null);
    setSessionState(next);
    setStatus("signedIn");
  }, []);

  const clearSession = useCallback(
    (reason?: AuthFailure | null, expected?: AuthSession): void => {
      if (expected && currentSession.current !== expected) return;
      operationVersion.current += 1;
      currentSession.current = null;
      if (reason !== undefined) setNotice(reason);
      setSessionState(null);
      setStatus("signedOut");
    },
    [],
  );

  const finishRestore = useCallback((next: AuthSession | null) => {
    operationVersion.current += 1;
    currentSession.current = next;
    setSessionState(next);
    setStatus(next ? "signedIn" : "signedOut");
  }, []);

  const value = useMemo(
    () => ({
      session, status, notice, clearNotice, beginOperation, captureOperation,
      setSession, clearSession, finishRestore,
    }),
    [session, status, notice, clearNotice, beginOperation, captureOperation,
      setSession, clearSession, finishRestore],
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
