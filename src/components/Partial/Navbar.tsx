import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
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
  const location = useLocation();
  
  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setUserData(null);
        return;
      }
      
      const response = await fetch('http://localhost:5000/users/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      
      if (data.status === 'success') {
        setUserData(data.data.user);
      } else {
        if (response.status === 401) {
          localStorage.removeItem('token');
          setUserData(null);
        }
      }
    } catch (err) {
      console.error(err);
      setUserData(null);
    }
  };
  
  useEffect(() => {
    fetchUserProfile();
  }, [location.pathname]);
  
  useEffect(() => {
    const handleStorageChange = (e: any) => {
      if (e.key === 'token') {
        fetchUserProfile();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUserData(null);
    navigate('/');
  };
  
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
                <Button className="my-button" onClick={handleLogout}>Log Out</Button>
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
