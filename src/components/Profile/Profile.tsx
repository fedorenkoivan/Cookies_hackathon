import "../../styles/Profile.scss";
import "../../styles/QuestCard.scss";
import QuestCard from "../Quests/QuestCard";
import StarRatingAuto from "../Rating/StarRatingAuto";
import { useEffect, useState } from "react";
import axios from "axios";

interface userInterface {
  username: string;
}

const Profile = () => {
  const userRating = 4.5;

  const [userData, setUserData] = useState<userInterface>({ username: "" });

  const fetchUserDetails = async () => {
    try {
      const token = sessionStorage.getItem("authToken");

      if (!token) {
        console.log("User is not logged in");
        return;
      }

      const response = await axios.get(
        "http://localhost:3000/api/auth/get-userDetails",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setUserData(response.data.user);
        sessionStorage.setItem(
          "userData",
          JSON.stringify({ isLoggedIn: true, userData: response.data.user })
        );
      } else {
        console.log(response.data.message || "Failed to fetch user details");
      }
    } catch (err) {
      console.error("Error fetching user details:", err);
    }
  };

  useEffect(() => {
    const storedUserData = sessionStorage.getItem("userData");
    if (storedUserData) {
      setUserData(JSON.parse(storedUserData).userData);
    } else {
      fetchUserDetails();
    }
  }, []);

  console.log(userData);

  return (
    <section className="profile">
      <h2 className="profile__text">My profile</h2>
      <div className="profile__block">
        <div className="profile__top">
          <img
            className="profile__photo"
            src="src/assets/profile_photo_default.png"
            alt="Profile"
          />
          <div className="profile__info">
            <div className="profile__rating_stars">
              <StarRatingAuto rating={userRating} />
            </div>
            <h3 className="profile__name">{userData.username}</h3>
          </div>
        </div>
        <p className="profile__biography">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque
          ligula odio, ultricies eget vestibulum et, euismod a enim. Vestibulum
          efficitur nibh leo, at auctor nisi dictum quis. Morbi aliquet feugiat
          arcu sed ultricies. Quisque eleifend vitae ligula sit amet rutrum.
          Vivamus magna ante, dapibus quis mollis sit amet, interdum non nisi.
        </p>
      </div>

      <h2 className="profile__text">All {userData.username}'s quests:</h2>
      <div className="profile__block">
        <div className="quests__cards">
          <QuestCard />
        </div>
      </div>

      <h2 className="profile__text">
        History of {userData.username}'s quests:
      </h2>
      <div className="profile__block">
        <div className="quests__cards">
          <QuestCard />
        </div>
      </div>
    </section>
  );
};

export default Profile;
