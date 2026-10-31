import { createContext, useContext, useState, type ReactNode } from 'react';

import type { DemoSession } from '@/domain/auth/demo-session';

type AuthSessionState = {
  session: DemoSession | null;
  setSession: (session: DemoSession | null) => void;
};

const AuthSessionContext = createContext<AuthSessionState | null>(null);

export function AuthSessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<DemoSession | null>(null);

  return (
    <AuthSessionContext.Provider value={{ session, setSession }}>
      {children}
    </AuthSessionContext.Provider>
  );
}

export function useAuthSession(): AuthSessionState {
  const context = useContext(AuthSessionContext);
  if (!context) throw new Error('AuthSessionProvider is missing');
  return context;
}
