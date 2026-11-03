import { useEffect, useState } from "react";

import {
  AuthFailure,
  resetPassword,
  sendPasswordResetOtp,
  verifyPasswordResetOtp,
} from "@/domain/auth";
import { passwordResetRepository, sessionStore } from "@/lib/auth";
import { useAuthSession } from "@/stores/auth-session";

export type PasswordResetStep = "email" | "otp" | "password" | "done";

type PasswordResetState = {
  step: PasswordResetStep;
  email: string;
  otp: string;
  newPassword: string;
  error: string | null;
  notice: string | null;
  isSubmitting: boolean;
  canResend: boolean;
  resendSeconds: number;
  setEmail: (value: string) => void;
  setOtp: (value: string) => void;
  setNewPassword: (value: string) => void;
  submitEmail: () => Promise<void>;
  submitOtp: () => Promise<void>;
  resendOtp: () => Promise<void>;
  submitPassword: () => Promise<void>;
  editEmail: () => void;
  restart: () => void;
};

const EMAIL_PATTERN = /^\S+@\S+\.\S+$/;
const OTP_PATTERN = /^\d{6}$/;

export function usePasswordReset(): PasswordResetState {
  const { clearSession } = useAuthSession();
  const [step, setStep] = useState<PasswordResetStep>("email");
  const [email, setEmailState] = useState("");
  const [otp, setOtpState] = useState("");
  const [newPassword, setNewPasswordState] = useState("");
  const [resetToken, setResetToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resendAvailableAt, setResendAvailableAt] = useState<number | null>(null);
  const [now, setNow] = useState(0);

  useEffect(() => {
    if (!resendAvailableAt) return;
    const timer = setInterval(() => {
      const current = Date.now();
      setNow(current);
      if (current >= resendAvailableAt) clearInterval(timer);
    }, 1000);
    return () => clearInterval(timer);
  }, [resendAvailableAt]);

  const resendSeconds = resendAvailableAt
    ? Math.max(0, Math.ceil((resendAvailableAt - now) / 1000))
    : 0;
  const canResend = resendSeconds === 0 && !isSubmitting;

  function setEmail(value: string): void {
    setEmailState(value);
    setError(null);
    setNotice(null);
  }

  function setOtp(value: string): void {
    setOtpState(value.replace(/\D/g, "").slice(0, 6));
    setError(null);
  }

  function setNewPassword(value: string): void {
    setNewPasswordState(value);
    setError(null);
  }

  function failureMessage(cause: unknown): string {
    return cause instanceof AuthFailure
      ? cause.message
      : "Something went wrong. Try again.";
  }

  async function requestCode(): Promise<boolean> {
    setError(null);
    setNotice(null);
    if (!EMAIL_PATTERN.test(email.trim())) {
      setError("Enter a valid email address.");
      return false;
    }
    setIsSubmitting(true);
    try {
      await sendPasswordResetOtp(passwordResetRepository, email);
      const availableAt = Date.now() + 60_000;
      setNow(Date.now());
      setResendAvailableAt(availableAt);
      return true;
    } catch (cause) {
      setError(failureMessage(cause));
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }

  async function submitEmail(): Promise<void> {
    const sent = await requestCode();
    if (!sent) return;
    setStep("otp");
    setNotice("If that email is registered, a 6-digit code is on its way.");
  }

  async function resendOtp(): Promise<void> {
    if (!canResend) return;
    const sent = await requestCode();
    if (sent)
      setNotice("A new 6-digit code was sent if that email is registered.");
  }

  async function submitOtp(): Promise<void> {
    if (isSubmitting) return;
    setError(null);
    if (!OTP_PATTERN.test(otp)) {
      setError("Enter the 6-digit code from your email.");
      return;
    }
    setIsSubmitting(true);
    try {
      const ticket = await verifyPasswordResetOtp(
        passwordResetRepository,
        email,
        otp,
      );
      setResetToken(ticket.resetToken);
      setStep("password");
      setNotice("");
    } catch (cause) {
      setError(failureMessage(cause));
    } finally {
      setIsSubmitting(false);
    }
  }

  async function submitPassword(): Promise<void> {
    if (isSubmitting || !resetToken) return;
    setError(null);
    if (newPassword.length < 8 || newPassword.length > 128) {
      setError("Use a password between 8 and 128 characters.");
      return;
    }
    setIsSubmitting(true);
    try {
      await resetPassword(passwordResetRepository, resetToken, newPassword);
      await sessionStore.clear().catch(() => undefined);
      clearSession();
      setStep("done");
      setNotice("Password updated. Sign in with your new password.");
      setNewPasswordState("");
    } catch (cause) {
      setError(failureMessage(cause));
    } finally {
      setIsSubmitting(false);
    }
  }

  function editEmail(): void {
    setStep("email");
    setOtpState("");
    setResetToken(null);
    setResendAvailableAt(null);
    setError(null);
    setNotice(null);
  }

  function restart(): void {
    setStep("email");
    setOtpState("");
    setNewPasswordState("");
    setResetToken(null);
    setResendAvailableAt(null);
    setError(null);
    setNotice(null);
  }

  return {
    step,
    email,
    otp,
    newPassword,
    error,
    notice,
    isSubmitting,
    canResend,
    resendSeconds,
    setEmail,
    setOtp,
    setNewPassword,
    submitEmail,
    submitOtp,
    resendOtp,
    submitPassword,
    editEmail,
    restart,
  };
}
