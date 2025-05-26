import { AUTH_STORAGE_KEYS } from "../constants/authConstants";

export const parseJwt = (token: string) => {
  try {
    const tokenParts = token.split(".");
    if (tokenParts.length !== 3) return null;

    const payload = JSON.parse(atob(tokenParts[1]));
    return payload;
  } catch (error) {
    console.error("Failed to parse JWT token:", error);
    return null;
  }
};

export const getTokenExpiration = (token: string): number | null => {
  const payload = parseJwt(token);
  if (!payload || !payload.exp) return null;
  return payload.exp * 1000;
};

export const storeTokenData = (token: string): number | null => {
  const expiresAt = getTokenExpiration(token);
  if (!expiresAt) return null;

  localStorage.setItem("accessToken", token);
  localStorage.setItem("expiresAt", expiresAt.toString());
  return expiresAt;
};

export const getStoredToken = (): {
  token: string | null;
  expiresAt: number | null;
} => {
  const token = localStorage.getItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN);
  const storedExpiresAt = localStorage.getItem(AUTH_STORAGE_KEYS.EXPIRES_AT);

  return {
    token,
    expiresAt: storedExpiresAt ? parseInt(storedExpiresAt, 10) : null,
  };
};

export const storeAuthData = (token: string, expiresAt: number) => {
  localStorage.setItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN, token);
  localStorage.setItem(AUTH_STORAGE_KEYS.EXPIRES_AT, expiresAt.toString());
};

export const clearAuthData = () => {
  localStorage.removeItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN);
  localStorage.removeItem(AUTH_STORAGE_KEYS.EXPIRES_AT);
};
