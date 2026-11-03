import type {
  AuthRepository,
  PasswordResetRepository,
  ProfileRepository,
  SessionStore,
} from "@/domain/auth";

import { httpAuthRepository } from "./auth-repository";
import { httpPasswordResetRepository } from "./password-reset-repository";
import { httpProfileRepository } from "./profile-repository";
import { secureSessionStore } from "./secure-session-store";

export { apiBaseUrl, mobileAuthRedirectUrl } from "./config";
export { setTokenRefresher } from "./api-client";
export const authRepository: AuthRepository = httpAuthRepository;
export const profileRepository: ProfileRepository = httpProfileRepository;
export const passwordResetRepository: PasswordResetRepository =
  httpPasswordResetRepository;
export const sessionStore: SessionStore = secureSessionStore;
