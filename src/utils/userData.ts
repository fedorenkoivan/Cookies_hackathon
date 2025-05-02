import { nameGenerator } from "../utils/nameGenerator";
interface UserData {
  name: string;
  email: string;
}

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
  const token = localStorage.getItem('token');
  if (status) {
    sessionStorage.setItem("isAuthorized", "true");
    if (!token) cacheUserData({ name: nameGenerator.next().value, email: "" });
  } else {
    sessionStorage.removeItem("isAuthorized");
    sessionStorage.removeItem("userData");
  }
  console.log("isAuthorized event", status);

  window.dispatchEvent(new Event(userAuthorizationEvent));
};
