import * as SecureStore from "expo-secure-store";

import type { AuthTokens, SessionStore } from "@/domain/auth";

const TOKENS_KEY = "bkpractice.auth.tokens";

export const secureSessionStore: SessionStore = {
  async read(): Promise<AuthTokens | null> {
    const raw = await SecureStore.getItemAsync(TOKENS_KEY);
    if (!raw) return null;
    let parsed: Partial<AuthTokens> | null = null;
    try {
      parsed = JSON.parse(raw) as Partial<AuthTokens>;
    } catch {
      parsed = null;
    }
    if (
      parsed &&
      typeof parsed.accessToken === "string" &&
      typeof parsed.refreshToken === "string"
    )
      return { accessToken: parsed.accessToken, refreshToken: parsed.refreshToken };
    await SecureStore.deleteItemAsync(TOKENS_KEY);
    return null;
  },

  async write(tokens: AuthTokens): Promise<void> {
    await SecureStore.setItemAsync(TOKENS_KEY, JSON.stringify(tokens));
  },

  async clear(): Promise<void> {
    await SecureStore.deleteItemAsync(TOKENS_KEY);
  },
};
