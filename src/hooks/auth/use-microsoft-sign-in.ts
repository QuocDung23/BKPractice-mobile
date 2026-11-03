import * as Linking from "expo-linking";
import { router } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { useState } from "react";

import { AuthFailure, signInWithMicrosoft } from "@/domain/auth";
import {
  apiBaseUrl,
  authRepository,
  mobileAuthRedirectUrl,
  sessionStore,
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
  const { setSession } = useAuthSession();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function submitMicrosoftSignIn(): Promise<void> {
    if (isSubmitting) return;
    setError(null);
    setIsSubmitting(true);
    try {
      const pkce = await createMicrosoftPkce();
      const startUrl = `${apiBaseUrl}/api/auth/microsoft?client_type=mobile&code_challenge=${encodeURIComponent(pkce.challenge)}`;
      const result = await WebBrowser.openAuthSessionAsync(
        startUrl,
        mobileAuthRedirectUrl,
      );
      if (result.type !== "success") return;
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
        { auth: authRepository, store: sessionStore },
        loginCode,
        pkce.verifier,
      );
      setSession(session);
      router.replace("/home");
    } catch (cause) {
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
