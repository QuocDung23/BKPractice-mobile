import { AuthFailure, type AuthFailureCode } from "@/domain/auth";

const failureByStatus: Record<number, { code: AuthFailureCode; message: string }> = {
  403: { code: "forbidden", message: "You do not have access to this action." },
  404: { code: "invalid_request", message: "That information is unavailable." },
  409: { code: "conflict", message: "That display name is already in use." },
  429: {
    code: "too_many_requests",
    message: "Too many attempts. Wait a moment and try again.",
  },
};

export function apiFailureFor(
  status: number,
  unauthorizedCode: AuthFailureCode,
): AuthFailure {
  if (status === 401) {
    if (unauthorizedCode === "invalid_current_password") {
      return new AuthFailure(
        unauthorizedCode,
        "Your current password is incorrect.",
        status,
      );
    }
    const message =
      unauthorizedCode === "invalid_credentials"
        ? "That student ID/email and password do not match."
        : "Your session has expired. Sign in again.";
    return new AuthFailure(unauthorizedCode, message, status);
  }
  if (status >= 500) {
    return new AuthFailure(
      "unavailable",
      "BKPractice is temporarily unavailable. Try again.",
      status,
    );
  }
  const failure = failureByStatus[status];
  return new AuthFailure(
    failure?.code ?? "invalid_request",
    failure?.message ?? "Check the information and try again.",
    status,
  );
}
