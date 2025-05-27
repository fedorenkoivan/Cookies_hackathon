import { useState, useEffect, useCallback, useRef } from "react";
import { userLoginEvent } from "@/utils/userData";
import { AuthResponse } from "@/types/authResponse";
import { USERS_URL, WARNING_MS } from "@/constants/authConstants";
import {
  getTokenExpiration,
  getStoredToken,
  storeAuthData,
  clearAuthData,
} from "@/utils/authUtils";
import {
  setupTokenTimers,
  clearTokenTimers,
  TokenTimerRefs,
} from "@/utils/tokenMonitoring";

export const useAuth = () => {
  const { token: initialToken, expiresAt: initialExpiresAt } = getStoredToken();
  const [accessToken, setAccessToken] = useState<string | null>(initialToken);
  const [expiresAt, setExpiresAt] = useState<number | null>(initialExpiresAt);
  const [showRenewalPrompt, setShowRenewalPrompt] = useState(false);

  const userDismissedRenewal = useRef(false);
  const tokenExpired = useRef(false);
  const timerRef = useRef<TokenTimerRefs>({ warning: null, expiration: null });

  useEffect(() => {
    userDismissedRenewal.current = false;
    tokenExpired.current = false;
  }, [accessToken, expiresAt]);

  useEffect(() => {
    clearTokenTimers(timerRef.current);

    if (!accessToken || !expiresAt) {
      setShowRenewalPrompt(false);
      userDismissedRenewal.current = false;
      tokenExpired.current = false;
      return;
    }

    timerRef.current = setupTokenTimers(
      expiresAt,
      WARNING_MS,
      () => {
        setShowRenewalPrompt(true);
      },
      () => {
        tokenExpired.current = true;
        // logout();
      },
      userDismissedRenewal.current,
    );

    const warningTimer = timerRef.current.warning;
    const expirationTimer = timerRef.current.expiration;

    return () => {
      if (warningTimer) clearTimeout(warningTimer);
      if (expirationTimer) clearTimeout(expirationTimer);
    };
  }, [accessToken, expiresAt]);

  const refresh = useCallback(async (): Promise<boolean> => {
    try {
      const res = await fetch(`${USERS_URL}/refresh`, {
        method: "POST",
        credentials: "include",
      });

      if (!res.ok) return false;
      const data: AuthResponse = await res.json();
      if (!data.accessToken) return false;

      const newExpiresAt = getTokenExpiration(data.accessToken);
      if (!newExpiresAt) return false;

      storeAuthData(data.accessToken, newExpiresAt);

      setAccessToken(data.accessToken);
      setExpiresAt(newExpiresAt);
      setShowRenewalPrompt(false);

      return true;
    } catch (error) {
      console.error("Refresh failed:", error);
      return false;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await fetch(`${USERS_URL}/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      clearAuthData();
      setAccessToken(null);
      setExpiresAt(null);
      setShowRenewalPrompt(false);
    }
  }, []);

  const handleRenewalResponse = useCallback(
    (shouldExtend: boolean) => {
      if (shouldExtend) {
        refresh();
      } else {
        userDismissedRenewal.current = true;
        setShowRenewalPrompt(false);
      }
    },
    [refresh],
  );

  useEffect(() => {
    const handleTokenRefresh = () => {
      const { token, expiresAt: storedExpiresAt } = getStoredToken();

      if (token && storedExpiresAt) {
        setAccessToken(token);
        setExpiresAt(storedExpiresAt);
        userDismissedRenewal.current = false;
        tokenExpired.current = false;
      }
    };

    window.addEventListener(userLoginEvent, handleTokenRefresh);
    return () => {
      window.removeEventListener(userLoginEvent, handleTokenRefresh);
    };
  }, []);

  return {
    accessToken,
    showRenewalPrompt,
    handleRenewalResponse,
    refresh,
    logout,
  };
};
