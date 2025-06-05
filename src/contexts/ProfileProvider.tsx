import { PropsWithChildren, useEffect } from "react";
import { useState, useMemo, useCallback } from "react";
import { UserData, UserPublicData } from "@/types/user";
import { historyQuest } from "@/types/quest";
import { ProfileContext } from "./ProfileContext";
import { USERS_URL } from "@/constants/authConstants";
import { PROGRESS_URL } from "@/constants/progressConstants";
import {
  getCachedUserData,
  cacheUserData,
  setAuthStatus,
} from "@/utils/userData";
import { userAuthorizationEvent, userLoginEvent } from "@/utils/userData";
import { useFetchQuests } from "@/hooks/useFetchQuests";

export const ProfileProvider = ({ children }: PropsWithChildren) => {
  const [userData, setUserData] = useState<UserData | null>(
    getCachedUserData()
  );
  const [userPublicData, setUserPublicData] = useState<UserPublicData | null>(
    null
  );
  const [historyQuests, setHistoryQuests] = useState<historyQuest[] | null>(
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

  const getHistoryURL = useCallback(() => {
    if (!userData?.id) {
      return "";
    }
    return `${PROGRESS_URL}?userId=${userData?.id}`;
  }, [userData?.id]);

  const fetchHistoryQuests = useFetchQuests(
    "No history quests available",
    getHistoryURL,
    setHistoryQuests,
    setLoading,
    setError
  );

  const deleteHistoryQuest = useCallback(async (_id: string)=> {
    const result = await fetch(`${PROGRESS_URL}?id=${_id}`, { method: "DELETE" });
    if (result.ok) {
      setHistoryQuests((prev) =>
        prev ? prev.filter((quest) => quest._id !== _id) : null
      );
    } else {
      const errorData = await result.json();
      console.error("Delete failed:", errorData);
      return;
    }

    await fetchHistoryQuests();
  }, [fetchHistoryQuests]);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token && !userData) {
      fetchUserProfile();
      fetchHistoryQuests();
    }
  }, [userData, fetchUserProfile, fetchHistoryQuests]);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token && userData?.id) {
      fetchHistoryQuests();
    }
  }, [userData?.id, fetchHistoryQuests]);

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
      historyQuests,
      loading,
      error,
      fetchUserProfile,
      fetchUserPublicProfile,
      fetchHistoryQuests,
      deleteHistoryQuest,
      logout,
    }),
    [
      userData,
      userPublicData,
      historyQuests,
      loading,
      error,
      fetchUserProfile,
      fetchUserPublicProfile,
      fetchHistoryQuests,
      deleteHistoryQuest,
      logout,
    ]
  );

  return (
    <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>
  );
};
