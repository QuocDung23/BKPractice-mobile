import { useEffect, useRef, useState } from "react";

import { AuthFailure, changeMyPassword } from "@/domain/auth";
import { authRepository } from "@/lib/auth";
import { useAuthSession } from "@/stores/auth-session";

const MIN_PASSWORD_LENGTH = 8;
const MAX_PASSWORD_LENGTH = 128;

export type ChangePasswordState = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  isSubmitting: boolean;
  error: string | null;
  isChanged: boolean;
  setCurrentPassword: (value: string) => void;
  setNewPassword: (value: string) => void;
  setConfirmPassword: (value: string) => void;
  submit: () => Promise<void>;
};

export function useChangePassword(): ChangePasswordState {
  const { session } = useAuthSession();
  const [currentPassword, setCurrentPasswordState] = useState("");
  const [newPassword, setNewPasswordState] = useState("");
  const [confirmPassword, setConfirmPasswordState] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isChanged, setIsChanged] = useState(false);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  function setCurrentPassword(value: string): void {
    setCurrentPasswordState(value);
    setError(null);
  }

  function setNewPassword(value: string): void {
    setNewPasswordState(value);
    setError(null);
  }

  function setConfirmPassword(value: string): void {
    setConfirmPasswordState(value);
    setError(null);
  }

  async function submit(): Promise<void> {
    if (isSubmitting) return;
    setError(null);

    if (!currentPassword) {
      setError("Enter your current password.");
      return;
    }
    if (
      newPassword.length < MIN_PASSWORD_LENGTH ||
      newPassword.length > MAX_PASSWORD_LENGTH
    ) {
      setError(
        `Use a password between ${MIN_PASSWORD_LENGTH} and ${MAX_PASSWORD_LENGTH} characters.`,
      );
      return;
    }
    if (newPassword === currentPassword) {
      setError("Choose a password different from your current one.");
      return;
    }
    if (confirmPassword !== newPassword) {
      setError("The passwords do not match.");
      return;
    }
    if (!session) {
      setError("Your session has expired. Sign in again.");
      return;
    }

    setIsSubmitting(true);
    try {
      await changeMyPassword(
        authRepository,
        session,
        currentPassword,
        newPassword,
      );
      if (isMounted.current) {
        setCurrentPasswordState("");
        setNewPasswordState("");
        setConfirmPasswordState("");
        setIsChanged(true);
      }
    } catch (cause) {
      if (isMounted.current) {
        setError(
          cause instanceof AuthFailure
            ? cause.message
            : "Something went wrong. Try again.",
        );
      }
    } finally {
      if (isMounted.current) setIsSubmitting(false);
    }
  }

  return {
    currentPassword,
    newPassword,
    confirmPassword,
    isSubmitting,
    error,
    isChanged,
    setCurrentPassword,
    setNewPassword,
    setConfirmPassword,
    submit,
  };
}
