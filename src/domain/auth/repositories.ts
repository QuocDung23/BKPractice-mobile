import type {
  AuthRefresh,
  AuthTokens,
  AuthUser,
  AvatarFile,
  AvatarUploadIntent,
  PasswordResetTicket,
  Profile,
  ProfileUpdate,
} from "./types";

export type PasswordCredentials = {
  identifier: string;
  password: string;
};

export interface AuthRepository {
  signIn(credentials: PasswordCredentials): Promise<AuthTokens>;
  exchangeMicrosoftLogin(
    loginCode: string,
    codeVerifier: string,
  ): Promise<AuthTokens>;
  refresh(refreshToken: string): Promise<AuthRefresh>;
  readCurrentUser(accessToken: string): Promise<AuthUser>;
  signOut(accessToken: string, refreshToken: string): Promise<void>;
}

export interface ProfileRepository {
  readMyProfile(accessToken: string): Promise<Profile>;
  updateMyProfile(accessToken: string, update: ProfileUpdate): Promise<Profile>;
  createAvatarUploadIntent(
    accessToken: string,
    contentType: string,
    size: number,
  ): Promise<AvatarUploadIntent>;
  uploadAvatar(intent: AvatarUploadIntent, file: AvatarFile): Promise<void>;
}

export interface PasswordResetRepository {
  sendOtp(email: string): Promise<void>;
  verifyOtp(email: string, otp: string): Promise<PasswordResetTicket>;
  resetPassword(resetToken: string, newPassword: string): Promise<void>;
}

export interface SessionStore {
  read(): Promise<AuthTokens | null>;
  write(tokens: AuthTokens): Promise<void>;
  clear(): Promise<void>;
}
