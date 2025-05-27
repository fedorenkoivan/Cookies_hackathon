import { PropsWithChildren, useEffect } from "react";
import { useState, useMemo, useCallback } from "react";
import { UserData, UserPublicData } from "@/types/user";
import { ProfileContext } from "./ProfileContext";
import { USERS_URL } from "@/constants/authConstants";
import {
  getCachedUserData,
  cacheUserData,
  setAuthStatus,
} from "@/utils/userData";
import { userAuthorizationEvent, userLoginEvent } from "@/utils/userData";

export const ProfileProvider = ({ children }: PropsWithChildren) => {
  const [userData, setUserData] = useState<UserData | null>(
    getCachedUserData()
  );
  const [userPublicData, setUserPublicData] = useState<UserPublicData | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUserProfile = useCallback(async () => {
    setLoading(true);
    try {
      const userDataStr = sessionStorage.getItem("userData");
      if (userDataStr) {
        setUserData(JSON.parse(userDataStr));
      }
    } catch (e) {
      console.error("Error loading userData from sessionStorage:", e);
    }

    try {
      const accessToken = localStorage.getItem("accessToken");

      if (!accessToken) {
        setUserData(getCachedUserData());
        setLoading(false);
        return;
      }

      const response = await fetch(`${USERS_URL}/profile`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const data = await response.json();

      if (data.status === "success") {
        setUserData(data.data.user);
        cacheUserData(data.data.user);
        setAuthStatus(true);
      } else {
        if (response.status === 401) {
          localStorage.removeItem("accessToken");
          setAuthStatus(false);
          setUserData(null);
          return;
        }

        setError(data.message || "Error fetching user profile");
        if (response.status === 401) {
          localStorage.removeItem("accessToken");
        }
      }
    } catch (err) {
      setError("Error connecting to server");
      console.error(err);
      setAuthStatus(false);
      setUserData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchUserPublicProfile = useCallback(async (userId: string) => {
    setLoading(true);
    try {
      const response = await fetch(`${USERS_URL}/public-profile/${userId}`);
      const data = await response.json();

      if (data.status === "success") {
        setUserPublicData(data.data.user);
      }
    } catch (err) {
      setError("An error occurred while fetching user's public profile");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token && !userData) {
      fetchUserProfile();
    }
  }, []);

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "accessToken") {
        if (e.newValue) {
          fetchUserProfile();
        } else {
          setUserData(null);
        }
      }
    };

    const handleUserLogin = () => {
      fetchUserProfile();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener(userLoginEvent, handleUserLogin);
    window.addEventListener(userAuthorizationEvent, () => {
      setUserData(getCachedUserData());
    });

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener(userLoginEvent, handleUserLogin);
      window.removeEventListener(userAuthorizationEvent, () => {
        setUserData(getCachedUserData());
      });
    };
  }, [fetchUserProfile]);

  const logout = useCallback(() => {
    localStorage.removeItem("accessToken");
    setUserData(null);
    setAuthStatus(false);
    setError(null);
  }, []);

  const value = useMemo(
    () => ({
      userData,
      userPublicData,
      loading,
      error,
      fetchUserProfile,
      fetchUserPublicProfile,
      logout,
    }),
    [
      userData,
      userPublicData,
      loading,
      error,
      fetchUserProfile,
      fetchUserPublicProfile,
      logout,
    ]
  );

  return (
    <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>
  );
};
