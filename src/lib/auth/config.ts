const fallbackMobileAuthRedirectUrl = "bkpracticemobile:///auth/callback";

export { apiBaseUrl } from "@/lib/http/config";

export const mobileAuthRedirectUrl =
  process.env.EXPO_PUBLIC_AUTH_MOBILE_REDIRECT_URL ??
  fallbackMobileAuthRedirectUrl;
