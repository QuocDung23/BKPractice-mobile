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

let tokenRefresher: TokenRefresher | null = null;
let refreshInFlight: Promise<AuthTokens | null> | null = null;

export function setTokenRefresher(refresher: TokenRefresher | null): void {
  tokenRefresher = refresher;
}

async function refreshAccessToken(): Promise<AuthTokens | null> {
  if (!tokenRefresher) return null;
  if (!refreshInFlight) {
    refreshInFlight = tokenRefresher()
      .catch(() => null)
      .finally(() => {
        refreshInFlight = null;
      });
  }
  return refreshInFlight;
}

function messageForStatus(status: number, unauthorizedCode: AuthFailureCode): string {
  if (status === 401) {
    return unauthorizedCode === "invalid_credentials"
      ? "That student ID/email and password do not match."
      : "Your session has expired. Sign in again.";
  }
  if (status === 403) return "You do not have access to this action.";
  if (status === 404) return "That information is unavailable.";
  if (status === 409) return "That display name is already in use.";
  if (status === 429) return "Too many attempts. Wait a moment and try again.";
  if (status >= 500) return "BKPractice is temporarily unavailable. Try again.";
  return "Check the information and try again.";
}

function codeForStatus(status: number, unauthorizedCode: AuthFailureCode): AuthFailureCode {
  if (status === 401) return unauthorizedCode;
  if (status === 403) return "forbidden";
  if (status === 409) return "conflict";
  if (status === 429) return "too_many_requests";
  if (status >= 500) return "unavailable";
  return "invalid_request";
}

async function sendRequest(
  request: ApiRequest,
  accessToken?: string,
): Promise<Response> {
  try {
    return await fetch(`${apiBaseUrl}${request.path}`, {
      method: request.method ?? "GET",
      headers: {
        Accept: "application/json",
        ...(request.body ? { "Content-Type": "application/json" } : {}),
        ...(request.mobile ? { "X-Client-Type": "mobile" } : {}),
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
      body: request.body ? JSON.stringify(request.body) : undefined,
    });
  } catch {
    throw new AuthFailure(
      "network",
      "Cannot reach BKPractice. Check your connection.",
    );
  }
}

export async function requestJson<T>(request: ApiRequest): Promise<T> {
  let accessToken = request.accessToken;
  let response = await sendRequest(request, accessToken);

  if (
    response.status === 401 &&
    accessToken &&
    request.retryOnUnauthorized !== false
  ) {
    const tokens = await refreshAccessToken();
    if (tokens) {
      accessToken = tokens.accessToken;
      response = await sendRequest(request, accessToken);
    }
  }

  if (!response.ok) {
    const unauthorizedCode = request.unauthorizedCode ?? "invalid_token";
    throw new AuthFailure(
      codeForStatus(response.status, unauthorizedCode),
      messageForStatus(response.status, unauthorizedCode),
      response.status,
    );
  }

  if (request.expectEmpty || response.status === 204) return undefined as T;

  return (await response.json()) as T;
}
