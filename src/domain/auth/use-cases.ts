import type {
  AuthRepository,
  PasswordResetRepository,
  ProfileRepository,
  SessionStore,
} from "./repositories";
import {
  AuthFailure,
  type AuthSession,
  type AuthTokens,
  type AuthUser,
  type AvatarFile,
  type AvatarUploadIntent,
  type PasswordResetTicket,
  type Profile,
  type ProfileUpdate,
} from "./types";

export type AuthDeps = {
  auth: AuthRepository;
  store: SessionStore;
};

function isExpiredSession(error: unknown): boolean {
  return error instanceof AuthFailure && error.status === 401;
}

async function readSession(
  { auth, store }: AuthDeps,
  tokens: AuthTokens,
): Promise<AuthSession> {
  const user = await auth.readCurrentUser(tokens.accessToken);
  if (!user.roles.includes("STUDENT")) {
    void auth.signOut(tokens.accessToken, tokens.refreshToken).catch(() => undefined);
    await store.clear();
    throw new AuthFailure(
      "mobile_access_denied",
      "This app is currently available to students only. Please use the web version.",
    );
  }
  return { user, tokens };
}

export async function restoreSession({
  auth,
  store,
}: AuthDeps): Promise<AuthSession | null> {
  const tokens = await store.read();
  if (!tokens) return null;

  try {
    return await readSession({ auth, store }, tokens);
  } catch (error) {
    if (!isExpiredSession(error)) throw error;
  }

  try {
    return await refreshSession({ auth, store }, tokens.refreshToken);
  } catch (error) {
    if (
      error instanceof AuthFailure &&
      (error.code === "mobile_access_denied" || error.code === "storage")
    ) throw error;
    await store.clear();
    return null;
  }
}

export async function refreshSession(
  { auth, store }: AuthDeps,
  refreshToken: string,
  currentUser?: AuthUser,
): Promise<AuthSession> {
  const persisted = await store.read();
  const refreshed = await auth.refresh(refreshToken);
  if (currentUser && currentUser.userId !== refreshed.userId)
    throw new AuthFailure(
      "invalid_token",
      "Your session is no longer valid. Sign in again.",
      401,
    );
  const session = await readSession({ auth, store }, refreshed.tokens);
  if (session.user.userId !== refreshed.userId)
    throw new AuthFailure(
      "invalid_token", "Your session is no longer valid. Sign in again.", 401,
    );
  if (persisted?.refreshToken === refreshToken) await store.write(refreshed.tokens);
  return session;
}

export async function signIn(
  { auth, store }: AuthDeps,
  identifier: string,
  password: string,
  persist: boolean,
): Promise<AuthSession> {
  const tokens = await auth.signIn({ identifier: identifier.trim(), password });
  const session = await readSession({ auth, store }, tokens);
  if (persist) await store.write(tokens);
  else await store.clear();
  return session;
}

export async function startMicrosoftSignIn(
  auth: AuthRepository,
  codeChallenge: string,
): Promise<string> {
  return auth.startMicrosoftLogin(codeChallenge);
}

export async function signInWithMicrosoft(
  { auth, store }: AuthDeps,
  loginCode: string,
  codeVerifier: string,
): Promise<AuthSession> {
  const tokens = await auth.exchangeMicrosoftLogin(loginCode, codeVerifier);
  const session = await readSession({ auth, store }, tokens);
  await store.write(tokens);
  return session;
}

export async function signOut(
  { auth, store }: AuthDeps,
  session: AuthSession,
): Promise<void> {
  const logout = auth.signOut(session.tokens.accessToken, session.tokens.refreshToken)
    .catch(() => undefined);
  await store.clear();
  await logout;
}

export async function changeMyPassword(
  auth: AuthRepository,
  session: AuthSession,
  currentPassword: string,
  newPassword: string,
): Promise<void> {
  return auth.changeMyPassword(
    session.tokens.accessToken,
    currentPassword,
    newPassword,
  );
}

export async function loadMyProfile(
  profiles: ProfileRepository,
  session: AuthSession,
): Promise<Profile> {
  return profiles.readMyProfile(session.tokens.accessToken);
}

export async function saveMyProfile(
  profiles: ProfileRepository,
  session: AuthSession,
  update: ProfileUpdate,
): Promise<Profile> {
  return profiles.updateMyProfile(session.tokens.accessToken, update);
}

export async function requestAvatarUpload(
  profiles: ProfileRepository,
  session: AuthSession,
  contentType: string,
  size: number,
): Promise<AvatarUploadIntent> {
  return profiles.createAvatarUploadIntent(
    session.tokens.accessToken,
    contentType,
    size,
  );
}

export async function uploadAvatar(
  profiles: ProfileRepository,
  intent: AvatarUploadIntent,
  file: AvatarFile,
): Promise<void> {
  return profiles.uploadAvatar(intent, file);
}

export async function sendPasswordResetOtp(
  resets: PasswordResetRepository,
  email: string,
): Promise<void> {
  return resets.sendOtp(email.trim().toLowerCase());
}

export async function verifyPasswordResetOtp(
  resets: PasswordResetRepository,
  email: string,
  otp: string,
): Promise<PasswordResetTicket> {
  return resets.verifyOtp(email.trim().toLowerCase(), otp);
}

export async function resetPassword(
  resets: PasswordResetRepository,
  resetToken: string,
  newPassword: string,
): Promise<void> {
  return resets.resetPassword(resetToken, newPassword);
}
