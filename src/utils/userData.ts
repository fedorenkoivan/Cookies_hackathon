import { nameGenerator } from "../utils/nameGenerator";
import { UserData } from "@/types/user";

export const userLoginEvent = "userLoggedIn";
export const userLogoutEvent = "userLoggedOut";
export const userAuthorizationEvent = "userAuthorized";

export const cacheUserData = (userData: UserData | null) => {
  if (userData) {
    sessionStorage.setItem("userData", JSON.stringify(userData));
  } else {
    sessionStorage.removeItem("userData");
  }
};

export const getCachedUserData = (): UserData | null => {
  const cachedData = sessionStorage.getItem("userData");
  return cachedData ? JSON.parse(cachedData) : null;
};

export const setAuthStatus = (status: boolean) => {
  const accessToken = localStorage.getItem('accessToken');
  if (status) {
    sessionStorage.setItem("isAuthorized", "true");
    if (!accessToken) cacheUserData({ id: "", name: nameGenerator.next().value, email: "" });
  } else {
    sessionStorage.removeItem("isAuthorized");
    sessionStorage.removeItem("userData");
  }

  window.dispatchEvent(new Event(userAuthorizationEvent));
};
