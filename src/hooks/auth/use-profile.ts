import { useCallback, useEffect, useState } from "react";

import { AuthFailure, loadMyProfile, type Profile } from "@/domain/auth";
import { profileRepository } from "@/lib/auth";
import { readCachedProfile, writeCachedProfile } from "@/lib/profile";
import { useAuthSession } from "@/stores/auth-session";

type ProfileState = {
  profile: Profile | null;
  isLoading: boolean;
  error: string | null;
  reload: () => void;
};

type ProfileRead = {
  userId: string | null;
  key: string | null;
  profile: Profile | null;
  error: string | null;
};

const EMPTY_READ: ProfileRead = {
  userId: null,
  key: null,
  profile: null,
  error: null,
};

export function useProfile(): ProfileState {
  const { session, clearSession } = useAuthSession();
  const [reloadKey, setReloadKey] = useState(0);
  const [read, setRead] = useState<ProfileRead>(EMPTY_READ);
  const requestKey = session ? `${session.user.userId}:${reloadKey}` : null;

  useEffect(() => {
    if (!session || !requestKey) return;
    const userId = session.user.userId;
    let active = true;

    loadMyProfile(profileRepository, session)
      .then((profile) => {
        if (!active) return;
        writeCachedProfile(profile);
        setRead({ userId, key: requestKey, profile, error: null });
      })
      .catch((cause) => {
        if (!active) return;
        if (cause instanceof AuthFailure && cause.status === 401) {
          clearSession(undefined, session);
          return;
        }
        setRead((current) => ({
          userId,
          key: requestKey,
          profile:
            current.userId === userId
              ? current.profile
              : readCachedProfile(userId),
          error:
            cause instanceof AuthFailure
              ? cause.message
              : "Could not load your profile.",
        }));
      });

    return () => {
      active = false;
    };
  }, [session, requestKey, clearSession]);

  const isLoading = session !== null && read.key !== requestKey;
  const profile = session
    ? (readCachedProfile(session.user.userId) ??
      (read.userId === session.user.userId ? read.profile : null))
    : null;
  const error = session && read.key === requestKey ? read.error : null;

  const reload = useCallback(() => setReloadKey((key) => key + 1), []);

  return { profile, isLoading, error, reload };
}
