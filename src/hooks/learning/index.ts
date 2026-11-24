import { useCallback, useEffect, useEffectEvent, useState } from "react";

import { AuthFailure } from "@/domain/auth";
import type { LearningRequest, LearningRequestResult } from "@/domain/learning";
import { useAuthSession } from "@/stores/auth-session";

export function describeLearningFailure(error: unknown): {
  message: string;
  retryable: boolean;
} {
  if (!(error instanceof AuthFailure)) {
    return { message: "Something went wrong. Try again.", retryable: true };
  }
  if (error.status === 409) {
    return {
      message: "This activity has changed. Reload it and try again.",
      retryable: true,
    };
  }
  return {
    message: error.message,
    retryable: ![401, 403, 404].includes(error.status),
  };
}

export function useLearningRequest<T>(
  key: string | undefined,
  load: (token: string) => Promise<T>,
): LearningRequestResult<T> {
  const { session, status } = useAuthSession();
  const userId = session?.user.userId;
  const [revision, setRevision] = useState(0);
  const [completed, setCompleted] = useState<{
    key: string;
    userId: string;
    revision: number;
    state: LearningRequest<T>;
  }>();
  const run = useEffectEvent(async (): Promise<T> => {
    if (!session)
      throw new AuthFailure(
        "invalid_token",
        "Your session has expired. Sign in again.",
        401,
      );
    return load(session.tokens.accessToken);
  });

  useEffect(() => {
    if (status !== "signedIn" || !key || !userId) return;
    let active = true;
    run().then(
      (data) => {
        if (active)
          setCompleted({
            key,
            userId,
            revision,
            state: { status: "success", data },
          });
      },
      (error: unknown) => {
        if (active) {
          setCompleted({
            key,
            userId,
            revision,
            state: { status: "error", ...describeLearningFailure(error) },
          });
        }
      },
    );
    return () => {
      active = false;
    };
  }, [key, revision, status, userId]);

  const state: LearningRequest<T> =
    !key || status === "signedOut"
      ? { status: "idle" }
      : completed &&
          status === "signedIn" &&
          completed.key === key &&
          completed.revision === revision &&
          completed.userId === userId
        ? completed.state
        : { status: "loading" };
  const retry = useCallback(
    () => setRevision((current) => current + 1),
    [],
  );
  return { state, retry };
}
