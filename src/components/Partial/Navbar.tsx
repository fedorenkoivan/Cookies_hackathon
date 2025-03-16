import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import './Navbar.scss';

interface UserData {
  name: string;
  email: string;
}

const Navbar = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const navigate = useNavigate();
  
  return (
    <nav className="navbar">
      <div className="navbar__left">
        <Link to="/" className="navbar__link">
          C&#127850;&#127850;kies
        </Link>
      </div>

      <div className="navbar__buttons">
        {userData ? (
          <>
            <Link to="/profile" className="navbar__profile">
              <img src="src/assets/img1.png" alt="Profile" className="profile-photo-circle" />
              <span className="username">{userData.name}</span>
            </Link>
            <Stack direction="row">
                <Button className="my-button">Log Out</Button>
          </Stack>
          </>
        ) : (
          <>
          <Stack spacing={1} direction="row">
          <Button 
          className="my-button"
          onClick={() => navigate('log-in')}
          >
            Log In
            </Button>
          </Stack>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
