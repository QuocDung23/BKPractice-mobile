import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";

import { AuthFailure, signIn } from "@/domain/auth";
import { authRepository, scopeSessionStore, sessionStore } from "@/lib/auth";
import { useAuthSession } from "@/stores/auth-session";

type SignInState = {
  error: string | null;
  isSubmitting: boolean;
  submitSignIn: (
    identifier: string,
    password: string,
    persist: boolean,
  ) => Promise<void>;
  clearError: () => void;
  retryStorageCleanup: () => Promise<void>;
};

export function useSignIn(): SignInState {
  const { setSession, clearSession, beginOperation, clearNotice, notice } = useAuthSession();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isMounted = useRef(true);
  useEffect(() => {
    isMounted.current = true;
    return () => { isMounted.current = false; };
  }, []);

  async function submitSignIn(
    identifier: string,
    password: string,
    persist: boolean,
  ): Promise<void> {
    if (isSubmitting || notice?.code === "storage") return;
    setError(null);
    clearNotice();
    if (!identifier.trim() || !password) {
      setError("Enter your student ID/email and password.");
      return;
    }
    setIsSubmitting(true);
    const ownsOperation = beginOperation();
    const isCurrent = () => isMounted.current && ownsOperation();
    const store = scopeSessionStore(sessionStore, isCurrent);
    try {
      const session = await signIn(
        { auth: authRepository, store },
        identifier,
        password,
        persist,
      );
      if (!isCurrent()) return;
      setSession(session);
      router.replace("/home");
    } catch (cause) {
      if (!isCurrent()) return;
      if (cause instanceof AuthFailure && cause.code === "storage") clearSession(cause);
      setError(
        cause instanceof AuthFailure
          ? cause.message
          : "Something went wrong. Try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function retryStorageCleanup(): Promise<void> {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setError(null);
    const ownsOperation = beginOperation();
    const isCurrent = () => isMounted.current && ownsOperation();
    try {
      await scopeSessionStore(sessionStore, isCurrent).clear();
      if (isCurrent()) clearSession(null);
    } catch (cause) {
      if (isCurrent() && cause instanceof AuthFailure) clearSession(cause);
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    error,
    isSubmitting,
    submitSignIn,
    retryStorageCleanup,
    clearError: () => setError(null),
  };
}
