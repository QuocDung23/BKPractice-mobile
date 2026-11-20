import * as Linking from "expo-linking";
import { router } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { useEffect, useRef, useState } from "react";

import {
  AuthFailure,
  signInWithMicrosoft,
  startMicrosoftSignIn,
} from "@/domain/auth";
import {
  authRepository,
  mobileAuthRedirectUrl,
  sessionStore,
  scopeSessionStore,
} from "@/lib/auth";
import { createMicrosoftPkce } from "@/lib/auth/microsoft-pkce";
import { useAuthSession } from "@/stores/auth-session";

type QueryParams = Record<string, string | string[] | undefined>;

type MicrosoftSignInState = {
  error: string | null;
  isSubmitting: boolean;
  submitMicrosoftSignIn: () => Promise<void>;
  clearError: () => void;
};

function readString(query: QueryParams | null, key: string): string | null {
  const value = query?.[key];
  return typeof value === "string" ? value : null;
}

export function useMicrosoftSignIn(): MicrosoftSignInState {
  const { setSession, clearSession, beginOperation, clearNotice, notice } = useAuthSession();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isMounted = useRef(true);
  useEffect(() => {
    isMounted.current = true;
    return () => { isMounted.current = false; };
  }, []);

  async function submitMicrosoftSignIn(): Promise<void> {
    if (isSubmitting || notice?.code === "storage") return;
    setError(null);
    setIsSubmitting(true);
    clearNotice();
    const ownsOperation = beginOperation();
    const isCurrent = () => isMounted.current && ownsOperation();
    const store = scopeSessionStore(sessionStore, isCurrent);
    try {
      const pkce = await createMicrosoftPkce();
      const microsoftUrl = await startMicrosoftSignIn(
        authRepository,
        pkce.challenge,
      );
      const result = await WebBrowser.openAuthSessionAsync(
        microsoftUrl,
        mobileAuthRedirectUrl,
      );
      if (!isCurrent() || result.type !== "success") return;
      const query = Linking.parse(result.url).queryParams;
      const loginCode = readString(query, "loginCode");
      if (!loginCode) {
        setError(
          readString(query, "error")
            ? "Microsoft sign-in was cancelled or denied."
            : "Microsoft sign-in did not finish. Try again.",
        );
        return;
      }
      const session = await signInWithMicrosoft(
        { auth: authRepository, store },
        loginCode,
        pkce.verifier,
      );
      if (!isCurrent()) return;
      setSession(session);
      router.replace("/home");
    } catch (cause) {
      if (!isCurrent()) return;
      if (cause instanceof AuthFailure && cause.code === "storage") clearSession(cause);
      if (cause instanceof AuthFailure) {
        setError(
          cause.code === "invalid_token"
            ? "Microsoft sign-in expired. Try again."
            : cause.message,
        );
      } else {
        setError("Something went wrong. Try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    error,
    isSubmitting,
    submitMicrosoftSignIn,
    clearError: () => setError(null),
  };
}
