const fallbackApiBaseUrl = "http://localhost:3000";
const fallbackMobileAuthRedirectUrl = "bkpracticemobile:///auth/callback";

export const apiBaseUrl = (
  process.env.EXPO_PUBLIC_API_BASE_URL ?? fallbackApiBaseUrl
).replace(/\/+$/, "");

export const mobileAuthRedirectUrl =
  process.env.EXPO_PUBLIC_AUTH_MOBILE_REDIRECT_URL ??
  fallbackMobileAuthRedirectUrl;
