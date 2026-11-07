import type { PasswordResetRepository, PasswordResetTicket } from "@/domain/auth";

import { requestJson } from "@/lib/http";

export const httpPasswordResetRepository: PasswordResetRepository = {
  async sendOtp(email): Promise<void> {
    await requestJson<void>({
      path: "/api/auth/password/send-otp",
      method: "POST",
      mobile: true,
      expectEmpty: true,
      body: { email },
    });
  },

  async verifyOtp(email, otp): Promise<PasswordResetTicket> {
    return requestJson<PasswordResetTicket>({
      path: "/api/auth/password/verify-otp",
      method: "POST",
      mobile: true,
      body: { email, otp },
    });
  },

  async resetPassword(resetToken, newPassword): Promise<void> {
    await requestJson<void>({
      path: "/api/auth/password/reset",
      method: "POST",
      mobile: true,
      expectEmpty: true,
      body: { resetToken, newPassword },
    });
  },
};
