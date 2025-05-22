import StarRatingAuto from "../Rating/StarRatingAuto";
import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "./Profile.scss";
import { useQuestContext } from "@/contexts/QuestContext";
import { Quest } from "@/types/quest";
import QuestCard from "../Home/QuestCard";
import "@/components/Home/QuestCard.scss";
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

  const { allQuests } = useQuestContext();

  const filteredQuests = useMemo(() => {
    return allQuests.filter((quest: Quest) => {
      if (activeNavItem === "Quests") {
        const authorName = JSON.parse(sessionStorage.userData).name;
        return quest.author === authorName;
      } else if (activeNavItem === "Saved") {
        const savedQuests = JSON.parse(localStorage.savedQuests);
        return savedQuests.includes(quest._id);
      } else {
        //History
        return false;
      }
    });
  }, [allQuests, activeNavItem]);

  console.log(filteredQuests);

  const navigate = useNavigate();

  const handleNavItemClick = (item: string) => {
    setActiveNavItem(item);
  };

  useEffect(() => {
    // Update your fetchUserProfile function to handle the error better
    const fetchUserProfile = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");

        if (!accessToken) {
          navigate("/log-in");
          return;
        }

        const response = await fetch("http://localhost:5000/users/profile", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const data = await response.json();

        if (data.status === "success") {
          setUserData(data.data.user);
        } else {
          // Handle specific error cases
          if (
            data.message === "Invalid ID format" ||
            data.message ===
              "Invalid user identification. Please log in again." ||
            data.message?.toLowerCase().includes("invalid")
          ) {
            console.error("Token contains invalid ID, logging out");
            // Clear token and redirect to login
            localStorage.removeItem("accessToken");

            // Redirect without toast since it's not imported or configured
            navigate("/log-in", {
              state: {
                message: "Your session is invalid. Please log in again.",
              },
            });
            return;
          }

          setError(data.message || "Помилка отримання даних користувача");
          if (response.status === 401) {
            localStorage.removeItem("accessToken");
            navigate("/log-in");
          }
        }
      } catch (err) {
        setError("Помилка конекту з сервером");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [navigate]);

  if (loading) {
    return <div className="profile__container">Loading...</div>;
  }

  if (error) {
    return <div className="profile__container">Error: {error}</div>;
  }

  return (
    <div className="profile__container">
      <div className="profile__top_container">
        <div className="profile__header">
          <div className="profile__avatar">
            <div className="image">
              <img src="./src/assets/img1.png" alt="Avatar" />
            </div>
          </div>
          <div className="profile__user-info">
            <h1>{userData?.name || "USERNAME"}</h1>
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
              className={`profile__nav-item ${
                activeNavItem === item ? "active" : ""
              }`}
              onClick={() => handleNavItemClick(item)}
            >
              {item}
            </span>
          ))}
        </div>
      </div>
      <div className="profile__quests">
        <div className="quests">
          <QuestCard quests={filteredQuests} />
        </div>
      </div>
    </div>
  );
};

export default Profile;
