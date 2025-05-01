import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import "./Navbar.scss";
import {
  cacheUserData,
  getCachedUserData,
  setAuthStatus,
  userLoginEvent,
  userLogoutEvent,
  userAuthorizationEvent,
} from "@/utils/userData";

interface UserData {
  name: string;
  email: string;
}

const Navbar = () => {
  const [userData, setUserData] = useState<UserData | null>(
    getCachedUserData()
  );
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const location = useLocation();

  const fetchUserProfile = async () => {
    if (loading) return;

    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setUserData(getCachedUserData());
        setLoading(false);
        return;
      }

      const response = await fetch("http://localhost:5000/users/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.status === "success") {
        setUserData(data.data.user);
        cacheUserData(data.data.user);
        setAuthStatus(true);
      } else {
        if (response.status === 401) {
          localStorage.removeItem("token");
          setAuthStatus(false);
          setUserData(null);
        }
      }
    } catch (err) {
      console.error(err);
      setAuthStatus(false);
      setUserData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("User data:", userData);
  }, [userData]);

  // useEffect(() => {
  //   const token = localStorage.getItem('token');
  //   if (token && !userData) {
  //     fetchUserProfile();
  //   }
  // }, []);

  useEffect(() => {
    fetchUserProfile();
  }, [location.pathname]);

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "token") {
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

    const handleUserLogout = () => {
      setAuthStatus(false);
      setTimeout(() => navigate("/"), 10);
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener(userLoginEvent, handleUserLogin);
    window.addEventListener(userLogoutEvent, handleUserLogout);
    window.addEventListener(userAuthorizationEvent, () => {
      setUserData(getCachedUserData());
    });

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener(userLoginEvent, handleUserLogin);
      window.removeEventListener(userLogoutEvent, handleUserLogout);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUserData(null);
    window.dispatchEvent(new Event(userLogoutEvent));
  };

  return (
    <nav className="navbar">
      <div className="navbar__left">
        <Link to="/" className="navbar__link">
          C&#127850;&#127850;kies
        </Link>
      </div>

      <div className="navbar__buttons">
        {loading ? (
          <span className="loading">Loading...</span>
        ) : userData ? (
          <>
            {userData.email ? (
              <>
                <Link to="/profile" className="navbar__profile">
                  <img
                    src="src/assets/img1.png"
                    alt="Profile"
                    className="profile-photo-circle"
                  />
                  <span className="username">{userData.name}</span>
                </Link>
                <Stack direction="row">
                  <>
                    <Button className="my-button" onClick={handleLogout}>
                      Log Out
                    </Button>
                  </>
                </Stack>
              </>
            ) : (
              <>
                <Link to="/log-in" className="navbar__profile">
                  <img
                    src="src/assets/img1.png"
                    alt="Profile"
                    className="profile-photo-circle"
                  />
                  <span className="username">{userData.name}</span>
                </Link>

                <Stack spacing={1} direction="row">
                  <Button
                    className="my-button"
                    onClick={() => navigate("log-in")}
                  >
                    <p>Log In</p>
                  </Button>
                </Stack>
              </>
            )}
          </>
        ) : (
          <>
            <Stack spacing={1} direction="row">
              <Button className="my-button" onClick={() => navigate("log-in")}>
                <p>Log In</p>
              </Button>
            </Stack>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
