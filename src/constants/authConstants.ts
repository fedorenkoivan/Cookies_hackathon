export const WARNING_MS = 3 * 60 * 1000; // 3 minutes in milliseconds (jwt in s, js in ms)

export const AUTH_STORAGE_KEYS = {
  ACCESS_TOKEN: "accessToken",
  EXPIRES_AT: "expiresAt",
};

export const USERS_URL = "http://localhost:5000/users";
export const REFRESH_URL = "http://localhost:5000/users/refresh";
export const LOGOUT_URL = "http://localhost:5000/users/logout";
export const REQUIRED_TEXT = "Please complete this required field.";
export const MIN_PASSWORD_LENGTH = 8;
export const ONLY_LATIN_LETTERS = /[a-zA-Z]/;
