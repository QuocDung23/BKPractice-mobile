import { create, type AxiosResponse } from "axios";

import { AuthFailure, type AuthFailureCode, type AuthTokens } from "@/domain/auth";

import { apiBaseUrl } from "./config";

type JsonBody = Record<string, unknown>;

export type ApiRequest = {
  path: string;
  method?: "GET" | "POST" | "PATCH" | "PUT";
  body?: JsonBody;
  accessToken?: string;
  mobile?: boolean;
  expectEmpty?: boolean;
  unauthorizedCode?: AuthFailureCode;
  retryOnUnauthorized?: boolean;
};

export type TokenRefresher = () => Promise<AuthTokens | null>;

const httpClient = create({
  baseURL: apiBaseUrl,
  timeout: 15000,
  validateStatus: () => true,
});

const failureByStatus: Record<number, { code: AuthFailureCode; message: string }> = {
  403: { code: "forbidden", message: "You do not have access to this action." },
  404: { code: "invalid_request", message: "That information is unavailable." },
  409: { code: "conflict", message: "That display name is already in use." },
  429: {
    code: "too_many_requests",
    message: "Too many attempts. Wait a moment and try again.",
  },
};

let tokenRefresher: TokenRefresher | null = null;
let refreshInFlight: Promise<AuthTokens | null> | null = null;

export function setTokenRefresher(refresher: TokenRefresher | null): void {
  tokenRefresher = refresher;
}

async function refreshAccessToken(): Promise<AuthTokens | null> {
  if (!tokenRefresher) return null;
  refreshInFlight ??= tokenRefresher()
    .catch(() => null)
    .finally(() => {
      refreshInFlight = null;
    });
  return refreshInFlight;
}

function authFailureFor(
  status: number,
  unauthorizedCode: AuthFailureCode,
): AuthFailure {
  if (status === 401) {
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

async function sendRequest(
  request: ApiRequest,
  accessToken?: string,
): Promise<AxiosResponse<unknown>> {
  try {
    return await httpClient.request<unknown>({
      url: request.path,
      method: request.method ?? "GET",
      headers: {
        Accept: "application/json",
        ...(request.body ? { "Content-Type": "application/json" } : {}),
        ...(request.mobile ? { "X-Client-Type": "mobile" } : {}),
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
      data: request.body,
    });
  } catch {
    throw new AuthFailure(
      "network",
      "Cannot reach BKPractice. Check your connection.",
    );
  }
}

export async function requestJson<T>(request: ApiRequest): Promise<T> {
  let response = await sendRequest(request, request.accessToken);

  if (
    response.status === 401 &&
    request.accessToken &&
    request.retryOnUnauthorized !== false
  ) {
    const tokens = await refreshAccessToken();
    if (tokens) response = await sendRequest(request, tokens.accessToken);
  }

  if (response.status < 200 || response.status >= 300) {
    throw authFailureFor(
      response.status,
      request.unauthorizedCode ?? "invalid_token",
    );
  }

  if (request.expectEmpty || response.status === 204) return undefined as T;

  return response.data as T;
}
