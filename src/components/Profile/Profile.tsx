import "@/styles/Profile.scss";
import StarRatingAuto from "../Rating/StarRatingAuto";
import { useState } from "react";

const Profile = () => {
  const [activeNavItem, setActiveNavItem] = useState<string | null>(null);

  const handleNavItemClick = (item: string) => {
    setActiveNavItem(item);
  };
  return (
    <div className="profile__container">
      <div className="profile__header">
        <div className="profile__avatar">
          <img src="./src/assets/default_avatar.svg" alt="Avatar"></img>
        </div>
        <div className="profile__user-info">
          <h2>USERNAME</h2>
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
