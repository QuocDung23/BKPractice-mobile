import { router } from "expo-router";
import { useState } from "react";

import { AuthFailure, signIn } from "@/domain/auth";
import { authRepository, sessionStore } from "@/lib/auth";
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
};

export function useSignIn(): SignInState {
  const { setSession } = useAuthSession();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function submitSignIn(
    identifier: string,
    password: string,
    persist: boolean,
  ): Promise<void> {
    if (isSubmitting) return;
    setError(null);
    if (!identifier.trim() || !password) {
      setError("Enter your student ID/email and password.");
      return;
    }
    setIsSubmitting(true);
    try {
      const session = await signIn(
        { auth: authRepository, store: sessionStore },
        identifier,
        password,
        persist,
      );
      setSession(session);
      router.replace("/home");
    } catch (cause) {
      setError(
        cause instanceof AuthFailure
          ? cause.message
          : "Something went wrong. Try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    error,
    isSubmitting,
    submitSignIn,
    clearError: () => setError(null),
  };
}
