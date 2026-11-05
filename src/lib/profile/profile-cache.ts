import type { Profile } from "@/domain/auth";

const profiles = new Map<string, Profile>();

export function readCachedProfile(userId: string): Profile | null {
  return profiles.get(userId) ?? null;
}

export function writeCachedProfile(profile: Profile): void {
  profiles.set(profile.userId, profile);
}
