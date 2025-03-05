import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import "../../styles/Navbar.scss";

interface UserData {
  name: string;
  email: string;
}

const Navbar: React.FC = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const navigate = useNavigate();
  
  return (
    <nav className="navbar">
      <div className="navbar__left">
        <Link to="/" className="navbar__link">
          C&#127850;&#127850;kies
        </Link>
      </div>

      <div className="navbar__search">
        <FaSearch className="navbar__search-icon" />
        <input type="text" placeholder="Search" className="navbar__search-input" />
      </div>

      <div className="navbar__buttons">
        {userData ? (
          <>
            <Link to="/profile" className="navbar__profile">
              <img src="src/assets/img1.png" alt="Profile" className="profile-photo-circle" />
              <span className="username">{userData.name}</span>
            </Link>
            <button className="navbar__button">
              Log out
            </button>
          </>
        ) : (
          <>
            <button className="navbar__button" onClick={() => navigate("/log-in")}>
              Log in
            </button>
            <button className="navbar__button navbar__button--primary" onClick={() => navigate("/sign-up")}>
              Sign Up
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
