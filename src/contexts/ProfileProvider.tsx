import { PropsWithChildren, useEffect } from "react";
import { useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { UserData } from "@/types/user";
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
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

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
  }, [navigate]);

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
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("accessToken");
    setUserData(null);
    setAuthStatus(false);
    setError(null);
  }, []);

  const value = useMemo(
    () => ({
      userData,
      loading,
      error,
      fetchUserProfile,
      logout,
    }),
    [userData, loading, error, fetchUserProfile, logout]
  );

  return (
    <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>
  );
};

/* async () => {
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
          navigate("/log-in");
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
          sessionStorage.setItem("userData", JSON.stringify(data.data.user));
        } else {
          if (
            data.message === "Invalid ID format" ||
            data.message ===
              "Invalid user identification. Please log in again." ||
            data.message?.toLowerCase().includes("invalid")
          ) {
            console.error("Token contains invalid ID, logging out");
            localStorage.removeItem("accessToken");

            navigate("/log-in", {
              state: {
                message: "Your session is invalid. Please log in again.",
              },
            });
            return;
          }

          setError(data.message || "Error fetching user profile");
          if (response.status === 401) {
            localStorage.removeItem("accessToken");
            navigate("/log-in");
          }
        }
      } catch (err) {
        setError("Error connecting to server");
        console.error(err);
      } finally {
        setLoading(false);
      }
    } */
