export const BASE_URL = "http://localhost:8080";
// Auth endpoints
export const LOGIN_ENDPOINT = `${BASE_URL}/api/auth/login`;
export const GOOGLE_LOGIN_ENDPOINT = `${BASE_URL}/api/auth/google-login`;
export const REGISTER_ENDPOINT = `${BASE_URL}/api/auth/register`;
export const VERIFY_EMAIL_ENDPOINT = `${BASE_URL}/api/auth/verify-email`;
export const VERIFY_EMAIL_TOKEN_ENDPOINT = (token: string) =>
  `${BASE_URL}/api/auth/verify-email/${token}`;
export const RESEND_VERIFICATION_ENDPOINT = `${BASE_URL}/api/auth/resend-verification`;
export const RESET_PASSWORD_ENDPOINT = `${BASE_URL}/api/auth/forgot-password`;
export const RESET_PASSWORD_WITH_TOKEN_ENDPOINT = (token: string) =>
  `${BASE_URL}/api/auth/reset-password/${token}`;
export const UPDATE_PASSWORD_ENDPOINT = `${BASE_URL}/api/auth/update-password`;
export const CHANGE_PASSWORD_ENDPOINT = `${BASE_URL}/api/auth/change-password`;
export const VERIFY_RESET_CODE_ENDPOINT = `${BASE_URL}/api/auth/verify-reset-code`;
export const LOGOUT_ENDPOINT = `${BASE_URL}/api/auth/logout`;
export const REFRESH_TOKEN_ENDPOINT = `${BASE_URL}/api/auth/refresh-token`;
