import { AuthFailure, type SessionStore } from "@/domain/auth";

let pendingStorage: Promise<unknown> = Promise.resolve();

export function scopeSessionStore(
  store: SessionStore,
  isCurrent: () => boolean,
): SessionStore {
  function queueStorage<T>(
    operation: () => Promise<T>,
    fallback: T,
    clearing = false,
  ): Promise<T> {
    if (!isCurrent()) return Promise.resolve(fallback);
    const next = pendingStorage.then(async () => {
      if (!clearing && !isCurrent()) return fallback;
      try {
        return await operation();
      } catch {
        throw new AuthFailure(
          "storage",
          "Could not update the saved session. Retry before signing in.",
        );
      }
    });
    // An already queued clear finishes before newer writes; late cleanup is skipped at enqueue.
    pendingStorage = next.catch(() => undefined);
    return next;
  }

  return {
    read: () => queueStorage(() => store.read(), null),
    write: (tokens) => queueStorage(() => store.write(tokens), undefined),
    clear: () => queueStorage(() => store.clear(), undefined, true),
  };
}
