import StarRatingAuto from "../Rating/StarRatingAuto";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './Profile.scss';

interface UserData {
  id: string;
  name: string;
  email: string;
}

const Profile = () => {
  const [activeNavItem, setActiveNavItem] = useState<string | null>("Quests");
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const navigate = useNavigate();

  const handleNavItemClick = (item: string) => {
    setActiveNavItem(item);
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        
        if (!token) {
          navigate('/log-in');
          return;
        }
        
        const response = await fetch('http://localhost:5000/users/profile', {
          headers: {
            'Authorization': `Bearer ${token}`
          },
        });
        
        const data = await response.json();
        
        if (data.status === 'success') {
          setUserData(data.data.user);
        } else {
          setError(data.message || 'Помилка отримання даних користувача');
          if (response.status === 401) {
            localStorage.removeItem('token');
            navigate('/log-in');
          }
        }
      } catch (err) {
        setError('Помилка конекту з сервером');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserProfile();
  }, [navigate]);

  if (loading) {
    return <div className="profile__container">Завантаження...</div>;
  }

  if (error) {
    return <div className="profile__container">Помилка: {error}</div>;
  }

  return (
    <div className="profile__container">
      <div className="profile__header">
        <div className="profile__avatar">
          <img src="./src/assets/default_avatar.svg" alt="Avatar"></img>
        </div>
        <div className="profile__user-info">
          <h2>{userData?.name || "USERNAME"}</h2>
          <p>{userData?.email}</p>
          <div className="profile__rating">
            <StarRatingAuto rating={3.5} />
          </div>
        </div>
        <div className="profile__actions">
          <button className="profile__edit-btn">
            <img src="./src/assets/edit-3-svgrepo-com.svg" alt="Edit"></img>
          </button>
          <button className="profile__share-btn">
            <img src="./src/assets/share-svgrepo-com.svg" alt="Share"></img>
          </button>
        </div>
      </div>
      <div className="profile__nav">
        {["Saved", "Quests", "History"].map((item) => (
          <span
            key={item}
            className={`profile__nav-item ${activeNavItem === item ? "active" : ""}`}
            onClick={() => handleNavItemClick(item)}
          >
            {item}
          </span>
        ))}
      </div>
      <div className="profile__quests">
      </div>
    </div>
  );
};

export default Profile;