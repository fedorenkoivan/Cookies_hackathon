import StarRatingAuto from "../Rating/StarRatingAuto";
import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "./Profile.scss";
import { useQuestContext } from "@/contexts/QuestContext";
import { Quest } from "@/types/quest";
import QuestCard from "../Home/QuestCard";
import "@/components/Home/QuestCard.scss";
import { FaEdit, FaShareAlt } from "react-icons/fa";
import { USERS_URL } from "@/constants/authConstants";
import { UserData } from "@/types/user";
// import { BidirectionalPriorityQueue } from "@/utils/BidirectionalPriorityQueue";


const Profile = () => {
  const [activeNavItem, setActiveNavItem] = useState<string | null>("Quests");
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const { allQuests } = useQuestContext();

  const filteredQuests = useMemo(() => {
    return allQuests.filter((quest: Quest) => {
      if (activeNavItem === "Quests") {
        const userDataStr = sessionStorage.getItem("userData");
        if (!userDataStr) return false;

        try {
          const userData = JSON.parse(userDataStr);
          return quest.author === userData.name;
        } catch (error) {
          console.error("Error parsing userData from sessionStorage:", error);
          return false;
        }
      } else if (activeNavItem === "Saved") {
        const savedQuestsStr = localStorage.getItem("savedQuests");
        const savedQuests = savedQuestsStr ? JSON.parse(savedQuestsStr) : [];
        return savedQuests.includes(quest._id);
      } else {
        return false;
      }
    });
  }, [allQuests, activeNavItem]);

  const navigate = useNavigate();

  const handleNavItemClick = (item: string) => {
    setActiveNavItem(item);
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const userDataStr = sessionStorage.getItem("userData");
        if (userDataStr) {
          setUserData(JSON.parse(userDataStr));
        }
      } catch (e) {
        console.error("Error loading userData from sessionStorage:", e);
      }
      try {
        const accessToken = localStorage.getItem("accessToken");

        if (!accessToken) {
          navigate("/log-in");
          return;
        }

        const response = await fetch(`${USERS_URL}/profile`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const data = await response.json();

        if (data.status === "success") {
          setUserData(data.data.user);
          sessionStorage.setItem("userData", JSON.stringify(data.data.user));
        } else {
          if (
            data.message === "Invalid ID format" ||
            data.message ===
              "Invalid user identification. Please log in again." ||
            data.message?.toLowerCase().includes("invalid")
          ) {
            console.error("Token contains invalid ID, logging out");
            localStorage.removeItem("accessToken");

            navigate("/log-in", {
              state: {
                message: "Your session is invalid. Please log in again.",
              },
            });
            return;
          }

          setError(data.message || "Error fetching user profile");
          if (response.status === 401) {
            localStorage.removeItem("accessToken");
            navigate("/log-in");
          }
        }
      } catch (err) {
        setError("Error connecting to server");
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
              <FaEdit />
            </button>
            <button className="profile__share-btn">
              <FaShareAlt />
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
        {userData ? (
          <div className="quests">
            <QuestCard quests={filteredQuests} />
          </div>
        ) : (
          <div className="loading-container">
            <p>Loading user data...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
