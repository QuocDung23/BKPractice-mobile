export type AccountStatus = "ACTIVE" | "LOCKED" | "PENDING";

export type AuthUser = {
  userId: string;
  studentId: string | null;
  roles: string[];
  status: AccountStatus;
};

export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
};

export type AuthSession = {
  user: AuthUser;
  tokens: AuthTokens;
};

export type AuthRefresh = {
  userId: string;
  tokens: AuthTokens;
};

export type Profile = {
  userId: string;
  displayName: string;
  avatar: string | null;
  bio: string | null;
};

export type ProfileUpdate = {
  displayName?: string;
  avatar?: string | null;
  bio?: string | null;
};

export type AvatarUploadIntent = {
  avatar: string;
  uploadUrl: string;
  expiresInSeconds: number;
  headers: Record<string, string>;
};

export type AvatarFile = {
  uri: string;
  contentType: string;
};

export type PasswordResetTicket = {
  resetToken: string;
};

export type AuthFailureCode =
  | "invalid_credentials"
  | "invalid_token"
  | "forbidden"
  | "conflict"
  | "invalid_request"
  | "too_many_requests"
  | "unavailable"
  | "network";

export class AuthFailure extends Error {
  readonly code: AuthFailureCode;
  readonly status: number;

  constructor(code: AuthFailureCode, message: string, status = 0) {
    super(message);
    this.name = "AuthFailure";
    this.code = code;
    this.status = status;
  }
}
