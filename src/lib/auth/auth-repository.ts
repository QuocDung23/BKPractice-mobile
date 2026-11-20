import {
  AuthFailure,
  type AccountStatus,
  type AuthRefresh,
  type AuthRepository,
  type AuthTokens,
  type AuthUser,
} from "@/domain/auth";

import { requestJson, requestRedirectLocation } from "@/lib/http";

type AuthenticatedResponse = {
  userId: string;
  accessToken?: string;
  refreshToken?: string;
};

type CurrentUserResponse = {
  userId: string;
  studentId: string | null;
  roles: unknown;
  status: string;
};

function readTokens(response: AuthenticatedResponse): AuthTokens {
  if (!response.accessToken || !response.refreshToken)
    throw new AuthFailure(
      "invalid_request",
      "The server returned an incomplete session. Try again.",
    );
  return {
    accessToken: response.accessToken,
    refreshToken: response.refreshToken,
  };
}

function readStatus(value: string): AccountStatus {
  if (value === "LOCKED" || value === "PENDING" || value === "ACTIVE")
    return value;
  return "ACTIVE";
}

export const httpAuthRepository: AuthRepository = {
  async signIn(credentials): Promise<AuthTokens> {
    const response = await requestJson<AuthenticatedResponse>({
      path: "/api/auth/login",
      method: "POST",
      mobile: true,
      unauthorizedCode: "invalid_credentials",
      retryOnUnauthorized: false,
      body: {
        identifier: credentials.identifier,
        password: credentials.password,
      },
    });
    return readTokens(response);
  },

  async startMicrosoftLogin(codeChallenge: string): Promise<string> {
    return requestRedirectLocation({
      path: "/api/auth/microsoft",
      headers: {
        "X-Client-Type": "mobile",
        "X-Mobile-Code-Challenge": codeChallenge,
      },
    });
  },

  async exchangeMicrosoftLogin(loginCode, codeVerifier): Promise<AuthTokens> {
    const response = await requestJson<AuthenticatedResponse>({
      path: "/api/auth/microsoft/exchange",
      method: "POST",
      mobile: true,
      unauthorizedCode: "invalid_token",
      retryOnUnauthorized: false,
      body: { loginCode, codeVerifier },
    });
    return readTokens(response);
  },

  async refresh(refreshToken): Promise<AuthRefresh> {
    const response = await requestJson<AuthenticatedResponse>({
      path: "/api/auth/refresh",
      method: "POST",
      mobile: true,
      unauthorizedCode: "invalid_token",
      retryOnUnauthorized: false,
      body: { refreshToken },
    });
    return { userId: response.userId, tokens: readTokens(response) };
  },

  async readCurrentUser(accessToken): Promise<AuthUser> {
    const response = await requestJson<CurrentUserResponse>({
      path: "/api/auth/me",
      accessToken,
      retryOnUnauthorized: false,
    });
    if (
      !response || !Array.isArray(response.roles) ||
      !response.roles.every((role: unknown) => typeof role === "string")
    ) throw new AuthFailure(
      "invalid_request", "The server returned an incomplete session. Try again.",
    );
    return {
      userId: response.userId,
      studentId: response.studentId,
      roles: response.roles,
      status: readStatus(response.status),
    };
  },

  async changeMyPassword(
    accessToken,
    currentPassword,
    newPassword,
  ): Promise<void> {
    await requestJson<void>({
      path: "/api/auth/password/change",
      method: "POST",
      mobile: true,
      accessToken,
      expectEmpty: true,
      unauthorizedCode: "invalid_current_password",
      body: { currentPassword, newPassword },
    });
  },

  async signOut(accessToken, refreshToken): Promise<void> {
    await requestJson<void>({
      path: "/api/auth/logout",
      method: "POST",
      mobile: true,
      accessToken,
      expectEmpty: true,
      retryOnUnauthorized: false,
      body: { refreshToken },
    });
  },
};
