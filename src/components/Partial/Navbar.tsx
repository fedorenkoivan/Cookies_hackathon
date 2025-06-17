import { useEffect, memo } from "react";
import { Link, useNavigate } from "react-router-dom";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import "./Navbar.scss";
import profileImage from "@/assets/img1.png";
import { USERS_URL } from "@/constants/authConstants";
import { useProfileContext } from "@/contexts/ProfileContext";

const Navbar = memo(() => {
  const { userData, loading, fetchUserProfile, logout } = useProfileContext();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token && !userData && !loading) {
      fetchUserProfile();
    }
  }, [userData, loading, fetchUserProfile]);

  const handleLogout = async () => {
    try {
      const response = await fetch(`${USERS_URL}/logout`, {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        logout();
        navigate("/");
      } else {
        console.error("Failed to logout: Server returned", response.status);
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
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
                    src={userData?.profileImage || profileImage}
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
                    src={profileImage}
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
});

export default Navbar;
