export const WARNING_MS = 3 * 60 * 1000; // 3 minutes in milliseconds (jwt in s, js in ms)

export const AUTH_STORAGE_KEYS = {
  ACCESS_TOKEN: "accessToken",
  EXPIRES_AT: "expiresAt",
};

export const USERS_URL = "/api/users";
export const REFRESH_URL = "/api/users/refresh";
export const LOGOUT_URL = "/api/users/logout";
export const REQUIRED_TEXT = "Please complete this required field.";
export const MIN_PASSWORD_LENGTH = 8;
export const ONLY_LATIN_LETTERS = /[a-zA-Z]/;
