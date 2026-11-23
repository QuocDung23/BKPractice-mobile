import { AuthFailure } from "@/domain/auth";
import type { LearningPage } from "@/domain/learning";
import { requestJson, type ApiRequest } from "@/lib/http";

export function readObject(value: unknown): Record<string, unknown> {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw new Error("Expected an object");
  }
  return value as Record<string, unknown>;
}

export function readText(value: unknown): string {
  if (typeof value !== "string") throw new Error("Expected text");
  return value;
}

export function readOptionalText(value: unknown): string | null {
  return value === null ? null : readText(value);
}

export function readCount(value: unknown): number {
  if (typeof value !== "number" || !Number.isSafeInteger(value) || value < 0) {
    throw new Error("Expected a nonnegative integer");
  }
  return value;
}

export function readBoolean(value: unknown): boolean {
  if (typeof value !== "boolean") throw new Error("Expected a boolean");
  return value;
}

export function readList<T>(value: unknown, decode: (item: unknown) => T): T[] {
  if (!Array.isArray(value)) throw new Error("Expected a list");
  return value.map(decode);
}

export function readPage<T>(
  value: unknown,
  decode: (item: unknown) => T,
  sizeField: "pageSize" | "limit",
): LearningPage<T> {
  const data = readObject(value);
  const page = readCount(data.page);
  const pageSize = readCount(data[sizeField]);
  if (!page || !pageSize) throw new Error("Invalid pagination");
  return {
    items: readList(data.items, decode),
    total: readCount(data.total),
    page,
    pageSize,
  };
}

export async function fetchLearning<T>(
  accessToken: string,
  request: Omit<ApiRequest, "accessToken">,
  decode: (value: unknown) => T,
): Promise<T> {
  const data = await requestJson<unknown>({ ...request, accessToken });
  try {
    return decode(data);
  } catch {
    throw new AuthFailure("unavailable", "BKPractice returned an unexpected response. Try again.");
  }
}
