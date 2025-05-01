import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import './Navbar.scss';

interface UserData {
  name: string;
  email: string;
}

export const userLoginEvent = 'userLoggedIn';
export const userLogoutEvent = 'userLoggedOut';

const cacheUserData = (userData: UserData | null) => {
  if (userData) {
    sessionStorage.setItem('userData', JSON.stringify(userData));
  } else {
    sessionStorage.removeItem('userData');
  }
};

const getCachedUserData = (): UserData | null => {
  const cachedData = sessionStorage.getItem('userData');
  return cachedData ? JSON.parse(cachedData) : null;
};

const Navbar = () => {
  const [userData, setUserData] = useState<UserData | null>(getCachedUserData());
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  const fetchUserProfile = async () => {
    if (loading) return;
    
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setUserData(null);
        cacheUserData(null);
        setLoading(false);
        return;
      }
      
      const response = await fetch('http://localhost:5000/users/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include',
      });
      
      const data = await response.json();
      
      if (data.status === 'success') {
        setUserData(data.data.user);
        cacheUserData(data.data.user);
      } else {
        if (response.status === 401) {
          localStorage.removeItem('token');
          setUserData(null);
          cacheUserData(null);
        }
      }
    } catch (err) {
      console.error(err);
      setUserData(null);
      cacheUserData(null);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && !userData) {
      fetchUserProfile();
    }
  }, []);
  
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && !userData) {
      fetchUserProfile();
    }
  }, [location.pathname]);
  
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'token') {
        if (e.newValue) {
          fetchUserProfile();
        } else {
          setUserData(null);
          cacheUserData(null);
        }
      }
    };
    
    const handleUserLogin = () => {
      fetchUserProfile();
    };
    
    const handleUserLogout = () => {
      setUserData(null);
      cacheUserData(null);
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener(userLoginEvent, handleUserLogin);
    window.addEventListener(userLogoutEvent, handleUserLogout);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener(userLoginEvent, handleUserLogin);
      window.removeEventListener(userLogoutEvent, handleUserLogout);
    };
  }, []);

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:5000/users/logout', {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        localStorage.removeItem('token');
        setUserData(null);
        cacheUserData(null);
        window.dispatchEvent(new Event(userLogoutEvent));
        navigate('/');
      } else {
        console.error('Failed to logout: Server returned', response.status);
      }
    } catch (error) {
      console.error('Error during logout:', error);
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
