import { create, type AxiosResponse } from "axios";

import { AuthFailure, type AuthFailureCode, type AuthTokens } from "@/domain/auth";

import { apiBaseUrl } from "./config";
import { apiFailureFor } from "./failure";

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
    throw apiFailureFor(
      response.status,
      request.unauthorizedCode ?? "invalid_token",
    );
  }

  if (request.expectEmpty || response.status === 204) return undefined as T;

  return response.data as T;
}
